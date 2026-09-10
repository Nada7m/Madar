import {
	AvailableTime,
	ExperienceType,
	RouteInterest,
	SuggestedRoute,
	suggestedRoutes,
} from "@/data/routes";
import { mockDestinations } from "@/data/destinations";
import { getAllProjects } from "@/data/projects";

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface RoutePreferences {
	interests: RouteInterest[];
	availableTime: AvailableTime;
	experienceType: ExperienceType;
	currentCoordinates?: Coordinates;
}

export interface RankedRoute {
	route: SuggestedRoute;
	score: number;
	matchedTags: RouteInterest[];
}

const timeLimits: Record<AvailableTime, number> = {
	"under-two": 120,
	"two-four": 240,
	"half-day": 420,
	"full-day": 720,
	"two-days": 2160,
	"three-days": 4320,
};

function distanceInDegrees(a: Coordinates, b: Coordinates): number {
	return Math.hypot(a.lat - b.lat, a.lng - b.lng);
}

function routeStart(route: SuggestedRoute): Coordinates | undefined {
	const firstProject = route.projectIds
		.map((id) => getAllProjects().find((project) => project.id === id))
		.find((project) => typeof project?.lat === "number" && typeof project.lng === "number");
	if (firstProject?.lat !== undefined && firstProject.lng !== undefined) {
		return { lat: firstProject.lat, lng: firstProject.lng };
	}

	const firstDestination = route.destinationIds
		?.map((id) => mockDestinations.find((destination) => destination.id === id))
		.find(Boolean);
	return firstDestination
		&& typeof firstDestination.lat === "number"
		&& typeof firstDestination.lng === "number"
		? { lat: firstDestination.lat, lng: firstDestination.lng }
		: undefined;
}

export function recommendRoutes(preferences: RoutePreferences): RankedRoute[] {
	const limit = timeLimits[preferences.availableTime];

	return suggestedRoutes
		.map((route) => {
			const matchedTags = route.tags.filter((tag) => preferences.interests.includes(tag));
			const experienceMatch = route.experienceTypes.includes(preferences.experienceType);
			let score = matchedTags.length * 28 + (experienceMatch ? 30 : 0);
			const timeDifference = route.durationMinutes - limit;

			if (timeDifference <= 0) score += 24;
			else score -= Math.min(38, Math.ceil(timeDifference / 60) * 6);

			const start = routeStart(route);
			if (start && preferences.currentCoordinates) {
				const distance = distanceInDegrees(start, preferences.currentCoordinates);
				score += Math.max(0, 10 - Math.round(distance * 100));
			}

			if (preferences.interests.length === 0) score += 8;
			return { route, score: Math.max(0, score), matchedTags };
		})
		.sort((a, b) => b.score - a.score || a.route.durationMinutes - b.route.durationMinutes)
		.slice(0, 5);
}