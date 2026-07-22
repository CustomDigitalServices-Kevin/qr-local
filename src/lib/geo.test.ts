import { describe, expect, it } from "vitest";
import { buildGeo } from "./geo";

describe("buildGeo", () => {
  it("builds an RFC 5870 geo URI preserving precision", () => {
    const result = buildGeo({ latitude: " 48.8566 ", longitude: " 2.3522 " });
    expect(result).toEqual({ ok: true, payload: "geo:48.8566,2.3522" });
  });

  it("accepts negative coordinates and boundary values", () => {
    expect(buildGeo({ latitude: "-90", longitude: "180" })).toEqual({
      ok: true,
      payload: "geo:-90,180",
    });
  });

  it("rejects latitude outside [-90, 90]", () => {
    const result = buildGeo({ latitude: "90.1", longitude: "0" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("geo.latitude.invalid");
  });

  it("rejects longitude outside [-180, 180]", () => {
    const result = buildGeo({ latitude: "0", longitude: "181" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("geo.longitude.invalid");
  });

  it("rejects a comma decimal separator", () => {
    const result = buildGeo({ latitude: "48,85", longitude: "2.35" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("geo.latitude.invalid");
  });
});
