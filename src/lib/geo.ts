import { err, ok, type BuildResult } from "./payload";

export interface GeoInput {
  /** Latitude in decimal degrees, as a string (point decimal separator). */
  readonly latitude: string;
  /** Longitude in decimal degrees, as a string (point decimal separator). */
  readonly longitude: string;
}

function parseCoordinate(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  // Reject anything that is not a plain decimal number (a comma decimal
  // separator would silently produce NaN, so it is rejected explicitly).
  if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/**
 * Geo URI per RFC 5870: `geo:<lat>,<lon>`. Latitude must be within
 * [-90, 90] and longitude within [-180, 180]. The original (validated) numeric
 * strings are emitted to preserve the user's precision exactly.
 */
export function buildGeo(input: GeoInput): BuildResult {
  const lat = parseCoordinate(input.latitude);
  if (lat === null || lat < -90 || lat > 90) {
    return err("geo.latitude.invalid", "Latitude must be between -90 and 90");
  }
  const lon = parseCoordinate(input.longitude);
  if (lon === null || lon < -180 || lon > 180) {
    return err("geo.longitude.invalid", "Longitude must be between -180 and 180");
  }
  return ok(`geo:${input.latitude.trim()},${input.longitude.trim()}`);
}
