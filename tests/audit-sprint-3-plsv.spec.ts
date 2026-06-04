import { test, expect } from '@playwright/test';

test.describe('Sprint 3 PLSV Audit Test', () => {
  test('Seed prerequisite topics, complete PLSV drill, complete PLSV mastery, and verify map mastered status', async ({ page }) => {
    // 1. Pergi ke halaman learning-map dan seed integer, fractions, & algebra sebagai mastered
    await page.goto('http://localhost:3000/student/learning-map', { waitUntil: 'commit' });
    await page.evaluate(() => {
      localStorage.setItem('akalmatika_progress', JSON.stringify({
        topics: {
          integer: {
            topicId: "integer",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [
              {
                topicId: "integer",
                passed: true,
                score: 100,
                attemptDate: new Date().toISOString()
              }
            ]
          },
          fractions: {
            topicId: "fractions",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [
              {
                topicId: "fractions",
                passed: true,
                score: 100,
                attemptDate: new Date().toISOString()
              }
            ]
          },
          algebra: {
            topicId: "algebra",
            masteryLevel: "mastered",
            diagnosticResults: [],
            bridgeVisits: [],
            drillProgress: null,
            masteryResults: [
              {
                topicId: "algebra",
                passed: true,
                score: 100,
                attemptDate: new Date().toISOString()
              }
            ]
          }
        }
      }));
    });

    // Reload untuk membaca seeding
    await page.reload({ waitUntil: 'networkidle' });

    // 2. Pastikan PLSV available (Mulai Ujian 🎯)
    const plsvNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persamaan Linear (PLSV)")') }).first();
    await expect(plsvNode).toContainText('Mulai Ujian 🎯');

    // 3. Pergi ke halaman drill PLSV
    await page.goto('http://localhost:3000/student/drill/plsv', { waitUntil: 'networkidle' });

    // --- FASE 1: Worked Examples ---
    await expect(page.locator('text=Contoh Detail 1 dari')).toBeVisible();
    
    // Klik Contoh Berikutnya
    const nextBtn1 = page.locator('button:has-text("Contoh Berikutnya")');
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(200);

    await expect(page.locator('text=Contoh Detail 2 dari')).toBeVisible();

    // Klik Lanjut ke Contoh Terbimbing
    const startP2Btn = page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")');
    await expect(startP2Btn).toBeVisible();
    await startP2Btn.click({ force: true });
    await page.waitForTimeout(300);

    // --- FASE 2: Guided Practice ---
    await expect(page.locator('text=Contoh Terbimbing 1 dari')).toBeVisible();

    // Q1: x - 5 = 2 -> x = 7
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*7)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: x/3 = 4 -> x = 12
    await expect(page.locator('text=Contoh Terbimbing 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*12)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 3x + 2 = 11 -> x = 3
    await expect(page.locator('text=Contoh Terbimbing 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*3)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // --- FASE 3: Independent Practice ---
    // Q1: x + 8 = 15 -> x = 7
    await expect(page.locator('text=Latihan Mandiri 1 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*7)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 4x = 24 -> x = 6
    await expect(page.locator('text=Latihan Mandiri 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: x - 9 = -3 -> x = 6
    await expect(page.locator('text=Latihan Mandiri 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: keseimbangan kedua ruas
    await expect(page.locator('text=Latihan Mandiri 4 dari')).toBeVisible();
    await page.locator('.grid button:has-text("Agar nilai persamaan tetap seimbang dan setara")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: 2x - 5 = 7 -> x = 6
    await expect(page.locator('text=Latihan Mandiri 5 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan hasil latihan mandiri sukses
    await expect(page.locator('text=Luar Biasa! Latihan Selesai')).toBeVisible();

    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("DRILL PROGRESS STORAGE (PLSV):", JSON.stringify(progress.topics.plsv.drillProgress, null, 2));

    expect(progress.topics.plsv.drillProgress.phase1Completed).toBe(true);
    expect(progress.topics.plsv.drillProgress.phase2Accuracy).toBe(100);
    expect(progress.topics.plsv.drillProgress.phase3Accuracy).toBe(100);

    // --- MASTERY CHECK ---
    const startMasteryBtn = page.locator('button:has-text("Lanjut ke Mastery Check")');
    await expect(startMasteryBtn).toBeVisible();
    await startMasteryBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/mastery/plsv');
    await expect(page.locator('text=Mastery Check: Persamaan Linear (PLSV)')).toBeVisible();

    // Q1: x + 6 = -2 -> x = -8
    await expect(page.locator('text=Pertanyaan 1/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*[-−\u2212]8$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: x/5 = 7 -> x = 35
    await expect(page.locator('text=Pertanyaan 2/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*35$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 2x + 7 = 19 -> x = 6
    await expect(page.locator('text=Pertanyaan 3/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*6$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: 5x = 4 + 3x -> x = 2
    await expect(page.locator('text=Pertanyaan 4/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*2$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: 3x + 4 = 16 -> 4 permen
    await expect(page.locator('text=Pertanyaan 5/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^4 permen$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi kelulusan
    await expect(page.locator('text=Persamaan Linear (PLSV) Berhasil Dikuasai!')).toBeVisible();

    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("MASTERY RESULTS STORAGE (PLSV):", JSON.stringify(progress2.topics.plsv.masteryResults, null, 2));

    expect(progress2.topics.plsv.masteryResults).toHaveLength(1);
    expect(progress2.topics.plsv.masteryResults[0].passed).toBe(true);

    // --- PETA BELAJAR MAP CHECK ---
    const goToMapBtn = page.locator('button:has-text("Lihat Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // PLSV harus Selesai ✓
    const checkedPlsvNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persamaan Linear (PLSV)")') }).first();
    await expect(checkedPlsvNode).toContainText('Selesai ✓');

    console.log("AUDIT SPRINT 3 PLSV EXPANSION BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
