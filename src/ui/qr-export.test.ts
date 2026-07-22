import { describe, expect, it } from "vitest";
import { sanitizeFileName, clampExportSize, DEFAULT_PNG_SIZE } from "./qr-export";

describe("sanitizeFileName", () => {
  it("lowercases, strips accents and collapses separators", () => {
    expect(sanitizeFileName("Héllo Wörld!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(sanitizeFileName("  --Réf 42--  ")).toBe("ref-42");
  });

  it("falls back to qr-code when nothing usable remains", () => {
    expect(sanitizeFileName("")).toBe("qr-code");
    expect(sanitizeFileName("   ")).toBe("qr-code");
    expect(sanitizeFileName("***")).toBe("qr-code");
  });

  it("caps the length at 60 characters without a trailing hyphen", () => {
    const out = sanitizeFileName("a".repeat(80));
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.endsWith("-")).toBe(false);
  });
});

describe("clampExportSize", () => {
  it("keeps values inside the HD range", () => {
    expect(clampExportSize(100)).toBe(512);
    expect(clampExportSize(5000)).toBe(2048);
    expect(clampExportSize(1024)).toBe(1024);
  });

  it("rounds fractional sizes", () => {
    expect(clampExportSize(1023.6)).toBe(1024);
  });

  it("defaults on non-finite input", () => {
    expect(clampExportSize(Number.NaN)).toBe(DEFAULT_PNG_SIZE);
  });
});
