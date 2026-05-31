import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const routes = [
  { name: 'landing', url: '/?role=landing' },
  { name: 'siswa', url: '/?role=siswa' },
  { name: 'guru', url: '/?role=guru' },
  { name: 'dev_overview', url: '/?role=developer&tab=overview' },
  { name: 'dev_sandbox', url: '/?role=developer&tab=sandbox' },
  { name: 'dev_simulation', url: '/?role=developer&tab=simulation' },
  { name: 'dev_schema', url: '/?role=developer&tab=schema' },
  { name: 'dev_stack', url: '/?role=developer&tab=stack' },
  { name: 'dev_directory', url: '/?role=developer&tab=directory' }
];

test.describe('Mobile Usability Audit', () => {
  let auditResults: any[] = [];

  test.afterAll(async () => {
    // Write results to JSON
    const reportDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportPath = path.join(reportDir, 'mobile-report.json');
    
    // Read existing if any to append or merge (simple approach: just overwrite with current worker's data - this might have issues with fullyParallel, so we write per worker)
    const workerReportPath = path.join(reportDir, `mobile-report-${process.env.TEST_WORKER_INDEX || 0}.json`);
    fs.writeFileSync(workerReportPath, JSON.stringify(auditResults, null, 2));
  });

  for (const route of routes) {
    test(`Audit route: ${route.name}`, async ({ page }, testInfo) => {
      await page.goto(route.url);
      
      // Wait for animations
      await page.waitForTimeout(1000);

      // Take screenshot
      const projectName = testInfo.project.name.replace(/\s+/g, '-');
      const screenshotName = `${route.name}-${projectName}.png`;
      await page.screenshot({ path: `test-results/mobile-screenshots/${screenshotName}`, fullPage: true });

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Get document width and window width for context
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      auditResults.push({
        route: route.name,
        viewport: testInfo.project.name,
        hasOverflow,
        dimensions,
        screenshot: screenshotName,
        status: hasOverflow ? 'FAIL' : 'PASS'
      });

      // In CI or strictly, we might want to fail the test. 
      // But for audit cycles, we might just want to collect data.
      // We will assert to make it show up in the report.
      expect(hasOverflow, `Route ${route.name} has horizontal overflow on ${testInfo.project.name}. ScrollWidth: ${dimensions.scrollWidth}, InnerWidth: ${dimensions.innerWidth}`).toBeFalsy();
    });
  }
});
