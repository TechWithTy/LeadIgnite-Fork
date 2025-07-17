// ? This is a mock API to simulate backend functionality for AI agents.
// * It uses an in-memory array to store agents and simulates async operations.

import type { Agent } from "./schema";

let agents: Agent[] = [
	{
		isPublic: true,
		id: "1",
		image: "/placeholder-agent.png", // * Placeholder image
		name: "Q3 Top Performer",
		type: "phone",
		voice: "Cloned Voice - John D.",
		campaignGoal: "Book 100 Demos",
		salesScript: "Introductory Pitch v2",
		persona: "Enthusiastic & Knowledgeable",
		backgroundNoise: "None",
		voicemailScript: "Standard Voicemail Drop",
	},
];

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchAgents = async (): Promise<Agent[]> => {
	await simulateDelay(500);
	return agents;
};

export const fetchAgentById = async (
	id: string,
): Promise<Agent | undefined> => {
	await simulateDelay(300);
	return agents.find((agent) => agent.id === id);
};

// * Mock function to fetch available voices
export async function fetchBackgroundNoises(): Promise<
	{ id: string; name: string }[]
> {
	console.log("Fetching available background noises...");
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: "noise-1", name: "Coffee Shop Ambience" },
				{ id: "noise-2", name: "Quiet Office Hum" },
			]);
		}, 500);
	});
}

export async function fetchVoicemails(): Promise<
	{ id: string; name: string }[]
> {
	console.log("Fetching available voicemails...");
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: "voicemail-1", name: "Standard Voicemail" },
				{ id: "voicemail-2", name: "Follow-up Voicemail" },
			]);
		}, 500);
	});
}

export async function fetchVoices(): Promise<{ id: string; name: string }[]> {
	console.log("Fetching available voices...");
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: "voice-1", name: "Standard Male Voice" },
				{ id: "voice-2", name: "Standard Female Voice" },
				{ id: "cloned-voice-john", name: "Cloned Voice - John D." },
			]);
		}, 500);
	});
}

export const createAgent = async (data: Omit<Agent, "id">): Promise<Agent> => {
	await simulateDelay(500);
	const newAgent: Agent = {
		id: String(Date.now()),
		...data,
	};
	agents.push(newAgent);
	return newAgent;
};

export const updateAgent = async (
	id: string,
	data: Partial<Agent>,
): Promise<Agent | undefined> => {
	await simulateDelay(500);
	const agentIndex = agents.findIndex((agent) => agent.id === id);
	if (agentIndex !== -1) {
		agents[agentIndex] = { ...agents[agentIndex], ...data };
		return agents[agentIndex];
	}
	return undefined;
};

export const deleteAgent = async (id: string): Promise<boolean> => {
	await simulateDelay(500);
	const initialLength = agents.length;
	agents = agents.filter((agent) => agent.id !== id);
	return agents.length < initialLength;
};
