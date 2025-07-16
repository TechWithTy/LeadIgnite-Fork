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
				"relative flex h-28 w-full flex-col justify-between rounded-lg border px-4 py-2 transition-all duration-200",
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
			<div className="flex items-center justify-between gap-2">
				<h3 className="line-clamp-2 flex-1 font-semibold text-gray-800 text-sm leading-tight dark:text-gray-200">
					{title}
				</h3>
				{badge && (
					<span
						className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-gray-500 shadow-sm dark:bg-gray-700 dark:text-gray-200"
						style={{
							backgroundColor: badge.bgColor,
							color: badge.textColor,
							whiteSpace: "nowrap",
						}}
					>
						{badge.text}
					</span>
				)}
				<div
					className={cn(
						"ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
						isSelected
							? "border-blue-500 bg-blue-500 text-white"
							: "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700",
					)}
				>
					{isSelected && <Check className="h-3 w-3" />}
				</div>
			</div>
			<div className="mt-1 flex items-center justify-between">
				<div className="font-medium text-gray-600 text-xs dark:text-gray-300">
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
								<p className="mb-2 text-gray-500 text-xs dark:text-gray-400">
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
