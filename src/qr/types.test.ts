import { describe, expect, it } from "vitest";
import { QR_TYPES, typeLabelKey } from "./types";
import { messages } from "../i18n/messages";

describe("QR type registry", () => {
  it("exposes the ten supported content types in order", () => {
    expect([...QR_TYPES]).toEqual([
      "url",
      "text",
      "wifi",
      "vcard",
      "mecard",
      "mailto",
      "sms",
      "tel",
      "geo",
      "sepa",
    ]);
  });

  it("has no duplicate type identifiers", () => {
    expect(new Set(QR_TYPES).size).toBe(QR_TYPES.length);
  });

  it("maps every type to a label key that exists in both locales", () => {
    for (const type of QR_TYPES) {
      const key = typeLabelKey(type);
      expect(messages.fr[key]).toBeTruthy();
      expect(messages.en[key]).toBeTruthy();
    }
  });
});
