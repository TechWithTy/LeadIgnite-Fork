import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { NavItem } from "@/types";

//
// Corrected Type Definitions
// =====================================================================
//

export type LeadStatus = "New Lead" | "Contacted" | "Closed" | "Lost";

export type SocialLinks = {
	facebook: string;
	linkedin: string;
	instagram: string;
	twitter: string;
};

export type LeadTypeGlobal = {
	id: string; // Unique identifier for the lead

	// Contact Information
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	domain?: string;

	// Lead Details
	summary: string; // Summary of the interaction or lead
	bed: number; // Number of bedrooms in the property
	bath: number; // Number of bathrooms in the property
	sqft: number; // Square footage of the property
	status: LeadStatus; // Lead status (e.g., "New Lead", "Contacted", "Closed", "Lost")
	followUp: string | null; // Follow-up date (can be null if none is set)
	lastUpdate: string; // Last update timestamp
	campaignID?: string;
	socials?: SocialLinks; // Social media links
};

//
// Configuration
// =====================================================================
//

export const APP_TESTING_MODE = true;

//
// Mock Data Generation
// =====================================================================
//

/**
 * Generates a specified number of mock leads.
 * @param count - The number of mock leads to generate.
 * @returns An array of `LeadTypeGlobal` objects.
 */
export function generateMockLeads(count: number): LeadTypeGlobal[] {
	const leads: LeadTypeGlobal[] = [];

	for (let i = 0; i < count; i++) {
		const lead: LeadTypeGlobal = {
			id: uuid(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.location.streetAddress(),
			domain: faker.internet.domainName(),
			summary: faker.lorem.sentence(),
			bed: faker.number.int({ min: 1, max: 5 }),
			bath: faker.number.int({ min: 1, max: 4 }),
			sqft: faker.number.int({ min: 500, max: 5000 }),
			status: faker.helpers.arrayElement<LeadStatus>([
				"New Lead",
				"Contacted",
				"Closed",
				"Lost",
			]),
			followUp:
				faker.helpers.maybe(
					() => faker.date.future().toISOString().split("T")[0],
					{ probability: 0.5 },
				) || null,
			lastUpdate: faker.date.recent().toISOString().split("T")[0],
			campaignID: faker.helpers.maybe(() => faker.string.uuid(), {
				probability: 0.8,
			}),
			socials: {
				facebook: `https://facebook.com/${faker.internet.userName()}`,
				linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
				instagram: `https://instagram.com/${faker.internet.userName()}`,
				twitter: `https://twitter.com/${faker.internet.userName()}`,
			},
		};

		leads.push(lead);
	}

	return leads;
}

export const mockGeneratedLeads = APP_TESTING_MODE
	? generateMockLeads(100)
	: [];

//
// Static Mock Data (Corrected)
// =====================================================================
//

export const staticMockLeadData: LeadTypeGlobal[] = [
	{
		id: uuid(),
		firstName: "Candice",
		lastName: "Schiner",
		phone: "(555) 123-4567",
		email: "testemail@gmail.com",
		address: "123 Main St, Springfield, IL",
		summary: "Discussed details about the 4-bedroom property.",
		bed: 4,
		bath: 3,
		sqft: 3200,
		status: "New Lead",
		followUp: "2023-09-12",
		lastUpdate: "2023-09-10",
	},
	{
		id: uuid(),
		firstName: "John",
		lastName: "Doe",
		phone: "(555) 234-5678",
		email: "testemail@gmail.com",
		address: "456 Oak St, Chicago, IL",
		summary: "Interested in selling their 2-bedroom condo.",
		bed: 2,
		bath: 2,
		sqft: 1200,
		status: "Contacted",
		followUp: "2023-09-15",
		lastUpdate: "2023-09-11",
	},
	{
		id: uuid(),
		firstName: "Alice",
		lastName: "Johnson",
		phone: "(555) 345-6789",
		email: "testemail@gmail.com",
		address: "789 Maple Ave, Austin, TX",
		summary: "Looking to buy a 3-bedroom house.",
		bed: 3,
		bath: 2,
		sqft: 1800,
		status: "New Lead",
		followUp: null,
		lastUpdate: "2023-09-09",
	},
	{
		id: uuid(),
		firstName: "David",
		lastName: "Smith",
		phone: "(555) 456-7890",
		email: "testemail@gmail.com",
		address: "321 Birch St, Seattle, WA",
		summary: "Asked for more details about the 5-bedroom house.",
		bed: 5,
		bath: 4,
		sqft: 4000,
		status: "Closed",
		followUp: null,
		lastUpdate: "2023-09-08",
	},
	{
		id: uuid(),
		firstName: "Emma",
		lastName: "Wilson",
		phone: "(555) 567-8901",
		email: "testemail@gmail.com",
		address: "654 Cedar Rd, Denver, CO",
		summary: "Inquired about investment opportunities in the area.",
		bed: 2,
		bath: 2,
		sqft: 1500,
		status: "Lost",
		followUp: "2023-09-20",
		lastUpdate: "2023-09-07",
	},
];

//
// Other Types and Data
// =====================================================================
//

export type Employee = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	gender: string;
	date_of_birth: string; // Consider using a proper date type if possible
	street: string;
	city: string;
	state: string;
	country: string;
	zipcode: string;
	longitude?: number; // Optional field
	latitude?: number; // Optional field
	job: string;
	profile_picture?: string | null; // Profile picture can be a string (URL) or null
};

export const navItems: NavItem[] = [
	{
		title: "Property Search",
		href: "/dashboard",
		icon: "search",
		label: "searchProperties",
	},
	{
		title: "Campaign Manager",
		href: "/dashboard/campaigns",
		icon: "campaigns",
		label: "campaigns",
	},
	{
		title: "Leads",
		href: "/dashboard/lead",
		icon: "user",
		label: "leads",
	},
	{
		title: "Lead Lists",
		href: "/dashboard/leadList",
		icon: "scribe",
		label: "lead-lists",
	},
	{
		title: "Kanban",
		href: "/dashboard/kanban",
		icon: "kanban",
		label: "kanban",
	},
	{
		title: "Employee",
		href: "/dashboard/employee",
		icon: "employee",
		label: "employee",
	},
	{
		title: "Logout",
		href: "/",
		icon: "logout",
		label: "logout",
	},
];
