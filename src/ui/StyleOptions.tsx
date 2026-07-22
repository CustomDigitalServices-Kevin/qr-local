// Appearance controls: colours, module & corner shapes, foreground gradient,
// error-correction level, and a locally-read center logo. Edits a StyleState
// through a single patch callback; the pure mapping to qr-code-styling options
// lives in qr-render.ts. When a logo is set the ECC selector is disabled and
// pinned to H, mirroring the rule enforced in resolveErrorCorrection.

import { useId, useRef } from "react";
import type { ChangeEvent, ReactElement } from "react";
import type { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import type { EccLevel } from "../lib";
import { clampLogoSize } from "../lib";
import { useLocale } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";
import type { StyleState } from "./style-state";
import { ColorField, SelectField, CheckboxField } from "./fields";
import { ImageIcon, TrashIcon } from "./icons";

const DOT_OPTIONS: readonly { value: DotType; labelKey: MessageKey }[] = [
  { value: "square", labelKey: "style.dot.square" },
  { value: "rounded", labelKey: "style.dot.rounded" },
  { value: "dots", labelKey: "style.dot.dots" },
  { value: "classy", labelKey: "style.dot.classy" },
  { value: "classy-rounded", labelKey: "style.dot.classy-rounded" },
  { value: "extra-rounded", labelKey: "style.dot.extra-rounded" },
];

const CORNER_SQUARE_OPTIONS: readonly { value: CornerSquareType; labelKey: MessageKey }[] = [
  { value: "square", labelKey: "style.corner.square" },
  { value: "dot", labelKey: "style.corner.dot" },
  { value: "extra-rounded", labelKey: "style.corner.extra-rounded" },
];

const CORNER_DOT_OPTIONS: readonly { value: CornerDotType; labelKey: MessageKey }[] = [
  { value: "square", labelKey: "style.corner.square" },
  { value: "dot", labelKey: "style.corner.dot" },
];

const ECC_OPTIONS: readonly { value: EccLevel; labelKey: MessageKey }[] = [
  { value: "L", labelKey: "style.ecc.L" },
  { value: "M", labelKey: "style.ecc.M" },
  { value: "Q", labelKey: "style.ecc.Q" },
  { value: "H", labelKey: "style.ecc.H" },
];

function isDotType(value: string): value is DotType {
  return DOT_OPTIONS.some((option) => option.value === value);
}
function isCornerSquareType(value: string): value is CornerSquareType {
  return CORNER_SQUARE_OPTIONS.some((option) => option.value === value);
}
function isCornerDotType(value: string): value is CornerDotType {
  return CORNER_DOT_OPTIONS.some((option) => option.value === value);
}
function isEccLevel(value: string): value is EccLevel {
  return ECC_OPTIONS.some((option) => option.value === value);
}

interface StyleOptionsProps {
  style: StyleState;
  onChange: (patch: Partial<StyleState>) => void;
}

export function StyleOptions({ style, onChange }: StyleOptionsProps): ReactElement {
  const { t } = useLocale();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoSizeId = useId();
  const hasLogo = style.logoDataUrl !== null;

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        // A logo occludes modules, so pin ECC to H at the same time.
        onChange({ logoDataUrl: result, ecc: "H" });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="flex flex-col gap-4" data-testid="style-options">
      <h3 className="text-[13.5px] font-bold text-txt">{t("style.title")}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          label={t("style.fgColor")}
          value={style.fgColor}
          onChange={(v) => {
            onChange({ fgColor: v });
          }}
        />
        <ColorField
          label={t("style.bgColor")}
          value={style.bgColor}
          onChange={(v) => {
            onChange({ bgColor: v });
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label={t("style.dotType")}
          value={style.dotType}
          options={DOT_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          onChange={(v) => {
            if (isDotType(v)) onChange({ dotType: v });
          }}
        />
        <SelectField
          label={t("style.ecc")}
          value={style.ecc}
          hint={t("style.ecc.hint")}
          options={ECC_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          onChange={(v) => {
            if (!hasLogo && isEccLevel(v)) onChange({ ecc: v });
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label={t("style.cornersSquare")}
          value={style.cornersSquareType}
          options={CORNER_SQUARE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          onChange={(v) => {
            if (isCornerSquareType(v)) onChange({ cornersSquareType: v });
          }}
        />
        <SelectField
          label={t("style.cornersDot")}
          value={style.cornersDotType}
          options={CORNER_DOT_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
          onChange={(v) => {
            if (isCornerDotType(v)) onChange({ cornersDotType: v });
          }}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-panel-2 p-4">
        <CheckboxField
          label={t("style.gradient")}
          checked={style.gradientEnabled}
          onChange={(checked) => {
            onChange({ gradientEnabled: checked });
          }}
        />
        {style.gradientEnabled ? (
          <ColorField
            label={t("style.gradientColor")}
            value={style.gradientColor}
            onChange={(v) => {
              onChange({ gradientColor: v });
            }}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-panel-2 p-4">
        <span className="text-[12.5px] font-semibold text-muted">{t("style.logo")}</span>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="sr-only"
          aria-label={t("style.logo.add")}
          onChange={handleLogoChange}
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-panel px-3 py-1.5 text-[13px] font-semibold text-txt transition-colors hover:border-orange hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            onClick={() => {
              logoInputRef.current?.click();
            }}
          >
            <ImageIcon className="size-4" />
            {t("style.logo.add")}
          </button>
          {hasLogo ? (
            <button
              type="button"
              data-testid="logo-remove"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-panel px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:border-red hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              onClick={() => {
                onChange({ logoDataUrl: null });
              }}
            >
              <TrashIcon className="size-4" />
              {t("style.logo.remove")}
            </button>
          ) : null}
        </div>
        {hasLogo ? (
          <div>
            <label htmlFor={logoSizeId} className="mb-1.5 block text-[12px] text-muted">
              {t("style.logoSize")} — {Math.round(clampLogoSize(style.logoSize) * 100)}%
            </label>
            <input
              id={logoSizeId}
              type="range"
              min={0.1}
              max={0.3}
              step={0.05}
              value={style.logoSize}
              className="w-full accent-orange"
              onChange={(event) => {
                onChange({ logoSize: Number(event.target.value) });
              }}
            />
          </div>
        ) : null}
        <p className="text-[11.5px] text-faint">{t("style.logo.hint")}</p>
      </div>
    </section>
  );
}
