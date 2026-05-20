import { test, expect } from '@playwright/test';

test.describe('Typing Velocity - Core Typing Game', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the local typing test page
    await page.goto('/');
  });

  test('should display the main layout and default UI elements', async ({ page }) => {
    // 1. Title verification
    await expect(page).toHaveTitle(/Typing/i);
    await expect(page.locator('h1')).toContainText('TypoVelocity');
    await expect(page.locator('h2')).toContainText('Test Your Typing Velocity');

    // 2. Default stats should be 0 or standard defaults
    const speedStat = page.locator('p:has-text("Speed") + div > span').first();
    const accuracyStat = page.locator('p:has-text("Accuracy") + div > span').first();
    const errorsStat = page.locator('p:has-text("Errors") + div > span').first();

    await expect(speedStat).toHaveText('0');
    await expect(accuracyStat).toHaveText('100'); // Default accuracy is 100%
    await expect(errorsStat).toHaveText('0');

    // 3. Instruction overlay should be present
    await expect(page.locator('text=Click inside the typing box')).toBeVisible();
  });

  test('should change duration when time limits are clicked', async ({ page }) => {
    const timeStat = page.locator('p:has-text("Time") + div > span').first();

    // Default duration should be 30s
    await expect(timeStat).toHaveText('30');

    // Change to 15s
    await page.click('button:has-text("15s")');
    await expect(timeStat).toHaveText('15');

    // Change to 60s
    await page.click('button:has-text("60s")');
    await expect(timeStat).toHaveText('60');
  });

  test('should support typing through a paragraph and showing results', async ({ page }) => {
    // Locate the paragraph container
    const displayContainer = page.locator('div.cursor-text');
    await expect(displayContainer).toBeVisible();

    // Get the paragraph text
    const paragraphText = await page.locator('.cursor-text > div.font-mono').textContent();
    expect(paragraphText).toBeTruthy();
    expect(paragraphText.length).toBeGreaterThan(10);

    // Focus the hidden typing input
    const hiddenInput = page.locator('input[type="text"]');
    await hiddenInput.focus();

    // Start typing character by character (to simulate authentic user actions)
    // We will type the exact paragraph
    await page.keyboard.type(paragraphText);

    // The test automatically finishes when the whole paragraph is typed.
    // The results screen (ResultModal) should display.
    const resultModal = page.locator('text=Speedy Keystrokes!').or(page.locator('text=Fluid Velocity!')).or(page.locator('text=Steady Flow!')).or(page.locator('text=Mythical Typist!'));
    await expect(resultModal).toBeVisible({ timeout: 10000 });

    // Verify restart button exists
    const restartButton = page.locator('button:has-text("Restart Typing Test")');
    await expect(restartButton).toBeVisible();

    // Click restart and verify we go back to the typing screen
    await restartButton.click();
    await expect(page.locator('h2')).toContainText('Test Your Typing Velocity');
  });

  test('should track errors correctly during typing', async ({ page }) => {
    // Get paragraph text
    const paragraphText = await page.locator('.cursor-text > div.font-mono').textContent();
    const wrongChar = paragraphText[0] === 'a' ? 'b' : 'a';

    // Focus and type a wrong character
    const hiddenInput = page.locator('input[type="text"]');
    await hiddenInput.focus();
    await page.keyboard.type(wrongChar);

    // Verify errors stat increments to 1
    const errorsStat = page.locator('p:has-text("Errors") + div > span').first();
    await expect(errorsStat).toHaveText('1');

    // Verify accuracy decreases
    const accuracyStat = page.locator('p:has-text("Accuracy") + div > span').first();
    const accuracyVal = await accuracyStat.textContent();
    expect(parseInt(accuracyVal, 10)).toBeLessThan(100);
  });
});
