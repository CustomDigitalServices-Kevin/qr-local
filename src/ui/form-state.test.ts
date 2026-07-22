import { describe, expect, it } from "vitest";
import { QR_TYPES } from "../qr/types";
import { buildPayload, type PayloadInput } from "../lib";
import { initialFormState, toPayloadInput, restoreSlice } from "./form-state";

describe("toPayloadInput", () => {
  it("tags every slice with its own discriminant", () => {
    const state = initialFormState();
    for (const type of QR_TYPES) {
      expect(toPayloadInput(type, state).type).toBe(type);
    }
  });

  it("carries the slice values through unchanged", () => {
    const state = initialFormState();
    const next = { ...state, url: { url: "https://cds.example" } };
    const input = toPayloadInput("url", next);
    expect(input).toEqual({ type: "url", url: "https://cds.example" });
  });

  it("produces inputs that the builder dispatcher accepts", () => {
    const state = { ...initialFormState(), text: { text: "hello" } };
    const result = buildPayload(toPayloadInput("text", state));
    expect(result.ok).toBe(true);
  });
});

describe("restoreSlice", () => {
  it("round-trips an input back into the matching slice", () => {
    const inputs: PayloadInput[] = [
      { type: "url", url: "https://a.example" },
      { type: "wifi", ssid: "Net", password: "secret-key", auth: "WPA", hidden: true },
      {
        type: "sepa",
        name: "Acme",
        iban: "FR7630006000011234567890189",
        bic: "",
        amount: "12.50",
        purpose: "",
        reference: "",
        remittance: "Invoice 42",
        info: "",
      },
    ];
    for (const input of inputs) {
      const restored = restoreSlice(initialFormState(), input);
      expect(toPayloadInput(input.type, restored)).toEqual(input);
    }
  });

  it("leaves the other slices at their defaults", () => {
    const restored = restoreSlice(initialFormState(), { type: "text", text: "hi" });
    expect(restored.url).toEqual(initialFormState().url);
    expect(restored.text).toEqual({ text: "hi" });
  });
});
