export interface EnrichmentOption {
	id: string;
	title: string;
	description: string;
	features?: string[];
	isFree?: boolean;
	badge?: {
		text: string;
		bgColor: string;
		textColor: string;
	};
	footer: string;
}
