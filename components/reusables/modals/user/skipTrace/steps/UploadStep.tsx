"use client";

import type React from "react";
import { useState } from "react";
import Papa from "papaparse";

interface UploadStepProps {
	onFileSelect: (
		file: File,
		headers: string[],
		name: string,
		data: Record<string, unknown>[],
	) => void;
	onBack: () => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onFileSelect, onBack }) => {
	const [listName, setListName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.type !== "text/csv") {
				setError("Please upload a valid CSV file.");
				setFile(null);
			} else {
				setFile(selectedFile);
				setError("");
			}
		}
	};

	const handleContinue = () => {
		if (file && listName.trim()) {
			Papa.parse(file, {
				header: true,
				preview: 1,
				complete: (results) => {
					if (results.meta.fields) {
						onFileSelect(file, results.meta.fields, listName, results.data);
					} else {
						setError("Could not parse headers from the CSV file.");
					}
				},
			});
		} else {
			setError("Please provide a list name and select a file.");
		}
	};

	return (
		<div className="space-y-4 p-4">
			<div>
				<label
					htmlFor="listName"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					List Name
				</label>
				<input
					type="text"
					id="listName"
					value={listName}
					onChange={(e) => setListName(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					placeholder="e.g., High Equity Leads"
				/>
			</div>
			<div>
				<label
					htmlFor="fileUpload"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Upload CSV
				</label>
				<input
					type="file"
					id="fileUpload"
					accept=".csv"
					onChange={handleFileChange}
					className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
				/>
			</div>
			{error && <p className="text-sm text-red-600">{error}</p>}
			<div className="flex justify-between">
				<button
					type="button"
					onClick={onBack}
					className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
				>
					Back
				</button>
				<button
					type="button"
					disabled={!file || !listName.trim()}
					onClick={handleContinue}
					className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Continue
				</button>
			</div>
		</div>
	);
};

export default UploadStep;
