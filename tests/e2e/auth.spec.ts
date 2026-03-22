import { test, expect } from "@playwright/test";

const TEST_USER = {
  name: "Test User",
  email: `test-${Date.now()}@example.com`,
  password: "testpassword123",
};

test.describe("Authentication", () => {
  test("registration flow: register → auto-login → see home", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await expect(page.getByLabel("Display Name")).toBeVisible({ timeout: 10000 });

    await page.getByLabel("Display Name").fill(TEST_USER.name);
    await page.getByLabel("Email").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("**/home");
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });

  test("login flow: login → see home", async ({ page }) => {
    // First register
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    const email = `login-test-${Date.now()}@example.com`;
    await page.getByLabel("Display Name").fill("Login Test");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/home");

    // Logout
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login");

    // Login
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("**/home");
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nonexistent@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("logout flow: logout → redirected to login", async ({ page }) => {
    // Register and login
    await page.goto("/register");
    const email = `logout-test-${Date.now()}@example.com`;
    await page.getByLabel("Display Name").fill("Logout Test");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/home");

    // Logout
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login");

    // Verify can't access protected page
    await page.goto("/home");
    await page.waitForURL("**/login");
  });

  test("duplicate email shows error", async ({ page }) => {
    const email = `dup-test-${Date.now()}@example.com`;

    // Register first time
    await page.goto("/register");
    await page.getByLabel("Display Name").fill("First User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/home");

    // Logout and try registering same email
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/login");

    await page.goto("/register");
    await page.getByLabel("Display Name").fill("Second User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText(/already/i)).toBeVisible();
  });
});
