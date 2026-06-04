import { test, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Konfigurasi ──────────────────────────────────────────

const BASE_URL = 'http://localhost:3000';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'docs', 'demo', 'screenshots');

interface ViewportConfig {
  label: string;
  suffix: string;
  width: number;
  height: number;
}

const VIEWPORTS: ViewportConfig[] = [
  { label: 'Desktop 1366x768', suffix: 'desktop', width: 1366, height: 768 },
  { label: 'Mobile 390x844', suffix: 'mobile', width: 390, height: 844 },
];

// ─── Mock Data ────────────────────────────────────────────

/**
 * Data progress realistis:
 * - integer: mastered (perfect track, no misconception)
 * - fractions: mastered (had misconception MC-FRAC-ADD-NUM-DENOM, bridged & drilled)
 * - percent: diagnosed (misconception MC-PERC-NO-100 detected, not yet bridged)
 * - algebra: not-started (locked, prereqs not fully met in this scenario)
 * - plsv: not-started (locked)
 */
function getMockProgressPartial(): object {
  const now = Date.now();
  return {
    topics: {
      integer: {
        topicId: 'integer',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'integer',
            date: new Date(now - 86400000 * 3).toISOString(),
            isPerfectTrack: true,
            detectedMisconceptionCode: null,
            confidence: 100,
            matchRatio: '0/2',
            answers: ['5', '-3'],
          },
        ],
        bridgeVisits: [],
        drillProgress: {
          topicId: 'integer',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 100,
          phase3Accuracy: 100,
          totalAttempts: 3,
          lastAttemptDate: new Date(now - 86400000 * 2.5).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'integer',
            passed: true,
            score: 100,
            attemptDate: new Date(now - 86400000 * 2).toISOString(),
          },
        ],
      },
      fractions: {
        topicId: 'fractions',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'fractions',
            date: new Date(now - 86400000 * 1.5).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-FRAC-ADD-NUM-DENOM',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['2/5', '3/7'],
          },
        ],
        bridgeVisits: [
          {
            topicId: 'fractions',
            misconceptionCode: 'MC-FRAC-ADD-NUM-DENOM',
            visitedDate: new Date(now - 86400000 * 1.2).toISOString(),
            completedVisualization: true,
            visualizationOpened: true,
          },
        ],
        drillProgress: {
          topicId: 'fractions',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 100,
          phase3Accuracy: 100,
          totalAttempts: 3,
          lastAttemptDate: new Date(now - 86400000 * 1).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'fractions',
            passed: true,
            score: 100,
            attemptDate: new Date(now - 86400000 * 0.8).toISOString(),
          },
        ],
      },
      percent: {
        topicId: 'percent',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'percent',
            date: new Date(now - 86400000 * 0.6).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-PERC-NO-100',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['25', '50'],
          },
        ],
        bridgeVisits: [
          {
            topicId: 'percent',
            misconceptionCode: 'MC-PERC-NO-100',
            visitedDate: new Date(now - 86400000 * 0.5).toISOString(),
            completedVisualization: true,
            visualizationOpened: true,
          },
        ],
        drillProgress: {
          topicId: 'percent',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 80,
          phase3Accuracy: 80,
          totalAttempts: 4,
          lastAttemptDate: new Date(now - 86400000 * 0.4).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'percent',
            passed: true,
            score: 80,
            attemptDate: new Date(now - 86400000 * 0.3).toISOString(),
          },
        ],
      },
      algebra: {
        topicId: 'algebra',
        masteryLevel: 'diagnosed',
        diagnosticResults: [
          {
            topicId: 'algebra',
            date: new Date(now - 3600000).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-ALG-ADD-UNLIKE',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['5x', '7xy'],
          },
        ],
        bridgeVisits: [],
        drillProgress: null,
        masteryResults: [],
      },
    },
  };
}

/**
 * Data progress untuk dashboard siswa: 3 topik mastered, 1 diagnosed, 1 locked.
 * Menghasilkan tampilan progress ring 60% dan rekomendasi langkah belajar aktif.
 */
function getMockProgressForDashboard(): object {
  const now = Date.now();
  return {
    topics: {
      integer: {
        topicId: 'integer',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'integer',
            date: new Date(now - 86400000 * 5).toISOString(),
            isPerfectTrack: true,
            detectedMisconceptionCode: null,
            confidence: 100,
            matchRatio: '0/2',
            answers: ['5', '-3'],
          },
        ],
        bridgeVisits: [],
        drillProgress: {
          topicId: 'integer',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 100,
          phase3Accuracy: 100,
          totalAttempts: 3,
          lastAttemptDate: new Date(now - 86400000 * 4).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'integer',
            passed: true,
            score: 100,
            attemptDate: new Date(now - 86400000 * 4).toISOString(),
          },
        ],
      },
      fractions: {
        topicId: 'fractions',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'fractions',
            date: new Date(now - 86400000 * 3).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-FRAC-ADD-NUM-DENOM',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['2/5', '3/7'],
          },
        ],
        bridgeVisits: [
          {
            topicId: 'fractions',
            misconceptionCode: 'MC-FRAC-ADD-NUM-DENOM',
            visitedDate: new Date(now - 86400000 * 2.8).toISOString(),
            completedVisualization: true,
            visualizationOpened: true,
          },
        ],
        drillProgress: {
          topicId: 'fractions',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 100,
          phase3Accuracy: 100,
          totalAttempts: 3,
          lastAttemptDate: new Date(now - 86400000 * 2.5).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'fractions',
            passed: true,
            score: 100,
            attemptDate: new Date(now - 86400000 * 2.5).toISOString(),
          },
        ],
      },
      percent: {
        topicId: 'percent',
        masteryLevel: 'mastered',
        diagnosticResults: [
          {
            topicId: 'percent',
            date: new Date(now - 86400000 * 2).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-PERC-NO-100',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['25', '50'],
          },
        ],
        bridgeVisits: [
          {
            topicId: 'percent',
            misconceptionCode: 'MC-PERC-NO-100',
            visitedDate: new Date(now - 86400000 * 1.8).toISOString(),
            completedVisualization: true,
            visualizationOpened: true,
          },
        ],
        drillProgress: {
          topicId: 'percent',
          currentPhase: 3,
          phase1Completed: true,
          phase2Accuracy: 80,
          phase3Accuracy: 80,
          totalAttempts: 4,
          lastAttemptDate: new Date(now - 86400000 * 1.5).toISOString(),
        },
        masteryResults: [
          {
            topicId: 'percent',
            passed: true,
            score: 80,
            attemptDate: new Date(now - 86400000 * 1.5).toISOString(),
          },
        ],
      },
      algebra: {
        topicId: 'algebra',
        masteryLevel: 'diagnosed',
        diagnosticResults: [
          {
            topicId: 'algebra',
            date: new Date(now - 3600000).toISOString(),
            isPerfectTrack: false,
            detectedMisconceptionCode: 'MC-ALG-ADD-UNLIKE',
            confidence: 100,
            matchRatio: '2/2',
            answers: ['5x', '7xy'],
          },
        ],
        bridgeVisits: [],
        drillProgress: null,
        masteryResults: [],
      },
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────

