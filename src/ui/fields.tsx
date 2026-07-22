// Presentational, controlled form primitives shared by every per-type form and
// the style panel. Each owns its own generated id (label/control association)
// and applies the CDS dark tokens. They carry no business logic — value in,
// change out — so forms stay declarative.

import { useId } from "react";
import type { ChangeEvent, ReactElement } from "react";

const CONTROL_CLASSES =
  "w-full rounded-[10px] border border-line bg-panel-2 px-3 py-2 text-[13.5px] text-txt placeholder:text-faint transition-colors focus:border-orange focus:outline-2 focus:outline-offset-2 focus:outline-orange";

const LABEL_CLASSES = "mb-1.5 block text-[12.5px] font-semibold text-muted";

interface BaseFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  type = "text",
  inputMode,
  maxLength,
}: BaseFieldProps & {
  type?: "text" | "email" | "tel" | "url" | "number";
  inputMode?: "text" | "email" | "tel" | "url" | "numeric" | "decimal";
  maxLength?: number;
}): ReactElement {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        className={CONTROL_CLASSES}
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
      />
      {hint ? <p className="mt-1 text-[11.5px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  rows = 3,
  maxLength,
}: BaseFieldProps & { rows?: number; maxLength?: number }): ReactElement {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required ? <span className="ml-1 text-orange">*</span> : null}
      </label>
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        className={`${CONTROL_CLASSES} resize-y`}
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value);
        }}
      />
      {hint ? <p className="mt-1 text-[11.5px] text-faint">{hint}</p> : null}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  hint?: string;
}): ReactElement {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <select
        id={id}
        className={`${CONTROL_CLASSES} cursor-pointer`}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          onChange(event.target.value);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-panel-2 text-txt">
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-[11.5px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}): ReactElement {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        <input
          id={id}
          type="color"
          className="size-9 shrink-0 cursor-pointer rounded-[8px] border border-line bg-panel-2 p-0.5"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
        />
        <input
          type="text"
          aria-label={label}
          className={`${CONTROL_CLASSES} font-mono text-[12.5px] uppercase`}
          value={value}
          maxLength={7}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}): ReactElement {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-txt">
      <input
        id={id}
        type="checkbox"
        className="size-4 accent-orange"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.checked);
        }}
      />
      {label}
    </label>
  );
}
