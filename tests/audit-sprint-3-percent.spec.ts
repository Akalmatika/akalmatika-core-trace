import { test, expect } from '@playwright/test';

test.describe('Sprint 3 Percent Audit Test', () => {
  test('Seed fractions mastered, complete percent drill, complete percent mastery, and verify map unlock', async ({ page }) => {
    // 1. Pergi ke halaman learning-map dan seed fractions sebagai mastered
    await page.goto('http://localhost:3000/student/learning-map', { waitUntil: 'commit' });
    await page.evaluate(() => {
      localStorage.setItem('akalmatika_progress', JSON.stringify({
        topics: {
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
          }
        }
      }));
    });

    // Reload untuk membaca seeding
    await page.reload({ waitUntil: 'networkidle' });

    // 2. Pastikan percent available (Mulai Ujian 🎯)
    const percentNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persen")') }).first();
    await expect(percentNode).toContainText('Mulai Ujian 🎯');

    // 3. Pergi ke halaman drill percent
    await page.goto('http://localhost:3000/student/drill/percent', { waitUntil: 'networkidle' });

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

    // Q1: 50% = 0.5 dan 1/2
    await page.locator('.grid button:has-text("0.5 dan 1/2")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 10% dari 200 = 20
    await expect(page.locator('text=Contoh Terbimbing 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(20)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 25% dari 80 = 20
    await expect(page.locator('text=Contoh Terbimbing 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(20)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // --- FASE 3: Independent Practice ---
    // Q1: 75% = 3/4
    await expect(page.locator('text=Latihan Mandiri 1 dari')).toBeVisible();
    await page.locator('.grid button:has-text("3/4")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 5% = 0.05
    await expect(page.locator('text=Latihan Mandiri 2 dari')).toBeVisible();
    await page.locator('.grid button:has-text("0.05")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 20% dari 150 = 30
    await expect(page.locator('text=Latihan Mandiri 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(30)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: diskon 10% dari 100rb = Rp10.000
    await expect(page.locator('text=Latihan Mandiri 4 dari')).toBeVisible();
    await page.locator('.grid button:has-text("Rp10.000")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: perbedaan 5 dan 5% = 5% bernilai 100 kali lebih kecil
    await expect(page.locator('text=Latihan Mandiri 5 dari')).toBeVisible();
    await page.locator('.grid button:has-text("5% bernilai 100 kali lebih kecil")').click({ force: true });
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan hasil latihan mandiri sukses
    await expect(page.locator('text=Luar Biasa! Latihan Selesai')).toBeVisible();

    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("DRILL PROGRESS STORAGE (PERCENT):", JSON.stringify(progress.topics.percent.drillProgress, null, 2));

    expect(progress.topics.percent.drillProgress.phase1Completed).toBe(true);
    expect(progress.topics.percent.drillProgress.phase2Accuracy).toBe(100);
    expect(progress.topics.percent.drillProgress.phase3Accuracy).toBe(100);

    // --- MASTERY CHECK ---
    const startMasteryBtn = page.locator('button:has-text("Lanjut ke Mastery Check")');
    await expect(startMasteryBtn).toBeVisible();
    await startMasteryBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/mastery/percent');
    await expect(page.locator('text=Mastery Check: Persen')).toBeVisible();

    // Q1: arti % = Per seratus
    await expect(page.locator('text=Pertanyaan 1/')).toBeVisible();
    await page.locator('button:has-text("Per seratus")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 40% = 2/5
    await expect(page.locator('text=Pertanyaan 2/')).toBeVisible();
    await page.locator('button:has-text("2/5")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 12% = 0.12
    await expect(page.locator('text=Pertanyaan 3/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^0\.12$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: 15% dari 200 = 30
    await expect(page.locator('text=Pertanyaan 4/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^30$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: diskon 25% dari Rp120.000 = Rp30.000
    await expect(page.locator('text=Pertanyaan 5/')).toBeVisible();
    await page.locator('button:has-text("Rp30.000")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi kelulusan
    await expect(page.locator('text=Persen Berhasil Dikuasai!')).toBeVisible();

    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("MASTERY RESULTS STORAGE (PERCENT):", JSON.stringify(progress2.topics.percent.masteryResults, null, 2));

    expect(progress2.topics.percent.masteryResults).toHaveLength(1);
    expect(progress2.topics.percent.masteryResults[0].passed).toBe(true);

    // --- PETA BELAJAR MAP CHECK ---
    const goToMapBtn = page.locator('button:has-text("Lihat Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // Persen harus Selesai ✓
    const checkedPercentNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persen")') }).first();
    await expect(checkedPercentNode).toContainText('Selesai ✓');

    console.log("AUDIT SPRINT 3 PERCENT PILOT BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
