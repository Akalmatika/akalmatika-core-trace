import { test, expect } from '@playwright/test';

test('Click Buka Visualisasi', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => {
    errors.push(`PageError: ${error.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`ConsoleError: ${msg.text()}`);
    }
  });

  await page.goto('http://localhost:3000/student/visualizations/integer', { waitUntil: 'networkidle' });
  
  // click the first "Buka Visualisasi"
  await page.locator('text=Buka Visualisasi').first().click();

  await page.waitForTimeout(1000); // Wait for potential render crash
  
  if (errors.length > 0) {
    console.log("ERRORS DETECTED ON ZERO PAIR:\n", errors.join("\n"));
  } else {
    console.log("Zero Pair Click OK.");
  }

  // Go back
  await page.goBack();
  await page.waitForTimeout(500);

  // click the second "Buka Visualisasi"
  await page.locator('text=Buka Visualisasi').nth(1).click();
  await page.waitForTimeout(1000);

  if (errors.length > 0) {
    console.log("ERRORS DETECTED AFTER SECOND CLICK:\n", errors.join("\n"));
  } else {
    console.log("Placeholder Click OK.");
  }
});
