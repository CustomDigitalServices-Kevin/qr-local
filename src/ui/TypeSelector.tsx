// Content-type picker: a tablist of every QrType. Purely presentational — the
// selected type and its setter are owned by the studio.

import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import { QR_TYPES, typeLabelKey } from "../qr/types";
import type { QrType } from "../qr/types";

interface TypeSelectorProps {
  value: QrType;
  onChange: (type: QrType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps): ReactElement {
  const { t } = useLocale();
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-1 text-[13px] font-semibold text-muted">{t("studio.typeLabel")}</legend>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("studio.typeLabel")}>
        {QR_TYPES.map((qrType) => {
          const selected = qrType === value;
          return (
            <button
              key={qrType}
              type="button"
              role="tab"
              aria-selected={selected}
              data-testid={`type-${qrType}`}
              className={`rounded-[10px] border px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                selected
                  ? "border-orange bg-orange-soft text-orange"
                  : "border-line bg-panel-2 text-muted hover:border-line-strong hover:text-txt"
              }`}
              onClick={() => {
                onChange(qrType);
              }}
            >
              {t(typeLabelKey(qrType))}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
