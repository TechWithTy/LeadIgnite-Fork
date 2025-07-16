// * Defines the possible input fields for a skip trace
export type InputField =
	| "firstName"
	| "lastName"
	| "address"
	| "email"
	| "phone"
	| "domain"
	| "socialTag";

// * Represents required field groups. At least one inner array's conditions must be met.
// * e.g., [['firstName', 'lastName'], ['address']] means (firstName AND lastName) OR (address)
export type RequiredFields = InputField[][];

export interface EnrichmentOption {
	id: string;
	title: string;
	description: string;
	features: string[];
	isFree: boolean;
	cost: number;
	badge?: {
		text: string;
		bgColor: string;
		textColor: string;
	};
	// * Defines the data required to use this enrichment tool
	requiredFields: RequiredFields;
	// * Defines optional data that can enhance the results
	optionalFields: InputField[];
}
