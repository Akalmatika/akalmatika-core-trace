# Akalmatika MVP Demo Preparation Checklist

Dokumen ini berisi daftar periksa (*checklist*) teknis dan non-teknis yang wajib dilakukan oleh presenter sebelum memulai sesi demonstrasi langsung (live demo) untuk memastikan pengalaman berjalan mulus tanpa kendala teknis.

---

## 1. Persiapan Server Lokal
*   [ ] **Jalankan Vite Dev Server**: Pastikan server lokal aktif.
    *   Buka terminal di root project dan jalankan:
        ```bash
        npm run dev
        ```
    *   Pastikan server berjalan di: [http://localhost:3000/](http://localhost:3000/)
*   [ ] **Lakukan Reset Penyimpanan Lokal (Reset Data Belajar)**:
    *   Sebelum melakukan presentasi, pastikan alur dimulai dari nol.
    *   Di browser (Chrome/Edge/Firefox), buka [http://localhost:3000/](http://localhost:3000/).
    *   Buka *Developer Tools* (Tekan `F12` atau `Ctrl+Shift+I` / `Cmd+Opt+I`).
    *   Masuk ke tab **Application** (atau **Storage**).
    *   Klik **Local Storage** -> `http://localhost:3000`.
    *   Klik ikon tempat sampah (*Clear All*) atau ketik di tab Console:
        ```javascript
        localStorage.clear();
        ```
    *   Lakukan *Hard Refresh* halaman (`Ctrl+F5` atau `Cmd+Shift+R`).

---

## 2. Persiapan Rute Tab Browser
Siapkan tab browser berikut untuk transisi demo yang cepat dan tidak canggung:
*   [ ] **Tab 1 — Landing Page**: Buka [http://localhost:3000/](http://localhost:3000/). Ini digunakan untuk demonstrasi pembuka dan mulai diagnosis fondasi.
*   [ ] **Tab 2 — Dashboard Siswa**: Buka [http://localhost:3000/student/dashboard](http://localhost:3000/student/dashboard). Tab ini di-refresh untuk memperlihatkan kondisi *Empty State* sebelum siswa memulai aktivitas apa pun.
*   [ ] **Tab 3 — Dashboard Guru**: Buka [http://localhost:3000/teacher/dashboard](http://localhost:3000/teacher/dashboard). Tab ini disiapkan untuk mendemonstrasikan dasbor guru secara instan tanpa perlu siswa menyelesaikan rantai belajar terlebih dahulu di depan audiens.

---

## 3. Validasi Kesiapan Kode (Sistem Periksa)
Jalankan pemeriksaan otomatis berikut 15 menit sebelum presentasi untuk memastikan tidak ada perubahan kode tidak sengaja yang memicu error:
*   [ ] **Type Checking (TypeScript Compilation)**:
    *   Buka terminal dan jalankan:
        ```bash
        npx tsc --noEmit
        ```
    *   Pastikan tidak ada error kompilasi yang tampil.
*   *Opsional (Jika ada perubahan tes)*:
    *   [ ] **Playwright Quick Test**:
        ```bash
        npx playwright test tests/audit-sprint-4-teacher-dashboard.spec.ts --project="Mobile 320x640"
        ```

---

## 4. Konfigurasi Tampilan & Jaringan
*   [ ] **Pengaturan Resolusi Layar Desktop**:
    *   Pastikan tampilan desktop laptop Anda menggunakan rasio standar (seperti **1366x768** atau rasio aspek 16:9 yang cocok diproyeksikan ke layar proyektor eksternal).
    *   Tekan `Ctrl+-` atau `Ctrl++` untuk menyesuaikan tingkat zoom browser (optimal: 100% atau 90% tergantung lebar proyektor).
*   [ ] **Pemeriksaan Koneksi Internet**:
    *   Akalmatika MVP dirancang untuk dapat berjalan secara offline (*self-contained*). Namun, beberapa font premium (seperti *Outfit* atau *Plus Jakarta Sans*) diimpor secara dinamis dari **Google Fonts CDN**.
    *   Pastikan laptop Anda terhubung ke internet lokal atau hotspot sebelum presentasi agar font premium ter-render dengan estetika maksimal (tidak jatuh kembali ke font browser default times/arial yang kaku).

---

## 5. Simulasi Jawaban Demo (Panduan Presenter)
*   [ ] **Soal 1 (Bilangan Bulat: -2 + 3)**: Pilih opsi `1` (Benar) untuk menunjukkan pemahaman awal.
*   [ ] **Soal 2 (Bilangan Bulat: 4 - (-2))**: Pilih opsi `6` (Benar).
*   [ ] **Soal 3 (Pecahan: 1/2 + 1/4)**: Pilih opsi `2/6` (Salah, sengaja memicu miskonsepsi `MC-FRAC-ADD-NUM-DENOM`).
*   [ ] **Soal 4 (Pecahan: 1/3 + 1/4)**: Pilih opsi `2/7` (Salah).
*   [ ] **Soal 5 (Persen: 1/4 ke %)**: Pilih opsi `25%` (Benar).
*   [ ] **Soal 6 (Persen: 3/10 ke %)**: Pilih opsi `30%` (Benar).
*   [ ] **Soal 7 (Aljabar: 2x + 3y)**: Pilih opsi `5xy` (Salah, sengaja memicu miskonsepsi `MC-ALG-ADD-UNLIKE`).
*   [ ] **Soal 8 (Aljabar: 4y - y)**: Pilih opsi `3y` (Benar).
*   [ ] **Soal 9 (PLSV: x + 3 = 8)**: Pilih opsi `11` (Salah, sengaja memicu miskonsepsi `MC-PLSV-INV-OP-CONFUSION`).
*   [ ] **Soal 10 (PLSV: x - 4 = 6)**: Pilih opsi `10` (Benar).
