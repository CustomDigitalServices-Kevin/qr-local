// Pure bridge from (payload string + StyleState) to the qr-code-styling
// `Options` object. No DOM, no library instance created here — this is the
// single place that encodes the "QUALITE QR" rules (ECC escalation with a
// logo, logo-size clamp, quiet zone, hidden dots under the logo) as data.

import type { Options as QrOptions, Gradient, DrawType } from "qr-code-styling";
import { resolveErrorCorrection, clampLogoSize, QUIET_ZONE_MODULES } from "../lib";
import type { StyleState } from "./style-state";

/**
 * Assumed module count used to translate the 4-module quiet-zone rule into the
 * pixel margin qr-code-styling expects. Real symbols range from 21 modules
 * (v1) upward; anchoring on a mid-size version keeps the border at least four
 * modules wide for common payloads, and a slightly wider zone only ever helps
 * scanning.
 */
const ASSUMED_MODULE_COUNT = 33;

/**
 * Pixel quiet zone for a symbol of `size` px, derived from
 * {@link QUIET_ZONE_MODULES}. Never negative; rounded to a whole pixel.
 */
export function quietMargin(size: number): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  return Math.round((size * QUIET_ZONE_MODULES) / ASSUMED_MODULE_COUNT);
}

function foregroundGradient(style: StyleState): Gradient | undefined {
  if (!style.gradientEnabled) return undefined;
  return {
    type: "linear",
    rotation: Math.PI / 4,
    colorStops: [
      { offset: 0, color: style.fgColor },
      { offset: 1, color: style.gradientColor },
    ],
  };
}

/**
 * Build the full option object for a QR of the given pixel size and draw type.
 * `payload` is the exact string to encode (already produced by src/lib/). When
 * a logo is present the ECC level is forced to "H" and the logo is size-clamped
 * with background dots hidden underneath it.
 */
export function buildQrOptions(
  payload: string,
  style: StyleState,
  size: number,
  drawType: DrawType,
): QrOptions {
  const logo = style.logoDataUrl;
  const hasLogo = logo !== null;
  const gradient = foregroundGradient(style);

  const options: QrOptions = {
    type: drawType,
    width: size,
    height: size,
    margin: quietMargin(size),
    data: payload,
    qrOptions: {
      errorCorrectionLevel: resolveErrorCorrection(hasLogo, style.ecc),
    },
    dotsOptions: {
      type: style.dotType,
      color: style.fgColor,
      ...(gradient ? { gradient } : {}),
    },
    cornersSquareOptions: {
      type: style.cornersSquareType,
      color: style.fgColor,
    },
    cornersDotOptions: {
      type: style.cornersDotType,
      color: style.fgColor,
    },
    backgroundOptions: {
      color: style.bgColor,
    },
  };

  if (logo !== null) {
    options.image = logo;
    options.imageOptions = {
      hideBackgroundDots: true,
      imageSize: clampLogoSize(style.logoSize),
      margin: 0,
      crossOrigin: "anonymous",
    };
  }

  return options;
}
