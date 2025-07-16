"use client";

import type { EnrichmentOption } from "@/types/skip-trace/enrichment";
import { enrichmentOptions } from "@/constants/skip-trace/enrichmentOptions";
import type React from "react";
import { useState } from "react";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnrichmentStepProps {
	onNext: () => void;
	onBack: () => void;
	selectedOptions: string[];
	setSelectedOptions: (selected: string[]) => void;
	availableCredits: number;
	leadCount: number;
}

const EnrichmentStep: React.FC<EnrichmentStepProps> = ({
	onNext,
	onBack,
	selectedOptions,
	setSelectedOptions,
	availableCredits,
	leadCount,
}) => {
	const handleToggle = (optionId: string) => {
		const newSelection = selectedOptions.includes(optionId)
			? selectedOptions.filter((id) => id !== optionId)
			: [...selectedOptions, optionId];
		setSelectedOptions(newSelection);
	};

	const creditCost = selectedOptions.reduce((total, optionId) => {
		const option = enrichmentOptions.find((opt) => opt.id === optionId);
		if (option && !option.isFree) {
			return total + leadCount;
		}
		return total;
	}, 0);
	const hasEnoughCredits = availableCredits >= creditCost;

	return (
		<div className="space-y-4 p-4">
			<h3 className="font-medium text-lg">Select Enrichment Tools</h3>
			<div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-900/50">
				<p className="text-sm text-gray-800 dark:text-gray-200">
					You have{" "}
					<span className="font-bold text-blue-600 dark:text-blue-400">
						{availableCredits.toLocaleString()}
					</span>{" "}
					credits. This list contains{" "}
					<span className="font-bold">{leadCount.toLocaleString()}</span> leads.
				</p>
			</div>

			<div className="flex space-x-4 overflow-x-auto pb-4">
				{enrichmentOptions.map((option) => (
					<button
						type="button"
						key={option.id}
						className={`relative w-64 flex-shrink-0 rounded-lg border p-4 text-left transition-all ${selectedOptions.includes(option.id) ? "border-blue-500 ring-2 ring-blue-500" : "dark:border-gray-700"}`}
						onClick={() => handleToggle(option.id)}
					>
						<div className="flex h-full flex-col justify-between">
							<div>
								<div className="flex items-start justify-between">
									<h4 className="pr-2 text-lg font-semibold">{option.title}</h4>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="shrink-0 cursor-pointer">
													<Info className="h-4 w-4 text-gray-400" />
												</span>
											</TooltipTrigger>
											<TooltipContent side="top" align="center">
												<div className="max-w-xs p-2">
													<p className="text-sm text-gray-600 dark:text-gray-400">
														{option.description}
													</p>
													{option.features && (
														<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
															{option.features.map((feature) => (
																<li key={feature}>{feature}</li>
															))}
														</ul>
													)}
												</div>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								{option.badge && (
									<span
										className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${option.badge.bgColor} ${option.badge.textColor}`}
									>
										{option.badge.text}
									</span>
								)}
							</div>
							<div className="mt-4 text-right text-xs font-semibold text-gray-500">
								{option.footer}
							</div>
						</div>
						<div className="absolute right-4 top-4 h-5 w-5 rounded border border-gray-300 bg-white group-hover:border-blue-500">
							{selectedOptions.includes(option.id) && (
								<div className="h-full w-full rounded-sm bg-blue-500" />
							)}
						</div>
					</button>
				))}
			</div>

			<div className="flex justify-between pt-4">
				<button
					type="button"
					onClick={onBack}
					className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
				>
					Back
				</button>
				<button
					type="button"
					onClick={onNext}
					disabled={!hasEnoughCredits}
					className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default EnrichmentStep;
