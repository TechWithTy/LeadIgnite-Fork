"use client";

import { useUserProfileStore } from "@/lib/stores/user/userProfile";
import type React from "react";
import { useState, useEffect } from "react";
import EnrichmentStep from "../steps/EnrichmentStep";
import ReviewAndSubmitStep from "../steps/ReviewAndSubmitStep";

// ? Define the shape of the initial data for a single trace
type SingleTraceData =
	| { type: "single"; address: string }
	| { type: "single"; name: { firstName: string; lastName: string } };

interface SingleTraceFlowProps {
	onClose: () => void;
	onBack: () => void;
	initialData?: SingleTraceData;
}

const SingleTraceFlow: React.FC<SingleTraceFlowProps> = ({
	onBack,
	onClose,
	initialData,
}) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [address, setAddress] = useState("");
	const [error, setError] = useState("");
	const [step, setStep] = useState(0);
	const [selectedEnrichmentOptions, setSelectedEnrichmentOptions] = useState<
		string[]
	>([]);
	const [submitting, setSubmitting] = useState(false);

	const { userProfile } = useUserProfileStore();
	const availableCredits = userProfile?.subscription?.aiCredits
		? userProfile.subscription.aiCredits.allotted -
			userProfile.subscription.aiCredits.used
		: 0;

	useEffect(() => {
		if (initialData) {
			if ("name" in initialData) {
				setFirstName(initialData.name.firstName);
				setLastName(initialData.name.lastName);
			} else if ("address" in initialData) {
				setAddress(initialData.address);
			}
		}
	}, [initialData]);

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handleNextFromInput = () => {
		if (!firstName && !lastName && !address) {
			setError("Please fill in either a name or an address.");
			return;
		}
		setError("");
		nextStep();
	};

	const handleFinalSubmit = () => {
		if (!firstName && !lastName && !address) {
			setError("Please fill in either a name or an address.");
			return;
		}
		setError("");
		// ! todo: Add submission logic and credit check
		setSubmitting(true);
		// ! todo: Add submission logic and credit deduction
		console.log("Submitting single trace:", {
			firstName,
			lastName,
			address,
			enrichments: selectedEnrichmentOptions,
		});
		console.log("Final submission with options:", selectedEnrichmentOptions);
		setTimeout(() => {
			setSubmitting(false);
			onClose(); // Close modal on success
		}, 2000);
	};

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<div className="space-y-4 p-4">
						<h3 className="font-medium text-lg">Skip Trace a Single Contact</h3>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="firstName"
									className="block font-medium text-sm text-gray-700 dark:text-gray-300"
								>
									First Name
								</label>
								<input
									type="text"
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
								/>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="block font-medium text-sm text-gray-700 dark:text-gray-300"
								>
									Last Name
								</label>
								<input
									type="text"
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
								/>
							</div>
							<div className="text-center text-sm text-gray-500">OR</div>
							<div>
								<label
									htmlFor="address"
									className="block font-medium text-sm text-gray-700 dark:text-gray-300"
								>
									Full Address
								</label>
								<input
									type="text"
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
								/>
							</div>
						</div>
						{error && <p className="text-sm text-red-600">{error}</p>}
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
								onClick={handleNextFromInput}
								className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							>
								Next
							</button>
						</div>
					</div>
				);
			case 1:
				return (
					<EnrichmentStep
						onNext={nextStep}
						onBack={prevStep}
						selectedOptions={selectedEnrichmentOptions}
						setSelectedOptions={setSelectedEnrichmentOptions}
						availableCredits={availableCredits}
						leadCount={1} // Single trace is always 1 lead
					/>
				);
			case 2:
				return (
					<ReviewAndSubmitStep
						listName={`${firstName} ${lastName}`.trim() || address}
						uploadedFile={null}
						selectedHeaders={[]}
						onSubmit={handleFinalSubmit}
						onBack={prevStep}
						submitting={submitting}
						availableCredits={availableCredits}
						selectedEnrichmentOptions={selectedEnrichmentOptions}
						leadCount={1}
					/>
				);
			default:
				return null;
		}
	};

	return <>{renderStep()}</>;
};

export default SingleTraceFlow;
