import { escapeWifi } from "./escape";
import { err, ok, type BuildResult } from "./payload";

export type WifiAuth = "WPA" | "WEP" | "nopass";

export interface WifiInput {
  /** Network SSID. Required. */
  readonly ssid: string;
  /** Pre-shared key. Required unless `auth` is "nopass". */
  readonly password: string;
  /** Authentication type. */
  readonly auth: WifiAuth;
  /** Whether the SSID is hidden (not broadcast). */
  readonly hidden: boolean;
}

/**
 * Wi-Fi join payload: `WIFI:T:<auth>;S:<ssid>;P:<pass>;H:<true|false>;;`.
 * SSID and password are escaped for the reserved characters `\ ; , : "`.
 * The `P` field is omitted entirely for open ("nopass") networks. The string
 * is terminated with the mandatory double semicolon.
 */
export function buildWifi(input: WifiInput): BuildResult {
  const ssid = input.ssid.trim();
  if (ssid.length === 0) {
    return err("wifi.ssid.empty", "SSID is required");
  }

  const open = input.auth === "nopass";
  if (!open && input.password.length === 0) {
    return err("wifi.password.empty", "Password is required for a secured network");
  }

  const parts = [`T:${input.auth}`, `S:${escapeWifi(ssid)}`];
  if (!open) {
    parts.push(`P:${escapeWifi(input.password)}`);
  }
  parts.push(`H:${input.hidden ? "true" : "false"}`);

  return ok(`WIFI:${parts.join(";")};;`);
}
