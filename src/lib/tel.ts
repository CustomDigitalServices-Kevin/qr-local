import { err, ok, type BuildResult } from "./payload";

export interface TelInput {
  /** Phone number; may contain a leading + and visual separators. */
  readonly phone: string;
}

/**
 * Telephone payload per RFC 3966: `tel:<number>`. Whitespace is stripped
 * (spaces are not valid in a tel URI; visual separators `-.()` and a leading
 * `+` are kept). At least one digit is required.
 */
export function buildTel(input: TelInput): BuildResult {
  const raw = input.phone.trim();
  if (raw.length === 0) {
    return err("tel.phone.empty", "Phone number is required");
  }
  const number = raw.replace(/\s+/g, "");
  if (!/\d/.test(number)) {
    return err("tel.phone.invalid", "Phone number must contain digits");
  }
  return ok(`tel:${number}`);
}
