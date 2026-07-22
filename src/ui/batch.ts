// Batch generation: turn a pasted list / CSV of values into a ZIP of QR files.
// Each input line is treated as one whole value (never split on commas, so URLs
// and text containing commas are preserved intact) encoded either as a URL or
// as plain text. Parsing is pure and tested; the ZIP step renders each value
// and packs it with JSZip.

import JSZip from "jszip";
import { buildUrl, buildText } from "../lib";
import type { StyleState } from "./style-state";
import { renderQrBlob, sanitizeFileName, clampExportSize, type QrFormat } from "./qr-export";

/** One value to encode, with the base file name it will get in the archive. */
export interface BatchRow {
  readonly value: string;
  readonly name: string;
}

/** The two ways a batch line can be interpreted. */
export type BatchValueType = "url" | "text";

/**
 * Split raw pasted / CSV text into rows: one non-empty trimmed line per row.
 * Blank lines are dropped. Names are sequential and zero-padded to the width of
 * the largest index so archives sort naturally (qr-01, qr-02, …).
 */
export function parseBatchInput(raw: string): BatchRow[] {
  const values = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const width = String(values.length).length;
  return values.map((value, index) => ({
    value,
    name: `qr-${String(index + 1).padStart(width, "0")}`,
  }));
}

/** Ensure every archive entry name is unique by suffixing collisions. */
function uniqueName(base: string, used: Set<string>): string {
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${String(suffix)}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

/**
 * Render every row to `format` and pack them into a ZIP Blob. A row whose value
 * fails validation (e.g. empty after the URL/text builder) is skipped; the
 * returned count reports how many were actually written. Throws only if the ZIP
 * itself cannot be produced.
 */
export async function buildBatchZip(
  rows: readonly BatchRow[],
  valueType: BatchValueType,
  style: StyleState,
  format: QrFormat,
  size: number,
): Promise<{ blob: Blob; count: number }> {
  const zip = new JSZip();
  const used = new Set<string>();
  const pngSize = clampExportSize(size);
  let count = 0;

  for (const row of rows) {
    const built = valueType === "url" ? buildUrl({ url: row.value }) : buildText({ text: row.value });
    if (!built.ok) continue;
    const blob = await renderQrBlob(built.payload, style, format, pngSize);
    const entryName = uniqueName(sanitizeFileName(row.name), used);
    zip.file(`${entryName}.${format}`, blob);
    count += 1;
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, count };
}
