// Download controls for the current QR: vector SVG, HD PNG, and PDF. Each
// button renders the payload to a Blob via qr-export.ts and hands it to the
// browser download helper, then notifies the parent so it can record history.
// Buttons are disabled while the form is invalid or an export is in flight;
// failures surface a localized message instead of throwing.

import { useId, useState } from "react";
import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import type { StyleState } from "./style-state";
import {
  exportSvg,
  exportPng,
  exportPdf,
  clampExportSize,
  DEFAULT_PNG_SIZE,
  MIN_PNG_SIZE,
  MAX_PNG_SIZE,
} from "./qr-export";
import { triggerDownload } from "./download";
import { DownloadIcon } from "./icons";

interface ExportBarProps {
  payload: string | null;
  style: StyleState;
  fileBaseName: string;
  onExported: () => void;
}

type Kind = "svg" | "png" | "pdf";

export function ExportBar({ payload, style, fileBaseName, onExported }: ExportBarProps): ReactElement {
  const { t } = useLocale();
  const sizeId = useId();
  const [size, setSize] = useState(DEFAULT_PNG_SIZE);
  const [busy, setBusy] = useState<Kind | null>(null);
  const [failed, setFailed] = useState(false);

  const disabled = payload === null || busy !== null;

  const run = async (kind: Kind): Promise<void> => {
    if (payload === null) return;
    setBusy(kind);
    setFailed(false);
    try {
      const blob =
        kind === "svg"
          ? await exportSvg(payload, style)
          : kind === "png"
            ? await exportPng(payload, style, size)
            : await exportPdf(payload, style, size);
      triggerDownload(blob, `${fileBaseName}.${kind}`);
      onExported();
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  const buttons: readonly { kind: Kind; label: string }[] = [
    { kind: "svg", label: t("export.svg") },
    { kind: "png", label: t("export.png") },
    { kind: "pdf", label: t("export.pdf") },
  ];

  return (
    <section className="flex flex-col gap-3" data-testid="export-bar">
      <h3 className="text-[13.5px] font-bold text-txt">{t("export.title")}</h3>

      <div className="grid grid-cols-3 gap-2">
        {buttons.map(({ kind, label }) => (
          <button
            key={kind}
            type="button"
            data-testid={`export-${kind}`}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-line bg-panel-2 px-3 py-2 text-[13px] font-semibold text-txt transition-colors hover:border-orange hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-txt"
            onClick={() => {
              void run(kind);
            }}
          >
            <DownloadIcon className="size-4" />
            {busy === kind ? t("export.working") : label}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor={sizeId} className="mb-1.5 block text-[12px] text-muted">
          {t("export.size")} — {size}px
        </label>
        <input
          id={sizeId}
          type="range"
          min={MIN_PNG_SIZE}
          max={MAX_PNG_SIZE}
          step={256}
          value={size}
          className="w-full accent-orange"
          onChange={(event) => {
            setSize(clampExportSize(Number(event.target.value)));
          }}
        />
      </div>

      {payload === null ? (
        <p className="text-[11.5px] text-faint">{t("export.pending")}</p>
      ) : null}
      {failed ? (
        <p className="text-[12px] text-red" role="alert">
          {t("export.failed")}
        </p>
      ) : null}
    </section>
  );
}
