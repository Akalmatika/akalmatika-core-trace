import { test, expect } from '@playwright/test';

test.describe('Sprint 3 Algebra Audit Test', () => {
  test('Seed integer and fractions mastered, complete algebra drill, complete algebra mastery, and verify map unlock', async ({ page }) => {
    // 1. Pergi ke halaman learning-map dan seed integer & fractions sebagai mastered
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
          }
        }
      }));
    });

    // Reload untuk membaca seeding
    await page.reload({ waitUntil: 'networkidle' });

    // 2. Pastikan algebra available (Mulai Ujian 🎯)
    const algebraNode = page.locator('div').filter({ has: page.locator('h3:has-text("Aljabar")') }).first();
    await expect(algebraNode).toContainText('Mulai Ujian 🎯');

    // 3. Pergi ke halaman drill algebra
    await page.goto('http://localhost:3000/student/drill/algebra', { waitUntil: 'networkidle' });

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

    // Q1: 4a + a = 5a
    await page.locator('.grid button').filter({ hasText: /^(5a)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 5m - 2m = 3m
    await expect(page.locator('text=Contoh Terbimbing 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(3m)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 3p + 2q + p = 4p + 2q
    await expect(page.locator('text=Contoh Terbimbing 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(4p\s*\+\s*2q)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // --- FASE 3: Independent Practice ---
    // Q1: 7x + 2x = 9x
    await expect(page.locator('text=Latihan Mandiri 1 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(9x)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 5x + 4y
    await expect(page.locator('text=Latihan Mandiri 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(5x\s*\+\s*4y)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 6a - a = 5a
    await expect(page.locator('text=Latihan Mandiri 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(5a)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: suku sejenis/tidak sejenis
    await expect(page.locator('text=Latihan Mandiri 4 dari')).toBeVisible();
    await page.locator('.grid button:has-text("Suku sejenis memiliki variabel dan pangkat yang sama")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: 2x + 5y + 3x = 5x + 5y
    await expect(page.locator('text=Latihan Mandiri 5 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(5x\s*\+\s*5y)+$/ }).click({ force: true });
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan hasil latihan mandiri sukses
    await expect(page.locator('text=Luar Biasa! Latihan Selesai')).toBeVisible();

    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("DRILL PROGRESS STORAGE (ALGEBRA):", JSON.stringify(progress.topics.algebra.drillProgress, null, 2));

    expect(progress.topics.algebra.drillProgress.phase1Completed).toBe(true);
    expect(progress.topics.algebra.drillProgress.phase2Accuracy).toBe(100);
    expect(progress.topics.algebra.drillProgress.phase3Accuracy).toBe(100);

    // --- MASTERY CHECK ---
    const startMasteryBtn = page.locator('button:has-text("Lanjut ke Mastery Check")');
    await expect(startMasteryBtn).toBeVisible();
    await startMasteryBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/mastery/algebra');
    await expect(page.locator('text=Mastery Check: Aljabar Dasar')).toBeVisible();

    // Q1: 8x + 2y - 3x + y = 5x + 3y
    await expect(page.locator('text=Pertanyaan 1/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^5x \+ 3y$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: Budi kelereng = 5x + 2y kotak
    await expect(page.locator('text=Pertanyaan 2/')).toBeVisible();
    await page.locator('button:has-text("5x + 2y kotak")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: y + y + y + x = 3y + x
    await expect(page.locator('text=Pertanyaan 3/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^3y \+ x$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: Tidak dapat disederhanakan = 2a + 3b
    await expect(page.locator('text=Pertanyaan 4/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^2a \+ 3b$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: buku dan pensil = 7p + 4q
    await expect(page.locator('text=Pertanyaan 5/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^7p \+ 4q$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi kelulusan
    await expect(page.locator('text=Aljabar Dasar Berhasil Dikuasai!')).toBeVisible();

    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("MASTERY RESULTS STORAGE (ALGEBRA):", JSON.stringify(progress2.topics.algebra.masteryResults, null, 2));

    expect(progress2.topics.algebra.masteryResults).toHaveLength(1);
    expect(progress2.topics.algebra.masteryResults[0].passed).toBe(true);

    // --- PETA BELAJAR MAP CHECK ---
    const goToMapBtn = page.locator('button:has-text("Lihat Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // Aljabar harus Selesai ✓
    const checkedAlgebraNode = page.locator('div').filter({ has: page.locator('h3:has-text("Aljabar")') }).first();
    await expect(checkedAlgebraNode).toContainText('Selesai ✓');

    // PLSV (plsv) prasyaratnya adalah Aljabar. Karena Aljabar sudah Selesai, PLSV harus available (Mulai Ujian 🎯)
    const checkedPlsvNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persamaan Linear (PLSV)")') }).first();
    await expect(checkedPlsvNode).toContainText('Mulai Ujian 🎯');

    console.log("AUDIT SPRINT 3 ALGEBRA PILOT BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
