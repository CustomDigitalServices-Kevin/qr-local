import { describe, expect, it } from "vitest";
import { buildTel } from "./tel";

describe("buildTel", () => {
  it("builds an RFC 3966 tel URI and strips spaces", () => {
    const result = buildTel({ phone: " +33 6 12 34 56 78 " });
    expect(result).toEqual({ ok: true, payload: "tel:+33612345678" });
  });

  it("keeps visual separators", () => {
    const result = buildTel({ phone: "+33-6-12" });
    expect(result).toEqual({ ok: true, payload: "tel:+33-6-12" });
  });

  it("rejects an empty number", () => {
    const result = buildTel({ phone: "  " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("tel.phone.empty");
  });

  it("rejects a number without any digit", () => {
    const result = buildTel({ phone: "+--()" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("tel.phone.invalid");
  });
});
