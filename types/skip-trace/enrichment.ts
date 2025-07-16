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
}
