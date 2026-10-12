import { Amenity, AmenityType } from "@/types";

export const AMENITY_LABELS: Record<AmenityType, { en: string; bn: string }> = {
  police_booth: { en: "Police Assistance Booth", bn: "পুলিশ সহায়তা কেন্দ্র" },
  medical_aid: { en: "First Aid / Medical Camp", bn: "প্রাথমিক চিকিৎসা কেন্দ্র" },
  drinking_water: { en: "Free Drinking Water", bn: "পানীয় জল" },
  restroom: { en: "Public Restroom", bn: "শৌচাগার" },
  lost_and_found: { en: "Lost & Found Booth", bn: "নিখোঁজ তথ্য কেন্দ্র" },
  fire_station: { en: "Fire Emergency Station", bn: "দমকল কেন্দ্র" },
};

export function filterAmenitiesByType(amenities: Amenity[], type: AmenityType): Amenity[] {
  return amenities.filter((item) => item.type === type);
}
