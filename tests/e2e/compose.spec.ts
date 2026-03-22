import { test, expect } from "@playwright/test";

async function registerAndLogin(page: import("@playwright/test").Page) {
  const email = `compose-${Date.now()}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Display Name").fill("Compose Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("testpassword123");
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL("**/home");
}

test.describe("Tweet Composition", () => {
  test("compose and post a tweet with character counter", async ({ page }) => {
    await registerAndLogin(page);

    const textarea = page.locator("textarea");
    await textarea.fill("This is my first tweet!");

    // Check character counter shows remaining
    await expect(page.getByText("257")).toBeVisible();

    await page.getByRole("button", { name: "Post" }).click();

    // Textarea should be cleared after posting
    await expect(textarea).toHaveValue("");
  });

  test("cannot submit empty tweet", async ({ page }) => {
    await registerAndLogin(page);

    const postButton = page.getByRole("button", { name: "Post" });
    await expect(postButton).toBeDisabled();
  });

  test("character counter shows 0 at 280 characters", async ({ page }) => {
    await registerAndLogin(page);

    const longText = "a".repeat(280);
    await page.locator("textarea").fill(longText);
    await expect(page.getByText("0")).toBeVisible();
  });
});
