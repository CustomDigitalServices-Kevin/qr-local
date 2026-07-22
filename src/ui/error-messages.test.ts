import { describe, expect, it } from "vitest";
import { messages } from "../i18n/messages";
import { errorMessageKey } from "./error-messages";

describe("errorMessageKey", () => {
  it("prefixes the stable error code", () => {
    expect(errorMessageKey("sepa.tooLarge")).toBe("error.sepa.tooLarge");
  });

  it("maps to a real, non-empty message in both locales", () => {
    const key = errorMessageKey("wifi.ssid.empty");
    expect(messages.fr[key].length).toBeGreaterThan(0);
    expect(messages.en[key].length).toBeGreaterThan(0);
  });
});
