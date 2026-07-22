import type { MessageKey } from "../i18n/messages";

// Canonical list of QR content types the studio can build. The payload
// builders (one per type) land in step 2 under src/lib/. This registry is
// pure structure — the ordered identifiers plus their i18n label key — so the
// UI and the builders share a single source of truth.
export const QR_TYPES = [
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
] as const;

export type QrType = (typeof QR_TYPES)[number];

export function typeLabelKey(type: QrType): MessageKey {
  return `qr.type.${type}`;
}