async function seedProgress(page: Page, data: object): Promise<void> {
  await page.evaluate((d) => {
    localStorage.setItem('akalmatika_progress', JSON.stringify(d));
  }, data);
}

async function clearProgress(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('akalmatika_progress');
  });
}

async function captureScreenshot(
  page: Page,
  filename: string,
  options?: { fullPage?: boolean }
): Promise<void> {
  const filePath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({
    path: filePath,
    fullPage: options?.fullPage ?? true,
  });
}

async function setViewport(page: Page, vp: ViewportConfig): Promise<void> {
  await page.setViewportSize({ width: vp.width, height: vp.height });
}

// ─── Test Suite ───────────────────────────────────────────

test.describe('Demo Screenshot Capture', () => {
  test.describe.configure({ mode: 'serial' });

  // ── 1. Landing Page ──────────────────────────────────────
  test('01 — Landing Page', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await captureScreenshot(page, `01-landing-${vp.suffix}.png`);
    }
  });

  // ── 2. Diagnosis Fondasi — halaman awal ──────────────────
  test('02 — Diagnosis Fondasi (Welcome)', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.goto(`${BASE_URL}/student/diagnostic-foundation`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(500);
      await captureScreenshot(page, `02-diagnosis-welcome-${vp.suffix}.png`);
    }
  });

  // ── 3. Learning Map ──────────────────────────────────────
  test('03 — Learning Map', async ({ page }) => {
    // Seed partial progress so some nodes are unlocked, some locked
    await page.goto(`${BASE_URL}/student/learning-map`, { waitUntil: 'commit' });
    await seedProgress(page, getMockProgressPartial());
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `03-learning-map-${vp.suffix}.png`);
    }
  });

  // ── 4. Jembatan Konsep (Bridge) ──────────────────────────
  test('04 — Bridge Page (Fractions)', async ({ page }) => {
    // Seed progress so bridge page renders correctly
    await page.goto(`${BASE_URL}/student/bridge/fractions/MC-FRAC-ADD-NUM-DENOM`, {
      waitUntil: 'commit',
    });
    await seedProgress(page, getMockProgressPartial());
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `04-bridge-fractions-${vp.suffix}.png`);
    }
  });

  // ── 5. Drill Page ────────────────────────────────────────
  test('05 — Drill Page (Fractions)', async ({ page }) => {
    // Seed so fractions drill is accessible
    await page.goto(`${BASE_URL}/student/drill/fractions`, {
      waitUntil: 'commit',
    });
    await seedProgress(page, getMockProgressPartial());
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `05-drill-fractions-${vp.suffix}.png`);
    }
  });

  // ── 6. Mastery Check ─────────────────────────────────────
  test('06 — Mastery Check (Fractions)', async ({ page }) => {
    // Seed so fractions mastery is accessible
    await page.goto(`${BASE_URL}/student/mastery/fractions`, {
      waitUntil: 'commit',
    });
    await seedProgress(page, getMockProgressPartial());
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `06-mastery-fractions-${vp.suffix}.png`);
    }
  });

  // ── 7. Dashboard Siswa — Empty State ─────────────────────
  test('07a — Student Dashboard (Empty State)', async ({ page }) => {
    await page.goto(`${BASE_URL}/student/dashboard`, { waitUntil: 'commit' });
    await clearProgress(page);
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `07a-dashboard-student-empty-${vp.suffix}.png`);
    }
  });

  // ── 7b. Dashboard Siswa — Dengan Progress ────────────────
  test('07b — Student Dashboard (With Progress)', async ({ page }) => {
    await page.goto(`${BASE_URL}/student/dashboard`, { waitUntil: 'commit' });
    await seedProgress(page, getMockProgressForDashboard());
    await page.reload({ waitUntil: 'networkidle' });

    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.waitForTimeout(500);
      await captureScreenshot(page, `07b-dashboard-student-progress-${vp.suffix}.png`);
    }
  });

  // ── 8. Dashboard Guru ────────────────────────────────────
  test('08 — Teacher Dashboard', async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await setViewport(page, vp);
      await page.goto(`${BASE_URL}/teacher/dashboard`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(500);
      await captureScreenshot(page, `08-dashboard-teacher-${vp.suffix}.png`);
    }
  });
});
