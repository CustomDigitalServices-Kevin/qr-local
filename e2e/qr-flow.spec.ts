import { expect, test } from "@playwright/test";

// End-to-end coverage of the studio wiring in a real browser: form -> live
// preview (qr-code-styling renders an SVG) -> exports (PNG download) and the
// batch ZIP path. This is the piece unit tests can't cover (happy-dom does not
// rasterize), so it validates the actual render/export engine.

test("generates a live preview from a URL and exports a PNG", async ({ page }) => {
  await page.goto("/");

  // Default type is URL: fill the first field.
  const field = page.getByTestId("qr-form").getByRole("textbox").first();
  await field.fill("https://custom-digital-services.com");

  // The preview frame now contains a rendered SVG symbol.
  await expect(page.locator('[data-testid="preview-frame"] svg')).toBeVisible();

  // Export buttons are enabled and PNG triggers a download.
  const pngButton = page.getByTestId("export-png");
  await expect(pngButton).toBeEnabled();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    pngButton.click(),
  ]);
  expect(download.suggestedFilename()).toBe("qr-url.png");
});

test("shows a validation error only after the user types an invalid value", async ({ page }) => {
  await page.goto("/");
  // Pristine form: no error yet.
  await expect(page.getByTestId("form-error")).toHaveCount(0);

  // Switch to SEPA and enter an invalid IBAN with a beneficiary name.
  await page.getByTestId("type-sepa").click();
  const nameField = page.getByTestId("qr-form").getByRole("textbox").first();
  await nameField.fill("Acme");
  await page.getByTestId("qr-form").getByRole("textbox").nth(1).fill("NOT-AN-IBAN");
  await expect(page.getByTestId("form-error")).toBeVisible();
});

test("switches to Wi-Fi, renders a preview and exports an SVG", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("type-wifi").click();
  // Wi-Fi form: SSID is the first textbox, key the second.
  const fields = page.getByTestId("qr-form").getByRole("textbox");
  await fields.first().fill("MonReseau");
  await fields.nth(1).fill("supersecret");

  // The engine renders the symbol from the built WIFI: payload.
  await expect(page.locator('[data-testid="preview-frame"] svg')).toBeVisible();

  const svgButton = page.getByTestId("export-svg");
  await expect(svgButton).toBeEnabled();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    svgButton.click(),
  ]);
  expect(download.suggestedFilename()).toBe("qr-wifi.svg");
});

test("records an export in history and persists it across a reload", async ({ page }) => {
  await page.goto("/");

  // Pristine: history is empty.
  await expect(page.getByTestId("history-panel")).toContainText(/./);
  await expect(page.getByTestId("history-panel").getByRole("listitem")).toHaveCount(0);

  // Generate and export a PNG — this is what records a history entry.
  await page
    .getByTestId("qr-form")
    .getByRole("textbox")
    .first()
    .fill("https://custom-digital-services.com");
  await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("export-png").click(),
  ]);

  const entries = page.getByTestId("history-panel").getByRole("listitem");
  await expect(entries).toHaveCount(1);
  await expect(entries.first()).toContainText("custom-digital-services.com");

  // Reload: localStorage-backed history survives (device-only persistence).
  await page.reload();
  const afterReload = page.getByTestId("history-panel").getByRole("listitem");
  await expect(afterReload).toHaveCount(1);
  await expect(afterReload.first()).toContainText("custom-digital-services.com");
});

test("batch generation downloads a ZIP", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("batch-panel").getByRole("textbox").fill("https://a.example\nhttps://b.example");

  const generate = page.getByTestId("batch-generate");
  await expect(generate).toBeEnabled();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    generate.click(),
  ]);
  expect(download.suggestedFilename()).toBe("qr-batch.zip");
});
