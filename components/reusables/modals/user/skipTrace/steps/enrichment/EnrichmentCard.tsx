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

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<label
			htmlFor={id}
			className={cn(
				"relative flex h-40 w-full shrink-0 cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all duration-200",
				isSelected
					? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/50"
					: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
			)}
		>
			<input
				id={id}
				type="checkbox"
				className="sr-only"
				checked={isSelected}
				onChange={() => onToggle(id)}
			/>
			{badge && (
				<div
					className={cn(
						"-top-3 -translate-x-1/2 absolute left-1/2 transform rounded-full px-3 py-1 font-semibold text-xs",
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
			<div className="mt-auto flex items-center justify-between">
				<p className="text-gray-500 text-sm dark:text-gray-400">
					{isFree ? "Included" : `+${cost} credit`}
				</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								className="shrink-0 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
								onClick={handleInfoClick}
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
		</label>
	);
}
