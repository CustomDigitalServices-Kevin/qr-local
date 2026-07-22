import { describe, expect, it } from "vitest";
import { buildSms } from "./sms";

describe("buildSms", () => {
  it("builds SMSTO with number and message", () => {
    const result = buildSms({ phone: " +33612345678 ", message: "Bonjour" });
    expect(result).toEqual({ ok: true, payload: "SMSTO:+33612345678:Bonjour" });
  });

  it("keeps a trailing colon when the message is empty", () => {
    const result = buildSms({ phone: "0612345678", message: "" });
    expect(result).toEqual({ ok: true, payload: "SMSTO:0612345678:" });
  });

  it("preserves the message verbatim", () => {
    const result = buildSms({ phone: "0612345678", message: "a: b, c" });
    expect(result).toEqual({ ok: true, payload: "SMSTO:0612345678:a: b, c" });
  });

  it("rejects an empty number", () => {
    const result = buildSms({ phone: "  ", message: "x" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("sms.phone.empty");
  });
});
