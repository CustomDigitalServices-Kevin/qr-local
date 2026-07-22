import { err, ok, type BuildResult } from "./payload";

export interface MailtoInput {
  /** Recipient e-mail address. */
  readonly to: string;
  /** Optional subject line. */
  readonly subject: string;
  /** Optional message body. */
  readonly body: string;
}

/**
 * mailto: URI. Subject and body are percent-encoded (spaces become %20 via
 * encodeURIComponent, which also escapes `&`, `=`, `#`, etc. so they cannot
 * break the query string). Only provided query parameters are appended.
 */
export function buildMailto(input: MailtoInput): BuildResult {
  const to = input.to.trim();
  if (to.length === 0) {
    return err("mailto.to.empty", "Recipient address is required");
  }

  const params: string[] = [];
  const subject = input.subject.trim();
  if (subject.length > 0) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (input.body.length > 0) {
    params.push(`body=${encodeURIComponent(input.body)}`);
  }

  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return ok(`mailto:${to}${query}`);
}
