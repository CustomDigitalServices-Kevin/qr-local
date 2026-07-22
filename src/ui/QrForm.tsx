// Per-type input dispatcher. The selected QrType picks which fields render;
// each field edits exactly one slice of FormState through the typed `onChange`
// patcher. No payload building here — that stays in src/lib/, invoked by the
// studio from this state. The larger contact and SEPA forms live in their own
// files to keep this dispatcher small. Every user-facing string is localized.

import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { QrType } from "../qr/types";
import type { FormState } from "./form-state";
import type { WifiAuth } from "../lib";
import { TextField, TextAreaField, SelectField, CheckboxField } from "./fields";
import { VCardForm, MeCardForm } from "./ContactForm";
import { SepaForm } from "./SepaForm";

interface QrFormProps {
  type: QrType;
  state: FormState;
  onChange: <K extends keyof FormState>(key: K, patch: Partial<FormState[K]>) => void;
}

function toWifiAuth(value: string): WifiAuth {
  return value === "WEP" || value === "nopass" ? value : "WPA";
}

export function QrForm({ type, state, onChange }: QrFormProps): ReactElement {
  const { t } = useLocale();

  let content: ReactElement;
  switch (type) {
    case "url":
      content = (
        <TextField
          label={t("form.url.url")}
          type="url"
          inputMode="url"
          required
          value={state.url.url}
          placeholder={t("form.url.url.ph")}
          onChange={(v) => {
            onChange("url", { url: v });
          }}
        />
      );
      break;

    case "text":
      content = (
        <TextAreaField
          label={t("form.text.text")}
          required
          rows={4}
          value={state.text.text}
          placeholder={t("form.text.text.ph")}
          onChange={(v) => {
            onChange("text", { text: v });
          }}
        />
      );
      break;

    case "wifi":
      content = (
        <>
          <TextField
            label={t("form.wifi.ssid")}
            required
            value={state.wifi.ssid}
            onChange={(v) => {
              onChange("wifi", { ssid: v });
            }}
          />
          <SelectField
            label={t("form.wifi.auth")}
            value={state.wifi.auth}
            options={[
              { value: "WPA", label: t("form.wifi.auth.wpa") },
              { value: "WEP", label: t("form.wifi.auth.wep") },
              { value: "nopass", label: t("form.wifi.auth.nopass") },
            ]}
            onChange={(v) => {
              onChange("wifi", { auth: toWifiAuth(v) });
            }}
          />
          {state.wifi.auth !== "nopass" ? (
            <TextField
              label={t("form.wifi.password")}
              required
              value={state.wifi.password}
              onChange={(v) => {
                onChange("wifi", { password: v });
              }}
            />
          ) : null}
          <CheckboxField
            label={t("form.wifi.hidden")}
            checked={state.wifi.hidden}
            onChange={(checked) => {
              onChange("wifi", { hidden: checked });
            }}
          />
        </>
      );
      break;

    case "vcard":
      content = (
        <VCardForm
          value={state.vcard}
          onChange={(patch) => {
            onChange("vcard", patch);
          }}
        />
      );
      break;

    case "mecard":
      content = (
        <MeCardForm
          value={state.mecard}
          onChange={(patch) => {
            onChange("mecard", patch);
          }}
        />
      );
      break;

    case "mailto":
      content = (
        <>
          <TextField
            label={t("form.mailto.to")}
            type="email"
            inputMode="email"
            required
            value={state.mailto.to}
            placeholder={t("form.mailto.to.ph")}
            onChange={(v) => {
              onChange("mailto", { to: v });
            }}
          />
          <TextField
            label={t("form.mailto.subject")}
            value={state.mailto.subject}
            onChange={(v) => {
              onChange("mailto", { subject: v });
            }}
          />
          <TextAreaField
            label={t("form.mailto.body")}
            rows={3}
            value={state.mailto.body}
            onChange={(v) => {
              onChange("mailto", { body: v });
            }}
          />
        </>
      );
      break;

    case "sms":
      content = (
        <>
          <TextField
            label={t("form.sms.phone")}
            type="tel"
            inputMode="tel"
            required
            value={state.sms.phone}
            onChange={(v) => {
              onChange("sms", { phone: v });
            }}
          />
          <TextAreaField
            label={t("form.sms.message")}
            rows={3}
            value={state.sms.message}
            onChange={(v) => {
              onChange("sms", { message: v });
            }}
          />
        </>
      );
      break;

    case "tel":
      content = (
        <TextField
          label={t("form.tel.phone")}
          type="tel"
          inputMode="tel"
          required
          value={state.tel.phone}
          placeholder={t("form.tel.phone.ph")}
          onChange={(v) => {
            onChange("tel", { phone: v });
          }}
        />
      );
      break;

    case "geo":
      content = (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("form.geo.lat")}
            inputMode="decimal"
            required
            value={state.geo.latitude}
            placeholder={t("form.geo.lat.ph")}
            onChange={(v) => {
              onChange("geo", { latitude: v });
            }}
          />
          <TextField
            label={t("form.geo.lon")}
            inputMode="decimal"
            required
            value={state.geo.longitude}
            placeholder={t("form.geo.lon.ph")}
            hint={t("form.geo.hint")}
            onChange={(v) => {
              onChange("geo", { longitude: v });
            }}
          />
        </div>
      );
      break;

    case "sepa":
      content = (
        <SepaForm
          value={state.sepa}
          onChange={(patch) => {
            onChange("sepa", patch);
          }}
        />
      );
      break;

    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }

  return (
    <div className="flex flex-col gap-4" data-testid="qr-form">
      {content}
    </div>
  );
}
