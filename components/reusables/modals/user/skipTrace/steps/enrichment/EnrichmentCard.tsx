import { Check, Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EnrichmentOption } from "@/types/skip-trace/enrichment";
import { cn } from "@/lib/_utils/kanban/utils";

interface EnrichmentCardProps {
	enrichment: EnrichmentOption;
	isSelected: boolean;
	onToggle: (id: string) => void;
}

export function EnrichmentCard({
	enrichment,
	isSelected,
	onToggle,
}: EnrichmentCardProps) {
	const { id, title, description, cost, features, isFree, badge } = enrichment;

	const handleCardClick = () => {
		onToggle(id);
	};

	const handleInfoClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			onToggle(id);
		}
	};

	return (
		<div
			className={cn(
				"relative h-full cursor-pointer rounded-lg border bg-white p-4 transition-all duration-200 flex flex-col justify-between hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
				isSelected
					? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/50"
					: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
			)}
			onClick={handleCardClick}
			onKeyDown={handleKeyDown}
			role="checkbox"
			aria-checked={isSelected}
			tabIndex={0}
		>
			{badge && (
				<div
					className={cn(
						"absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full px-3 py-1 text-xs font-semibold",
						badge.bgColor,
						badge.textColor,
					)}
				>
					{badge.text}
				</div>
			)}
			{isSelected && (
				<div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
					<Check className="h-4 w-4" />
				</div>
			)}
			<div className="pt-4">
				<h4 className="font-semibold text-md">{title}</h4>
				{isFree && (
					<span className="font-medium text-green-600 text-xs dark:text-green-400">
						Free
					</span>
				)}
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500 text-sm dark:text-gray-400">
					{isFree ? "Included" : `+${cost} credit`}
				</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild onClick={handleInfoClick}>
							<button
								type="button"
								className="shrink-0 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<Info className="h-4 w-4 text-gray-500" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="top" align="center">
							<div className="max-w-xs p-2 text-sm">
								<p className="font-bold">{description}</p>
								<ul className="mt-2 list-inside list-disc space-y-1">
									{features.map((feature: string) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
