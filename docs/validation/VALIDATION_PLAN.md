# Akalmatika MVP - Validation Plan

## 1. Tujuan Validasi
Tujuan utama validasi ini adalah menguji asumsi dasar produk Akalmatika kepada pengguna nyata tanpa bias teknis. Fokusnya adalah mengetahui apakah masalah (hafalan rumus buta vs pemahaman konsep) benar-benar dirasakan, dan apakah solusi yang ditawarkan (Diagnosis -> Bridge -> Drill -> Mastery) dinilai logis, intuitif, dan solutif.

## 2. Target Responden (Audiens Demo)
Kita perlu memvalidasi produk ini dengan audiens dari berbagai sudut pandang:
- **Guru Matematika (SMP/SMA):** Untuk menilai keakuratan pedagogis, alur Bridge, relevansi miskonsepsi, dan kegunaan Dashboard Guru.
- **Siswa SMP/SMA:** Untuk menguji antarmuka, kejelasan bahasa, tingkat kesulitan, serta efektivitas rekomendasi langkah belajar.
- **Orang Tua:** Untuk mengukur ketertarikan mereka terhadap laporan progres, Dashboard Siswa, dan kemauan mengadopsi platform untuk anak.
- **Teman Non-Teknis:** Untuk mengevaluasi kejelasan antarmuka dan copywriting dari perspektif orang awam.
- **Calon Partner / Pengelola Bimbel:** Untuk melihat nilai bisnis, kegunaan analitik kelas (Dashboard Guru), dan potensi integrasi.

## 3. Skenario Demo (5 Menit)
1. **[0:00 - 1:00] Hook & Landing Page:** Buka beranda, jelaskan bahwa Akalmatika fokus memutus rantai "menghafal buta" dengan melacak miskonsepsi sampai akar (fondasi).
2. **[1:00 - 2:00] Diagnosis Fondasi:** Masuk sebagai siswa baru, klik "Mulai Diagnosis Fondasi", jalankan tes simulasi, dan tunjukkan hasil peta kelemahan.
3. **[2:00 - 3:00] Bridge & Drill (Pecahan):** Buka "Peta Belajar", pilih topik pertama (Pecahan), jalankan "Jembatan Konsep" untuk menyembuhkan miskonsepsi, dan tunjukkan sistem "Latihan Mandiri (Drill)" yang bertahap (Contoh, Bimbingan, Mandiri).
4. **[3:00 - 4:00] Mastery & Progress Siswa:** Selesaikan "Mastery Check", lalu buka "Dashboard Siswa" untuk menunjukkan log aktivitas dan rekomendasi belajar selanjutnya.
5. **[4:00 - 5:00] Dashboard Guru:** Buka `/teacher/dashboard` untuk mendemokan peta miskonsepsi kelas (heatmap) dan rencana remediasi kelas.

## 4. Hal yang Harus Diamati Selama Demo
*   **Reaksi Spontan:** Perhatikan kerutan dahi, senyuman, atau kata-kata spontan ("Oh, paham", "Lho kok begini?").
*   **Navigasi:** Apakah mereka mencari tombol yang tidak ada? Apakah mereka tersesat di halaman Bridge/Drill?
*   **Keterbacaan:** Apakah teks penjelasan konsep (math) cukup jelas atau memusingkan?
*   **Gestur Kebingungan:** Perhatikan saat audiens diam lebih dari 5 detik melihat sebuah halaman.

## 5. Pertanyaan Pasca-Demo
*(Lihat file `INTERVIEW_QUESTIONS.md` untuk daftar pertanyaan spesifik)*

## 6. Kriteria Sinyal Kuat (Validasi Positif)
*   Guru merasa Dashboard Guru bisa menghemat waktu analisis nilai mereka.
*   Siswa merasa visualisasi Bridge lebih masuk akal dibanding sekadar membaca buku cetak.
*   Orang tua langsung bertanya: *"Apakah anak saya sudah bisa pakai ini di rumah?"* atau *"Harganya berapa?"*
*   Responden mengeluhkan masalah matematika yang persis sama dengan narasi Landing Page.

## 7. Kriteria Sinyal Lemah (Area Perbaikan)
*   Audiens merasa UI terlalu ramai atau membingungkan.
*   Guru menganggap soal Drill terlalu teoritis dan tidak sesuai kurikulum lokal.
*   Siswa mengklik "Petunjuk" berkali-kali tapi tetap tidak paham.
*   Responden mengatakan "Bagus sih..." tapi tidak tahu kapan mereka akan menggunakannya.

## 8. Keputusan Pasca-Validasi
Setelah mengumpulkan 5-10 *Feedback Log*, tim harus mengambil keputusan:
*   **PIVOT:** Jika masalah tidak dirasakan relevan (misal: guru hanya butuh bank soal, bukan deteksi miskonsepsi).
*   **PERSEVERANCE (Lanjut Sprint 7):** Jika validasi positif, segera mulai integrasi Database & Auth sesungguhnya agar bisa diujicobakan secara live (Beta Testing).
*   **ITERASI UI/UX:** Jika konsep disetujui tapi alur navigasi dianggap membingungkan.
