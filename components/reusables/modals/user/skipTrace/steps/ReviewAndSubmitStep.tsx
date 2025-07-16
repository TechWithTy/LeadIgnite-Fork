"use client";

import type { Header } from "@/types/skip-trace";
import type React from "react";

interface ReviewAndSubmitStepProps {
	listName: string;
	uploadedFile: File | null;
	selectedHeaders: Header[];
	onSubmit: () => void;
	onBack: () => void;
	submitting: boolean;
	availableCredits: number;
}

const ReviewAndSubmitStep: React.FC<ReviewAndSubmitStepProps> = ({
	listName,
	uploadedFile,
	selectedHeaders,
	onSubmit,
	onBack,
	submitting,
	availableCredits,
}) => {
	return (
		<div className="space-y-4 p-4">
			<h3 className="text-lg font-medium">Review and Submit</h3>
			<div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-900/50">
				<p className="text-sm text-blue-800 dark:text-blue-200">
					You have{" "}
					<span className="font-bold">{availableCredits.toLocaleString()}</span>{" "}
					available credits.
				</p>
			</div>
			<div className="space-y-2 rounded-md border p-4 dark:border-gray-700">
				<div>
					<span className="font-semibold">List Name:</span> {listName}
				</div>
				<div>
					<span className="font-semibold">File:</span> {uploadedFile?.name}
				</div>
				<div>
					<h4 className="font-semibold">Mapped Headers:</h4>
					<ul className="list-inside list-disc pl-4">
						{selectedHeaders.map((h) => (
							<li key={h.csvHeader}>
								{h.csvHeader} &rarr; {h.type.replace(/_/g, " ")}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="flex justify-between">
				<button
					type="button"
					onClick={onBack}
					className="rounded-md border bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					Back
				</button>
				<button
					type="button"
					onClick={onSubmit}
					disabled={submitting}
					className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? "Submitting..." : "Submit"}
				</button>
			</div>
		</div>
	);
};

export default ReviewAndSubmitStep;
