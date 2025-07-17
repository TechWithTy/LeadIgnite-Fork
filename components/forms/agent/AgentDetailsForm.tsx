"use client";

import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import type { Agent } from "./utils/schema";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AgentDetailsFormProps {
	form: UseFormReturn<Agent>;
	imagePreview: string | null;
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AgentDetailsForm({
	form,
	imagePreview,
	handleImageChange,
}: AgentDetailsFormProps) {
	return (
		<>
			<FormField
				control={form.control}
				name="image"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Agent Image</FormLabel>
						<div className="flex items-center space-x-4">
							{imagePreview && (
								<Image
									src={imagePreview}
									alt="Agent Preview"
									width={64}
									height={64}
									className="rounded-full"
								/>
							)}
							<FormControl>
								<Input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</FormControl>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="e.g., Q4 Sales Agent" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Agent Type</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select an agent type" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="phone">Phone</SelectItem>
								<SelectItem value="direct mail">Direct Mail</SelectItem>
								<SelectItem value="email">Email</SelectItem>
								<SelectItem value="social">Social</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
