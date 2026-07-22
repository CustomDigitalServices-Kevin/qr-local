// The two contact forms (vCard and MeCard). Kept out of QrForm to keep that
// dispatcher small. Each takes its own slice value plus a scoped patch callback,
// so the switch in QrForm stays a one-liner per case.

import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { VCardInput, MeCardInput } from "../lib";
import { TextField } from "./fields";

export function VCardForm({
  value,
  onChange,
}: {
  value: VCardInput;
  onChange: (patch: Partial<VCardInput>) => void;
}): ReactElement {
  const { t } = useLocale();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("form.contact.firstName")}
          value={value.firstName}
          onChange={(v) => {
            onChange({ firstName: v });
          }}
        />
        <TextField
          label={t("form.contact.lastName")}
          value={value.lastName}
          onChange={(v) => {
            onChange({ lastName: v });
          }}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("form.contact.org")}
          value={value.org}
          onChange={(v) => {
            onChange({ org: v });
          }}
        />
        <TextField
          label={t("form.contact.title")}
          value={value.title}
          onChange={(v) => {
            onChange({ title: v });
          }}
        />
      </div>
      <TextField
        label={t("form.contact.phone")}
        type="tel"
        inputMode="tel"
        value={value.phone}
        onChange={(v) => {
          onChange({ phone: v });
        }}
      />
      <TextField
        label={t("form.contact.email")}
        type="email"
        inputMode="email"
        value={value.email}
        onChange={(v) => {
          onChange({ email: v });
        }}
      />
      <TextField
        label={t("form.contact.url")}
        type="url"
        inputMode="url"
        value={value.url}
        hint={t("form.contact.nameHint")}
        onChange={(v) => {
          onChange({ url: v });
        }}
      />
    </>
  );
}

export function MeCardForm({
  value,
  onChange,
}: {
  value: MeCardInput;
  onChange: (patch: Partial<MeCardInput>) => void;
}): ReactElement {
  const { t } = useLocale();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("form.contact.firstName")}
          value={value.firstName}
          onChange={(v) => {
            onChange({ firstName: v });
          }}
        />
        <TextField
          label={t("form.contact.lastName")}
          value={value.lastName}
          onChange={(v) => {
            onChange({ lastName: v });
          }}
        />
      </div>
      <TextField
        label={t("form.contact.phone")}
        type="tel"
        inputMode="tel"
        value={value.phone}
        onChange={(v) => {
          onChange({ phone: v });
        }}
      />
      <TextField
        label={t("form.contact.email")}
        type="email"
        inputMode="email"
        value={value.email}
        onChange={(v) => {
          onChange({ email: v });
        }}
      />
      <TextField
        label={t("form.contact.url")}
        type="url"
        inputMode="url"
        value={value.url}
        hint={t("form.contact.nameHint")}
        onChange={(v) => {
          onChange({ url: v });
        }}
      />
    </>
  );
}
