import type { BuildResult } from "./payload";
import { buildUrl, type UrlInput } from "./url";
import { buildText, type TextInput } from "./text";
import { buildWifi, type WifiInput } from "./wifi";
import { buildVCard, type VCardInput } from "./vcard";
import { buildMeCard, type MeCardInput } from "./mecard";
import { buildMailto, type MailtoInput } from "./mailto";
import { buildSms, type SmsInput } from "./sms";
import { buildTel, type TelInput } from "./tel";
import { buildGeo, type GeoInput } from "./geo";
import { buildSepa, type SepaInput } from "./sepa";

/**
 * Discriminated union of every builder input, tagged by {@link QrType}. The
 * `type` field is the discriminant the UI switches on; the remaining fields are
 * the per-type input shape.
 */
export type PayloadInput =
  | ({ readonly type: "url" } & UrlInput)
  | ({ readonly type: "text" } & TextInput)
  | ({ readonly type: "wifi" } & WifiInput)
  | ({ readonly type: "vcard" } & VCardInput)
  | ({ readonly type: "mecard" } & MeCardInput)
  | ({ readonly type: "mailto" } & MailtoInput)
  | ({ readonly type: "sms" } & SmsInput)
  | ({ readonly type: "tel" } & TelInput)
  | ({ readonly type: "geo" } & GeoInput)
  | ({ readonly type: "sepa" } & SepaInput);

// Coverage is guaranteed from both directions at build time (tsc typechecks
// the test files): the exhaustive `default: never` case below proves every
// PayloadInput variant is handled, and the exhaustive switch over QR_TYPES in
// build-payload.test.ts proves every registered QrType has a PayloadInput
// variant.

/**
 * Route a typed input to its builder and return the exact string to encode
 * (or a validation error). The `switch` is exhaustive over the union.
 */
export function buildPayload(input: PayloadInput): BuildResult {
  switch (input.type) {
    case "url":
      return buildUrl(input);
    case "text":
      return buildText(input);
    case "wifi":
      return buildWifi(input);
    case "vcard":
      return buildVCard(input);
    case "mecard":
      return buildMeCard(input);
    case "mailto":
      return buildMailto(input);
    case "sms":
      return buildSms(input);
    case "tel":
      return buildTel(input);
    case "geo":
      return buildGeo(input);
    case "sepa":
      return buildSepa(input);
    default: {
      // Exhaustiveness guard: a new QrType without a case fails to compile.
      const exhaustive: never = input;
      return exhaustive;
    }
  }
}
