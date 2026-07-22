// Live QR preview. Owns a single qr-code-styling instance (SVG draw type for a
// crisp, scalable render) that is created lazily and updated in place as the
// payload or style changes. All library calls are guarded: if rendering throws
// (e.g. in a non-DOM test environment) the component degrades to a localized
// error message instead of crashing the tree. Export/rasterization is handled
// elsewhere (qr-export.ts) — this is display only.

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import QRCodeStyling from "qr-code-styling";
import { useLocale } from "../i18n/locale-context";
import type { StyleState } from "./style-state";
import { buildQrOptions } from "./qr-render";

interface QrPreviewProps {
  /** Exact string to encode, or null when the form is incomplete/invalid. */
  payload: string | null;
  style: StyleState;
  /** Preview edge in pixels. */
  size?: number;
}

export function QrPreview({ payload, style, size = 280 }: QrPreviewProps): ReactElement {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    if (payload === null) {
      // Nothing valid to show: tear down any previous render.
      container.replaceChildren();
      instanceRef.current = null;
      setFailed(false);
      return;
    }

    try {
      const options = buildQrOptions(payload, style, size, "svg");
      if (instanceRef.current === null) {
        const instance = new QRCodeStyling(options);
        container.replaceChildren();
        instance.append(container);
        instanceRef.current = instance;
      } else {
        instanceRef.current.update(options);
      }
      setFailed(false);
    } catch {
      container.replaceChildren();
      instanceRef.current = null;
      setFailed(true);
    }
  }, [payload, style, size]);

  return (
    <div
      className="grid aspect-square w-full place-items-center overflow-hidden rounded-xl border border-line-strong bg-panel-2 p-4"
      data-testid="preview-frame"
    >
      {payload === null ? (
        <p className="px-4 text-center text-[12.5px] text-muted">{t("studio.previewPending")}</p>
      ) : failed ? (
        <p className="px-4 text-center text-[12.5px] text-red" role="alert">
          {t("preview.error")}
        </p>
      ) : null}
      <div
        ref={containerRef}
        aria-label={t("preview.data")}
        className={`flex items-center justify-center [&_svg]:h-auto [&_svg]:w-full ${
          payload === null || failed ? "hidden" : ""
        }`}
      />
    </div>
  );
}
