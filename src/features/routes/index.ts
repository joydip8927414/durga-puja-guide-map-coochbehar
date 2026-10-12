import { GeoLocationCoordinates } from "@/types";

/**
 * Great-circle distance formula (Haversine) in kilometers.
 * Foundational helper for route planning and pandal proximity calculations.
 */
export function calculateDistanceKm(
  coord1: GeoLocationCoordinates,
  coord2: GeoLocationCoordinates
): number {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}
