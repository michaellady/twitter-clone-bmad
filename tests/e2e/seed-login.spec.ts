import { test, expect } from "@playwright/test";

test.describe("Seed Data Login Debug", () => {
  test("register a fresh user and verify login works", async ({ page }) => {
    const email = `fresh-${Date.now()}@example.com`;

    // Register via UI
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Display Name").fill("Fresh User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/home");

    // Logout
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login");

    // Login with same credentials
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });

  test("seed user alice@example.com can log in with password123", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log In" }).click();

    // Either we land on /home or we see an error
    await page.waitForTimeout(3000);
    const url = page.url();
    const hasError = await page.getByText("Invalid credentials").isVisible().catch(() => false);

    console.log(`URL after login attempt: ${url}`);
    console.log(`Has error: ${hasError}`);

    if (hasError) {
      // Debug: try the API directly
      const response = await page.request.post("/api/auth/sign-in/email", {
        data: { email: "alice@example.com", password: "password123" },
      });
      console.log(`Direct API response status: ${response.status()}`);
      console.log(`Direct API response body: ${await response.text()}`);
    }

    expect(hasError).toBe(false);
  });
});
