// Shared contract for every payload builder in src/lib/.
//
// A builder takes a typed, UI-agnostic input object and returns the *exact*
// string to encode into a QR code. Because most content types have required
// fields and length/format constraints, builders return a discriminated
// `BuildResult` rather than throwing: the UI can render errors declaratively
// and map the stable `code` to a localized message. Pure, no UI dependency.

/**
 * Stable, machine-readable error identifiers. The UI maps each to a localized
 * message; `message` carries an English fallback for logs.
 */
export type BuildErrorCode =
  | "url.empty"
  | "text.empty"
  | "wifi.ssid.empty"
  | "wifi.password.empty"
  | "vcard.name.empty"
  | "mecard.name.empty"
  | "mailto.to.empty"
  | "sms.phone.empty"
  | "tel.phone.empty"
  | "tel.phone.invalid"
  | "geo.latitude.invalid"
  | "geo.longitude.invalid"
  | "sepa.name.empty"
  | "sepa.name.tooLong"
  | "sepa.iban.empty"
  | "sepa.iban.invalid"
  | "sepa.bic.invalid"
  | "sepa.amount.invalid"
  | "sepa.amount.range"
  | "sepa.purpose.tooLong"
  | "sepa.reference.tooLong"
  | "sepa.remittance.tooLong"
  | "sepa.remittance.exclusive"
  | "sepa.info.tooLong"
  | "sepa.tooLarge";

export interface BuildError {
  readonly code: BuildErrorCode;
  /** English fallback message, intended for logs/tests, not for end users. */
  readonly message: string;
}

export type BuildResult =
  | { readonly ok: true; readonly payload: string }
  | { readonly ok: false; readonly error: BuildError };

/** Wrap a successful payload string. */
export function ok(payload: string): BuildResult {
  return { ok: true, payload };
}

/** Wrap a validation failure. */
export function err(code: BuildErrorCode, message: string): BuildResult {
  return { ok: false, error: { code, message } };
}

/** UTF-8 byte length of a string (not the UTF-16 code-unit `.length`). */
export function utf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}
