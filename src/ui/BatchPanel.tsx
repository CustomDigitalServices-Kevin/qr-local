// Batch generation panel: paste (or import a .csv/.txt of) one value per line,
// pick URL vs text and the output format, and download a ZIP of QR files. The
// heavy lifting (parsing, rendering, zipping) is in batch.ts; this component is
// input collection, a live count, and progress/error feedback.

import { useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { StyleState } from "./style-state";
import { parseBatchInput, buildBatchZip, type BatchValueType } from "./batch";
import { DEFAULT_PNG_SIZE, type QrFormat } from "./qr-export";
import { triggerDownload } from "./download";
import { LayersIcon } from "./icons";

interface BatchPanelProps {
  style: StyleState;
}

export function BatchPanel({ style }: BatchPanelProps): ReactElement {
  const { t } = useLocale();
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState("");
  const [valueType, setValueType] = useState<BatchValueType>("url");
  const [format, setFormat] = useState<QrFormat>("png");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doneCount, setDoneCount] = useState<number | null>(null);

  const rows = useMemo(() => parseBatchInput(raw), [raw]);

  const handleImport = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setRaw(reader.result);
        setDoneCount(null);
      }
    };
    reader.readAsText(file);
  };

  const generate = async (): Promise<void> => {
    if (rows.length === 0) return;
    setBusy(true);
    setFailed(false);
    setDoneCount(null);
    try {
      const { blob, count } = await buildBatchZip(rows, valueType, style, format, DEFAULT_PNG_SIZE);
      triggerDownload(blob, "qr-batch.zip");
      setDoneCount(count);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="rounded-2xl border border-line bg-panel p-5"
      data-testid="batch-panel"
      aria-labelledby={`${inputId}-title`}
    >
      <h3
        id={`${inputId}-title`}
        className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-txt"
      >
        <span className="grid size-6.5 shrink-0 place-items-center rounded-lg bg-orange-soft text-orange">
          <LayersIcon className="size-3.5" />
        </span>
        {t("batch.title")}
      </h3>
      <p className="mb-4 text-[12.8px] text-muted">{t("batch.intro")}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-[12.5px] font-semibold text-muted">
            {t("batch.input")}
          </label>
          <textarea
            id={inputId}
            rows={7}
            className="w-full resize-y rounded-[10px] border border-line bg-panel-2 px-3 py-2 font-mono text-[12.5px] text-txt placeholder:text-faint focus:border-orange focus:outline-2 focus:outline-offset-2 focus:outline-orange"
            value={raw}
            placeholder={t("batch.input.ph")}
            onChange={(event) => {
              setRaw(event.target.value);
              setDoneCount(null);
            }}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[11.5px] text-faint">
              {rows.length} {t("batch.detected")}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              className="sr-only"
              aria-label={t("batch.import")}
              onChange={handleImport}
            />
            <button
              type="button"
              className="rounded-[10px] border border-line bg-panel-2 px-3 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:border-orange hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              onClick={() => {
                fileRef.current?.click();
              }}
            >
              {t("batch.import")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
              {t("batch.valueType")}
            </span>
            <div className="flex gap-2">
              {(["url", "text"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={valueType === option}
                  className={`flex-1 rounded-[10px] border px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                    valueType === option
                      ? "border-orange bg-orange-soft text-orange"
                      : "border-line bg-panel-2 text-muted hover:text-txt"
                  }`}
                  onClick={() => {
                    setValueType(option);
                  }}
                >
                  {t(option === "url" ? "batch.valueType.url" : "batch.valueType.text")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
              {t("batch.format")}
            </span>
            <div className="flex gap-2">
              {(["png", "svg"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={format === option}
                  className={`flex-1 rounded-[10px] border px-3 py-1.5 text-[13px] font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                    format === option
                      ? "border-orange bg-orange-soft text-orange"
                      : "border-line bg-panel-2 text-muted hover:text-txt"
                  }`}
                  onClick={() => {
                    setFormat(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            data-testid="batch-generate"
            disabled={rows.length === 0 || busy}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-br from-orange to-orange-mid px-4 py-2.5 text-[13.5px] font-bold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              void generate();
            }}
          >
            <LayersIcon className="size-4" />
            {busy ? t("batch.working") : t("batch.generate")}
          </button>

          {rows.length === 0 ? <p className="text-[11.5px] text-faint">{t("batch.empty")}</p> : null}
          {failed ? (
            <p className="text-[12px] text-red" role="alert">
              {t("batch.failed")}
            </p>
          ) : null}
          {doneCount !== null ? (
            <p className="text-[12px] text-green" role="status">
              {t("batch.done")} ({doneCount})
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
