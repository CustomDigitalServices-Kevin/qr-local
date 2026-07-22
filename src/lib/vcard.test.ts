import { describe, expect, it } from "vitest";
import { buildVCard } from "./vcard";

const EMPTY = { firstName: "", lastName: "", org: "", title: "", phone: "", email: "", url: "" };

describe("buildVCard", () => {
  it("builds a minimal vCard 3.0 with N and FN using CRLF", () => {
    const result = buildVCard({ ...EMPTY, firstName: "Kevin", lastName: "Tomas" });
    expect(result).toEqual({
      ok: true,
      payload: ["BEGIN:VCARD", "VERSION:3.0", "N:Tomas;Kevin", "FN:Kevin Tomas", "END:VCARD"].join(
        "\r\n",
      ),
    });
  });

  it("includes optional properties only when present", () => {
    const result = buildVCard({
      firstName: "Kevin",
      lastName: "Tomas",
      org: "CDS",
      title: "Consultant",
      phone: "+33612345678",
      email: "kevin@cds.fr",
      url: "https://cds.fr",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload).toBe(
        [
          "BEGIN:VCARD",
          "VERSION:3.0",
          "N:Tomas;Kevin",
          "FN:Kevin Tomas",
          "ORG:CDS",
          "TITLE:Consultant",
          "TEL;TYPE=WORK,VOICE:+33612345678",
          "EMAIL:kevin@cds.fr",
          "URL:https://cds.fr",
          "END:VCARD",
        ].join("\r\n"),
      );
    }
  });

  it("escapes reserved characters in components", () => {
    const result = buildVCard({ ...EMPTY, lastName: "Doe; Inc,", firstName: "A\\B" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload).toContain("N:Doe\\; Inc\\,;A\\\\B");
  });

  it("derives FN from a single available name part", () => {
    const result = buildVCard({ ...EMPTY, lastName: "Tomas" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload).toContain("\r\nN:Tomas;\r\nFN:Tomas\r\n");
  });

  it("rejects when both name parts are empty", () => {
    const result = buildVCard({ ...EMPTY, org: "CDS" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("vcard.name.empty");
  });
});
