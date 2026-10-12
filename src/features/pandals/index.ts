import { Pandal } from "@/types";

export interface PandalFilterOptions {
  zone?: string;
  searchQuery?: string;
  wheelchairOnly?: boolean;
  seniorFriendlyOnly?: boolean;
}

/**
 * Filter contract placeholder for future pandal directory implementation
 */
export function filterPandals(pandals: Pandal[], filters: PandalFilterOptions): Pandal[] {
  return pandals.filter((pandal) => {
    if (filters.zone && pandal.zone !== filters.zone) return false;
    if (filters.wheelchairOnly && !pandal.accessibility.wheelchairAccessible) return false;
    if (filters.seniorFriendlyOnly && !pandal.accessibility.seniorRestArea) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName =
        pandal.nameEn.toLowerCase().includes(q) || pandal.nameBn.includes(q);
      const matchAddress = pandal.address.toLowerCase().includes(q);
      if (!matchName && !matchAddress) return false;
    }
    return true;
  });
}
