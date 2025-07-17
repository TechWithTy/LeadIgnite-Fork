import { z } from "zod";

// * Defines the validation schema for creating and updating an AI agent.
// ! This schema is crucial for maintaining data integrity.

export const agentSchema = z.object({
	isPublic: z.boolean().default(false),
	id: z.string().optional(), // * Optional for creation, required for updates
	image: z.string().optional(),
	name: z.string().min(1, { message: "Agent Name is required." }),
	voice: z.string().min(1, { message: "Voice is required." }),
	campaignGoal: z.string().min(1, { message: "Campaign Goal is required." }),
	salesScript: z.string().min(1, { message: "Sales Script is required." }),
	persona: z.string().min(1, { message: "Persona is required." }),
	backgroundNoise: z
		.string()
		.min(1, { message: "Background Noise is required." }),
	voicemailScript: z
		.string()
		.min(1, { message: "Voicemail Script is required." }),
});

export type Agent = z.infer<typeof agentSchema>;
