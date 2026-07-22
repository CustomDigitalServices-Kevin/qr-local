import { describe, expect, it } from "vitest";
import { buildUrl } from "./url";

describe("buildUrl", () => {
  it("returns the trimmed URL verbatim", () => {
    const result = buildUrl({ url: "  https://example.com/path?q=1  " });
    expect(result).toEqual({ ok: true, payload: "https://example.com/path?q=1" });
  });

  it("does not inject a scheme", () => {
    const result = buildUrl({ url: "example.com" });
    expect(result).toEqual({ ok: true, payload: "example.com" });
  });

  it("rejects an empty or whitespace-only value", () => {
    const result = buildUrl({ url: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("url.empty");
  });
});
