import { test, expect } from '@playwright/test';

const newRoutes = [
  { name: 'fractions-catalog', url: '/student/visualizations/fractions' },
  { name: 'integer-catalog', url: '/student/visualizations/integer' },
  { name: 'percent-catalog', url: '/student/visualizations/percent' },
  { name: 'algebra-catalog', url: '/student/visualizations/algebra' },
  { name: 'area-model', url: '/student/visualizations/fractions/area-model' },
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
