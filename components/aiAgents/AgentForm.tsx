"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema, type Agent } from "./utils/schema";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentFormProps {
	onSubmit: (data: Agent) => void;
	defaultValues?: Partial<Agent>;
	isEditing?: boolean;
}

// * A reusable form for creating and editing AI agents.
// ? It leverages react-hook-form for state management and Zod for validation.
export function AgentForm({
	onSubmit,
	defaultValues,
	isEditing = false,
}: AgentFormProps) {
	const form = useForm<Agent>({
		resolver: zodResolver(agentSchema),
		defaultValues: defaultValues || {},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isEditing ? "Edit AI Agent" : "Create AI Agent"}</CardTitle>
			</CardHeader>
			<CardContent>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Q3 Top Performer" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="voice"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Voice</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., Cloned Voice - John D."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="campaignGoal"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Campaign Goal</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Book 100 Demos" {...field} />
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
										<Input
											placeholder="e.g., Introductory Pitch v2"
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
										<Input
											placeholder="e.g., Enthusiastic & Knowledgeable"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="backgroundNoise"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Background Noise</FormLabel>
									<FormControl>
										<Input placeholder="e.g., None" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="voicemailScript"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Voicemail Script</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., Standard Voicemail Drop"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">
							{isEditing ? "Update Agent" : "Save Agent"}
						</Button>
					</form>
				</FormProvider>
			</CardContent>
		</Card>
	);
}
