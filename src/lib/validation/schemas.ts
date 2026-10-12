import { CrowdDensity, GeoLocationCoordinates } from "@/types";

/**
 * Server-Side Validation Utilities
 *
 * Enforces strict boundaries against injection, overflow, and malformed client inputs.
 */

// Approximate bounding box for Cooch Behar District, West Bengal
export const COOCH_BEHAR_BOUNDS = {
  minLat: 25.8,
  maxLat: 26.7,
  minLon: 88.6,
  maxLon: 90.1,
};

export const VALID_CROWD_DENSITIES: readonly CrowdDensity[] = [
  "low",
  "moderate",
  "high",
  "peak",
];

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates and sanitizes a string input.
 * Strips HTML tags, trims whitespace, and validates length bounds.
 */
export function validateSanitizedString(
  input: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 250
): ValidationResult<string> {
  if (typeof input !== "string") {
    return {
      success: false,
      error: `${fieldName} must be a valid text string.`,
    };
  }

  // Strip dangerous HTML tags and zero-width/control characters
  const sanitized = input
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();

  if (sanitized.length < minLength) {
    return {
      success: false,
      error: `${fieldName} must be at least ${minLength} characters long.`,
    };
  }

  if (sanitized.length > maxLength) {
    return {
      success: false,
      error: `${fieldName} exceeds maximum length of ${maxLength} characters.`,
    };
  }

  return { success: true, data: sanitized };
}

/**
 * Validates geo coordinates are numbers and fall within Cooch Behar bounds.
 */
export function validateCoordinates(
  lat: unknown,
  lon: unknown
): ValidationResult<GeoLocationCoordinates> {
  if (typeof lat !== "number" || typeof lon !== "number" || isNaN(lat) || isNaN(lon)) {
    return {
      success: false,
      error: "Latitude and longitude must be valid floating point numbers.",
    };
  }

  if (
    lat < COOCH_BEHAR_BOUNDS.minLat ||
    lat > COOCH_BEHAR_BOUNDS.maxLat ||
    lon < COOCH_BEHAR_BOUNDS.minLon ||
    lon > COOCH_BEHAR_BOUNDS.maxLon
  ) {
    return {
      success: false,
      error: `Coordinates must fall within Cooch Behar district boundaries (${COOCH_BEHAR_BOUNDS.minLat} - ${COOCH_BEHAR_BOUNDS.maxLat} N, ${COOCH_BEHAR_BOUNDS.minLon} - ${COOCH_BEHAR_BOUNDS.maxLon} E).`,
    };
  }

  return { success: true, data: { latitude: lat, longitude: lon } };
}

/**
 * Validates crowd density enum.
 */
export function validateCrowdDensity(input: unknown): ValidationResult<CrowdDensity> {
  if (typeof input !== "string" || !VALID_CROWD_DENSITIES.includes(input as CrowdDensity)) {
    return {
      success: false,
      error: `Invalid crowd status. Must be one of: ${VALID_CROWD_DENSITIES.join(", ")}.`,
    };
  }
  return { success: true, data: input as CrowdDensity };
}
