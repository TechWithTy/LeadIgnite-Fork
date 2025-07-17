"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { agentSchema, type Agent } from "./utils/schema";
import {
	fetchVoices,
	fetchVoicemails,
	fetchBackgroundNoises,
} from "./utils/api";

export function useAgentForm(defaultValues?: Partial<Agent>) {
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

	return {
		form,
		showVoicemailModal,
		setShowVoicemailModal,
		showCloneModal,
		setShowCloneModal,
		imagePreview,
		handleImageChange,
		voices,
		voicemails,
		backgroundNoises,
		handleVoicemailAudio,
		handleCloneVoiceAudio,
	};
}
