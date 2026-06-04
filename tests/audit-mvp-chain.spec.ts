import { test, expect } from '@playwright/test';

test.describe('Akalmatika MVP Chain E2E Audit Test', () => {
  test('New student completing the entire MVP chain: integer -> fractions -> percent -> algebra -> plsv', async ({ page }) => {
    test.setTimeout(120000);
    // 1. Mulai dari Landing Page
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Klik "Mulai Diagnosis Fondasi"
    const startFoundationBtn = page.locator('a:has-text("Mulai Diagnosis Fondasi")').first();
    await expect(startFoundationBtn).toBeVisible();
    await startFoundationBtn.click({ force: true });
    await page.waitForTimeout(500);
    
    expect(page.url()).toContain('/student/diagnostic-foundation');
    
    // Klik "Mulai Diagnosis"
    const startQuizBtn = page.locator('button:has-text("Mulai Diagnosis")');
    await expect(startQuizBtn).toBeVisible();
    await startQuizBtn.click({ force: true });
    await page.waitForTimeout(200);

    // Kerjakan 10 soal dengan memilih opsi indeks 1 (memicu semua miskonsepsi)
    for (let i = 1; i <= 10; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }

    // Tunggu hasil diagnosis fondasi muncul
    await expect(page.locator('text=Peta Kelemahan Fondasimu')).toBeVisible();

    // Klik "Ke Peta Belajar"
    const goToMapBtn = page.locator('button:has-text("Ke Peta Belajar")');
    await expect(goToMapBtn).toBeVisible();
    await goToMapBtn.click({ force: true });
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/student/learning-map');

    // === TOPIK 1: BILANGAN BULAT (integer) ===
    // Pergi ke Jembatan Konsep integer
    await page.goto('http://localhost:3000/student/bridge/integer/MC-ADD-SIGN-CONF', { waitUntil: 'networkidle' });
    
    // Buka visualisasi
    const vizBtnInt = page.locator('button:has-text("Ke Media Visualisasi")');
    await expect(vizBtnInt).toBeVisible();
    await vizBtnInt.click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/visualizations/integer');

    // Kembali ke bridge untuk drill
    await page.goto('http://localhost:3000/student/bridge/integer/MC-ADD-SIGN-CONF', { waitUntil: 'networkidle' });
    const drillBtnInt = page.locator('button:has-text("Mulai Latihan (Drill)")');
    await expect(drillBtnInt).toBeVisible();
    await drillBtnInt.click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/drill/integer');

    // Selesaikan drill integer
    // Fase 1: Worked Examples
    await page.locator('button:has-text("Contoh Berikutnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")').click({ force: true });
    await page.waitForTimeout(300);

    // Fase 2: Guided Practice
    // Q1: -7 + 3 = -4
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]4/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: 5 + (-2) = 3
    await page.locator('.grid button').filter({ hasText: /^(3)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: -6 + 6 = 0
    await page.locator('.grid button').filter({ hasText: /^(0)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // Fase 3: Independent Practice
    // Q1: -4 + (-3) = -7
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]7/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: -9 + 5 = -4
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]4/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: 8 + (-10) = -2
    await page.locator('.grid button').filter({ hasText: /^[-−\u2212]2/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: zero pair
    await page.locator('.grid button:has-text("Menjumlahkan suatu bilangan bulat dengan lawan negatif/positifnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: -5
    await page.locator('.grid button:has-text("Bergerak ke kiri sebanyak 2 langkah dan mendarat di -5")').click({ force: true });
    await page.waitForTimeout(250);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Selesaikan mastery check integer
    await page.locator('button:has-text("Lanjut ke Mastery Check")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/mastery/integer');

    // Q1: -12 + 15 = 3
    await page.locator('.grid button').filter({ hasText: /^3$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: -3 + 8 = 5 derajat Celcius
    await page.locator('.grid button').filter({ hasText: /^5 derajat Celcius$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: Rp10.000
    await page.locator('.grid button').filter({ hasText: /^Rp10\.000$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: -25 meter
    await page.locator('.grid button').filter({ hasText: /^-25 meter$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: -4
    await page.locator('.grid button').filter({ hasText: /^-4$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Kembali ke peta belajar
    await page.locator('button:has-text("Lihat Peta Belajar")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/learning-map');

    // === TOPIK 2: PECAHAN (fractions) ===
    // Klik Pecahan card
    await page.locator('text=Pecahan').first().click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/diagnostic/fractions');

    // Mulai Analisis
    await page.locator('button:has-text("Mulai Analisis")').click({ force: true });
    await page.waitForTimeout(200);
    // Jawab 5 soal salah
    for (let i = 1; i <= 5; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }
    // Ke Jembatan Konsep
    await page.locator('button:has-text("Ke Jembatan Konsep")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/bridge/fractions/MC-FRAC-ADD-NUM-DENOM');

    // Mulai Latihan
    await page.locator('button:has-text("Mulai Latihan (Drill)")').click({ force: true });
    await page.waitForTimeout(500);

    // Selesaikan drill pecahan
    await page.locator('button:has-text("Contoh Berikutnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")').click({ force: true });
    await page.waitForTimeout(300);

    // Fase 2
    await page.locator('.grid button:has-text("7/12")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("4/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("5/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // Fase 3
    await page.locator('.grid button:has-text("7/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("5/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("10/12")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("5/9")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("11/15")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Mastery check pecahan
    await page.locator('button:has-text("Lanjut ke Mastery Check")').click({ force: true });
    await page.waitForTimeout(500);

    // Q1: 5/6
    await page.locator('button:has-text("5/6")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: Ukuran atau jumlah total
    await page.locator('button:has-text("Ukuran atau jumlah total")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: 6/9
    await page.locator('button:has-text("6/9")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: 3/4 bagian
    await page.locator('button:has-text("3/4 bagian")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: 8/10
    await page.locator('button:has-text("8/10")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Kembali ke peta belajar
    await page.locator('button:has-text("Lihat Peta Belajar")').click({ force: true });
    await page.waitForTimeout(500);

    // === TOPIK 3: PERSEN (percent) ===
    // Klik Persen card
    await page.locator('text=Persen').first().click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/diagnostic/percent');

    // Mulai Analisis
    await page.locator('button:has-text("Mulai Analisis")').click({ force: true });
    await page.waitForTimeout(200);
    // Jawab salah
    for (let i = 1; i <= 4; i++) {
      const optionButtons = page.locator('.grid button');
      await page.waitForTimeout(150);
      await optionButtons.nth(1).click({ force: true });
      await page.waitForTimeout(250);
    }
    // Ke Jembatan Konsep
    await page.locator('button:has-text("Ke Jembatan Konsep")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/bridge/percent/MC-PERC-NO-100');

    // Mulai Latihan
    await page.locator('button:has-text("Mulai Latihan (Drill)")').click({ force: true });
    await page.waitForTimeout(500);

    // Selesaikan drill persen
    await page.locator('button:has-text("Contoh Berikutnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")').click({ force: true });
    await page.waitForTimeout(300);

    // Fase 2
    await page.locator('.grid button:has-text("0.5 dan 1/2")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(20)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(20)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // Fase 3
    await page.locator('.grid button:has-text("3/4")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("0.05")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(30)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("Rp10.000")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("5% bernilai 100 kali lebih kecil")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Mastery check persen
    await page.locator('button:has-text("Lanjut ke Mastery Check")').click({ force: true });
    await page.waitForTimeout(500);

    // Q1: Per seratus
    await page.locator('button:has-text("Per seratus")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: 2/5
    await page.locator('button:has-text("2/5")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: 0.12
    await page.locator('.grid button').filter({ hasText: /^0\.12$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: 30
    await page.locator('.grid button').filter({ hasText: /^30$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: Rp30.000
    await page.locator('button:has-text("Rp30.000")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Kembali ke peta belajar
    await page.locator('button:has-text("Lihat Peta Belajar")').click({ force: true });
    await page.waitForTimeout(500);

    // === TOPIK 4: ALJABAR (algebra) ===
    // Klik Aljabar card
    await page.locator('text=Aljabar Dasar').first().click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/diagnostic/algebra');

    // Mulai Analisis
    await page.locator('button:has-text("Mulai Analisis")').click({ force: true });
    await page.waitForTimeout(200);
    // Jawab untuk memicu MC-ALG-ADD-UNLIKE
    // Q1: 5x (index 0)
    await page.locator('.grid button').nth(0).click({ force: true });
    await page.waitForTimeout(250);
    // Q2: 3y (index 0)
    await page.locator('.grid button').nth(0).click({ force: true });
    await page.waitForTimeout(250);
    // Q3: 5xy (index 1)
    await page.locator('.grid button').nth(1).click({ force: true });
    await page.waitForTimeout(250);
    // Q4: 3x (index 0)
    await page.locator('.grid button').nth(0).click({ force: true });
    await page.waitForTimeout(250);

    // Ke Jembatan Konsep
    await page.locator('button:has-text("Ke Jembatan Konsep")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/bridge/algebra/MC-ALG-ADD-UNLIKE');

    // Mulai Latihan
    await page.locator('button:has-text("Mulai Latihan (Drill)")').click({ force: true });
    await page.waitForTimeout(500);

    // Selesaikan drill aljabar
    await page.locator('button:has-text("Contoh Berikutnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")').click({ force: true });
    await page.waitForTimeout(300);

    // Fase 2
    await page.locator('.grid button').filter({ hasText: /^(5a)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(3m)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(4p\s*\+\s*2q)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // Fase 3
    await page.locator('.grid button').filter({ hasText: /^(9x)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(5x\s*\+\s*4y)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(5a)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("Suku sejenis memiliki variabel dan pangkat yang sama")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(5x\s*\+\s*5y)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Mastery check aljabar
    await page.locator('button:has-text("Lanjut ke Mastery Check")').click({ force: true });
    await page.waitForTimeout(500);

    // Q1: 5x + 3y
    await page.locator('.grid button').filter({ hasText: /^5x \+ 3y$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: 5x + 2y kotak
    await page.locator('button:has-text("5x + 2y kotak")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: 3y + x
    await page.locator('.grid button').filter({ hasText: /^3y \+ x$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: 2a + 3b
    await page.locator('.grid button').filter({ hasText: /^2a \+ 3b$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: 7p + 4q
    await page.locator('.grid button').filter({ hasText: /^7p \+ 4q$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Kembali ke peta belajar
    await page.locator('button:has-text("Lihat Peta Belajar")').click({ force: true });
    await page.waitForTimeout(500);

    // === TOPIK 5: PERSAMAAN LINEAR (plsv) ===
    // Klik PLSV card
    await page.locator('text=Persamaan Linear (PLSV)').first().click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/diagnostic/plsv');

    // Mulai Analisis
    await page.locator('button:has-text("Mulai Analisis")').click({ force: true });
    await page.waitForTimeout(200);
    // Jawab salah untuk memicu MC-PLSV-INV-OP-CONFUSION
    // Q1: 11 (index 1)
    await page.locator('.grid button').nth(1).click({ force: true });
    await page.waitForTimeout(250);
    // Q2: 2 (index 1)
    await page.locator('.grid button').nth(1).click({ force: true });
    await page.waitForTimeout(250);
    // Q3: 24 (index 1)
    await page.locator('.grid button').nth(1).click({ force: true });
    await page.waitForTimeout(250);
    // Q4: \frac{4}{3} (index 3)
    await page.locator('.grid button').nth(3).click({ force: true });
    await page.waitForTimeout(250);

    // Ke Jembatan Konsep
    await page.locator('button:has-text("Ke Jembatan Konsep")').click({ force: true });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/student/bridge/plsv/MC-PLSV-INV-OP-CONFUSION');

    // Mulai Latihan
    await page.locator('button:has-text("Mulai Latihan (Drill)")').click({ force: true });
    await page.waitForTimeout(500);

    // Selesaikan drill PLSV
    await page.locator('button:has-text("Contoh Berikutnya")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Saya Paham, Lanjut ke Contoh Terbimbing")').click({ force: true });
    await page.waitForTimeout(300);

    // Fase 2
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*7)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*12)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*3)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lanjut ke Latihan Mandiri")').click({ force: true });
    await page.waitForTimeout(400);

    // Fase 3
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*7)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button:has-text("Agar nilai persamaan tetap seimbang dan setara")').click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('.grid button').filter({ hasText: /^(x\s*=\s*6)+$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil Latihan")').click({ force: true });
    await page.waitForTimeout(500);

    // Mastery check PLSV
    await page.locator('button:has-text("Lanjut ke Mastery Check")').click({ force: true });
    await page.waitForTimeout(500);

    // Q1: x = -8
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*[-−\u2212]8$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q2: x = 35
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*35$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q3: x = 6
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*6$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q4: x = 2
    await page.locator('.grid button').filter({ hasText: /^x\s*=\s*2$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Pertanyaan Berikutnya")').click({ force: true });
    await page.waitForTimeout(300);
    // Q5: 4 permen
    await page.locator('.grid button').filter({ hasText: /^4 permen$/ }).click({ force: true });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Lihat Hasil")').click({ force: true });
    await page.waitForTimeout(500);

    // Kembali ke peta belajar
    await page.locator('button:has-text("Lihat Peta Belajar")').click({ force: true });
    await page.waitForTimeout(500);

    // Verifikasi bahwa seluruh 5 topik berstatus Selesai ✓
    const nodes = ['Bilangan Bulat', 'Pecahan', 'Persen', 'Aljabar Dasar', 'Persamaan Linear (PLSV)'];
    for (const nodeName of nodes) {
      const card = page.locator('div').filter({ has: page.locator(`h3:has-text("${nodeName}")`) }).first();
      await expect(card).toContainText('Selesai ✓');
    }

    console.log("MVP CHAIN E2E AUDIT TEST PASSED SEPENUHNYA!");
    await page.close();
  });
});
