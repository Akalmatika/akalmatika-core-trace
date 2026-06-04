import { test, expect } from '@playwright/test';

test.describe('Sprint 4A Student Dashboard Audit Test', () => {
  test('Verify dashboard under empty state, partial progress, and completed chain', async ({ page }) => {
    // SCENARIO 1: Empty state verification
    await page.goto('http://localhost:3000/student/dashboard', { waitUntil: 'commit' });
    
    // Clear localStorage to simulate fresh student
    await page.evaluate(() => {
      localStorage.removeItem('akalmatika_progress');
    });
    
    await page.reload({ waitUntil: 'networkidle' });

    // Verify empty state text and start button
    await expect(page.locator('text=Mulai Petualangan Matematikamu!')).toBeVisible();
    await expect(page.locator('text=Belum ada aktivitas. Ukur pemahaman matematika dasarmu')).toBeVisible();
    
    const startFoundationBtn = page.locator('a:has-text("Mulai Diagnosis Fondasi")');
    await expect(startFoundationBtn).toBeVisible();
    
    // SCENARIO 2: Partial progress seeding
    await page.evaluate(() => {
      localStorage.setItem('akalmatika_progress', JSON.stringify({
        topics: {
          integer: {
            topicId: "integer",
            masteryLevel: "mastered",
            diagnosticResults: [
              {
                topicId: "integer",
                date: new Date(Date.now() - 3600000 * 3).toISOString(),
                isPerfectTrack: true,
                detectedMisconceptionCode: null,
                confidence: 100,
                matchRatio: "0/2",
                answers: ["5", "-3"]
              }
            ],
            bridgeVisits: [],
            drillProgress: {
              topicId: "integer",
              currentPhase: 3,
              phase1Completed: true,
              phase2Accuracy: 100,
              phase3Accuracy: 100,
              totalAttempts: 3,
              lastAttemptDate: new Date(Date.now() - 3600000 * 2.5).toISOString()
            },
            masteryResults: [
              {
                topicId: "integer",
                passed: true,
                score: 100,
                attemptDate: new Date(Date.now() - 3600000 * 2).toISOString()
              }
            ]
          },
          fractions: {
            topicId: "fractions",
            masteryLevel: "mastered",
            diagnosticResults: [
              {
                topicId: "fractions",
                date: new Date(Date.now() - 3600000 * 1.5).toISOString(),
                isPerfectTrack: false,
                detectedMisconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
                confidence: 100,
                matchRatio: "2/2",
                answers: ["2/5", "3/7"]
              }
            ],
            bridgeVisits: [
              {
                topicId: "fractions",
                misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
                visitedDate: new Date(Date.now() - 3600000 * 1.2).toISOString(),
                completedVisualization: true,
                visualizationOpened: true
              }
            ],
            drillProgress: {
              topicId: "fractions",
              currentPhase: 3,
              phase1Completed: true,
              phase2Accuracy: 100,
              phase3Accuracy: 100,
              totalAttempts: 3,
              lastAttemptDate: new Date(Date.now() - 3600000 * 1).toISOString()
            },
            masteryResults: [
              {
                topicId: "fractions",
                passed: true,
                score: 100,
                attemptDate: new Date(Date.now() - 3600000 * 0.8).toISOString()
              }
            ]
          },
          percent: {
            topicId: "percent",
            masteryLevel: "diagnosed",
            diagnosticResults: [
              {
                topicId: "percent",
                date: new Date(Date.now() - 600000).toISOString(),
                isPerfectTrack: false,
                detectedMisconceptionCode: "MC-PERC-NO-100",
                confidence: 100,
                matchRatio: "2/2",
                answers: ["25", "50"]
              }
            ],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: []
          }
        }
      }));
    });

    await page.reload({ waitUntil: 'networkidle' });

    // Verify progress rings show correct mastered topics
    await expect(page.locator('text=2 / 5 Topik Dikuasai')).toBeVisible();
    await expect(page.locator('text=40%').first()).toBeVisible();
    await expect(page.locator('text=Sedang membangun fondasi')).toBeVisible();

    // Verify next-step recommendation points to percent bridge page
    await expect(page.locator('a:has-text("Buka Jembatan Konsep")')).toBeVisible();
    const recTopicHeader = page.locator('h3:has-text("Persen")');
    await expect(recTopicHeader).toBeVisible();

    // Verify topic cards render status badges correctly
    const integerBadge = page.locator('div').filter({ has: page.locator('h4:has-text("Bilangan Bulat")') }).first();
    await expect(integerBadge).toContainText('Selesai ✓');
    
    const fractionBadge = page.locator('div').filter({ has: page.locator('h4:has-text("Pecahan")') }).first();
    await expect(fractionBadge).toContainText('Selesai ✓');

    const percentBadge = page.locator('div').filter({ has: page.locator('h4:has-text("Persen")') }).first();
    await expect(percentBadge).toContainText('Diagnosed');

    const algebraBadge = page.locator('div').filter({ has: page.locator('h4:has-text("Aljabar Dasar")') }).first();
    await expect(algebraBadge).toContainText('Terkunci 🔒');

    // Click next-step button and ensure it routes to Bridge Page
    const nextStepBtn = page.locator('a:has-text("Buka Jembatan Konsep")').first();
    await expect(nextStepBtn).toBeVisible();
    await nextStepBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/bridge/percent/MC-PERC-NO-100');

    // SCENARIO 3: Mastered chain check
    await page.goto('http://localhost:3000/student/dashboard', { waitUntil: 'commit' });
    await page.evaluate(() => {
      localStorage.setItem('akalmatika_progress', JSON.stringify({
        topics: {
          integer: {
            topicId: "integer",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [{ topicId: "integer", passed: true, score: 100, attemptDate: new Date().toISOString() }]
          },
          fractions: {
            topicId: "fractions",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [{ topicId: "fractions", passed: true, score: 100, attemptDate: new Date().toISOString() }]
          },
          percent: {
            topicId: "percent",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [{ topicId: "percent", passed: true, score: 100, attemptDate: new Date().toISOString() }]
          },
          algebra: {
            topicId: "algebra",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [{ topicId: "algebra", passed: true, score: 100, attemptDate: new Date().toISOString() }]
          },
          plsv: {
            topicId: "plsv",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [{ topicId: "plsv", passed: true, score: 100, attemptDate: new Date().toISOString() }]
          }
        }
      }));
    });

    await page.reload({ waitUntil: 'networkidle' });

    // Verify mastered status
    await expect(page.locator('text=5 / 5 Topik Dikuasai')).toBeVisible();
    await expect(page.locator('text=100%').first()).toBeVisible();
    await expect(page.locator('text=Rantai MVP selesai')).toBeVisible();
    await expect(page.locator('text=Rantai fondasi pertama sudah selesai.')).toBeVisible();

    await page.close();
  });
});
