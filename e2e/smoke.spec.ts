import { expect, test } from "@playwright/test";

test("app loads and shows the local-first banner", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("local-banner")).toBeVisible();
  await expect(page).toHaveTitle(/QR Studio local/);
});

test("static-QR warning is shown", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("static-warning")).toBeVisible();
});

test("no outgoing network request carries data", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "localhost") {
      externalRequests.push(request.url());
    }
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(externalRequests).toEqual([]);
});
