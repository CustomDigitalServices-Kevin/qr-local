// Device-only history list. Shows past generations (newest first) with a
// one-line payload preview and the content type, and lets the user reuse an
// entry (restores it into the form) or delete it. Everything is read from and
// written to localStorage by the parent via history.ts — this is presentation.

import type { ReactElement } from "react";
import { useLocale } from "../i18n/locale-context";
import { typeLabelKey } from "../qr/types";
import type { HistoryEntry } from "./history";
import { historyLabel } from "./history";
import { ClockIcon, TrashIcon } from "./icons";

interface HistoryPanelProps {
  entries: readonly HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  entries,
  onRestore,
  onRemove,
  onClear,
}: HistoryPanelProps): ReactElement {
  const { t } = useLocale();

  return (
    <section className="flex flex-col gap-3" data-testid="history-panel">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[13.5px] font-bold text-txt">
          <ClockIcon className="size-4 text-muted" />
          {t("history.title")}
        </h3>
        {entries.length > 0 ? (
          <button
            type="button"
            className="text-[12px] font-semibold text-muted transition-colors hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            onClick={onClear}
          >
            {t("history.clear")}
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="text-[12px] text-faint">{t("history.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-2 rounded-[10px] border border-line bg-panel-2 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] text-txt">{historyLabel(entry)}</p>
                <p className="text-[11px] text-faint">{t(typeLabelKey(entry.type))}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-[8px] border border-line px-2 py-1 text-[11.5px] font-semibold text-muted transition-colors hover:border-orange hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                onClick={() => {
                  onRestore(entry);
                }}
              >
                {t("history.restore")}
              </button>
              <button
                type="button"
                aria-label={t("history.remove")}
                className="shrink-0 rounded-[8px] border border-line p-1.5 text-muted transition-colors hover:border-red hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                onClick={() => {
                  onRemove(entry.id);
                }}
              >
                <TrashIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-faint">{t("history.note")}</p>
    </section>
  );
}
