import { describe, expect, it } from "vitest";
import { buildMailto } from "./mailto";

describe("buildMailto", () => {
  it("builds a bare mailto when subject and body are empty", () => {
    const result = buildMailto({ to: " contact@cds.fr ", subject: "", body: "" });
    expect(result).toEqual({ ok: true, payload: "mailto:contact@cds.fr" });
  });

  it("percent-encodes subject and body, spaces as %20", () => {
    const result = buildMailto({
      to: "contact@cds.fr",
      subject: "Devis QR",
      body: "Bonjour, merci",
    });
    expect(result).toEqual({
      ok: true,
      payload: "mailto:contact@cds.fr?subject=Devis%20QR&body=Bonjour%2C%20merci",
    });
  });

  it("omits the query entirely when only the address is present", () => {
    const result = buildMailto({ to: "a@b.fr", subject: "   ", body: "" });
    expect(result).toEqual({ ok: true, payload: "mailto:a@b.fr" });
  });

  it("rejects an empty recipient", () => {
    const result = buildMailto({ to: "  ", subject: "x", body: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("mailto.to.empty");
  });
});
