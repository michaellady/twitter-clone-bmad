import { test, expect } from "@playwright/test";

test.describe("Explore Page", () => {
  test("logged-out user sees explore page with public tweets", async ({ page }) => {
    await page.goto("/explore");

    await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
    // Should see sign-up CTA
    await expect(page.getByText("Sign up")).toBeVisible();
  });

  test("logged-in user sees explore page", async ({ page }) => {
    // Register
    const email = `explore-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Display Name").fill("Explorer");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/home");

    // Navigate to explore
    await page.getByRole("link", { name: "Explore" }).click();
    await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
  });
});
