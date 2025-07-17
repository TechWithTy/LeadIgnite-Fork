"use client";

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
import { Textarea } from "@/components/ui/textarea";

interface AgentScriptsFormProps {
	form: UseFormReturn<Agent>;
}

export function AgentScriptsForm({ form }: AgentScriptsFormProps) {
	return (
		<>
			<FormField
				control={form.control}
				name="campaignGoal"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Campaign Goal</FormLabel>
						<FormControl>
							<Textarea
								placeholder="e.g., Book 150 qualified demos in Q4."
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="persona"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Persona</FormLabel>
						<FormControl>
							<Input placeholder="e.g., Friendly & Helpful" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="salesScript"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Sales Script</FormLabel>
						<FormControl>
							<Textarea
								placeholder="e.g., Hi [Name], I'm calling from..."
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
