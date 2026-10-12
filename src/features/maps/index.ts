import { GeoLocationCoordinates } from "@/types";

/**
 * Cooch Behar Center & Map Configuration Constants
 * Prepared for future React Leaflet integration
 */
export const COOCH_BEHAR_MAP_CENTER: GeoLocationCoordinates = {
  latitude: 26.3239,
  longitude: 89.451,
};

export const DEFAULT_MAP_ZOOM = 14;
export const MIN_MAP_ZOOM = 11;
export const MAX_MAP_ZOOM = 18;

// OpenStreetMap Standard Tile Layer
export const OSM_TILE_LAYER_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
