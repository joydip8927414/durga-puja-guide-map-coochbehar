/**
 * Core Domain Types for Cooch Behar Durga Puja Guide
 * Strict typing enforced for all future modules
 */

export type LanguageCode = "en" | "bn";

export type CrowdDensity = "low" | "moderate" | "high" | "peak";

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PandalAccessibility {
  wheelchairAccessible: boolean;
  seniorRestArea: boolean;
  priorityQueueAvailable: boolean;
  drinkingWaterNearby: boolean;
  medicalCampNearby: boolean;
}

export interface Pandal {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  zone: string; // e.g. "Cooch Behar Town", "Dinhata", "Tufanganj", etc.
  address: string;
  coordinates: GeoLocationCoordinates;
  themeEn?: string;
  themeBn?: string;
  inaugurationDate?: string;
  accessibility: PandalAccessibility;
  currentCrowdLevel?: CrowdDensity;
  bannerImageUrl?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrowdReportSubmission {
  pandalId: string;
  crowdLevel: CrowdDensity;
  estimatedWaitMinutes?: number;
  clientTimestamp: number;
}

export type AmenityType =
  | "police_booth"
  | "medical_aid"
  | "drinking_water"
  | "restroom"
  | "lost_and_found"
  | "fire_station";

export interface Amenity {
  id: string;
  type: AmenityType;
  nameEn: string;
  nameBn: string;
  coordinates: GeoLocationCoordinates;
  helplineNumber?: string;
  is24x7: boolean;
}

export interface RoutePlan {
  id: string;
  titleEn: string;
  titleBn: string;
  pandalIds: string[];
  totalDistanceKm: number;
  estimatedHours: number;
  isSeniorFriendly: boolean;
}
