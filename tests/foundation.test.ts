import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateSanitizedString,
  validateCoordinates,
  validateCrowdDensity,
} from "../src/lib/validation/schemas";
import { calculateDistanceKm } from "../src/features/routes";

describe("Foundation Verification Tests", () => {
  it("validateSanitizedString strips HTML tags and enforces length bounds", () => {
    const raw = "<script>alert('xss')</script>Pooja Pandal";
    const result = validateSanitizedString(raw, "Pandal Name", 3, 50);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, "alert('xss')Pooja Pandal");
  });

  it("validateCoordinates rejects coordinates outside Cooch Behar district", () => {
    // Valid Cooch Behar Town coordinate
    const valid = validateCoordinates(26.3239, 89.451);
    assert.strictEqual(valid.success, true);

    // Invalid coordinate (outside bounding box)
    const invalid = validateCoordinates(12.9716, 77.5946);
    assert.strictEqual(invalid.success, false);
  });

  it("validateCrowdDensity verifies allowed enums", () => {
    assert.strictEqual(validateCrowdDensity("low").success, true);
    assert.strictEqual(validateCrowdDensity("moderate").success, true);
    assert.strictEqual(validateCrowdDensity("invalid_status").success, false);
  });

  it("calculateDistanceKm calculates Haversine distance", () => {
    const c1 = { latitude: 26.3239, longitude: 89.451 };
    const c2 = { latitude: 26.3339, longitude: 89.461 };
    const dist = calculateDistanceKm(c1, c2);
    assert.ok(dist > 0);
  });
});
