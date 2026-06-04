# Akalmatika — MVP Stable Freeze Document

Dokumen ini memvalidasi pembekuan (freeze) kode Akalmatika Minimum Viable Product (MVP) versi demo stabil pertama. Seluruh fitur utama siswa dan guru telah diuji secara menyeluruh.

---

## 1. Parameter Rilis

*   **Nama Versi**: Akalmatika MVP Demo Stable v1
*   **Tanggal Freeze**: 2026-06-04
*   **Target Viewport**: Mobile (320x640) dan Desktop (Responsive)
*   **Kondisi Rilis**: Stabil, Zero TypeScript compilation errors, 100% Playwright Test Suites passed.

---

## 2. Fitur yang Sudah Tersedia

### Fitur Siswa (Student Portal)
1.  **Landing Page (`/`)**: Navigasi utama, visual penjelasan cara kerja, dan tombol masuk dashboard belajar murid/guru.
2.  **Diagnosis Fondasi (`/student/diagnostic-foundation`)**: Uji coba 10 pertanyaan dasar matematika untuk memetakan kelemahan awal murid di 5 topik utama.
3.  **Peta Kelemahan Fondasi**: Laporan visual pasca-diagnosis fondasi yang merangkum status pemahaman siswa (Kuat / Perlu Diperkuat / Lemah).
4.  **Learning Map (`/student/learning-map`)**: Jalur belajar terurut berbasis node interaktif yang mengunci bab lanjut jika bab prasyarat belum dikuasai (mastered).
5.  **Jembatan Berpikir (Bridge Page - `/student/bridge/...`)**: Media pembelajaran konsep visual interaktif yang dirancang khusus untuk merekonstruksi miskonsepsi sebelum latihan dimulai.
6.  **Latihan Mandiri (Drill Page - `/student/drill/...`)**: Jalur latihan 3 Fase:
    *   *Fase 1 (Worked Examples)*: Contoh detail bertahap.
    *   *Fase 2 (Guided Practice)*: Contoh terbimbing dengan hints dinamis dan solusi terperinci jika salah.
    *   *Fase 3 (Independent Practice)*: Latihan mandiri untuk menguji akurasi jawaban murid.
7.  **Ujian Penguasaan (Mastery Check - `/student/mastery/...`)**: Evaluasi kelulusan topik (passing score >= 80%) untuk membuka bab berikutnya pada peta belajar.
8.  **Dashboard Siswa (`/student/dashboard`)**: Ringkasan progres (mastered count & percentage), rekomendasi langkah belajar dinamis, status detail per topik, dan log aktivitas terbaru.

### Fitur Guru (Teacher Portal Mock)
1.  **Teacher Layout (`/teacher/...`)**: Layout navigasi khusus guru bernuansa hijau zamrud (emerald) dengan breadcrumbs dinamis.
2.  **Dashboard Guru (`/teacher/dashboard`)**:
    *   *Ringkasan Kelas*: Metrik total siswa, rata-rata kelulusan, area topik terlemah, dan miskonsepsi paling sering muncul.
    *   *Peta Miskonsepsi Kelas (Heatmap)*: Tabel sebaran miskonsepsi per topik, prioritas tindakan (Rendah/Sedang/Tinggi), dan saran penanganan kolektif.
    *   *Daftar Siswa Mock*: Daftar progres belajar per murid, mendeteksi pola miskonsepsi terakhir, dan menyarankan tindakan remedial individual.
    *   *Rekomendasi Intervensi*: Kartu panduan instruksional pengajaran konkret di kelas fisik.

---

## 3. Rute Utama (Core Routes)

*   **Halaman Utama (Landing)**: `http://localhost:3000/`
*   **Dashboard Siswa**: `http://localhost:3000/student/dashboard`
*   **Diagnosis Fondasi**: `http://localhost:3000/student/diagnostic-foundation`
*   **Peta Belajar**: `http://localhost:3000/student/learning-map`
*   **Dashboard Guru**: `http://localhost:3000/teacher/dashboard`

---

## 4. Lapisan Data & Test Suite

### Lapisan Data (Data Layer)
Seluruh penyimpanan status dan riwayat belajar disimpan secara lokal melalui `src/services/progressStorage.ts` pada kunci `akalmatika_progress` di `localStorage` siswa. Tidak ada database backend eksternal yang dihubungkan untuk menjaga kecepatan dan simplisitas demo.

### Test Suite Teruji
Sebanyak 9 file uji otomatis Playwright terverifikasi **PASSED**:
1.  `tests/audit-sprint-2.spec.ts`: Validasi Jembatan Konsep & redirect visualisasi.
2.  `tests/audit-sprint-3-integer.spec.ts`: Alur belajar Bilangan Bulat.
3.  `tests/audit-sprint-3-fractions.spec.ts`: Alur belajar Pecahan.
4.  `tests/audit-sprint-3-percent.spec.ts`: Alur belajar Persen.
5.  `tests/audit-sprint-3-algebra.spec.ts`: Alur belajar Aljabar Dasar.
6.  `tests/audit-sprint-3-plsv.spec.ts`: Alur belajar Persamaan Linear (PLSV).
7.  `tests/audit-mvp-chain.spec.ts`: Integrasi E2E perjalanan penuh siswa baru dari landing hingga tamat 5 topik.
8.  `tests/audit-sprint-4-dashboard-student.spec.ts`: Validasi status kosong, sedang belajar, dan kelulusan di Dashboard Siswa.
9.  `tests/audit-sprint-4-teacher-dashboard.spec.ts`: Validasi visual heatmap dan log progres kelas di Dashboard Guru.

---

## 5. Batasan & Technical Debt

### Batasan MVP (Constraints)
*   **Tidak ada Autentikasi / Sesi**: Akun guru dan murid tidak dilindungi kata sandi, login, atau multi-user session.
*   **Penyimpanan Lokal**: Jika murid membersihkan cache browser/localStorage, riwayat belajar akan terhapus.
*   **Data Guru Mock**: Dashboard Guru menyajikan data statis realistis untuk simulasi dan belum tersinkronisasi secara real-time dengan database murid.

### Technical Debt
*   **Layout Visualisasi Bilangan Bulat**: Topik Bilangan Bulat (`integer`) masih menggunakan tab visualisasi terintegrasi di `StudentPortal.tsx` ketimbang visualizer mandiri terpisah seperti 4 topik lainnya. Ini tidak mengganggu alur fungsional, namun perlu diselaraskan di sprint depan.

---

## 6. Rekomendasi Sprint Berikutnya

1.  **Standardisasi Halaman Visualisasi Bilangan Bulat**: Memindahkan tabs visualizer `integer` ke rute visualisasi mandiri terpisah.
2.  **Sistem Koneksi Kelas Siswa-Guru**: Membangun API database server sederhana menggunakan PostgreSQL/Supabase dan otentikasi JWT untuk menghubungkan progress nyata siswa dengan dashboard guru secara real-time.
3.  **Ekspor Laporan PDF/Excel**: Menambahkan tombol cetak rekapitulasi miskonsepsi untuk pelaporan rapat guru atau orang tua murid.
