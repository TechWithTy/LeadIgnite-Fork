"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Property } from "@/types/_dashboard/property";
import { BarChart2, LineChart, PieChart, Star } from "lucide-react";
import { useMemo } from "react";

interface AIScoreCardProps {
	property: Property;
	className?: string;
}

// Types for AI scores
interface AIScore {
	name: string;
	value: number;
	description?: string;
	trend?: "up" | "down" | "neutral";
	icon?: React.ReactNode;
	features?: string[];
	mapLink?: string;
}

// Mock data for AI scores
const mockAIScores: AIScore[] = [
	{
		name: "Off-Market Score",
		value: 85,
		description: "Likelihood of finding off-market deals in this area",
		trend: "up",
		features: [
			"Analyzes historical off-market transactions",
			"Considers local market conditions",
			"Identifies potential motivated sellers",
		],
	},
	{
		name: "Crime Score",
		value: 72,
		description: "Safety assessment of the neighborhood",
		trend: "neutral",
		features: [
			"Crime rate analysis",
			"Safety trends",
			"Local law enforcement presence",
		],
	},
	{
		name: "Walk Score",
		value: 63,
		description: "Walkability of the neighborhood",
		trend: "up",
		icon: <span>🚶</span>,
		features: [
			"Proximity to amenities",
			"Sidewalk quality",
			"Pedestrian safety",
		],
		mapLink: "#walkability-map",
	},
	{
		name: "Transit Score",
		value: 58,
		description: "Quality of public transportation",
		trend: "down",
		icon: <span>🚌</span>,
		features: [
			"Transit routes",
			"Frequency of service",
			"Access to major hubs",
		],
		mapLink: "#transit-map",
	},
];

// Mock neighborhood data
const neighborhoodInsights = {
	walkability: [
		{ amenity: "Restaurants", distance: "5 min walk" },
		{ amenity: "Grocery Stores", distance: "12 min walk" },
		{ amenity: "Parks", distance: "8 min walk" },
	],
	transit: [
		{ line: "Bus 42", frequency: "Every 15 min", distance: "3 min walk" },
		{
			line: "Subway Blue Line",
			frequency: "Every 8 min",
			distance: "10 min walk",
		},
	],
};

