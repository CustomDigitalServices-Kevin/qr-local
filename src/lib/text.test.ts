import { describe, expect, it } from "vitest";
import { buildText } from "./text";

describe("buildText", () => {
  it("encodes text verbatim, preserving internal whitespace", () => {
    const result = buildText({ text: "  hello   world  " });
    expect(result).toEqual({ ok: true, payload: "  hello   world  " });
  });

  it("rejects an all-whitespace value", () => {
    const result = buildText({ text: "\n\t " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("text.empty");
  });
});
