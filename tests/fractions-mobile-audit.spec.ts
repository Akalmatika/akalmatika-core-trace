import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const fractionPages = [
  { name: 'area-model', url: '/student/visualizations/fractions/area-model' },
  { name: 'equivalent-fractions', url: '/student/visualizations/fractions/equivalent-fractions' },
  { name: 'simplify', url: '/student/visualizations/fractions/simplify' },
  { name: 'compare-order', url: '/student/visualizations/fractions/compare-order' },
  { name: 'same-denominator', url: '/student/visualizations/fractions/same-denominator' },
  { name: 'different-denominator', url: '/student/visualizations/fractions/different-denominator' }
];

test.describe('Fractions Mobile Usability Audit', () => {
  for (const pageInfo of fractionPages) {
    test(`Audit ${pageInfo.name} for overflow and capture screenshots`, async ({ page }, testInfo) => {
      // Go to page
      await page.goto(pageInfo.url);
      
      // Wait for page load and transition animations
      await page.waitForTimeout(1500);

      // Check horizontal overflow
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      
      const hasOverflow = dimensions.scrollWidth > dimensions.innerWidth;
      
      // Assert no horizontal overflow
      expect(hasOverflow, `Page ${pageInfo.name} has horizontal overflow on ${testInfo.project.name}. ScrollWidth: ${dimensions.scrollWidth}, InnerWidth: ${dimensions.innerWidth}`).toBeFalsy();

      // Ensure directory exists in the artifact directory
      const artifactBase = 'C:\\Users\\Alam\\.gemini\\antigravity\\brain\\7f9a0259-6af7-4ccf-a1cf-5306f06f365e';
      const screenshotsDir = path.join(artifactBase, 'audit_screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      // Take a screenshot of the viewport
      const safeProjectName = testInfo.project.name.replace(/\s+/g, '-');
      const screenshotPath = path.join(screenshotsDir, `${pageInfo.name}-${safeProjectName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      
      console.log(`Screenshot saved for ${pageInfo.name} on ${testInfo.project.name} to ${screenshotPath}`);
    });
  }
});
