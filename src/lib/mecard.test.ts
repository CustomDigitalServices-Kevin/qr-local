import { describe, expect, it } from "vitest";
import { buildMeCard } from "./mecard";

const EMPTY = { firstName: "", lastName: "", phone: "", email: "", url: "" };

describe("buildMeCard", () => {
  it("builds a MeCard with comma-separated name terminated by double semicolon", () => {
    const result = buildMeCard({ ...EMPTY, firstName: "Kevin", lastName: "Tomas" });
    expect(result).toEqual({ ok: true, payload: "MECARD:N:Tomas,Kevin;;" });
  });

  it("appends optional fields in order", () => {
    const result = buildMeCard({
      firstName: "Kevin",
      lastName: "Tomas",
      phone: "+33612345678",
      email: "kevin@cds.fr",
      url: "https://cds.fr",
    });
    expect(result).toEqual({
      ok: true,
      // Per the escapeMeCard contract (escapes \ ; : ,) the URL's colons are
      // backslash-escaped, consistent with the ":" escaping asserted below.
      payload: "MECARD:N:Tomas,Kevin;TEL:+33612345678;EMAIL:kevin@cds.fr;URL:https\\://cds.fr;;",
    });
  });

  it("escapes reserved characters including the comma inside a name part", () => {
    const result = buildMeCard({ ...EMPTY, lastName: "Doe, Jr;", firstName: "A:B" });
    expect(result).toEqual({ ok: true, payload: "MECARD:N:Doe\\, Jr\\;,A\\:B;;" });
  });

  it("rejects when both name parts are empty", () => {
    const result = buildMeCard({ ...EMPTY, phone: "0612345678" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("mecard.name.empty");
  });
});
