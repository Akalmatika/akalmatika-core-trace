import { test, expect } from '@playwright/test';

test.describe('Sprint 3 Integer Audit Test', () => {
  test('Complete integer drill, complete integer mastery, and verify map unlock', async ({ page }) => {
    // 1. Pergi ke halaman learning-map
    await page.goto('http://localhost:3000/student/learning-map', { waitUntil: 'networkidle' });

    // Pastikan integer available (Mulai Ujian 🎯)
    const integerNode = page.locator('div').filter({ has: page.locator('h3:has-text("Bilangan Bulat")') }).first();
    await expect(integerNode).toContainText('Mulai Ujian 🎯');

    // 2. Pergi ke halaman drill integer
    await page.goto('http://localhost:3000/student/drill/integer', { waitUntil: 'networkidle' });

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

    // Q1: -7 + 3 = -4
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]4/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: 5 + (-2) = 3
    await expect(page.locator('text=Contoh Terbimbing 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(3)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: -6 + 6 = 0
    await expect(page.locator('text=Contoh Terbimbing 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^(0)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // --- FASE 3: Independent Practice ---
    // Q1: -4 + (-3) = -7
    await expect(page.locator('text=Latihan Mandiri 1 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]7/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: -9 + 5 = -4
    await expect(page.locator('text=Latihan Mandiri 2 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]4/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: 8 + (-10) = -2
    await expect(page.locator('text=Latihan Mandiri 3 dari')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]2/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: zero pair definition = Menjumlahkan suatu bilangan bulat dengan lawan negatif/positifnya menghasilkan nol
    await expect(page.locator('text=Latihan Mandiri 4 dari')).toBeVisible();
    await page.locator('.grid button:has-text("Menjumlahkan suatu bilangan bulat dengan lawan negatif/positifnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: -3 + (-2) = Bergerak ke kiri sebanyak 2 langkah dan mendarat di -5
    await expect(page.locator('text=Latihan Mandiri 5 dari')).toBeVisible();
    await page.locator('.grid button:has-text("Bergerak ke kiri sebanyak 2 langkah dan mendarat di -5")').click({ force: true });
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan hasil latihan mandiri sukses
    await expect(page.locator('text=Luar Biasa! Latihan Selesai')).toBeVisible();

    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("DRILL PROGRESS STORAGE (INTEGER):", JSON.stringify(progress.topics.integer.drillProgress, null, 2));

    expect(progress.topics.integer.drillProgress.phase1Completed).toBe(true);
    expect(progress.topics.integer.drillProgress.phase2Accuracy).toBe(100);
    expect(progress.topics.integer.drillProgress.phase3Accuracy).toBe(100);

    // --- MASTERY CHECK ---
    const startMasteryBtn = page.locator('button:has-text("Lanjut ke Mastery Check")');
    await expect(startMasteryBtn).toBeVisible();
    await startMasteryBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/mastery/integer');
    await expect(page.locator('text=Mastery Check: Bilangan Bulat')).toBeVisible();

    // Q1: -12 + 15 = 3
    await expect(page.locator('text=Pertanyaan 1/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^3$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q2: suhu -3 + 8 = 5 derajat Celcius
    await expect(page.locator('text=Pertanyaan 2/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^5 derajat Celcius$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q3: saldo 50rb - 70rb + 30rb = Rp10.000
    await expect(page.locator('text=Pertanyaan 3/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^Rp10\.000$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q4: kapal selam -15 + (-10) = -25 meter
    await expect(page.locator('text=Pertanyaan 4/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^-25 meter$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);

    // Q5: (-10) + 10 + (-4) = -4
    await expect(page.locator('text=Pertanyaan 5/')).toBeVisible();
    await page.locator('.grid button').filter({ hasText: /^-4$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi kelulusan
    await expect(page.locator('text=Bilangan Bulat Berhasil Dikuasai!')).toBeVisible();

    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("MASTERY RESULTS STORAGE (INTEGER):", JSON.stringify(progress2.topics.integer.masteryResults, null, 2));

    expect(progress2.topics.integer.masteryResults).toHaveLength(1);
    expect(progress2.topics.integer.masteryResults[0].passed).toBe(true);

    // --- PETA BELAJAR MAP CHECK ---
    const goToMapBtn = page.locator('button:has-text("Lihat Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // Bilangan Bulat harus Selesai ✓
    const checkedIntegerNode = page.locator('div').filter({ has: page.locator('h3:has-text("Bilangan Bulat")') }).first();
    await expect(checkedIntegerNode).toContainText('Selesai ✓');

    // Pecahan (fractions) prasyaratnya adalah Bilangan Bulat. Karena Bilangan Bulat sudah Selesai, Pecahan harus available (Mulai Ujian 🎯 atau Sedang Dipelajari)
    const checkedFractionsNode = page.locator('div').filter({ has: page.locator('h3:has-text("Pecahan")') }).first();
    const fractionsText = await checkedFractionsNode.textContent();
    expect(fractionsText).toMatch(/Mulai Ujian 🎯|Sedang Dipelajari ⏳/);

    console.log("AUDIT SPRINT 3 INTEGER PILOT BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
