// Studio orchestrator: owns the form state, style state, and history, derives
// the payload from src/lib/, and lays out the form, live preview, exports and
// batch. All heavy logic is delegated — payload building to src/lib/, rendering
// to qr-render/qr-export, persistence to history.ts — so this stays wiring.

import { useCallback, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { QrType } from "../qr/types";
import { buildPayload, hasSufficientContrast } from "../lib";
import { errorMessageKey } from "./error-messages";
import {
  initialFormState,
  toPayloadInput,
  restoreSlice,
  type FormState,
} from "./form-state";
import { initialStyleState, type StyleState } from "./style-state";
import { sanitizeFileName } from "./qr-export";
import {
  loadHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearHistory,
  type HistoryEntry,
} from "./history";
import { TypeSelector } from "./TypeSelector";
import { QrForm } from "./QrForm";
import { StyleOptions } from "./StyleOptions";
import { QrPreview } from "./QrPreview";
import { ExportBar } from "./ExportBar";
import { BatchPanel } from "./BatchPanel";
import { HistoryPanel } from "./HistoryPanel";

const PRISTINE = initialFormState();

function contrastOk(style: StyleState): boolean {
  if (!hasSufficientContrast(style.fgColor, style.bgColor)) return false;
  if (style.gradientEnabled && !hasSufficientContrast(style.gradientColor, style.bgColor)) {
    return false;
  }
  return true;
}

export function QrStudio(): ReactElement {
  const { t } = useLocale();
  const [type, setType] = useState<QrType>("url");
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [style, setStyle] = useState<StyleState>(initialStyleState);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const patchSlice = useCallback(
    <K extends keyof FormState>(key: K, patch: Partial<FormState[K]>): void => {
      setFormState((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
    },
    [],
  );

  const patchStyle = useCallback((patch: Partial<StyleState>): void => {
    setStyle((current) => ({ ...current, ...patch }));
  }, []);

  const input = useMemo(() => toPayloadInput(type, formState), [type, formState]);
  const result = useMemo(() => buildPayload(input), [input]);
  const payload = result.ok ? result.payload : null;

  // Only surface a validation error once the user has actually touched the
  // current type's fields; a freshly selected, still-empty form just shows the
  // pending preview.
  const pristine = JSON.stringify(formState[type]) === JSON.stringify(PRISTINE[type]);
  const errorKey = !result.ok && !pristine ? errorMessageKey(result.error.code) : null;

  const showContrastWarning = payload !== null && !contrastOk(style);
  const byteLength = payload === null ? 0 : new TextEncoder().encode(payload).length;
  const fileBaseName = sanitizeFileName(`qr-${type}`);

  const handleExported = useCallback((): void => {
    if (payload === null) return;
    setHistory(addHistoryEntry({ type, input, payload }));
  }, [payload, type, input]);

  const handleRestore = useCallback((entry: HistoryEntry): void => {
    setType(entry.type);
    setFormState((current) => restoreSlice(current, entry.input));
  }, []);

  const handleRemove = useCallback((id: string): void => {
    setHistory(removeHistoryEntry(id));
  }, []);

  const handleClear = useCallback((): void => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(300px,360px)]">
        <div className="relative rounded-[22px] p-[2px] panel-border">
          <div className="panel-inner-glow flex flex-col gap-5 rounded-[20px] p-6">
            <h2 className="text-lg font-bold text-txt">{t("studio.title")}</h2>
            <TypeSelector value={type} onChange={setType} />
            <QrForm type={type} state={formState} onChange={patchSlice} />
            {errorKey !== null ? (
              <p
                className="rounded-xl border border-red/30 bg-red/8 px-4 py-3 text-[12.5px] text-red"
                role="alert"
                data-testid="form-error"
              >
                {t(errorKey)}
              </p>
            ) : null}
            <hr className="border-line" />
            <StyleOptions style={style} onChange={patchStyle} />
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-5">
          <h3 className="text-[13.5px] font-bold text-txt">{t("studio.previewTitle")}</h3>
          <QrPreview payload={payload} style={style} />

          {payload !== null ? (
            <p className="text-center text-[11px] text-faint">
              {byteLength} {t("preview.bytes")}
            </p>
          ) : null}

          {showContrastWarning ? (
            <p
              className="rounded-xl border border-red/30 bg-red/8 px-3.5 py-2.5 text-[12px] text-red"
              role="alert"
              data-testid="contrast-warning"
            >
              {t("preview.contrastWarning")}
            </p>
          ) : null}

          <div
            className="flex items-start gap-3 rounded-xl border border-blue/25 bg-blue/8 p-4"
            role="note"
            data-testid="static-warning"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-blue/40 text-[11px] font-bold text-blue"
            >
              i
            </span>
            <div>
              <p className="text-[13px] font-bold text-txt">{t("studio.static.title")}</p>
              <p className="mt-1 text-[12.5px] text-muted">{t("studio.static.body")}</p>
            </div>
          </div>

          <hr className="border-line" />
          <ExportBar
            payload={payload}
            style={style}
            fileBaseName={fileBaseName}
            onExported={handleExported}
          />
          <hr className="border-line" />
          <HistoryPanel
            entries={history}
            onRestore={handleRestore}
            onRemove={handleRemove}
            onClear={handleClear}
          />
        </aside>
      </div>

      <BatchPanel style={style} />
    </div>
  );
}
