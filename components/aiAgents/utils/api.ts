// ? This is a mock API to simulate backend functionality for AI agents.
// * It uses an in-memory array to store agents and simulates async operations.

import type { Agent } from "./schema";

let agents: Agent[] = [
	{
		id: "1",
		name: "Q3 Top Performer",
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
