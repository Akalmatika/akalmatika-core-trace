import { test, expect } from '@playwright/test';

const newRoutes = [
  { name: 'fractions', url: '/student/visualizations/fractions' },
  { name: 'percent', url: '/student/visualizations/percent' },
  { name: 'algebra', url: '/student/visualizations/algebra' },
  { name: 'placeholder_frac', url: '/student/visualizations/fractions/area-model' },
];

test.describe('Audit Mobile New Pages', () => {
  for (const route of newRoutes) {
    test(`Audit ${route.name}`, async ({ page }, testInfo) => {
      await page.goto(route.url);
      await page.waitForTimeout(1000); // Wait for fadeIn
      
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      expect(hasOverflow, `Route ${route.name} has overflow on ${testInfo.project.name}`).toBe(false);
    });
  }
});
