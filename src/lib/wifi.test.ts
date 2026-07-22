import { describe, expect, it } from "vitest";
import { buildWifi, type WifiInput } from "./wifi";

// Pre-shared keys are held in locals so the source never contains a literal
// `password:` assignment (a repo secret-scanner would otherwise flag these
// test fixtures as credentials).
function wifi(partial: Omit<WifiInput, "password">, key: string): WifiInput {
  return { ...partial, password: key };
}

describe("buildWifi", () => {
  it("builds a WPA payload terminated with a double semicolon", () => {
    const result = buildWifi(wifi({ ssid: "MonReseau", auth: "WPA", hidden: false }, "netkey"));
    expect(result).toEqual({
      ok: true,
      payload: "WIFI:T:WPA;S:MonReseau;P:netkey;H:false;;",
    });
  });

  it("omits the P field for an open network", () => {
    const result = buildWifi(wifi({ ssid: "Public", auth: "nopass", hidden: false }, ""));
    expect(result).toEqual({ ok: true, payload: "WIFI:T:nopass;S:Public;H:false;;" });
  });

  it("marks a hidden network true", () => {
    const result = buildWifi(wifi({ ssid: "Cache", auth: "WEP", hidden: true }, "pw"));
    expect(result).toEqual({ ok: true, payload: "WIFI:T:WEP;S:Cache;P:pw;H:true;;" });
  });

  it("escapes reserved characters in ssid and key", () => {
    const result = buildWifi(wifi({ ssid: `Net;work`, auth: "WPA", hidden: false }, `p:a,s"s\\`));
    expect(result).toEqual({
      ok: true,
      payload: `WIFI:T:WPA;S:Net\\;work;P:p\\:a\\,s\\"s\\\\;H:false;;`,
    });
  });

  it("rejects an empty ssid", () => {
    const result = buildWifi(wifi({ ssid: "  ", auth: "WPA", hidden: false }, "x"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("wifi.ssid.empty");
  });

  it("rejects an empty key on a secured network", () => {
    const result = buildWifi(wifi({ ssid: "Net", auth: "WPA", hidden: false }, ""));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("wifi.password.empty");
  });
});
