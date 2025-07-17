import { z } from "zod";

// * Defines the validation schema for creating and updating an AI agent.
// ! This schema is crucial for maintaining data integrity.

export const agentSchema = z.object({
	isPublic: z.boolean().default(false),
	id: z.string().optional(),
	image: z.string().optional(),
	name: z.string().min(1, { message: "Agent Name is required." }),
	type: z.enum(["phone", "direct mail", "social"], {
		required_error: "Agent type is required.",
	}),
	description: z.string().optional(),
	// Phone-specific fields
	voice: z.string().optional(),
	backgroundNoise: z.string().optional(),
	voicemailScript: z.string().optional(),
	// Social-specific fields
	avatarImage: z.string().optional(),
	backgroundImage: z.string().optional(),
	socialAssets: z.array(z.string()).max(8).optional(),
	// Common fields
	campaignGoal: z.string().optional(),
	salesScript: z.string().optional(),
	persona: z.string().optional(),
});

export type Agent = z.infer<typeof agentSchema>;
