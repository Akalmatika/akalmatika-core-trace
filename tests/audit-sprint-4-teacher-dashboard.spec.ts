import { test, expect } from '@playwright/test';

test.describe('Sprint 4B Teacher Dashboard Audit Test', () => {
  test('Verify teacher dashboard components and student route regression', async ({ page }) => {
    // 1. Navigate to Teacher Dashboard
    await page.goto('http://localhost:3000/teacher/dashboard', { waitUntil: 'networkidle' });

    // 2. Verify Header
    await expect(page.locator('h2:has-text("Dashboard Guru")')).toBeVisible();
    await expect(page.locator('text=Lihat pola miskonsepsi kelas agar intervensi belajar lebih tepat')).toBeVisible();

    // 3. Verify Class Summary Metrics
    await expect(page.locator('text=Total Siswa')).toBeVisible();
    await expect(page.locator('text=Rata-rata Mastery')).toBeVisible();
    await expect(page.locator('text=Topik Perlu Penguatan')).toBeVisible();
    await expect(page.locator('text=Miskonsepsi Utama')).toBeVisible();
    
    await expect(page.locator('h3:has-text("28 Siswa")')).toBeVisible();
    await expect(page.locator('h3:has-text("64%")')).toBeVisible();

    // 4. Verify Misconception Heatmap Table
    await expect(page.locator('h3:has-text("Peta Miskonsepsi Kelas")')).toBeVisible();
    await expect(page.locator('table >> text=Bilangan Bulat').first()).toBeVisible();
    await expect(page.locator('table >> text=Pecahan').first()).toBeVisible();
    await expect(page.locator('table >> text=MC-FRAC-ADD-NUM-DENOM')).toBeVisible();

    // 5. Verify Student Progress Roster Table
    await expect(page.locator('h3:has-text("Pemantauan Progres Siswa")')).toBeVisible();
    await expect(page.locator('table >> text=Budi Santoso')).toBeVisible();
    await expect(page.locator('table >> text=Siti Rahma')).toBeVisible();
    await expect(page.locator('table >> text=Aditya Pratama')).toBeVisible();

    // 6. Verify Remediation Intervention Cards
    await expect(page.locator('h3:has-text("Intervensi Kelas Disarankan")')).toBeVisible();
    await expect(page.locator('text=Aktivitas Remidiasi Kelompok Pecahan')).toBeVisible();
    await expect(page.locator('text=Pendalaman Suku Sejenis Aljabar')).toBeVisible();
    await expect(page.locator('text=18 Siswa (Prioritas Tinggi)')).toBeVisible();

    // 7. Student Route Regression Check
    // Navigate to Student Dashboard
    await page.goto('http://localhost:3000/student/dashboard', { waitUntil: 'networkidle' });
    await expect(page.locator('h2:has-text("Dashboard Belajar")')).toBeVisible();

    // Navigate to Learning Map
    await page.goto('http://localhost:3000/student/learning-map', { waitUntil: 'networkidle' });
    await expect(page.locator('h2:has-text("Peta Belajar Akalmatika")')).toBeVisible();

    await page.close();
  });
});
