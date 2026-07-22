// Pure derivation of the QR quality settings from the "QUALITE QR" rules:
// error-correction level, logo size clamping, quiet zone, and a WCAG contrast
// check. No dependency on qr-code-styling — these functions feed its options.

/** qr-code-styling error-correction levels, low to high redundancy. */
export type EccLevel = "L" | "M" | "Q" | "H";

/** Minimum quiet zone around the symbol, in modules (QR spec baseline). */
export const QUIET_ZONE_MODULES = 4;

/** Hard ceiling on the logo footprint relative to the symbol. */
export const MAX_LOGO_SIZE = 0.3;

/** Minimum contrast ratio between dark and light modules for reliable scans. */
export const MIN_CONTRAST_RATIO = 3;

/**
 * Resolve the error-correction level. A logo occludes modules, so as soon as
 * one is present the level is forced to "H" (30% recovery) regardless of the
 * requested level. Without a logo, the caller's choice is honoured, defaulting
 * to "M".
 */
export function resolveErrorCorrection(hasLogo: boolean, requested: EccLevel = "M"): EccLevel {
  return hasLogo ? "H" : requested;
}

/**
 * Clamp the logo size to the safe range. Values are relative to the symbol
 * size; anything above {@link MAX_LOGO_SIZE} would leave too little
 * error-correction headroom, and negatives are meaningless.
 */
export function clampLogoSize(imageSize: number): number {
  if (!Number.isFinite(imageSize) || imageSize < 0) return 0;
  return Math.min(imageSize, MAX_LOGO_SIZE);
}

function parseHex(color: string): { r: number; g: number; b: number } | null {
  const hex = color.trim().replace(/^#/, "");
  const expanded =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  // WCAG 2.1 relative luminance.
  const channel = (value: number): number => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio (1..21) between two hex colors. Returns `null` if either
 * color is not a valid 3- or 6-digit hex string.
 */
export function contrastRatio(foreground: string, background: string): number | null {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (fg === null || bg === null) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Whether the dark/light module colors meet the {@link MIN_CONTRAST_RATIO}
 * threshold needed for reliable scanning. Invalid colors return `false`.
 */
export function hasSufficientContrast(dark: string, light: string): boolean {
  const ratio = contrastRatio(dark, light);
  return ratio !== null && ratio >= MIN_CONTRAST_RATIO;
}
