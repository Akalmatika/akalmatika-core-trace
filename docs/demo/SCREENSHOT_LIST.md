# Daftar Screenshot Akalmatika MVP Demo (Stable v1 Polished)

Dokumen ini berisi daftar cuplikan gambar (*screenshot*) utama yang perlu diambil untuk kebutuhan presentasi, dokumentasi produk, deck investor, maupun brosur pemasaran Akalmatika.

---

## 1. Landing Page
*   **Tujuan**: Memperlihatkan estetika visual utama, proposisi nilai produk ("Matematika Tidak Harus Dihafal. Ia Harus Masuk Akal."), dan navigasi premium.
*   **Panduan Pengambilan**:
    *   Ambil dalam resolusi desktop (**1366x768** atau full HD **1920x1080**).
    *   Pastikan visual alur pemulihan pemahaman di sisi kanan atas masuk dalam bingkai tangkapan.
    *   Ambil versi mobile (**390x844**) dengan menu tertutup dan menu terbuka (drawer aktif).

---

## 2. Mulai Diagnosis Fondasi (Diagnostic Welcome)
*   **Tujuan**: Memperlihatkan halaman pengantar diagnosis yang menyajikan detail tes secara rapi dan ramah kepada siswa.
*   **Panduan Pengambilan**:
    *   Ambil pada rute `/student/diagnostic-foundation` sebelum tombol "Mulai Diagnosis" ditekan.
    *   Tangkapan layar harus memperlihatkan ikon sparkles dan kotak petunjuk langkah tes.

---

## 3. Peta Kelemahan Fondasi (Diagnostic Results)
*   **Tujuan**: Menunjukkan visual laporan peta kelemahan konsep hasil diagnosis siswa yang memuat status warna (Kuat/Lemah) dan label deteksi miskonsepsi.
*   **Panduan Pengambilan**:
    *   Lakukan simulasi pengisian diagnosis dengan beberapa jawaban salah (seperti memilih $\frac{2}{6}$ pada soal $\frac{1}{2} + \frac{1}{4}$).
    *   Ambil cuplikan pada rute hasil diagnosis yang menampilkan status `"Lemah"` pada Pecahan, lengkap dengan baris penjelasan miskonsepsi `MC-FRAC-ADD-NUM-DENOM`.
    *   Tunjukkan widget "Rekomendasi Rute Belajar" berwarna indigo di bagian bawah halaman.

---

## 4. Peta Belajar Interaktif (Learning Map)
*   **Tujuan**: Memperlihatkan rantai kompetensi materi dengan node tingkat yang terkunci atau terbuka secara bertahap.
*   **Panduan Pengambilan**:
    *   Tampilkan rute `/student/learning-map`.
    *   Ambil cuplikan yang menampilkan node Bilangan Bulat dan Pecahan berstatus aktif/sedang dipelajari, sementara node Persen, Aljabar, dan PLSV terkunci di bawahnya dengan tanda gembok abu-abu.
    *   Ambil versi mobile untuk menunjukkan bahwa garis hubung putus-putus dan nomor lingkaran berderet rapi secara vertikal.

---

## 5. Jembatan Konsep (Bridge Page)
*   **Tujuan**: Memperlihatkan struktur 7-bagian penyembuhan miskonsepsi, terutama tombol aksi ganda yang seimbang setelah dipoles.
*   **Panduan Pengambilan**:
    *   Buka rute `/student/bridge/fractions/MC-FRAC-ADD-NUM-DENOM`.
    *   Ambil screenshot yang menampilkan bagian "Ilustrasi Konkret" (kutipan pizza) dan "Renungkan Pertanyaan Ini" yang rapi.
    *   Pastikan bagian bawah halaman tertangkap, memperlihatkan tombol outline sekunder `"Ke Media Visualisasi"` berdampingan dengan tombol ungu solid `"Mulai Latihan (Drill)"`.

---

## 6. Latihan Mandiri Bertahap (Drill Page)
*   **Tujuan**: Menunjukkan pemisah fase latihan yang terstruktur dan responsif.
*   **Panduan Pengambilan**:
    *   Buka rute `/student/drill/fractions`.
    *   Ambil screenshot pada **Fase 2 (Contoh Terbimbing)** yang menampilkan opsi soal matematika di tengah dan tombol `"Tampilkan Petunjuk (Hint)"`.
    *   Ambil screenshot pada layar HP kecil (320px) untuk memvalidasi ketiadaan teks yang tumpang tindih pada indikator stepper fase di bagian atas.

---

## 7. Mastery Check
*   **Tujuan**: Menunjukkan UI pengerjaan kuis kelulusan materi dengan umpan balik warna hijau/merah.
*   **Panduan Pengambilan**:
    *   Buka rute `/student/mastery/fractions`.
    *   Ambil screenshot saat sebuah opsi jawaban ditekan: tombol opsi berubah menjadi latar hijau lembut (jika benar) dengan indikator centang di lingkaran kiri.
    *   Ambil screenshot halaman keberhasilan kelulusan (skor 100% atau 80% dengan ikon piala emas memantul).

---

## 8. Dashboard Siswa (Student Dashboard)
*   **Tujuan**: Memperlihatkan pusat pemantauan kemajuan belajar personal siswa, rekomendasi cerdas dinamis, dan riwayat aktivitas.
*   **Panduan Pengambilan**:
    *   Ambil screenshot saat dasbor berstatus kosong (*Empty State*) yang memancing siswa memulai diagnosis awal.
    *   Ambil screenshot setelah siswa menyelesaikan beberapa topik: menampilkan progress bar kemajuan (misal: 60% selesai), rekomendasi langkah belajar aktif, kartu-kartu topik dengan metrik di dalamnya, serta linimasa riwayat aktivitas belajar terbaru.

---

## 9. Dashboard Guru (Teacher Dashboard)
*   **Tujuan**: Memperlihatkan dasbor analitis miskonsepsi kelas yang berpusat pada pemulihan pemahaman kolektif kelas, bukan peringkat nilai.
*   **Panduan Pengambilan**:
    *   Buka rute `/teacher/dashboard` pada layar desktop (**1366x768**).
    *   Ambil screenshot yang memuat widget Ringkasan Kelas (4 metrik utama) di bagian atas.
    *   Tangkap tabel Heatmap Miskonsepsi Kelas yang menunjukkan sebaran siswa terdampak dan tingkat prioritas penanganan.
    *   Tangkap tabel Pemantauan Progres Siswa Roster beserta kartu-kartu Rekomendasi Intervensi Kelas Fisik di samping kanannya.
