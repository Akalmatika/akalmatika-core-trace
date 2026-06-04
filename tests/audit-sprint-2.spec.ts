import { test, expect } from '@playwright/test';

test.describe('Sprint 2 Audit Test', () => {
  test('Complete diagnosis, navigate to Bridge page, verify 7 parts, and verify visualization redirect', async ({ page }) => {
    // 1. Pergi ke halaman diagnosis fractions
    await page.goto('http://localhost:3000/student/diagnostic/fractions', { waitUntil: 'networkidle' });

    // Klik tombol Mulai Analisis (gunakan locator spesifik tombol)
    const startButton = page.locator('button:has-text("Mulai Analisis")');
    await expect(startButton).toBeVisible();
    await startButton.click({ force: true });
    await page.waitForTimeout(200);

    // 2. Kerjakan 5 soal pecahan dengan memilih opsi indeks 1 (memicu miskonsepsi MC-FRAC-ADD-NUM-DENOM)
    for (let i = 1; i <= 5; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }

    // Tunggu hasil diagnosis muncul
    const resultTitle = page.locator('text=Tantangan Konsep:');
    await expect(resultTitle).toBeVisible();

    // 3. Pastikan tombol hasil diagnosis mengarah ke Jembatan Konsep dengan microcopy yang tepat
    const bridgeCTA = page.locator('button:has-text("Ke Jembatan Konsep")');
    await expect(bridgeCTA).toBeVisible();
    await bridgeCTA.click({ force: true });
    await page.waitForTimeout(500);

    // Pastikan diarahkan ke Bridge Page
    expect(page.url()).toContain('/student/bridge/fractions/MC-FRAC-ADD-NUM-DENOM');

    // 4. Verifikasi bahwa Bridge Page menampilkan ke-7 bagian
    await expect(page.locator('text=1. Pola Jawaban Terdeteksi')).toBeVisible();
    await expect(page.locator('text=2. Mengapa Ini Alami?')).toBeVisible();
    await expect(page.locator('text=3. Makna Konsep Sebenarnya')).toBeVisible();
    await expect(page.locator('text=4. Ilustrasi Konkret')).toBeVisible();
    await expect(page.locator('text=5. Renungkan Pertanyaan Ini')).toBeVisible();
    
    const vizBtn = page.locator('button:has-text("Ke Media Visualisasi")');
    const drillBtn = page.locator('button:has-text("Mulai Latihan (Drill)")');
    await expect(vizBtn).toBeVisible();
    await expect(drillBtn).toBeVisible();
    
    // Pastikan tombol drill diaktifkan (enabled) untuk topik pecahan di Sprint 3
    const isDrillDisabled = await drillBtn.isDisabled();
    expect(isDrillDisabled).toBe(false);

    // 5. Pastikan bridge visit tersimpan di localStorage akalmatika_progress dengan completedVisualization = false dan visualizationOpened = false
    let progressDataStr = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    expect(progressDataStr).not.toBeNull();
    let progress = JSON.parse(progressDataStr!);
    console.log("BRIDGE VISITS DATA (INITIAL):", JSON.stringify(progress.topics.fractions.bridgeVisits, null, 2));

    expect(progress.topics.fractions.bridgeVisits).toHaveLength(1);
    expect(progress.topics.fractions.bridgeVisits[0].misconceptionCode).toBe('MC-FRAC-ADD-NUM-DENOM');
    expect(progress.topics.fractions.bridgeVisits[0].completedVisualization).toBe(false);
    expect(progress.topics.fractions.bridgeVisits[0].visualizationOpened).toBe(false);

    // 6. Klik tombol "Ke Media Visualisasi" dan pastikan terarah ke route visualisasi pecahan
    await vizBtn.click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/visualizations/fractions');

    // 7. Periksa bahwa data progress terupdate dengan completedVisualization = false dan visualizationOpened = true
    let progressDataStr2 = await page.evaluate(() => localStorage.getItem('akalmatika_progress'));
    let progress2 = JSON.parse(progressDataStr2!);
    console.log("BRIDGE VISITS DATA (AFTER VIZ CLICK):", JSON.stringify(progress2.topics.fractions.bridgeVisits, null, 2));
    
    expect(progress2.topics.fractions.bridgeVisits[0].completedVisualization).toBe(false);
    expect(progress2.topics.fractions.bridgeVisits[0].visualizationOpened).toBe(true);

    // 8. Cek rute lama tetap sehat
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

    console.log("AUDIT SPRINT 2 BERHASIL SEPENUHNYA!");
    await page.close();
  });
});
