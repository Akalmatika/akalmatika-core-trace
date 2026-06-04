# Akalmatika — MVP Demo Presentation Script

Skrip ini dirancang untuk mendemonstrasikan Akalmatika MVP Stable v1 selama **5–7 menit**. Presentasi berfokus pada transisi murid dari terdeteksi salah paham hingga menguasai konsep dasar, serta bagaimana guru melihat pola tersebut secara kolektif.

---

## Persiapan Sebelum Demo
1.  Buka terminal, jalankan server dev (`npm run dev`) dan pastikan web terbuka di `http://localhost:3000/`.
2.  Buka tab baru untuk Dashboard Guru (`http://localhost:3000/teacher/dashboard`).
3.  Pastikan `localStorage` browser dibersihkan (Inspect Element -> Application -> Clear Storage -> Local Storage -> hapus key `akalmatika_progress` atau clear all) agar demo dimulai dalam kondisi kosong.

---

## Struktur Demonstrasi (5–7 Menit)

### 1. Pembukaan & Pengenalan Masalah (Menit 0:00 - 0:45)
*   **Aksi**: Tampilkan halaman depan (Landing Page - `http://localhost:3000/`). Scroll perlahan melihat visual alur pemulihan.
*   **Narasi**:
    > "Halo semuanya. Hari ini saya ingin memperkenalkan Akalmatika, media belajar matematika interaktif yang memfokuskan diri pada **akar pemahaman murid**, bukan sekadar skor nilai. 
    > Banyak siswa mengalami kesulitan belajar matematika bukan karena mereka malas berlatih, tetapi karena fondasi konsepnya bolong. Mereka hafal rumus instan (seperti 'pindah ruas' atau 'minus dikali minus'), tetapi tidak mengerti maknanya. Begitu bentuk soal diubah sedikit, mereka bingung.
    > Mari kita lihat bagaimana siswa baru menggunakan Akalmatika."

### 2. Diagnosis Fondasi Dasar (Menit 0:45 - 2:00)
*   **Aksi**: Klik tombol **"Mulai Diagnosis Fondasi"**. Jawablah 10 pertanyaan quiz secara cepat. Sengaja salahkan beberapa soal (misal: jawab `2/5` untuk `1/2 + 1/3` untuk memicu miskonsepsi pecahan, jawab `25` untuk `25% dari 80`, jawab `5xy` untuk `2x + 3y`).
*   **Narasi**:
    > "Di sini, siswa memulai dengan Diagnosis Fondasi. Sistem kami tidak hanya menilai benar/salah, tetapi mendeteksi pola jawaban salah siswa untuk menebak miskonsepsi aktif mereka.
    > Sebagai contoh, jika saya menjumlahkan pecahan $\frac{1}{2} + \frac{1}{3}$ dan menjawab $\frac{2}{5}$ (menjumlahkan atas dengan atas, bawah dengan bawah), sistem akan merekam pola ini sebagai miskonsepsi penjumlahan pecahan."
*   **Aksi**: Selesaikan diagnosis fondasi hingga halaman **Laporan Peta Kelemahan** tampil.
*   **Narasi**:
    > "Begitu selesai, siswa langsung disajikan peta kelemahan fondasi mereka. Terlihat topik mana saja yang perlu diperkuat (Pecahan, Aljabar, Persen) lengkap dengan jenis kesalahan berpikir spesifik yang terdeteksi."

### 3. Peta Belajar & Jembatan Konsep (Menit 2:00 - 3:30)
*   **Aksi**: Klik tombol **"Masuk Peta Belajar"** (`/student/learning-map`). Tunjukkan bahwa topik pertama (`integer` / Bilangan Bulat) terbuka (Sedang Dipelajari ⏳ atau Mulai Ujian 🎯), sementara topik pecahan, persen, aljabar, dan PLSV terkunci.
*   **Narasi**:
    > "Siswa kemudian masuk ke Peta Belajar. Alurnya teratur secara beruntun. Siswa tidak bisa melompati bab sesuka hati karena setiap materi dibangun di atas konsep prasyarat sebelumnya."
