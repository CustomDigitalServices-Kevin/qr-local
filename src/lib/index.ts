// Public surface of the QR business-logic layer. Everything here is pure and
// UI-agnostic: payload builders (one per content type), the tagged dispatcher,
// and the QR quality-option derivations.

export {
  type BuildError,
  type BuildErrorCode,
  type BuildResult,
  ok,
  err,
  utf8ByteLength,
} from "./payload";

export { escapeWifi, escapeMeCard, escapeVCard } from "./escape";

export { buildUrl, type UrlInput } from "./url";
export { buildText, type TextInput } from "./text";
export { buildWifi, type WifiInput, type WifiAuth } from "./wifi";
export { buildVCard, type VCardInput } from "./vcard";
export { buildMeCard, type MeCardInput } from "./mecard";
export { buildMailto, type MailtoInput } from "./mailto";
export { buildSms, type SmsInput } from "./sms";
export { buildTel, type TelInput } from "./tel";
export { buildGeo, type GeoInput } from "./geo";
export { buildSepa, type SepaInput } from "./sepa";

export { buildPayload, type PayloadInput } from "./build-payload";

export {
  type EccLevel,
  QUIET_ZONE_MODULES,
  MAX_LOGO_SIZE,
  MIN_CONTRAST_RATIO,
  resolveErrorCorrection,
  clampLogoSize,
  contrastRatio,
  hasSufficientContrast,
} from "./qr-options";
