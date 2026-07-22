import { escapeVCard } from "./escape";
import { err, ok, type BuildResult } from "./payload";

export interface VCardInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly org: string;
  readonly title: string;
  readonly phone: string;
  readonly email: string;
  readonly url: string;
}

// vCard 3.0 (RFC 2426) mandates CRLF as the line delimiter.
const CRLF = "\r\n";

/**
 * vCard 3.0 payload. `N` (structured name) and `FN` (formatted name) are the
 * only mandatory properties; at least one of first/last name must be given.
 * `FN` is derived as "<first> <last>". Optional properties (ORG, TITLE, TEL,
 * EMAIL, URL) are emitted only when present. Every user value is escaped per
 * RFC 2426. Lines are joined with CRLF.
 */
export function buildVCard(input: VCardInput): BuildResult {
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  if (first.length === 0 && last.length === 0) {
    return err("vcard.name.empty", "A first or last name is required");
  }

  const formatted = [first, last].filter((p) => p.length > 0).join(" ");

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(last)};${escapeVCard(first)}`,
    `FN:${escapeVCard(formatted)}`,
  ];

  const org = input.org.trim();
  if (org.length > 0) lines.push(`ORG:${escapeVCard(org)}`);

  const title = input.title.trim();
  if (title.length > 0) lines.push(`TITLE:${escapeVCard(title)}`);

  const phone = input.phone.trim();
  if (phone.length > 0) lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCard(phone)}`);

  const email = input.email.trim();
  if (email.length > 0) lines.push(`EMAIL:${escapeVCard(email)}`);

  const url = input.url.trim();
  if (url.length > 0) lines.push(`URL:${escapeVCard(url)}`);

  lines.push("END:VCARD");

  return ok(lines.join(CRLF));
}