*   **Aksi**: Klik topik Bilangan Bulat. Sistem akan mengarahkan ke halaman **Jembatan Konsep (Bridge Page)**.
*   **Narasi**:
    > "Ketika sistem mendeteksi miskonsepsi, siswa tidak langsung diberi lembar soal latihan. Mereka diarahkan ke Jembatan Berpikir. Di sini kami menggunakan model visual interaktif (seperti konsep penetralan Es dan Api untuk zero-pair, atau pembagian pizza setara untuk pecahan) untuk menumbuhkan makna intuitif matematika terlebih dahulu."

### 4. Latihan Mandiri Bertahap (Drill) & Mastery Check (Menit 3:30 - 4:45)
*   **Aksi**: Klik **"Mulai Latihan (Drill)"**. Tunjukkan sekilas Fase 1 (Contoh Lengkap), klik **"Lanjut"** ke Fase 2 (Guided Practice), pilih jawaban salah untuk melihat pop-up petunjuk terbimbing bertahap (Hints) & guided solution, lalu selesaikan Fase 3 (Independent Practice).
*   **Narasi**:
    > "Setelah paham konsep dasarnya, siswa masuk ke latihan mandiri bertahap (Drill). Terdiri dari 3 Fase: Fase 1 worked example dengan penjelasan langkah lengkap, Fase 2 latihan terbimbing dengan hints dinamis yang tidak langsung memberi tahu jawabannya jika siswa melakukan kesalahan, dan Fase 3 latihan mandiri."
*   **Aksi**: Setelah Drill selesai, klik **"Lanjut ke Mastery Check"**. Selesaikan ujian mastery dengan skor sempurna (>= 80%) hingga status topik berubah menjadi **Selesai ✓ (Mastered)**.
*   **Narasi**:
    > "Jika latihan mandiri selesai, siswa harus melewati Mastery Check. Bab ini merupakan penentu kelulusan. Begitu lulus dengan nilai minimal 80%, status di peta belajar akan berubah menjadi 'Selesai' dan bab berikutnya otomatis terbuka."

### 5. Dashboard Siswa (Menit 4:45 - 5:30)
*   **Aksi**: Klik breadcrumb atau menu **"Dashboard"** (`/student/dashboard`).
*   **Narasi**:
    > "Ini adalah Dashboard Siswa. Di sini siswa melihat persentase penguasaan rantai belajarnya (misal: 20% karena baru meluluskan 1 topik), log riwayat aktivitas terbaru yang teratur secara kronologis, dan yang terpenting: **rekomendasi langkah berikutnya**. Sistem secara cerdas memberi tahu apa yang harus dilakukan selanjutnya (misalnya: mulai diagnosis pecahan)."

### 6. Dashboard Guru (Menit 5:30 - 6:30)
*   **Aksi**: Buka tab Dashboard Guru (`/teacher/dashboard`).
*   **Narasi**:
    > "Sekarang kita beralih ke sudut pandang pengajar melalui Dashboard Guru. Di sini guru tidak disajikan ranking nilai kaku yang menghakimi siswa lambat.
    > Guru melihat **Peta Miskonsepsi Kelas (Heatmap)**. Terlihat bahwa di topik Pecahan, ada 18 siswa yang terdampak miskonsepsi 'Menjumlahkan atas-atas, bawah-bawah'. Ini memberi petunjuk konkret kepada guru: 'Besok di kelas, saya harus membawa alat peraga pecahan dan mengulangi konsep penyebut pecahan'."
*   **Aksi**: Tunjukkan daftar log siswa mock dan rekomendasi intervensi pengajaran di sebelah kanan.
    > "Di bagian bawah, guru bisa memantau progres belajar siswa individual lengkap dengan saran tindakan personal. Di sebelah kanan, guru langsung mendapatkan saran intervensi pembelajaran konseptual konkret untuk dipraktikkan langsung di kelas fisik."

### 7. Penutup & Kesimpulan (Menit 6:30 - 7:00)
*   **Aksi**: Kembali ke Landing Page, lalu tutup presentasi.
*   **Narasi**:
    > "Akalmatika memosisikan diri sebagai jembatan yang menghubungkan diagnosis digital interaktif dengan pengajaran nyata guru di kelas. Dengan memulihkan miskonsepsi dasar, kami memastikan siswa siap belajar matematika tingkat lanjut dengan percaya diri. Terima kasih."
