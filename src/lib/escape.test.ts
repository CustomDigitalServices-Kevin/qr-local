import { describe, expect, it } from "vitest";
import { escapeMeCard, escapeVCard, escapeWifi } from "./escape";

describe("escapeWifi", () => {
  it("escapes the five reserved characters", () => {
    expect(escapeWifi(`a;b,c:d"e`)).toBe(`a\\;b\\,c\\:d\\"e`);
  });

  it("escapes a literal backslash to a double backslash", () => {
    expect(escapeWifi("a\\b")).toBe("a\\\\b");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeWifi("MonReseau")).toBe("MonReseau");
  });
});

describe("escapeMeCard", () => {
  it("escapes backslash, semicolon, colon and comma", () => {
    expect(escapeMeCard("a;b:c,d\\e")).toBe("a\\;b\\:c\\,d\\\\e");
  });

  it("does not escape the double quote (not reserved in MeCard)", () => {
    expect(escapeMeCard(`a"b`)).toBe(`a"b`);
  });
});

describe("escapeVCard", () => {
  it("escapes backslash first to avoid double-escaping", () => {
    expect(escapeVCard("a\\b")).toBe("a\\\\b");
  });

  it("escapes comma and semicolon", () => {
    expect(escapeVCard("Doe, Inc.; Ltd")).toBe("Doe\\, Inc.\\; Ltd");
  });

  it("turns newlines into a literal backslash-n and normalises CRLF", () => {
    expect(escapeVCard("line1\r\nline2\rline3\nline4")).toBe(
      "line1\\nline2\\nline3\\nline4",
    );
  });
});
