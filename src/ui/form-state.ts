// Flat, per-type form state for the studio. Each slice mirrors exactly one
// builder input shape from src/lib/, so mapping a slice to its PayloadInput is
// a pure spread. Keeping every slice resident (rather than a discriminated
// union) lets the user switch types back and forth without losing what they
// already typed.

import type {
  PayloadInput,
  UrlInput,
  TextInput,
  WifiInput,
  VCardInput,
  MeCardInput,
  MailtoInput,
  SmsInput,
  TelInput,
  GeoInput,
  SepaInput,
} from "../lib";
import type { QrType } from "../qr/types";

export interface FormState {
  readonly url: UrlInput;
  readonly text: TextInput;
  readonly wifi: WifiInput;
  readonly vcard: VCardInput;
  readonly mecard: MeCardInput;
  readonly mailto: MailtoInput;
  readonly sms: SmsInput;
  readonly tel: TelInput;
  readonly geo: GeoInput;
  readonly sepa: SepaInput;
}

/** Empty-but-valid defaults for every slice. */
export function initialFormState(): FormState {
  return {
    url: { url: "" },
    text: { text: "" },
    wifi: { ssid: "", password: "", auth: "WPA", hidden: false },
    vcard: { firstName: "", lastName: "", org: "", title: "", phone: "", email: "", url: "" },
    mecard: { firstName: "", lastName: "", phone: "", email: "", url: "" },
    mailto: { to: "", subject: "", body: "" },
    sms: { phone: "", message: "" },
    tel: { phone: "" },
    geo: { latitude: "", longitude: "" },
    sepa: {
      name: "",
      iban: "",
      bic: "",
      amount: "",
      purpose: "",
      reference: "",
      remittance: "",
      info: "",
    },
  };
}

/**
 * Rebuild the form state with the slice for `input.type` replaced by the values
 * carried in `input`. Used to restore a history entry back into the live form.
 * Fields are reconstructed explicitly per type so the result is provably the
 * right slice shape (no discriminant leakage, no unused-variable churn).
 */
export function restoreSlice(state: FormState, input: PayloadInput): FormState {
  switch (input.type) {
    case "url":
      return { ...state, url: { url: input.url } };
    case "text":
      return { ...state, text: { text: input.text } };
    case "wifi":
      return {
        ...state,
        wifi: { ssid: input.ssid, password: input.password, auth: input.auth, hidden: input.hidden },
      };
    case "vcard":
      return {
        ...state,
        vcard: {
          firstName: input.firstName,
          lastName: input.lastName,
          org: input.org,
          title: input.title,
          phone: input.phone,
          email: input.email,
          url: input.url,
        },
      };
    case "mecard":
      return {
        ...state,
        mecard: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          email: input.email,
          url: input.url,
        },
      };
    case "mailto":
      return {
        ...state,
        mailto: { to: input.to, subject: input.subject, body: input.body },
      };
    case "sms":
      return { ...state, sms: { phone: input.phone, message: input.message } };
    case "tel":
      return { ...state, tel: { phone: input.phone } };
    case "geo":
      return { ...state, geo: { latitude: input.latitude, longitude: input.longitude } };
    case "sepa":
      return {
        ...state,
        sepa: {
          name: input.name,
          iban: input.iban,
          bic: input.bic,
          amount: input.amount,
          purpose: input.purpose,
          reference: input.reference,
          remittance: input.remittance,
          info: input.info,
        },
      };
    default: {
      const exhaustive: never = input;
      return exhaustive;
    }
  }
}

/**
 * Combine the discriminant with the matching slice to produce the tagged input
 * the `buildPayload` dispatcher expects. The mapping is total over QrType.
 */
export function toPayloadInput(type: QrType, state: FormState): PayloadInput {
  switch (type) {
    case "url":
      return { type, ...state.url };
    case "text":
      return { type, ...state.text };
    case "wifi":
      return { type, ...state.wifi };
    case "vcard":
      return { type, ...state.vcard };
    case "mecard":
      return { type, ...state.mecard };
    case "mailto":
      return { type, ...state.mailto };
    case "sms":
      return { type, ...state.sms };
    case "tel":
      return { type, ...state.tel };
    case "geo":
      return { type, ...state.geo };
    case "sepa":
      return { type, ...state.sepa };
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}
