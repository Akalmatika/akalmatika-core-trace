import { test, expect } from '@playwright/test';

test.describe('Sprint 3 Fractions Pilot Audit Test', () => {
  test('Complete drill phases, complete mastery check, and verify learning map update', async ({ page }) => {
    // 1. Pergi ke halaman drill fractions
    await page.goto('http://localhost:3000/student/drill/fractions', { waitUntil: 'networkidle' });

    // --- FASE 1: Worked Examples ---
    // Pastikan di Fase 1
    await expect(page.locator('text=Contoh Detail 1 dari')).toBeVisible();
    
    // Klik Contoh Berikutnya
    const nextBtn1 = page.locator('button:has-text("Contoh Berikutnya")');
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(200);

    await expect(page.locator('text=Contoh Detail 2 dari')).toBeVisible();

    // Klik Saya Paham, Lanjut ke Contoh Terbimbing
    const startP2Btn = page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")');
    await expect(startP2Btn).toBeVisible();
    await startP2Btn.click({ force: true });
    await page.waitForTimeout(300);

    // --- FASE 2: Guided Practice ---
    await expect(page.locator('text=Contoh Terbimbing 1 dari')).toBeVisible();

    // Pertanyaan 1: 1/3 + 1/4 = 7/12
    await page.locator('.grid button:has-text("7/12")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 2: 1/2 + 1/6 = 4/6
    await expect(page.locator('text=Contoh Terbimbing 2 dari')).toBeVisible();
    await page.locator('.grid button:has-text("4/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 3: 2/5 + 1/10 = 5/10
    await expect(page.locator('text=Contoh Terbimbing 3 dari')).toBeVisible();
    await page.locator('.grid button:has-text("5/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // --- FASE 3: Independent Practice ---
    // Pertanyaan 1: 1/5 + 1/2 = 7/10
    await expect(page.locator('text=Latihan Mandiri 1 dari')).toBeVisible();
    await page.locator('.grid button:has-text("7/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 2: 2/3 + 1/6 = 5/6
    await expect(page.locator('text=Latihan Mandiri 2 dari')).toBeVisible();
    await page.locator('.grid button:has-text("5/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 3: 3/4 + 1/12 = 10/12
    await expect(page.locator('text=Latihan Mandiri 3 dari')).toBeVisible();
    await page.locator('.grid button:has-text("10/12")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 4: 1/3 + 2/9 = 5/9
    await expect(page.locator('text=Latihan Mandiri 4 dari')).toBeVisible();
    await page.locator('.grid button:has-text("5/9")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Pertanyaan 5: 2/5 + 1/3 = 11/15
    await expect(page.locator('text=Latihan Mandiri 5 dari')).toBeVisible();
    await page.locator('.grid button:has-text("11/15")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan hasil latihan lolos dan progressStorage terupdate
    await expect(page.locator('text=Luar Biasa! Latihan Selesai')).toBeVisible();
    
    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("DRILL PROGRESS STORAGE:", JSON.stringify(progress.topics.fractions.drillProgress, null, 2));

    expect(progress.topics.fractions.drillProgress.phase1Completed).toBe(true);
    expect(progress.topics.fractions.drillProgress.phase2Accuracy).toBe(100);
    expect(progress.topics.fractions.drillProgress.phase3Accuracy).toBe(100);

    // --- MASTERY CHECK ---
    // Klik Lanjut ke Mastery Check
    const startMasteryBtn = page.locator('button:has-text("Lanjut ke Mastery Check")');
    await expect(startMasteryBtn).toBeVisible();
    await startMasteryBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/mastery/fractions');
    await expect(page.locator('text=Mastery Check: Pecahan')).toBeVisible();

    // Jawab 5 soal mastery dengan benar
    // Q1: 1/3 + 1/2 = 5/6
    await expect(page.locator('text=Pertanyaan 1/')).toBeVisible();
    await page.locator('button:has-text("5/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: arti dari angka 4 = Ukuran atau jumlah total
    await expect(page.locator('text=Pertanyaan 2/')).toBeVisible();
    await page.locator('button:has-text("Ukuran atau jumlah total")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: senilai dengan 2/3 = 6/9
    await expect(page.locator('text=Pertanyaan 3/')).toBeVisible();
    await page.locator('button:has-text("6/9")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: 1/4 + 1/2 = 3/4 bagian
    await expect(page.locator('text=Pertanyaan 4/')).toBeVisible();
    await page.locator('button:has-text("3/4 bagian")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: 3/5 + 2/10 = 8/10
    await expect(page.locator('text=Pertanyaan 5/')).toBeVisible();
    await page.locator('button:has-text("8/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi kelulusan mastery check
    await expect(page.locator('text=Pecahan Berhasil Dikuasai!')).toBeVisible();

    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("MASTERY RESULTS STORAGE:", JSON.stringify(progress2.topics.fractions.masteryResults, null, 2));

    expect(progress2.topics.fractions.masteryResults).toHaveLength(1);
    expect(progress2.topics.fractions.masteryResults[0].passed).toBe(true);
    expect(progress2.topics.fractions.masteryResults[0].score).toBe(100);

    // --- PETA BELAJAR MAP CHECK ---
    // Klik Lihat Peta Belajar
    const goToMapBtn = page.locator('button:has-text("Lihat Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // Pecahan harus Selesai ✓
    const fractionsNode = page.locator('div').filter({ has: page.locator('h3:has-text("Pecahan")') }).first();
    await expect(fractionsNode).toContainText('Selesai ✓');

    // Persen harus Unlocked (Mulai Ujian 🎯)
    const percentNode = page.locator('div').filter({ has: page.locator('h3:has-text("Persen")') }).first();
    await expect(percentNode).toContainText('Mulai Ujian 🎯');

    console.log("AUDIT SPRINT 3 FRAC PILOT BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
