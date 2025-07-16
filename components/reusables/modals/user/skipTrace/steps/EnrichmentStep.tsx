import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import type {
	EnrichmentOption,
	InputField,
} from "@/types/skip-trace/enrichment";
import { enrichmentOptions } from "@/constants/skip-trace/enrichmentOptions";
import { fieldLabels } from "@/constants/skip-trace/fieldLabels";
import { useUserProfileStore } from "@/lib/stores/user/userProfile";
import { EnrichmentCard } from "./enrichment/EnrichmentCard";

// * Helper function to check if an enrichment option should be disabled
const isEnrichmentDisabled = (
	option: EnrichmentOption,
	userInput: Record<InputField, string>,
) => {
	// * An option is disabled if none of its required field groups are met
	return !option.requiredFields.some((fieldGroup) =>
		// * A field group is met if all of its fields have a value
		fieldGroup.every((field) => userInput[field]),
	);
};

const getMissingFields = (
	option: EnrichmentOption,
	userInput: Record<string, string>,
) => {
	const missingFields: string[] = [];
	for (const fieldGroup of option.requiredFields) {
		const isGroupSatisfied = fieldGroup.some((field) => userInput[field]);
		if (!isGroupSatisfied) {
			for (const field of fieldGroup) {
				if (!userInput[field]) {
					missingFields.push(fieldLabels[field] || field);
				}
			}
		}
	}
	return missingFields;
};

interface EnrichmentStepProps {
	leadCount: number;
	onNext: (selectedOptions: string[]) => void;
	onBack: () => void;
	userInput: Record<InputField, string>;
}

export function EnrichmentStep({
	leadCount,
	onNext,
	onBack,
	userInput,
}: EnrichmentStepProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const { userProfile } = useUserProfileStore();

	const handleSelectOption = (optionId: string) => {
		setSelectedOptions((prev) =>
			prev.includes(optionId)
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId],
		);
	};

	const creditCost = selectedOptions.reduce((total, optionId) => {
		const option = enrichmentOptions.find((opt) => opt.id === optionId);
		if (option && !option.isFree) {
			return total + leadCount;
		}
		return total;
	}, 0);

	const availableCredits =
		(userProfile?.subscription?.skipTraces.allotted ?? 0) -
		(userProfile?.subscription?.skipTraces.used ?? 0);

	const hasEnoughCredits = availableCredits >= creditCost;

	return (
		<div className="flex h-full flex-col">
			<div className="mb-4">
				<h2 className="font-semibold text-lg">Choose Enrichments</h2>
				<p className="text-gray-500 text-sm">
					Select which data points you want to add to your list.
				</p>
			</div>

			<TooltipProvider>
				<ScrollArea className="h-72 flex-grow pr-4">
					<div className="grid grid-cols-2 gap-4 p-2">
						{enrichmentOptions.map((enrichment) => {
							const isDisabled = isEnrichmentDisabled(enrichment, userInput);
							const missingFields = isDisabled
								? getMissingFields(enrichment, userInput)
								: [];

							return (
								<EnrichmentCard
									key={enrichment.id}
									enrichment={enrichment}
									isSelected={selectedOptions.includes(enrichment.id)}
									onToggle={() => handleSelectOption(enrichment.id)}
									isDisabled={isDisabled}
									missingFields={missingFields}
								/>
							);
						})}
					</div>
				</ScrollArea>
			</TooltipProvider>

			<div className="mt-auto pt-4">
				{creditCost > 0 && (
					<div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-800 dark:bg-yellow-900/50">
						<p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
							Estimated Cost: {creditCost.toLocaleString()} credits
						</p>
					</div>
				)}
				<div className="flex justify-between">
					<Button variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button
						onClick={() => onNext(selectedOptions)}
						disabled={!hasEnoughCredits || selectedOptions.length === 0}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
