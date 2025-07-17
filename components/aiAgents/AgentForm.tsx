"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { agentSchema, type Agent } from "./utils/schema";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// * Import the advanced modal components
import VoicemailModal from "@/components/forms/steppers/profile-form/steps/knowledge/voice/VoicemailModal";
import CloneModal from "@/components/forms/steppers/profile-form/steps/knowledge/voice/CloneModal";
import {
	fetchVoices,
	fetchVoicemails,
	fetchBackgroundNoises,
} from "./utils/api";

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

	const [showVoicemailModal, setShowVoicemailModal] = useState(false);
	const [showCloneModal, setShowCloneModal] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(
		defaultValues?.image || null,
	);
	const [voices, setVoices] = useState<{ id: string; name: string }[]>([]);
	const [voicemails, setVoicemails] = useState<{ id: string; name: string }[]>(
		[],
	);
	const [backgroundNoises, setBackgroundNoises] = useState<
		{ id: string; name: string }[]
	>([]);

	useEffect(() => {
		const getVoices = async () => {
			const fetchedVoices = await fetchVoices();
			setVoices(fetchedVoices);
		};
		const getVoicemails = async () => {
			const fetchedVoicemails = await fetchVoicemails();
			setVoicemails(fetchedVoicemails);
		};
		const getBackgroundNoises = async () => {
			const fetchedNoises = await fetchBackgroundNoises();
			setBackgroundNoises(fetchedNoises);
		};
		getVoices();
		getVoicemails();
		getBackgroundNoises();
	}, []);

	const handleVoicemailAudio = async (audioBlob: Blob) => {
		console.log("Voicemail audio received:", audioBlob);
		const fakeFileName = `voicemail-${Date.now()}.wav`;
		form.setValue("voicemailScript", fakeFileName);
		setShowVoicemailModal(false);
	};

	const handleCloneVoiceAudio = async (audioBlob: Blob) => {
		console.log("Cloned voice audio received:", audioBlob);
		const fakeFileName = `cloned-voice-${Date.now()}.wav`;
		form.setValue("voice", fakeFileName);
		setShowCloneModal(false);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				form.setValue("image", reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>
						{isEditing ? "Edit AI Agent" : "Create AI Agent"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<FormProvider {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
								name="voice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Voice</FormLabel>
										<div className="flex items-center space-x-2">
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a voice" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{voices.map((voice) => (
														<SelectItem key={voice.id} value={voice.id}>
															{voice.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												type="button"
												variant="outline"
												onClick={() => setShowCloneModal(true)}
											>
												Clone
											</Button>
										</div>
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
											<Input
												placeholder="e.g., Friendly & Helpful"
												{...field}
											/>
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
							<FormField
								control={form.control}
								name="backgroundNoise"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Background Noise (Optional)</FormLabel>
										<div className="flex items-center space-x-2">
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a noise" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{backgroundNoises.map((noise) => (
														<SelectItem key={noise.id} value={noise.id}>
															{noise.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													document
														.getElementById("background-noise-upload")
														?.click()
												}
											>
												Upload
											</Button>
											<FormControl>
												<Input
													id="background-noise-upload"
													type="file"
													accept="audio/*"
													className="hidden"
													onChange={(e) =>
														field.onChange(e.target.files?.[0]?.name)
													}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="voicemailScript"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Voicemail</FormLabel>
										<div className="flex items-center space-x-2">
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a voicemail" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{voicemails.map((voicemail) => (
														<SelectItem key={voicemail.id} value={voicemail.id}>
															{voicemail.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												type="button"
												variant="outline"
												onClick={() => setShowVoicemailModal(true)}
											>
												Record
											</Button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isPublic"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Make Agent Public
											</FormLabel>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex justify-end space-x-2">
								<Button type="button" variant="outline">
									Cancel
								</Button>
								<Button type="submit">
									{isEditing ? "Update Agent" : "Save Agent"}
								</Button>
							</div>
						</form>
					</FormProvider>
				</CardContent>
			</Card>
			<VoicemailModal
				open={showVoicemailModal}
				onClose={() => setShowVoicemailModal(false)}
				onSave={handleVoicemailAudio}
			/>
			<CloneModal
				open={showCloneModal}
				onClose={() => setShowCloneModal(false)}
				onSave={handleCloneVoiceAudio}
			/>
		</>
	);
}
