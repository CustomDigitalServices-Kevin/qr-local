import { describe, expect, it } from "vitest";
import { buildPayload } from "./build-payload";
import { QR_TYPES } from "../qr/types";

describe("buildPayload dispatcher", () => {
  it("routes url to buildUrl", () => {
    expect(buildPayload({ type: "url", url: "https://cds.fr" })).toEqual({
      ok: true,
      payload: "https://cds.fr",
    });
  });

  it("routes tel to buildTel", () => {
    expect(buildPayload({ type: "tel", phone: "+33612345678" })).toEqual({
      ok: true,
      payload: "tel:+33612345678",
    });
  });

  it("routes geo to buildGeo", () => {
    expect(buildPayload({ type: "geo", latitude: "48.85", longitude: "2.35" })).toEqual({
      ok: true,
      payload: "geo:48.85,2.35",
    });
  });

  it("routes text to buildText verbatim", () => {
    expect(buildPayload({ type: "text", text: "Bonjour" })).toEqual({
      ok: true,
      payload: "Bonjour",
    });
  });

  it("routes wifi to buildWifi with the exact escaped payload", () => {
    expect(
      buildPayload({ type: "wifi", ssid: "Net;work", password: "p,w", auth: "WPA", hidden: false }),
    ).toEqual({
      ok: true,
      payload: `WIFI:T:WPA;S:Net\\;work;P:p\\,w;H:false;;`,
    });
  });

  it("routes vcard to buildVCard with the exact CRLF payload", () => {
    expect(
      buildPayload({
        type: "vcard",
        firstName: "Kevin",
        lastName: "Tomas",
        org: "",
        title: "",
        phone: "",
        email: "",
        url: "",
      }),
    ).toEqual({
      ok: true,
      payload: ["BEGIN:VCARD", "VERSION:3.0", "N:Tomas;Kevin", "FN:Kevin Tomas", "END:VCARD"].join(
        "\r\n",
      ),
    });
  });

  it("routes mecard to buildMeCard with the exact payload", () => {
    expect(
      buildPayload({ type: "mecard", firstName: "Kevin", lastName: "Tomas", phone: "", email: "", url: "" }),
    ).toEqual({ ok: true, payload: "MECARD:N:Tomas,Kevin;;" });
  });

  it("routes mailto to buildMailto with percent-encoded query", () => {
    expect(
      buildPayload({ type: "mailto", to: "a@b.fr", subject: "Devis QR", body: "" }),
    ).toEqual({ ok: true, payload: "mailto:a@b.fr?subject=Devis%20QR" });
  });

  it("routes sms to buildSms in SMSTO form", () => {
    expect(buildPayload({ type: "sms", phone: "0612345678", message: "Bonjour" })).toEqual({
      ok: true,
      payload: "SMSTO:0612345678:Bonjour",
    });
  });

  it("routes sepa to buildSepa with the exact LF-joined EPC payload", () => {
    expect(
      buildPayload({
        type: "sepa",
        name: "Custom Digital Services",
        iban: "FR7630006000011234567890189",
        bic: "",
        amount: "",
        purpose: "",
        reference: "",
        remittance: "",
        info: "",
      }),
    ).toEqual({
      ok: true,
      payload: ["BCD", "002", "1", "SCT", "", "Custom Digital Services", "FR7630006000011234567890189"].join(
        "\n",
      ),
    });
  });

  it("propagates builder validation errors", () => {
    const result = buildPayload({ type: "url", url: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("url.empty");
  });

  it("has a routable case for every registered QR type", () => {
    // A minimal valid-or-invalid input per type; we only assert that dispatch
    // returns a BuildResult (never throws) for each discriminant.
    for (const type of QR_TYPES) {
      const result = buildPayload(minimalInput(type));
      expect(typeof result.ok).toBe("boolean");
    }
  });
});

function minimalInput(type: (typeof QR_TYPES)[number]) {
  switch (type) {
    case "url":
      return { type, url: "https://cds.fr" } as const;
    case "text":
      return { type, text: "hello" } as const;
    case "wifi":
      return { type, ssid: "N", password: "p", auth: "WPA", hidden: false } as const;
    case "vcard":
      return {
        type,
        firstName: "K",
        lastName: "T",
        org: "",
        title: "",
        phone: "",
        email: "",
        url: "",
      } as const;
    case "mecard":
      return { type, firstName: "K", lastName: "T", phone: "", email: "", url: "" } as const;
    case "mailto":
      return { type, to: "a@b.fr", subject: "", body: "" } as const;
    case "sms":
      return { type, phone: "0612345678", message: "" } as const;
    case "tel":
      return { type, phone: "0612345678" } as const;
    case "geo":
      return { type, latitude: "0", longitude: "0" } as const;
    case "sepa":
      return {
        type,
        name: "CDS",
        iban: "FR7630006000011234567890189",
        bic: "",
        amount: "",
        purpose: "",
        reference: "",
        remittance: "",
        info: "",
      } as const;
  }
}
