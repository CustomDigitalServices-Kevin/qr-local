import { err, ok, type BuildResult } from "./payload";

export interface SmsInput {
  /** Destination phone number. */
  readonly phone: string;
  /** Optional pre-filled message body. */
  readonly message: string;
}

/**
 * SMS payload in the widely supported `SMSTO:<number>:<message>` form. The
 * number is required; the message is optional (the trailing colon is kept so
 * the format stays canonical even with an empty body). Whitespace inside the
 * number is stripped; the message is preserved verbatim.
 */
export function buildSms(input: SmsInput): BuildResult {
  const number = input.phone.trim().replace(/\s+/g, "");
  if (number.length === 0) {
    return err("sms.phone.empty", "Phone number is required");
  }
  return ok(`SMSTO:${number}:${input.message}`);
}
