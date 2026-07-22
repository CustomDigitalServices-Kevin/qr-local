import { describe, expect, it } from "vitest";
import {
  clampLogoSize,
  contrastRatio,
  hasSufficientContrast,
  MAX_LOGO_SIZE,
  resolveErrorCorrection,
} from "./qr-options";

describe("resolveErrorCorrection", () => {
  it("forces H when a logo is present, overriding the request", () => {
    expect(resolveErrorCorrection(true, "L")).toBe("H");
    expect(resolveErrorCorrection(true)).toBe("H");
  });

  it("honours the requested level without a logo, defaulting to M", () => {
    expect(resolveErrorCorrection(false)).toBe("M");
    expect(resolveErrorCorrection(false, "Q")).toBe("Q");
  });
});

describe("clampLogoSize", () => {
  it("caps the size at MAX_LOGO_SIZE", () => {
    expect(clampLogoSize(0.5)).toBe(MAX_LOGO_SIZE);
    expect(clampLogoSize(0.9)).toBe(MAX_LOGO_SIZE);
  });

  it("passes through values within range", () => {
    expect(clampLogoSize(0.2)).toBe(0.2);
  });

  it("clamps negatives and non-finite values to 0", () => {
    expect(clampLogoSize(-1)).toBe(0);
    expect(clampLogoSize(Number.NaN)).toBe(0);
  });
});

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#123456", "#123456")).toBeCloseTo(1, 5);
  });

  it("supports 3-digit shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 5);
  });

  it("returns null for an invalid color", () => {
    expect(contrastRatio("nope", "#fff")).toBeNull();
  });
});

describe("hasSufficientContrast", () => {
  it("accepts a high-contrast pair (>= 3:1)", () => {
    expect(hasSufficientContrast("#000000", "#ffffff")).toBe(true);
  });

  it("rejects a low-contrast pair", () => {
    expect(hasSufficientContrast("#777777", "#888888")).toBe(false);
  });

  it("rejects invalid colors", () => {
    expect(hasSufficientContrast("bad", "#fff")).toBe(false);
  });
});
