"use client";

import type { Header } from "@/types/skip-trace";
import type React from "react";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import MapHeadersStep from "../steps/MapHeadersStep";
import ReviewAndSubmitStep from "../steps/ReviewAndSubmitStep";
import UploadStep from "../steps/UploadStep";

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
	// ! todo: Replace with actual API call to fetch user credits
	const [availableCredits] = useState(10000);

	useEffect(() => {
		if (initialFile) {
			setUploadedFile(initialFile);
			setListName(initialFile.name.replace(/\.csv$/, ""));
			Papa.parse(initialFile, {
				header: true,
				preview: 1,
				complete: (results) => {
					if (results.meta.fields) {
						setParsedHeaders(results.meta.fields);
						setStep(1); // * Skip to Map Headers step
					}
				},
			});
		}
	}, [initialFile]);

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handleFileSelect = (file: File, headers: string[], name: string) => {
		setUploadedFile(file);
		setParsedHeaders(headers);
		setListName(name);
		nextStep();
	};

	const handleHeaderSelection = (headers: Header[]) => {
		setSelectedHeaders(headers);
		nextStep();
	};

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
				return <UploadStep onFileSelect={handleFileSelect} onBack={onBack} />;
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
					<ReviewAndSubmitStep
						listName={listName}
						uploadedFile={uploadedFile}
						selectedHeaders={selectedHeaders}
						onSubmit={handleSubmit}
						onBack={prevStep}
						submitting={submitting}
						availableCredits={availableCredits}
					/>
				);
			default:
				return null;
		}
	};

	return <div className="flex-1 overflow-y-auto">{renderStep()}</div>;
};

export default ListTraceFlow;
