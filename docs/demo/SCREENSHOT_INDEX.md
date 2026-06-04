# Indeks Screenshot Demo Akalmatika

Dokumen ini berisi indeks seluruh screenshot demo yang dihasilkan secara otomatis oleh script Playwright `tests/capture-demo-screenshots.spec.ts`.

**Viewport yang digunakan:**
| Label | Resolusi | Suffix |
|-------|----------|--------|
| Desktop | 1366×768 | `desktop` |
| Mobile | 390×844 | `mobile` |

---

## 1. Landing Page

| Viewport | File |
|----------|------|
| Desktop | [`01-landing-desktop.png`](screenshots/01-landing-desktop.png) |
| Mobile | [`01-landing-mobile.png`](screenshots/01-landing-mobile.png) |

**Route:** `/`
**Deskripsi:** Halaman utama dengan proposisi nilai "Matematika Tidak Harus Dihafal", navigasi premium, dan visual alur pemulihan pemahaman.

---

## 2. Diagnosis Fondasi (Welcome)

| Viewport | File |
|----------|------|
| Desktop | [`02-diagnosis-welcome-desktop.png`](screenshots/02-diagnosis-welcome-desktop.png) |
| Mobile | [`02-diagnosis-welcome-mobile.png`](screenshots/02-diagnosis-welcome-mobile.png) |

**Route:** `/student/diagnostic-foundation`
**Deskripsi:** Halaman pengantar diagnosis dengan ikon sparkles, detail tes, dan tombol "Mulai Diagnosis".

---

## 3. Peta Belajar (Learning Map)

| Viewport | File |
|----------|------|
| Desktop | [`03-learning-map-desktop.png`](screenshots/03-learning-map-desktop.png) |
| Mobile | [`03-learning-map-mobile.png`](screenshots/03-learning-map-mobile.png) |

**Route:** `/student/learning-map`
**Deskripsi:** Rantai kompetensi dengan node yang terbuka (integer, fractions, percent mastered) dan terkunci (plsv). Data progress di-seed otomatis.

---

## 4. Jembatan Konsep (Bridge) — Pecahan

| Viewport | File |
|----------|------|
| Desktop | [`04-bridge-fractions-desktop.png`](screenshots/04-bridge-fractions-desktop.png) |
| Mobile | [`04-bridge-fractions-mobile.png`](screenshots/04-bridge-fractions-mobile.png) |

**Route:** `/student/bridge/fractions/MC-FRAC-ADD-NUM-DENOM`
**Deskripsi:** Struktur 7-bagian penyembuhan miskonsepsi MC-FRAC-ADD-NUM-DENOM, dengan ilustrasi pizza, renungan, dan tombol aksi ganda.

---

## 5. Latihan Mandiri (Drill) — Pecahan

| Viewport | File |
|----------|------|
| Desktop | [`05-drill-fractions-desktop.png`](screenshots/05-drill-fractions-desktop.png) |
| Mobile | [`05-drill-fractions-mobile.png`](screenshots/05-drill-fractions-mobile.png) |

**Route:** `/student/drill/fractions`
**Deskripsi:** Halaman latihan bertahap (3 fase) dengan stepper di atas dan soal matematika interaktif.

---

## 6. Mastery Check — Pecahan

| Viewport | File |
|----------|------|
| Desktop | [`06-mastery-fractions-desktop.png`](screenshots/06-mastery-fractions-desktop.png) |
| Mobile | [`06-mastery-fractions-mobile.png`](screenshots/06-mastery-fractions-mobile.png) |

**Route:** `/student/mastery/fractions`
**Deskripsi:** Kuis kelulusan materi pecahan dengan opsi jawaban dan umpan balik visual hijau/merah.

---

## 7a. Dashboard Siswa — Empty State

| Viewport | File |
|----------|------|
| Desktop | [`07a-dashboard-student-empty-desktop.png`](screenshots/07a-dashboard-student-empty-desktop.png) |
| Mobile | [`07a-dashboard-student-empty-mobile.png`](screenshots/07a-dashboard-student-empty-mobile.png) |

**Route:** `/student/dashboard`
**Deskripsi:** Dashboard tanpa data — menampilkan pesan ajakan memulai Diagnosis Fondasi.

---

## 7b. Dashboard Siswa — Dengan Progress

| Viewport | File |
|----------|------|
| Desktop | [`07b-dashboard-student-progress-desktop.png`](screenshots/07b-dashboard-student-progress-desktop.png) |
| Mobile | [`07b-dashboard-student-progress-mobile.png`](screenshots/07b-dashboard-student-progress-mobile.png) |

**Route:** `/student/dashboard`
**Deskripsi:** Dashboard dengan 3 topik mastered dan 1 diagnosed. Menampilkan progress ring 60%, rekomendasi langkah berikutnya, kartu topik, dan riwayat aktivitas.

---

## 8. Dashboard Guru

| Viewport | File |
|----------|------|
| Desktop | [`08-dashboard-teacher-desktop.png`](screenshots/08-dashboard-teacher-desktop.png) |
| Mobile | [`08-dashboard-teacher-mobile.png`](screenshots/08-dashboard-teacher-mobile.png) |

**Route:** `/teacher/dashboard`
**Deskripsi:** Dashboard analitik miskonsepsi kelas dengan ringkasan kelas, heatmap miskonsepsi, roster siswa, dan rekomendasi intervensi.

---

## Cara Mengambil Ulang Screenshot

```bash
# Pastikan dev server berjalan di port 3000
npm run dev

# Jalankan script screenshot
npx playwright test tests/capture-demo-screenshots.spec.ts --project="Mobile 390x844"
```

> **Catatan:** Script menggunakan project "Mobile 390x844" sebagai runner, tetapi mengelola viewport secara internal untuk menangkap kedua resolusi (desktop dan mobile) dalam setiap test.

---

## Statistik

| Metrik | Jumlah |
|--------|--------|
| Total screenshot | 18 |
| Route yang dicover | 9 (termasuk 2 state dashboard siswa) |
| Viewport | 2 (desktop 1366×768, mobile 390×844) |
| Format | PNG (full-page) |
