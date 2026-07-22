// Per-format escaping helpers. Each QR text format reserves a different set of
// delimiter characters; a value that contains one of them must be
// backslash-escaped so it cannot forge a field boundary on the scanner side.

/**
 * Wi-Fi (WIFI:) escaping. The Wi-Fi Alliance / Android format reserves
 * `\ ; , : "` as separators; each is prefixed with a backslash. Escaping the
 * backslash class first is unnecessary here because the regex scans left to
 * right and only inserts a backslash *before* each reserved char, so an input
 * backslash becomes `\\` correctly.
 */
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

/**
 * MeCard escaping. MeCard reserves `\ ; : ,`. Same left-to-right single pass:
 * a literal backslash in the input is turned into `\\`.
 */
export function escapeMeCard(value: string): string {
  return value.replace(/([\\;:,])/g, "\\$1");
}

/**
 * vCard 3.0 (RFC 2426 §5) escaping for a text value / structured component.
 * Backslash MUST be escaped first, otherwise the backslashes we add for the
 * other characters would be double-escaped. Newlines become the literal `\n`.
 */
export function escapeVCard(value: string): string {
  return value
    .replace(/\r\n|\r/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
