import type { EnrichmentOption } from "@/types/skip-trace/enrichment";

export const enrichmentOptions: EnrichmentOption[] = [
	{
		id: "phone_hunter",
		title: "Phone Number Hunter",
		description:
			"Instantly enrich any phone number with critical data. Before you even dial, uncover the owner's name, line type, location, and spam score.",
		features: [
			"Owner Name Lookup",
			"Line Type (Mobile/VoIP/Landline)",
			"Carrier and Location Data",
			"Spam & Reputation Score",
		],
		isFree: true,
		badge: {
			text: "Pilot Tester Perk",
			bgColor: "bg-green-100",
			textColor: "text-green-800",
		},
		footer: "Free & Unlimited for Early Subscribers",
	},
	{
		id: "email_intelligence",
		title: "Email Intelligence",
		description:
			"Go beyond the inbox. Instantly find associated social profiles and generate likely email combinations to turn any contact into a warm lead.",
		features: [
			"Social Media Account Discovery",
			"Likely Email Address Generation",
			"Digital Footprint Verification",
		],
		isFree: true,
		badge: {
			text: "Pilot Tester Perk",
			bgColor: "bg-green-100",
			textColor: "text-green-800",
		},
		footer: "Free & Unlimited for Subscribers",
	},
	{
		id: "domain_recon",
		title: "Domain Recon",
		description:
			"Go beyond the homepage. Enter any domain to uncover associated emails, subdomains, employee names, and the technologies a company uses.",
		features: [
			"Email and Name Discovery",
			"Subdomain & IP Enumeration",
			"Technology Stack Identification",
			"Free Public Search Tier",
		],
		isFree: false,
		badge: {
			text: "Premium",
			bgColor: "bg-blue-100",
			textColor: "text-blue-800",
		},
		footer: "Premium Deep-Dive (Credit-Based)",
	},
	{
		id: "social_profile_hunter",
		title: "Social Profile Hunter",
		description:
			"Discover your lead's complete digital footprint. Use a username or email to find all associated accounts across 600+ social media and online platforms.",
		features: [
			"Username & Email Search",
			"Scans 600+ Online Platforms",
			"AI-Powered Metadata Extraction",
			"PDF & CSV Reporting",
		],
		isFree: true,
		badge: {
			text: "Pilot Tester Perk",
			bgColor: "bg-green-100",
			textColor: "text-green-800",
		},
		footer: "Free & Unlimited for Subscribers",
	},
	{
		id: "lead_dossier_generator",
		title: "Lead Dossier Generator",
		description:
			"The ultimate OSINT tool. Start with a single username to discover a web of associated accounts across 3000+ sites.",
		features: [
			"Recursive Search (Finds New Usernames)",
			"Comprehensive Search Across 3000+ Sites",
			"Profile Page Content Parsing",
			"Visual Relationship Map & Reports",
		],
		isFree: true,
		badge: {
			text: "Pilot Tester Perk",
			bgColor: "bg-green-100",
			textColor: "text-green-800",
		},
		footer: "Free & Unlimited (No API Keys Needed)",
	},
	{
		id: "data_enrichment_suite",
		title: "Data Enrichment Suite",
		description:
			"A suite of premium, credit-based tools to verify, clean, and enrich your lead data. Turn any single piece of information into a complete, actionable lead profile.",
		features: [
			"Reverse Phone & Address Lookup",
			"Bulk Phone Number Validation",
			"Find Person by Name & Location",
			"Real-Time Caller Identification",
		],
		isFree: false,
		badge: {
			text: "Premium Data Tools",
			bgColor: "bg-blue-100",
			textColor: "text-blue-800",
		},
		footer: "Uses Skip Tracing Credits",
	},
];
