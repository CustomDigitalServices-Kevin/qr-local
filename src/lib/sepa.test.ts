import { describe, expect, it } from "vitest";
import { buildSepa, type SepaInput } from "./sepa";
import { utf8ByteLength } from "./payload";

const BASE: SepaInput = {
  name: "Custom Digital Services",
  iban: "FR7630006000011234567890189",
  bic: "",
  amount: "",
  purpose: "",
  reference: "",
  remittance: "",
  info: "",
};

describe("buildSepa", () => {
  it("builds a minimal payload dropping trailing empty fields", () => {
    const result = buildSepa(BASE);
    expect(result).toEqual({
      ok: true,
      payload: ["BCD", "002", "1", "SCT", "", "Custom Digital Services", "FR7630006000011234567890189"].join(
        "\n",
      ),
    });
  });

  it("keeps the empty BIC line as a positional placeholder when a later field is set", () => {
    const result = buildSepa({ ...BASE, amount: "12.50" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lines = result.payload.split("\n");
      expect(lines[4]).toBe(""); // BIC empty but present
      expect(lines[7]).toBe("EUR12.50");
      expect(lines).toHaveLength(8);
    }
  });

  it("normalises IBAN (strips spaces, uppercases) and accepts a BIC", () => {
    const result = buildSepa({
      ...BASE,
      iban: "fr76 3000 6000 0112 3456 7890 189",
      bic: "agrifrpp",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lines = result.payload.split("\n");
      expect(lines[4]).toBe("AGRIFRPP");
      expect(lines[6]).toBe("FR7630006000011234567890189");
    }
  });

  it("emits the amount with a EUR prefix and point decimal", () => {
    const result = buildSepa({ ...BASE, amount: "1" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.split("\n")[7]).toBe("EUR1");
  });

  it("places a structured reference on line 10 with remittance empty", () => {
    const result = buildSepa({ ...BASE, reference: "RF18539007547034" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lines = result.payload.split("\n");
      expect(lines[9]).toBe("RF18539007547034");
      expect(lines).toHaveLength(10);
    }
  });

  it("places unstructured remittance on line 11 leaving line 10 empty", () => {
    const result = buildSepa({ ...BASE, remittance: "Facture 2026-001" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lines = result.payload.split("\n");
      expect(lines[9]).toBe(""); // structured reference stays empty
      expect(lines[10]).toBe("Facture 2026-001");
      expect(lines).toHaveLength(11);
    }
  });

  it("rejects when both a reference and remittance are provided", () => {
    const result = buildSepa({ ...BASE, reference: "RF18", remittance: "Facture" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.remittance.exclusive");
  });

  it("rejects an empty beneficiary name", () => {
    const result = buildSepa({ ...BASE, name: "  " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.name.empty");
  });

  it("rejects a name longer than 70 characters", () => {
    const result = buildSepa({ ...BASE, name: "a".repeat(71) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.name.tooLong");
  });

  it("rejects a malformed IBAN", () => {
    const result = buildSepa({ ...BASE, iban: "12FR3000" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.iban.invalid");
  });

  it("rejects a malformed BIC", () => {
    const result = buildSepa({ ...BASE, bic: "TOO" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.bic.invalid");
  });

  it("rejects an amount with more than two decimals", () => {
    const result = buildSepa({ ...BASE, amount: "12.505" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.amount.invalid");
  });

  it("rejects an amount below the minimum", () => {
    const result = buildSepa({ ...BASE, amount: "0.00" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.amount.range");
  });

  it("rejects an amount above the maximum", () => {
    const result = buildSepa({ ...BASE, amount: "1000000000.00" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.amount.range");
  });

  it("rejects a purpose longer than 4 characters", () => {
    const result = buildSepa({ ...BASE, purpose: "GDDS1" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.purpose.tooLong");
  });

  it("rejects a structured reference longer than 25 characters", () => {
    const result = buildSepa({ ...BASE, reference: "R".repeat(26) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.reference.tooLong");
  });

  it("rejects remittance text longer than 140 characters", () => {
    const result = buildSepa({ ...BASE, remittance: "x".repeat(141) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.remittance.tooLong");
  });

  it("rejects beneficiary info longer than 70 characters", () => {
    const result = buildSepa({ ...BASE, info: "i".repeat(71) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.info.tooLong");
  });

  it("rejects a payload exceeding 331 UTF-8 bytes", () => {
    // Name 70 + remittance 140 + info 70 with multi-byte chars pushes past 331.
    const result = buildSepa({
      ...BASE,
      name: "é".repeat(70),
      remittance: "é".repeat(140),
      info: "é".repeat(70),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sepa.tooLarge");
  });

  it("keeps a valid payload within the 331-byte limit", () => {
    const result = buildSepa({ ...BASE, amount: "99.90", remittance: "Facture 2026-001" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(utf8ByteLength(result.payload)).toBeLessThanOrEqual(331);
  });
});
