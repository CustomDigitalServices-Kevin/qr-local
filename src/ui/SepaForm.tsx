// SEPA (EPC069-12) credit-transfer form. Split out of QrForm because it carries
// the most fields (name + IBAN mandatory, six optional) and the structured
// reference / free-text remittance mutual-exclusivity hint. Validation itself
// lives in src/lib/sepa.ts; this only collects the raw strings.

import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { SepaInput } from "../lib";
import { TextField } from "./fields";

export function SepaForm({
  value,
  onChange,
}: {
  value: SepaInput;
  onChange: (patch: Partial<SepaInput>) => void;
}): ReactElement {
  const { t } = useLocale();
  const optional = t("form.optional");
  return (
    <>
      <TextField
        label={t("form.sepa.name")}
        required
        maxLength={70}
        value={value.name}
        onChange={(v) => {
          onChange({ name: v });
        }}
      />
      <TextField
        label={t("form.sepa.iban")}
        required
        value={value.iban}
        placeholder="FR76 3000 6000 0112 3456 7890 189"
        onChange={(v) => {
          onChange({ iban: v });
        }}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={`${t("form.sepa.bic")} ${optional}`}
          maxLength={11}
          value={value.bic}
          onChange={(v) => {
            onChange({ bic: v });
          }}
        />
        <TextField
          label={`${t("form.sepa.amount")} ${optional}`}
          inputMode="decimal"
          value={value.amount}
          placeholder={t("form.sepa.amount.ph")}
          hint={t("form.sepa.amount.hint")}
          onChange={(v) => {
            onChange({ amount: v });
          }}
        />
      </div>
      <TextField
        label={`${t("form.sepa.purpose")} ${optional}`}
        maxLength={4}
        value={value.purpose}
        onChange={(v) => {
          onChange({ purpose: v });
        }}
      />
      <TextField
        label={`${t("form.sepa.reference")} ${optional}`}
        maxLength={25}
        value={value.reference}
        onChange={(v) => {
          onChange({ reference: v });
        }}
      />
      <TextField
        label={`${t("form.sepa.remittance")} ${optional}`}
        maxLength={140}
        value={value.remittance}
        hint={t("form.sepa.exclusiveHint")}
        onChange={(v) => {
          onChange({ remittance: v });
        }}
      />
      <TextField
        label={`${t("form.sepa.info")} ${optional}`}
        maxLength={70}
        value={value.info}
        onChange={(v) => {
          onChange({ info: v });
        }}
      />
    </>
  );
}
