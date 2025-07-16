import { Check, Info } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/_utils/kanban/utils";
import type { EnrichmentOption } from "@/types/skip-trace/enrichment";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnrichmentCardProps {
	enrichment: EnrichmentOption;
	isSelected: boolean;
	onToggle: (id: string) => void;
	isDisabled: boolean;
	missingFields?: string[];
}

export function EnrichmentCard({
	enrichment,
	isSelected,
	onToggle,
	isDisabled,
	missingFields,
}: EnrichmentCardProps) {
	const { id, title, description, cost, features, isFree, badge } = enrichment;

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const cardContent = (
		<label
			htmlFor={id}
			className={cn(
				"relative flex h-40 w-full shrink-0 flex-col justify-between rounded-lg border p-4 transition-all duration-200",
				isSelected
					? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/50"
					: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
				isDisabled && "cursor-not-allowed opacity-50",
			)}
		>
			<input
				id={id}
				type="checkbox"
				className="sr-only"
				checked={isSelected}
				onChange={() => onToggle(id)}
				disabled={isDisabled}
			/>
			<div className="flex items-start justify-between">
				<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
					{title}
				</h3>
				<div
					className={cn(
						"flex h-6 w-6 items-center justify-center rounded-full border",
						isSelected
							? "border-blue-500 bg-blue-500 text-white"
							: "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700",
					)}
				>
					{isSelected && <Check className="h-4 w-4" />}
				</div>
			</div>
			<div className="flex items-end justify-between">
				<div className="text-xs text-gray-500 dark:text-gray-400">
					{isFree ? (
						<span className="font-bold text-green-600 dark:text-green-400">
							Free
						</span>
					) : (
						<span>{cost} Credits</span>
					)}
				</div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild onClick={handleInfoClick}>
							<button type="button" aria-label={`More info about ${title}`}>
								<Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
							</button>
						</TooltipTrigger>
						<TooltipContent align="end" side="top">
							<div className="max-w-xs p-2 text-sm">
								<p className="font-bold">{title}</p>
								<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
									{description}
								</p>
								<ul className="list-disc pl-4">
									{features.map((feature) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			{badge && (
				<div
					className="absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-xs font-semibold"
					style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
				>
					{badge.text}
				</div>
			)}
		</label>
	);

	if (isDisabled) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="h-full w-full cursor-not-allowed">
							{cardContent}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{missingFields && missingFields.length > 0 ? (
							<div className="space-y-1">
								<p className="font-semibold">This option requires:</p>
								<ul className="list-disc pl-4">
									{missingFields.map((field) => (
										<li key={field}>{field}</li>
									))}
								</ul>
							</div>
						) : (
							<p>Please enter the required field(s) to enable this option.</p>
						)}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return cardContent;
}
