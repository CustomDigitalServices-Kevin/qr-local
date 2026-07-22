// User-facing appearance settings for the QR symbol. These are the raw choices
// the StyleOptions panel edits; qr-render.ts turns them into the exact option
// object qr-code-styling consumes. Kept separate from rendering so the mapping
// stays pure and testable.

import type { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import type { EccLevel } from "../lib";

export interface StyleState {
  /** Foreground (module) colour, hex. */
  readonly fgColor: string;
  /** Background colour, hex. */
  readonly bgColor: string;
  /** Module shape. */
  readonly dotType: DotType;
  /** Outer finder-pattern (corner square) shape. */
  readonly cornersSquareType: CornerSquareType;
  /** Inner finder-pattern (corner dot) shape. */
  readonly cornersDotType: CornerDotType;
  /** Whether the foreground uses a two-stop linear gradient. */
  readonly gradientEnabled: boolean;
  /** Second gradient stop colour, hex (start stop is {@link fgColor}). */
  readonly gradientColor: string;
  /** Requested error-correction level (forced to "H" when a logo is set). */
  readonly ecc: EccLevel;
  /** Logo image as a data URL read locally via FileReader, or null. */
  readonly logoDataUrl: string | null;
  /** Logo footprint relative to the symbol (0..0.3), pre-clamp. */
  readonly logoSize: number;
}

/** Sensible high-contrast defaults: solid black on white, square modules. */
export function initialStyleState(): StyleState {
  return {
    fgColor: "#000000",
    bgColor: "#ffffff",
    dotType: "square",
    cornersSquareType: "square",
    cornersDotType: "square",
    gradientEnabled: false,
    gradientColor: "#ff6b00",
    ecc: "M",
    logoDataUrl: null,
    logoSize: 0.25,
  };
}

/** Selectable module shapes, in display order. */
export const DOT_TYPES: readonly DotType[] = [
  "square",
  "rounded",
  "dots",
  "classy",
  "classy-rounded",
  "extra-rounded",
];

/** Selectable corner-square (outer eye) shapes. */
export const CORNER_SQUARE_TYPES: readonly CornerSquareType[] = ["square", "dot", "extra-rounded"];

/** Selectable corner-dot (inner eye) shapes. */
export const CORNER_DOT_TYPES: readonly CornerDotType[] = ["square", "dot"];

/** Error-correction levels offered to the user, low to high redundancy. */
export const ECC_LEVELS: readonly EccLevel[] = ["L", "M", "Q", "H"];
