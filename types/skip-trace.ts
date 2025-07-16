export interface Header {
	csvHeader: string;
	type:
		| "property_address"
		| "property_city"
		| "property_state"
		| "property_zip"
		| "owner_name"
		| "owner_mailing_address";
}
