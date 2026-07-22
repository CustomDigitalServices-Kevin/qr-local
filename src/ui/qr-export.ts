// Rendering the QR to downloadable artefacts. Each export builds a fresh
// qr-code-styling instance from the shared option object (never mutating the
// live preview instance) at the requested draw type / size, then hands back a
// Blob. PDF wraps the raster in a single-page document via @cantoo/pdf-lib.

import QRCodeStyling from "qr-code-styling";
import type { StyleState } from "./style-state";
import { buildQrOptions } from "./qr-render";

/** Default raster export edge, in pixels (HD). */
export const DEFAULT_PNG_SIZE = 1024;
/** Lower bound accepted by {@link clampExportSize}. */
export const MIN_PNG_SIZE = 512;
/** Upper bound accepted by {@link clampExportSize}. */
export const MAX_PNG_SIZE = 2048;

/** Clamp a requested raster size into the supported HD range. */
export function clampExportSize(size: number): number {
  if (!Number.isFinite(size)) return DEFAULT_PNG_SIZE;
  return Math.min(MAX_PNG_SIZE, Math.max(MIN_PNG_SIZE, Math.round(size)));
}

/**
 * Turn an arbitrary label into a safe, non-empty file base name: lowercased,
 * accents stripped, runs of non-alphanumerics collapsed to a single hyphen,
 * trimmed, capped at 60 chars, falling back to "qr-code" when nothing usable
 * remains.
 */
export function sanitizeFileName(label: string): string {
  const normalized = label
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return normalized.length > 0 ? normalized : "qr-code";
}

/** Vector (SVG) or raster (PNG) output formats a QR can be rendered to. */
export type QrFormat = "svg" | "png";

/**
 * Render a payload to a single Blob in the requested format. SVG uses the
 * vector draw type at a nominal 512px viewport (scales losslessly); PNG uses
 * the canvas draw type at the clamped HD size. Shared by the single-file
 * exports and the batch ZIP builder.
 */
export async function renderQrBlob(
  payload: string,
  style: StyleState,
  format: QrFormat,
  size: number,
): Promise<Blob> {
  const drawType = format === "svg" ? "svg" : "canvas";
  const qr = new QRCodeStyling(buildQrOptions(payload, style, size, drawType));
  const raw = await qr.getRawData(format);
  if (raw === null) {
    throw new Error("QR rendering produced no data");
  }
  if (!(raw instanceof Blob)) {
    // Node Buffer path — never taken in the browser runtime of this app.
    throw new Error("Unexpected non-Blob QR output");
  }
  return raw;
}

/** Vector (SVG) export at a nominal 512px viewport; scales losslessly. */
export function exportSvg(payload: string, style: StyleState): Promise<Blob> {
  return renderQrBlob(payload, style, "svg", 512);
}

/** Raster (PNG) export at the given HD size. */
export function exportPng(payload: string, style: StyleState, size: number): Promise<Blob> {
  return renderQrBlob(payload, style, "png", clampExportSize(size));
}

/**
 * PDF export: render the QR to a high-resolution PNG, then embed it 1:1 on a
 * single square page whose point size equals the raster pixel size. Uses
 * @cantoo/pdf-lib (a maintained pdf-lib fork), never the abandoned pdf-lib.
 */
export async function exportPdf(payload: string, style: StyleState, size: number): Promise<Blob> {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const pngBlob = await exportPng(payload, style, size);
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  const doc = await PDFDocument.create();
  const image = await doc.embedPng(pngBytes);
  const page = doc.addPage([image.width, image.height]);
  page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

  const bytes = await doc.save();
  // Copy into a fresh ArrayBuffer-backed view so the Blob part is unambiguous.
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
