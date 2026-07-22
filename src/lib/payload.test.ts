import { describe, expect, it } from "vitest";
import { err, ok, utf8ByteLength, type BuildResult } from "./payload";

describe("ok", () => {
  it("wraps a payload string in a successful result", () => {
    const result: BuildResult = ok("hello");
    expect(result).toEqual({ ok: true, payload: "hello" });
  });

  it("preserves an empty payload verbatim", () => {
    expect(ok("")).toEqual({ ok: true, payload: "" });
  });
});

describe("err", () => {
  it("wraps a stable code and English fallback message", () => {
    const result: BuildResult = err("url.empty", "URL is required");
    expect(result).toEqual({
      ok: false,
      error: { code: "url.empty", message: "URL is required" },
    });
  });
});

describe("utf8ByteLength", () => {
  it("counts ASCII as one byte per character", () => {
    expect(utf8ByteLength("BCD")).toBe(3);
    expect(utf8ByteLength("")).toBe(0);
  });

  it("counts a 2-byte character (é) as two bytes, not one code unit", () => {
    // "é" is one UTF-16 code unit (.length === 1) but two UTF-8 bytes: the
    // distinction the SEPA 331-byte guard relies on.
    expect("é".length).toBe(1);
    expect(utf8ByteLength("é")).toBe(2);
  });

  it("counts a 3-byte character (€) as three bytes", () => {
    expect(utf8ByteLength("€")).toBe(3);
  });

  it("counts a 4-byte astral character (emoji) as four bytes", () => {
    // Surrogate pair: 2 UTF-16 code units, 4 UTF-8 bytes.
    expect("😀".length).toBe(2);
    expect(utf8ByteLength("😀")).toBe(4);
  });

  it("counts a newline (the SEPA field separator) as one byte", () => {
    expect(utf8ByteLength("a\nb")).toBe(3);
  });
});
