import { test, expect } from '@playwright/test';

test('Catch white screen error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => {
    errors.push(`PageError: ${error.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`ConsoleError: ${msg.text()}`);
    }
  });

  // Since we don't have vite running, let's start it in a child process or we can assume it's running
  // Wait, I should run the test against http://localhost:3000
  await page.goto('http://localhost:3000/student/visualizations/integer/zero-pair', { waitUntil: 'networkidle' });
  
  if (errors.length > 0) {
    console.log("ERRORS DETECTED:\n", errors.join("\n"));
  } else {
    console.log("No errors detected on page load.");
  }
});
