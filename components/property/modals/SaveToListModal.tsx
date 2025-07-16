"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfileStore } from "@/lib/stores/user/userProfile";
import type { LeadList } from "@/types/_dashboard/leadList";
import type { LeadTypeGlobal } from "@/types/_dashboard/leads";
import type { Property } from "@/types/_dashboard/property";
import { useState } from "react";

// * Helper to convert a Property to a LeadTypeGlobal
function propertyToLead(property: Property): LeadTypeGlobal {
	return {
		id: property.id,
		firstName: "", // No name on Property, use empty or "N/A"
		lastName: "",
		email: "",
		phone: "",
		summary: "", // You could use property.description if available
		bed: property.details.beds,
		bath: property.details.fullBaths,
		sqft: property.details.sqft ?? 0,
		status: "New Lead",
		followUp: null,
		lastUpdate: property.lastUpdated ?? new Date().toISOString(),
		address1: property.address.fullStreetLine,
		// campaignID and socials are optional, can be omitted or set as needed
	};
}
interface SaveToListModalProps {
	isOpen: boolean;
	onClose: () => void;
	property: Property;
	onSave: (listId: string) => void;
}

export default function SaveToListModal({
	isOpen,
	onClose,
	property,
	onSave,
}: SaveToListModalProps) {
	const { userProfile, addLeadList, addLeadToList } = useUserProfileStore();
	const { toast } = useToast();

	const [newListName, setNewListName] = useState("");
	const [selectedListId, setSelectedListId] = useState<string | null>(null);

	const handleCreateList = () => {
		if (newListName.trim() !== "") {
			const newId = addLeadList(newListName.trim());
			if (newId) {
				setSelectedListId(newId);
				try {
					toast({
						title: "Success",
						description: `List "${newListName}" created.`,
					});
				} catch (error) {
					console.error(error);
				}
			}
			setNewListName("");
		}
	};

	const handleSave = () => {
		if (selectedListId) {
			const lead = propertyToLead(property);
			addLeadToList(selectedListId, lead);
			const listName = userProfile?.companyInfo?.leadLists.find(
				(list: LeadList) => list.id === selectedListId,
			)?.listName;
			try {
				toast({
					title: "Success",
					description: `Property saved to "${listName || "list"}`,
				});
			} catch (error) {
				console.error(error);
			}

			onSave(selectedListId);
			onClose();
		}
	};

	const leadLists = userProfile?.companyInfo?.leadLists || [];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Save to List</DialogTitle>
					<DialogDescription>
						Add this property to an existing list or create a new one.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{/* Create New List */}
					<div className="space-y-2">
						<Label htmlFor="new-list-name">Create a New List</Label>
						<div className="flex gap-2">
							<Input
								id="new-list-name"
								value={newListName}
								onChange={(e) => setNewListName(e.target.value)}
								placeholder="e.g., 'Hot Leads'"
							/>
							<Button type="button" onClick={handleCreateList}>
								Create
							</Button>
						</div>
					</div>

					{/* Select Existing List */}
					<div className="space-y-2">
						<Label>Or Add to an Existing List</Label>
						<div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
							{leadLists.length > 0 ? (
								leadLists.map((list: LeadList) => (
									<button
										type="button"
										key={list.id}
										className={`w-full rounded-md p-2 text-left ${
											selectedListId === list.id
												? "bg-blue-100 dark:bg-blue-900"
												: "hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedListId(list.id)}
									>
										{list.listName}
									</button>
								))
							) : (
								<p className="text-center text-gray-500 text-sm">
									No lists found. Create one above.
								</p>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button type="button" onClick={handleSave} disabled={!selectedListId}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
