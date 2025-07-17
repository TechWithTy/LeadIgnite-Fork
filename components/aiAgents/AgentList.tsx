"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Agent } from "./utils/schema";
import { fetchAgents, deleteAgent } from "./utils/api";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AgentListProps {
	onEdit: (agent: Agent) => void;
	agents: Agent[];
	setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

// * Displays a list of AI agents with options to edit or delete.
// ? It includes a confirmation dialog for deletions to prevent accidental data loss.
export function AgentList({ onEdit, agents, setAgents }: AgentListProps) {
	const handleDelete = async (id: string) => {
		const success = await deleteAgent(id);
		if (success) {
			setAgents((prev) => prev.filter((agent) => agent.id !== id));
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Agent</TableHead>
					<TableHead>Persona</TableHead>
					<TableHead>Campaign Goal</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{agents.map((agent) => (
					<TableRow key={agent.id}>
						<TableCell className="flex items-center space-x-4">
							{agent.image && (
								<Image
									src={agent.image}
									alt={agent.name}
									width={40}
									height={40}
									className="rounded-full"
								/>
							)}
							<span>{agent.name}</span>
						</TableCell>
						<TableCell>{agent.persona}</TableCell>
						<TableCell>{agent.campaignGoal}</TableCell>
						<TableCell className="space-x-2 text-right">
							<Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
								Edit
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm">
										Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											the agent "{agent.name}".
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => agent.id && handleDelete(agent.id)}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
