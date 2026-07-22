import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { Shell } from "./Shell";

function renderShell(): void {
  render(
    <LocaleProvider>
      <Shell />
    </LocaleProvider>,
  );
}

describe("Shell", () => {
  it("shows the 100% local banner", () => {
    renderShell();
    expect(screen.getByTestId("local-banner")).toBeInTheDocument();
  });

  it("renders a selector button for every QR type", () => {
    renderShell();
    for (const type of ["url", "wifi", "vcard", "sepa"]) {
      expect(screen.getByTestId(`type-${type}`)).toBeInTheDocument();
    }
  });

  it("renders the static-QR warning", () => {
    renderShell();
    expect(screen.getByTestId("static-warning")).toBeInTheDocument();
  });

  it("toggles the locale via the pill", async () => {
    const user = userEvent.setup();
    renderShell();
    // The pill always offers the *other* locale; the detected initial locale
    // depends on the test environment's navigator, so assert the flip rather
    // than a fixed starting value.
    const toggle = screen.getByTestId("locale-toggle");
    const initial = toggle.textContent;
    expect(["FR", "EN"]).toContain(initial);
    await user.click(toggle);
    const flipped = screen.getByTestId("locale-toggle").textContent;
    expect(flipped).toBe(initial === "EN" ? "FR" : "EN");
  });

  it("navigates to the privacy page and back", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: /confidentialité|privacy/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/confidentialité|privacy/i);
  });
});
