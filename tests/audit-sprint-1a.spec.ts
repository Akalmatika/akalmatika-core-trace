import { test, expect } from '@playwright/test';

test.describe('Sprint 1A Audit Test', () => {
  test('Complete diagnosis, verify progressStorage localStorage, and check all old routes', async ({ page }) => {
    // 1. Pergi ke halaman diagnosis fractions
    await page.goto('http://localhost:3000/student/diagnostic/fractions', { waitUntil: 'networkidle' });
    
    // Klik tombol Mulai Analisis (gunakan force karena tombol memantul/bouncing)
    const startButton = page.locator('text=Mulai Analisis');
    await expect(startButton).toBeVisible();
    await startButton.click({ force: true });
    await page.waitForTimeout(200);

    // 2. Kerjakan diagnosis. Kita klik pilihan indeks 1 (miskonsepsi MC-FRAC-ADD-NUM-DENOM) untuk 5 soal.
    for (let i = 1; i <= 5; i++) {
      // Tunggu hingga tombol opsi muncul
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }

    // Tunggu sampai layar hasil diagnosis muncul
    const resultTitle = page.locator('text=Tantangan Konsep:');
    await expect(resultTitle).toBeVisible();

    // 3. Ambil data dari localStorage
    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    
    let progress = JSON.parse(progressDataStr!);
    console.log("STRUKTUR DATA LOCALSTORAGE (SETELAH TES 1):", JSON.stringify(progress, null, 2));

    // 4. Pastikan hanya ada key 'akalmatika_progress' di localStorage
    const keys = await page.evaluate(() => Object.keys(localStorage));
    console.log("SEMUA KEYS DI LOCALSTORAGE:", keys);
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe('akalmatika_progress');

    // 5. Pastikan struktur data sesuai kontrak dan topicId konsisten memakai ID internal 'fractions'
    expect(progress.topics).toBeDefined();
    expect(progress.topics.fractions).toBeDefined();
    expect(progress.topics['bilangan-bulat']).toBeUndefined(); // ID Indo tidak boleh jadi key utama
    expect(progress.topics['pecahan']).toBeUndefined(); // ID Indo tidak boleh jadi key utama
    
    const topicData = progress.topics.fractions;
    expect(topicData.topicId).toBe('fractions');
    expect(topicData.masteryLevel).toBe('diagnosed');
    expect(topicData.diagnosticResults).toHaveLength(1);
    
    const firstResult = topicData.diagnosticResults[0];
    expect(firstResult.topicId).toBe('fractions');
    expect(firstResult.isPerfectTrack).toBe(false);
    expect(firstResult.detectedMisconceptionCode).toBe('MC-FRAC-ADD-NUM-DENOM');
    expect(firstResult.answers).toEqual(['\\frac{2}{6}', '\\frac{3}{6}', '\\frac{2}{7}', '\\frac{2}{0}', '\\frac{0}{-1}']);

    // 6. Refresh browser dan pastikan data tetap ada
    await page.reload({ waitUntil: 'networkidle' });
    let progressDataStrAfterReload = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStrAfterReload).toBe(progressDataStr);

    // 7. Kerjakan diagnosis yang sama lagi (kali ini sempurna / perfect track)
    // Pergi ke /student/diagnostic/fractions lagi
    await page.goto('http://localhost:3000/student/diagnostic/fractions', { waitUntil: 'networkidle' });
    await page.locator('text=Mulai Analisis').click({ force: true });
    await page.waitForTimeout(200);

    for (let i = 1; i <= 5; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(0).click({ force: true }); // Indeks 0 adalah jawaban benar
      await page.waitForTimeout(250);
    }

    // Tunggu sampai layar hasil diagnosis sempurna muncul
    const perfectTitle = page.locator('text=Selamat, Detektif Hebat!');
    await expect(perfectTitle).toBeVisible();

    // Cek localStorage lagi. Harus ada 2 diagnosticResults
    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("JUMLAH HASIL DIAGNOSIS SEKARANG:", progress2.topics.fractions.diagnosticResults.length);
    expect(progress2.topics.fractions.diagnosticResults).toHaveLength(2);
    expect(progress2.topics.fractions.diagnosticResults[1].isPerfectTrack).toBe(true);

    // 8. Cek semua route lama untuk memastikan tidak ada regresi/crash
    const routesToTest = [
      'http://localhost:3000/',
      'http://localhost:3000/student/diagnostic',
      'http://localhost:3000/student/diagnostic/integer',
      'http://localhost:3000/student/visualizations',
      'http://localhost:3000/student/visualizations/integer'
    ];

    for (const r of routesToTest) {
      console.log(`Mengetes route: ${r}`);
      const response = await page.goto(r, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await page.waitForTimeout(200);
    }

    console.log("AUDIT BERILAKU SPRINT 1A BERHASIL PENUH!");
  });
});