export const PropertyAIScoreCard: React.FC<AIScoreCardProps> = ({
	property,
	className = "",
}) => {
	// Calculate overall score (average of all scores)
	const overallScore = useMemo(() => {
		const sum = mockAIScores.reduce((acc, score) => acc + score.value, 0);
		return Math.round(sum / mockAIScores.length);
	}, []);

	// Get score color based on value
	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-500";
		if (score >= 60) return "text-yellow-500";
		return "text-red-500";
	};

	// Get trend icon with optional custom class
	const getTrendIcon = (trend?: "up" | "down" | "neutral", className = "") => {
		switch (trend) {
			case "up":
				return <span className={`text-green-500 ${className}`}>↑</span>;
			case "down":
				return <span className={`text-red-500 ${className}`}>↓</span>;
			default:
				return <span className={`text-gray-500 ${className}`}>→</span>;
		}
	};

	return (
		<Card className={`dark:bg-gray-800 dark:text-white ${className}`}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Star className="h-5 w-5 text-yellow-500" />
					Property Location & Market Analysis
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Off-Market Score */}
				<div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 p-4 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium text-sm">Off-Market Potential</h3>
							<p className="text-xs opacity-80">
								Likelihood of finding off-market deals in this area
							</p>
						</div>
						<div className="font-bold text-4xl">
							{mockAIScores[0].value}
							<span className="text-2xl">/100</span>
							{getTrendIcon(mockAIScores[0].trend, "text-xl ml-1")}
						</div>
					</div>
					<div className="mt-3">
						<div className="mb-2 flex justify-between text-xs">
							<span>Low Potential</span>
							<span>High Potential</span>
						</div>
						<Progress
							value={mockAIScores[0].value}
							className="h-2 bg-white/20"
						/>
					</div>
					<div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
						{mockAIScores[0].features?.map((feature, i) => (
							<div key={i} className="flex items-center">
								<span className="mr-1">✓</span> {feature}
							</div>
						))}
					</div>
				</div>

				{/* Location & Neighborhood Scores */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{mockAIScores.slice(1).map((score) => (
						<div
							key={score.name}
							className="group relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md dark:border-gray-700"
						>
							<div className="flex items-center justify-between">
								<h4 className="font-medium">
									{score.icon && <span className="mr-2">{score.icon}</span>}
									{score.name}
								</h4>
								<div className="flex items-center gap-1">
									<span
										className={`font-semibold ${getScoreColor(score.value)}`}
									>
										{score.value}
									</span>
									{getTrendIcon(score.trend)}
								</div>
							</div>
							<p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
								{score.description}
							</p>
							<div className="mt-2">
								<div className="mb-1 flex justify-between text-gray-500 text-xs">
									<span>0</span>
									<span>100</span>
								</div>
								<Progress
									value={score.value}
									className="h-1.5"
									indicatorClassName={getScoreColor(score.value).replace(
										"text-",
										"bg-",
									)}
								/>
							</div>

							{/* Features List */}
							{score.features && score.features.length > 0 && (
								<div className="mt-3">
									<h5 className="mb-1 font-medium text-xs">Key Factors:</h5>
									<ul className="space-y-1 text-gray-600 text-xs dark:text-gray-400">
										{score.features.slice(0, 3).map((feature, i) => (
											<li key={i} className="flex items-start">
												<span className="mr-1">•</span> {feature}
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Map Link */}
							{score.mapLink && (
								<a
									href={score.mapLink}
									className="mt-2 block font-medium text-blue-600 text-xs hover:underline dark:text-blue-400"
								>
									View on map →
								</a>
							)}
						</div>
					))}
				</div>

				{/* Neighborhood Insights */}
				<div className="grid gap-4 md:grid-cols-2">
					{/* Walkability Details */}
					<div className="rounded-lg border p-4 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-xl">🚶</span>
								<h4 className="font-medium">Walkability</h4>
							</div>
							<a
								href="#walkability-map"
								className="font-medium text-blue-600 text-xs hover:underline dark:text-blue-400"
							>
								View Map →
							</a>
						</div>

						<div className="mt-3 space-y-3">
							<div>
								<div className="mb-1 flex justify-between text-sm">
									<span>Walk Score</span>
									<span className="font-semibold">
										{mockAIScores[2].value}/100
									</span>
								</div>
								<Progress
									value={mockAIScores[2].value}
									className="h-2"
									indicatorClassName="bg-green-500"
								/>
							</div>

							<div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<h5 className="mb-2 font-medium text-sm">Nearby Amenities</h5>
								<div className="space-y-2">
									{neighborhoodInsights.walkability.map((item, i) => (
										<div key={i} className="flex justify-between text-sm">
											<span>{item.amenity}</span>
											<span className="text-gray-500">{item.distance}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Transit Details */}
					<div className="rounded-lg border p-4 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-xl">🚌</span>
								<h4 className="font-medium">Transit Options</h4>
							</div>
							<a
								href="#transit-map"
								className="font-medium text-blue-600 text-xs hover:underline dark:text-blue-400"
							>
								View Map →
							</a>
						</div>

						<div className="mt-3 space-y-3">
							<div>
								<div className="mb-1 flex justify-between text-sm">
									<span>Transit Score</span>
									<span className="font-semibold">
										{mockAIScores[3].value}/100
									</span>
								</div>
								<Progress
									value={mockAIScores[3].value}
									className="h-2"
									indicatorClassName="bg-blue-500"
								/>
							</div>

							<div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<h5 className="mb-2 font-medium text-sm">Nearby Transit</h5>
								<div className="space-y-2">
									{neighborhoodInsights.transit.map((item, i) => (
										<div key={i} className="text-sm">
											<div className="font-medium">{item.line}</div>
											<div className="flex justify-between text-gray-500">
												<span>{item.frequency}</span>
												<span>{item.distance}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Crime & Safety */}
				<div className="rounded-lg border p-4 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-xl">🛡️</span>
							<h4 className="font-medium">Crime & Safety</h4>
						</div>
						<span className="text-gray-500 text-xs">
							Last updated: {new Date().toLocaleDateString()}
						</span>
					</div>

					<div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<div className="mb-1 flex justify-between text-sm">
								<span>Crime Score</span>
								<span className="font-semibold">
									{mockAIScores[1].value}/100
								</span>
							</div>
							<div className="relative">
								<Progress
									value={mockAIScores[1].value}
									className="h-2"
									indicatorClassName={getScoreColor(
										mockAIScores[1].value,
									).replace("text-", "bg-")}
								/>
								<div className="absolute inset-0 flex items-center justify-between px-1 text-[10px] text-gray-400">
									<span>Safer</span>
									<span>Average</span>
									<span>Less Safe</span>
								</div>
							</div>
							<div className="mt-2 text-gray-500 text-xs">
								{mockAIScores[1].description}
							</div>
						</div>

						<div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
							<h5 className="mb-2 font-medium text-red-800 text-sm dark:text-red-200">
								Safety Tips
							</h5>
							<ul className="space-y-1 text-red-700 text-xs dark:text-red-300">
								<li className="flex items-start">
									<span className="mr-1">•</span> Consider security system
									installation
								</li>
								<li className="flex items-start">
									<span className="mr-1">•</span> Neighborhood watch programs
									available
								</li>
								<li className="flex items-start">
									<span className="mr-1">•</span> Check local crime maps for
									specific incidents
								</li>
							</ul>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default PropertyAIScoreCard;
