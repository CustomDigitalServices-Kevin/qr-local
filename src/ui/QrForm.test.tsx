import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { QrForm } from "./QrForm";
import { initialFormState, toPayloadInput, type FormState } from "./form-state";
import type { QrType } from "../qr/types";
import { buildPayload } from "../lib";

// Controlled harness so the fields actually update and we can assert the payload
// the form would produce end to end.
function Harness({ type }: { type: QrType }): ReactElement {
  const [state, setState] = useState<FormState>(initialFormState);
  const result = buildPayload(toPayloadInput(type, state));
  return (
    <LocaleProvider>
      <QrForm
        type={type}
        state={state}
        onChange={(key, patch) => {
          setState((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
        }}
      />
      <output data-testid="payload">{result.ok ? result.payload : "INVALID"}</output>
    </LocaleProvider>
  );
}

describe("QrForm", () => {
  it("builds a URL payload from typed input", async () => {
    const user = userEvent.setup();
    render(<Harness type="url" />);
    await user.type(screen.getByRole("textbox"), "https://cds.example");
    expect(screen.getByTestId("payload")).toHaveTextContent("https://cds.example");
  });

  it("hides the secret field for an open Wi-Fi network", async () => {
    const user = userEvent.setup();
    render(<Harness type="wifi" />);
    // SSID + secret + (hidden checkbox) present by default (WPA).
    const secretLabel = /mot de passe|password/i;
    expect(screen.getByLabelText(secretLabel)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/sécurité|security/i), "nopass");
    expect(screen.queryByLabelText(secretLabel)).not.toBeInTheDocument();
  });

  it("escapes reserved characters when building a Wi-Fi payload", async () => {
    const user = userEvent.setup();
    render(<Harness type="wifi" />);
    await user.type(screen.getByLabelText(/network name|nom du réseau/i), "My;Net");
    await user.type(screen.getByLabelText(/mot de passe|password/i), "a,b");
    expect(screen.getByTestId("payload")).toHaveTextContent("WIFI:T:WPA;S:My\\;Net;P:a\\,b;H:false;;");
  });
});
