"use client";

import { AgentForm as NewAgentForm } from "@/components/forms/agent/AgentForm";
import type { Agent } from "@/components/forms/agent/utils/schema";

interface AgentFormProps {
	onSubmit: (data: Agent) => void;
	defaultValues?: Partial<Agent>;
	isEditing?: boolean;
}

export function AgentForm({
	onSubmit,
	defaultValues,
	isEditing = false,
}: AgentFormProps) {
	return (
		<NewAgentForm
			onSubmit={onSubmit}
			defaultValues={defaultValues}
			isEditing={isEditing}
		/>
	);
}
