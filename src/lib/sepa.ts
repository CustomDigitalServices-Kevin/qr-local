import { err, ok, utf8ByteLength, type BuildResult } from "./payload";

export interface SepaInput {
  /** Beneficiary name. Required, max 70 chars. */
  readonly name: string;
  /** Beneficiary IBAN. Required. Spaces are stripped before validation. */
  readonly iban: string;
  /** Beneficiary BIC. Optional in version 002 (8 or 11 chars if present). */
  readonly bic: string;
  /** Amount as a decimal string with a point separator (e.g. "12.50"). Optional. */
  readonly amount: string;
  /** Purpose code, max 4 chars. Optional. */
  readonly purpose: string;
  /** Structured creditor reference (ISO 11649), max 25 chars. Optional. */
  readonly reference: string;
  /** Unstructured remittance text, max 140 chars. Optional. */
  readonly remittance: string;
  /** Beneficiary-to-originator information, max 70 chars. Optional. */
  readonly info: string;
}

// EPC069-12 v3.1 constants.
const SERVICE_TAG = "BCD";
const VERSION = "002"; // v002: BIC optional.
const CHARSET_UTF8 = "1";
const IDENTIFICATION = "SCT";
const MAX_BYTES = 331;
const AMOUNT_MIN = 0.01;
const AMOUNT_MAX = 999999999.99;

const IBAN_RE = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
const BIC_RE = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const AMOUNT_RE = /^\d+(\.\d{1,2})?$/;

/**
 * SEPA Credit Transfer payload per EPC069-12 v3.1 (Girocode). Twelve fields,
 * one per line, separated by LF, UTF-8. Beneficiary name and IBAN are
 * mandatory. The structured reference (line 10) and the unstructured
 * remittance (line 11) are mutually exclusive. Trailing empty fields are
 * dropped so the last populated line carries no trailing separator, and the
 * whole payload must fit in 331 UTF-8 bytes.
 */
export function buildSepa(input: SepaInput): BuildResult {
  const name = input.name.trim();
  if (name.length === 0) {
    return err("sepa.name.empty", "Beneficiary name is required");
  }
  if (name.length > 70) {
    return err("sepa.name.tooLong", "Beneficiary name must be 70 characters or fewer");
  }

  const iban = input.iban.replace(/\s+/g, "").toUpperCase();
  if (iban.length === 0) {
    return err("sepa.iban.empty", "IBAN is required");
  }
  if (iban.length > 34 || !IBAN_RE.test(iban)) {
    return err("sepa.iban.invalid", "IBAN format is invalid");
  }

  const bic = input.bic.replace(/\s+/g, "").toUpperCase();
  if (bic.length > 0 && !BIC_RE.test(bic)) {
    return err("sepa.bic.invalid", "BIC must be 8 or 11 characters");
  }

  let amountField = "";
  const amount = input.amount.trim();
  if (amount.length > 0) {
    if (!AMOUNT_RE.test(amount)) {
      return err("sepa.amount.invalid", "Amount must be a decimal with up to 2 places");
    }
    const value = Number(amount);
    if (value < AMOUNT_MIN || value > AMOUNT_MAX) {
      return err("sepa.amount.range", "Amount must be between 0.01 and 999999999.99 EUR");
    }
    amountField = `EUR${amount}`;
  }

  const purpose = input.purpose.trim();
  if (purpose.length > 4) {
    return err("sepa.purpose.tooLong", "Purpose must be 4 characters or fewer");
  }

  const reference = input.reference.trim();
  if (reference.length > 25) {
    return err("sepa.reference.tooLong", "Structured reference must be 25 characters or fewer");
  }

  const remittance = input.remittance.trim();
  if (remittance.length > 140) {
    return err("sepa.remittance.tooLong", "Remittance text must be 140 characters or fewer");
  }

  if (reference.length > 0 && remittance.length > 0) {
    return err(
      "sepa.remittance.exclusive",
      "Provide either a structured reference or remittance text, not both",
    );
  }

  const info = input.info.trim();
  if (info.length > 70) {
    return err("sepa.info.tooLong", "Beneficiary information must be 70 characters or fewer");
  }

  // Positional fields 1..12. Order is fixed; empty intermediate fields stay as
  // empty lines to preserve positions.
  const fields = [
    SERVICE_TAG, // 1
    VERSION, // 2
    CHARSET_UTF8, // 3
    IDENTIFICATION, // 4
    bic, // 5
    name, // 6
    iban, // 7
    amountField, // 8
    purpose, // 9
    reference, // 10
    remittance, // 11
    info, // 12
  ];

  // Drop trailing empty fields: the last populated line must not be followed by
  // a separator.
  let lastFilled = fields.length - 1;
  while (lastFilled >= 0 && fields[lastFilled] === "") {
    lastFilled -= 1;
  }
  const payload = fields.slice(0, lastFilled + 1).join("\n");

  if (utf8ByteLength(payload) > MAX_BYTES) {
    return err("sepa.tooLarge", `Payload exceeds the ${String(MAX_BYTES)}-byte EPC limit`);
  }

  return ok(payload);
}
