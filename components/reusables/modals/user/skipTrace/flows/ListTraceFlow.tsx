"use client";

import type { Header } from "@/types/skip-trace";
import type { InputField } from "@/types/skip-trace/enrichment";
import type { Dispatch, SetStateAction } from "react";
import type React from "react";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import MapHeadersStep from "../steps/MapHeadersStep";
import ReviewAndSubmitStep from "../steps/ReviewAndSubmitStep";
import UploadStep from "../steps/UploadStep";
import { EnrichmentStep } from "../steps/EnrichmentStep";
import { useUserProfileStore } from "@/lib/stores/user/userProfile";

interface ListTraceFlowProps {
	onClose: () => void;
	onBack: () => void;
	initialFile?: File;
}

const ListTraceFlow: React.FC<ListTraceFlowProps> = ({
	onClose,
	onBack,
	initialFile,
}) => {
	const [step, setStep] = useState(0);
	const [listName, setListName] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
	const [selectedHeaders, setSelectedHeaders] = useState<Header[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [selectedEnrichmentOptions, setSelectedEnrichmentOptions] = useState<
		string[]
	>([]);
	const [leadCount, setLeadCount] = useState(100); // ? todo: Hardcoded for now

	const { userProfile } = useUserProfileStore();

	const availableCredits = userProfile?.subscription?.aiCredits
		? userProfile.subscription.aiCredits.allotted -
			userProfile.subscription.aiCredits.used
		: 0;

	useEffect(() => {
		if (initialFile) {
			setUploadedFile(initialFile);
			setListName(initialFile.name.replace(/\.csv$/, ""));
			Papa.parse(initialFile, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					if (results.meta.fields) {
						setParsedHeaders(results.meta.fields);
						setLeadCount(results.data.length);
						setStep(1); // * Skip to Map Headers step
					}
				},
			});
		}
	}, [initialFile]);

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handleFileSelect = (
		file: File,
		headers: string[],
		name: string,
		data: Record<string, unknown>[],
	) => {
		setUploadedFile(file);
		setParsedHeaders(headers);
		setListName(name);
		setLeadCount(data.length);
		nextStep();
	};

	const handleHeaderSelection = (headers: Header[]) => {
		setSelectedHeaders(headers);
		nextStep();
	};

	const handleEnrichmentNext = (options: string[]) => {
		setSelectedEnrichmentOptions(options);
		nextStep();
	};

	const mappedUserInput = selectedHeaders.reduce(
		(acc, header) => {
			if (header.mappedTo) {
				acc[header.mappedTo as InputField] = "mapped"; // The value doesn't matter, just its presence
			}
			return acc;
		},
		{} as Record<InputField, string>,
	);

	const handleSubmit = async () => {
		setSubmitting(true);
		console.log("Submitting List:", {
			listName,
			uploadedFile,
			selectedHeaders,
		});
		// ! todo: Add actual submission logic here
		await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
		setSubmitting(false);
		onClose();
	};

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<UploadStep
						onFileSelect={(file, headers, name, data) =>
							handleFileSelect(
								file,
								headers,
								name,
								data as Record<string, unknown>[],
							)
						}
						onBack={onBack}
					/>
				);
			case 1:
				return (
					<MapHeadersStep
						headers={parsedHeaders}
						onSubmit={handleHeaderSelection}
						onBack={prevStep}
					/>
				);
			case 2:
				return (
					<EnrichmentStep
						onNext={handleEnrichmentNext}
						onBack={prevStep}
						leadCount={leadCount}
						userInput={mappedUserInput}
					/>
				);
			case 3:
				return (
					<ReviewAndSubmitStep
						listName={listName}
						uploadedFile={uploadedFile}
						selectedHeaders={selectedHeaders}
						onSubmit={handleSubmit}
						onBack={prevStep}
						submitting={submitting}
						availableCredits={availableCredits}
						selectedEnrichmentOptions={selectedEnrichmentOptions}
						leadCount={leadCount}
					/>
				);
			default:
				return null;
		}
	};

	return <div className="flex-1 overflow-y-auto">{renderStep()}</div>;
};

export default ListTraceFlow;
