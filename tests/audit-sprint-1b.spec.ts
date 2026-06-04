import { test, expect } from '@playwright/test';

test.describe('Sprint 1B Audit Test', () => {
  test('Execute diagnostic foundation, verify lock/prereq logic on learning-map, and check routes', async ({ page }) => {
    // 1. Pergi ke halaman diagnosis fondasi
    await page.goto('http://localhost:3000/student/diagnostic-foundation', { waitUntil: 'networkidle' });

    // Klik tombol Mulai Ujian (gunakan locator spesifik tombol)
    const startButton = page.locator('button:has-text("Mulai Diagnosis")');
    await expect(startButton).toBeVisible();
    await startButton.click({ force: true });
    await page.waitForTimeout(200);

    // 2. Kerjakan 10 soal dengan memilih opsi indeks 1 (memicu semua miskonsepsi)
    for (let i = 1; i <= 10; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }

    // Tunggu hasil diagnosis fondasi muncul
    const resultTitle = page.locator('text=Peta Kelemahan Fondasimu');
    await expect(resultTitle).toBeVisible();

    // 3. Ambil data progress dari localStorage dan pastikan terisi untuk 5 topicId
    const progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    const progress = JSON.parse(progressDataStr!);
    console.log("PROGRESS STORED FROM FOUNDATION TEST:", JSON.stringify(progress, null, 2));

    const expectedTopics = ['integer', 'fractions', 'percent', 'algebra', 'plsv'];
    for (const t of expectedTopics) {
      expect(progress.topics[t]).toBeDefined();
      expect(progress.topics[t].diagnosticResults).toHaveLength(1);
      expect(progress.topics[t].diagnosticResults[0].isPerfectTrack).toBe(false);
      expect(progress.topics[t].diagnosticResults[0].detectedMisconceptionCode).not.toBeNull();
    }

    // 4. Buka /student/learning-map
    await page.goto('http://localhost:3000/student/learning-map', { waitUntil: 'networkidle' });

    // Periksa status node:
    // - integer: 'in-progress' (karena ada diagnosis tapi belum ada mastery result)
    // - fractions: 'locked' (karena integer belum mastered)
    // - percent: 'locked' (karena fractions belum mastered)
    // - algebra: 'locked' (karena integer & fractions belum mastered)
    // - plsv: 'locked' (karena algebra belum mastered)
    
    // Cari teks status badge
    const inProgressBadge = page.locator('text=Sedang Dipelajari');
    await expect(inProgressBadge).toBeVisible();

    const lockedBadges = page.locator('text=Terkunci');
    // Ada 4 node yang terkunci
    const lockedCount = await lockedBadges.count();
    console.log("JUMLAH NODE TERKUNCI:", lockedCount);
    expect(lockedCount).toBe(4);

    // 5. Klik pada salah satu node terkunci (misal: Pecahan) dan pastikan muncul toast/alert prasyarat
    const pecahanCard = page.locator('text=Pecahan').first();
    await pecahanCard.click({ force: true });
    await page.waitForTimeout(200);

    const toast = page.locator('text=Selesaikan prasyarat:');
    await expect(toast).toBeVisible();
    console.log("TOAST PRASYARAT MUNCUL:", await toast.textContent());

    // Tutup toast
    const closeToastBtn = page.locator('button:has(svg)').first();
    if (await closeToastBtn.isVisible()) {
      await closeToastBtn.click({ force: true });
    }

    // 6. Klik node yang tersedia (integer) dan pastikan berpindah ke route diagnosis integer
    const integerCard = page.locator('text=Bilangan Bulat').first();
    await integerCard.click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan berada di halaman /student/diagnostic/integer
    expect(page.url()).toContain('/student/diagnostic/integer');

    // 7. Periksa route lama
    const oldRoutes = [
      'http://localhost:3000/',
      'http://localhost:3000/student/diagnostic',
      'http://localhost:3000/student/visualizations'
    ];

    for (const r of oldRoutes) {
      console.log(`Mengetes route: ${r}`);
      const response = await page.goto(r, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await page.waitForTimeout(200);
    }

    console.log("AUDIT SPRINT 1B BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
