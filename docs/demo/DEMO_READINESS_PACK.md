# Akalmatika MVP Demo Readiness Pack (Stable v1 Polished)

Dokumen ini dirancang sebagai panduan komprehensif bagi presenter untuk melakukan demonstrasi produk **Akalmatika MVP Demo Stable v1 Polished** secara lancar, profesional, dan meyakinkan di depan pemangku kepentingan (stakeholders), calon mitra, maupun pengguna.

---

## 1. Ringkasan Produk Akalmatika
**Akalmatika** adalah platform pembelajaran matematika interaktif adaptif yang didesain khusus untuk **mengidentifikasi dan menyembuhkan miskonsepsi matematika dasar** pada siswa (jenjang SD hingga SMP). Alih-alih hanya berfokus pada pemberian nilai angka/skor akhir ujian, Akalmatika memandang kesalahan jawaban siswa sebagai sinyal berharga untuk melacak letak "bolong" pemahaman mereka, menjembataninya lewat visualisasi konkret, berlatih secara mandiri, hingga mencapai penguasaan konsep yang utuh.

---

## 2. Masalah Utama yang Disebabkan & Diselesaikan
*   **Masalah Utama**: Siswa sering kali menghafal prosedur dan rumus matematika secara mekanis (rote learning) tanpa memahami makna konseptualnya. Akibatnya, saat bentuk soal diubah sedikit, atau saat melangkah ke materi tingkat lanjut (seperti aljabar atau persamaan linear), siswa mengalami kegagalan karena fondasi dasarnya (seperti pecahan atau bilangan bulat negatif) rapuh.
*   **Solusi Akalmatika**:
    1.  **Mendeteksi letak miskonsepsi spesifik** secara otomatis lewat diagnosis cerdas.
    2.  **Menyediakan "Jembatan Berpikir"** konseptual (bukan langsung menyodorkan rumus cepat).
    3.  **Memberikan visualisasi interaktif** agar siswa bisa memanipulasi konsep secara visual.
    4.  **Melatih secara bertahap** (Worked Examples -> Guided Practice -> Independent Practice).
    5.  **Menyajikan data analitik miskonsepsi kelas** bagi guru demi intervensi kelompok yang presisi.

---

## 3. Pembeda dari Platform Ujian Biasa
| Dimensi | Platform Ujian / Bank Soal Biasa | Akalmatika |
| :--- | :--- | :--- |
| **Fokus Utama** | Evaluasi akhir (*Assessment of Learning*) & perolehan skor. | Diagnosis & Pemulihan Pemahaman (*Assessment for Learning*). |
| **Perlakuan Salah** | Hanya dianggap salah, nilai berkurang, diberi pembahasan statis. | Dibaca sebagai pola miskonsepsi terarah untuk dicarikan akar masalahnya. |
| **Logika Alur** | Bebas membuka bab sesuka hati tanpa memedulikan prasyarat. | Naik bertahap secara terstruktur berdasarkan kesiapan fondasi prasyarat. |
| **Cara Belajar** | Mengerjakan puluhan soal secara repetitif tanpa visualisasi. | Diagnosis $\rightarrow$ Jembatan Makna $\rightarrow$ Eksplorasi Visual $\rightarrow$ Latihan Mandiri. |
| **Analitik Guru** | Laporan nilai rapor, urutan ranking kelas (membuat siswa tertekan). | Peta miskonsepsi kelas & saran aktivitas remediasi fisik konseptual. |

---

## 4. Fitur Siswa yang Bisa Didemokan
1.  **Diagnosis Fondasi Awal**: Tes mandiri singkat berisi 10 soal mencakup 5 topik penting untuk memetakan kekuatan dan kelemahan pemahaman siswa.
2.  **Peta Kelemahan Fondasi**: Laporan visual hasil diagnosis yang melabeli status pemahaman (*Kuat*, *Perlu Diperkuat*, *Lemah*) beserta rincian miskonsepsi yang terdeteksi.
3.  **Peta Belajar Interaktif (Learning Map)**: Visualisasi rantai prasyarat belajar bertahap yang mengunci topik lanjutan sebelum topik prasyarat dituntaskan (Pecahan $\rightarrow$ Persen $\rightarrow$ Aljabar $\rightarrow$ PLSV).
4.  **Jembatan Berpikir (Concept Bridge)**: Halaman edukatif 7-bagian yang menjelaskan akar miskonsepsi secara ramah, mengapa kesalahan tersebut alami terjadi, ilustrasi konkret, dan pertanyaan reflektif.
5.  **Visualisasi Konsep Interaktif**: Papan simulasi manipulatif (seperti Koin Es & Api untuk bilangan bulat, potongan pizza untuk pecahan, grid 100 kotak untuk persen, kartu timbangan untuk aljabar/PLSV).
6.  **Latihan Mandiri Bertahap (Drill)**:
    *   *Fase 1 (Contoh Detail)*: Penjelasan soal langkah demi langkah dengan ilustrasi.
    *   *Fase 2 (Contoh Terbimbing)*: Mengerjakan soal dengan bantuan petunjuk bertahap (*progressive hints*).
    *   *Fase 3 (Latihan Mandiri)*: Uji kemandirian dengan target akurasi tertentu.
7.  **Ujian Penguasaan (Mastery Check)**: Tes kelulusan bab (5 soal acak) dengan standar kelulusan 80% untuk membuka node materi berikutnya pada Peta Belajar.
8.  **Dashboard Siswa**: Halaman personalisasi untuk memantau kemajuan rantai belajar, melihat rekomendasi aktivitas terbaik berikutnya secara dinamis, dan riwayat aktivitas belajar terbaru.

---

## 5. Fitur Guru yang Bisa Didemokan
1.  **Koleksi Ringkasan Kelas**: Dashboard utama guru menampilkan metrik jumlah siswa aktif, rata-rata tingkat kelulusan mastery, topik paling kritis yang perlu penguatan (Pecahan), serta jenis miskonsepsi dominan kelas.
2.  **Peta Miskonsepsi Kelas (Heatmap)**: Tabel analitis sebaran jumlah siswa yang terjebak pada kode miskonsepsi tertentu (misal: 18 siswa terjebak `MC-FRAC-ADD-NUM-DENOM`).
3.  **Pemantauan Progres Siswa**: Profil individu siswa yang memantau tingkat penguasaan topik rantai belajar, miskonsepsi terakhir yang dihadapi, serta rekomendasi tindakan spesifik bagi guru.
4.  **Kartu Rekomendasi Intervensi**: Saran aktivitas remediasi fisik/hands-on di kelas (seperti melipat kertas untuk pecahan, kartu warna untuk aljabar, dan lantai koordinat untuk bilangan bulat).

---

## 6. Batasan MVP (Dijelaskan Jujur Jika Diperlukan)
*   **Penyimpanan Lokal**: Seluruh data kemajuan belajar siswa disimpan secara lokal di dalam peramban web (`localStorage`) menggunakan `progressStorage.ts`. Saat ini belum ada backend server dinamis.
*   **Tanpa Sistem Akun/Auth**: Tidak diperlukan login/registrasi. Siswa langsung masuk sebagai *anonymous user* lokal, dan data guru didasarkan pada dataset mock representatif demi tujuan demonstrasi.
*   **Fokus Rantai MVP Pertama**: Rantai belajar yang aktif secara penuh dibatasi pada 5 topik prasyarat utama: *Bilangan Bulat $\rightarrow$ Pecahan $\rightarrow$ Persen $\rightarrow$ Aljabar Dasar $\rightarrow$ PLSV*. Topik lain di luar rantai ini berupa halaman placeholder.

---

## 7. Technical Debt (Tidak Perlu Dibahas Kecuali Ditanya)
*   **Visualisasi SVG Mobile**: Pada layar HP sangat sempit (320px), garis hubung koordinat visualisasi bilangan bulat terkadang terlihat padat. Ini diatur lewat CSS responsif namun belum diubah total agar tidak merusak presisi klik.
*   **Mock Roster Guru**: Data perkembangan siswa pada dasbor guru bersumber dari mock static dataset di `teacherMockData.ts` dan tidak berubah dinamis berdasarkan aktivitas peramban saat itu juga, karena ketiadaan database bersama.

---

## 8. Urutan Demo 5 Menit (Fokus: Alur Cepat & Aha! Moment)
1.  **Menit 0:00 - 0:45 (Landing Page)**: Buka `/`. Jelaskan visi "Paham Dulu, Baru Rumus". Klik "Mulai Diagnosis Fondasi".
2.  **Menit 0:45 - 1:45 (Diagnosis Cepat)**: Kerjakan 2 soal awal secara acak. Di soal Pecahan $\frac{1}{2} + \frac{1}{4}$, pilih jawaban salah $\frac{2}{6}$ (sengaja memicu miskonsepsi `MC-FRAC-ADD-NUM-DENOM`). Selesaikan diagnosis cepat.
3.  **Menit 1:45 - 2:45 (Peta Kelemahan & Peta Belajar)**: Tunjukkan hasil laporan Peta Kelemahan. Jelaskan mengapa status Pecahan menjadi *"Lemah"* dengan miskonsepsi terdeteksi. Buka Peta Belajar (`/student/learning-map`), tunjukkan bahwa topik Persen terkunci karena Pecahan belum dikuasai.
4.  **Menit 2:45 - 3:45 (Jembatan Konsep & Drill)**: Buka Jembatan Konsep Pecahan. Tunjukkan penjelasan makna konseptual pizza. Klik "Mulai Latihan (Drill)". Jelaskan Fase 1 (Contoh Soal), tunjukkan transisi ke Fase 2 (Terbimbing) dengan petunjuk (*hints*).
5.  **Menit 3:45 - 5:00 (Dashboard Guru)**: Buka `/teacher/dashboard`. Jelaskan bagaimana guru melihat 18 siswanya mengalami miskonsepsi serupa di kelas, lalu tunjukkan kartu rekomendasi kegiatan melipat kertas konseptual untuk menyembuhkannya secara klasikal. Akhiri demo.

---

## 9. Urutan Demo 10 Menit (Fokus: Kedalaman Alur & Pedagogi)
1.  **Menit 0:00 - 1:00 (Pembuka & Visi)**: Buka `/`. Sampaikan narasi pembuka tentang masalah hafal rumus matematika di sekolah.
2.  **Menit 1:00 - 3:00 (Diagnosis & Peta Kelemahan)**: Jalankan Diagnosis Fondasi. Jawab beberapa soal dengan memicu miskonsepsi (misal: menjumlahkan suku tidak sejenis pada aljabar $2x + 3y = 5xy$). Tampilkan laporan Peta Kelemahan Konsep.
3.  **Menit 3:00 - 4:30 (Peta Belajar & Dashboard Siswa)**: Masuk ke Dashboard Siswa (`/student/dashboard`). Tunjukkan widget "Rekomendasi Langkah Berikutnya" yang secara dinamis menyuruh siswa membuka Jembatan Konsep Pecahan. Tunjukkan status kuncian di Peta Belajar.
4.  **Menit 4:30 - 6:30 (Eksplorasi Jembatan Konsep & Visualisasi)**: Masuk ke rute Jembatan Konsep Pecahan. Klik `"Ke Media Visualisasi"`. Demonstrasikan bagaimana visualisasi pizza membantu siswa menyadari bahwa ukuran potongan (penyebut) harus disamakan terlebih dahulu sebelum digabungkan.
5.  **Menit 6:30 - 8:30 (Drill & Mastery Check)**: Buka Drill Pecahan. Lalui Fase 1 secara ringkas, beralih ke Fase 2 (simulasikan salah klik untuk menunjukkan munculnya *hints* bertahap), lalu jelaskan pentingnya kelulusan 80% pada Mastery Check untuk membuka kunci bab Persen.
6.  **Menit 8:30 - 9:30 (Dashboard Analitis Guru)**: Buka `/teacher/dashboard`. Tunjukkan Peta Miskonsepsi Kelas. Terangkan perbedaan mendasar dasbor ini yang fokus pada *penyembuhan miskonsepsi*, bukan membanding-bandingkan nilai siswa. Tunjukkan daftar intervensi konkret yang bisa dipraktikkan guru.
7.  **Menit 9:30 - 10:00 (Penutup)**: Sampaikan narasi penutup dan buka sesi tanya jawab.

---

## 10. Narasi Pembuka Demo
> *"Bapak dan Ibu sekalian, selamat pagi/siang. Mari kita bayangkan seorang anak kelas 7 SMP yang selalu mendapatkan nilai 90 di sekolah dasar karena hafal perkalian dan rumus pecahan. Namun, begitu masuk materi aljabar dan persamaan linear, nilainya merosot tajam menjadi 30. Kenapa? Guru mengira anak tersebut malas. Padahal, masalah sebenarnya adalah dia memendam miskonsepsi fundamental: dia mengira penjumlahan pecahan dilakukan dengan menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut secara langsung.*
>
> *Di sekolah biasa, kesalahan hanya dibubuhi coretan merah dan pengurangan poin. Anak tidak pernah tahu letak bolong berpikirnya.*
> *Hari ini, saya ingin mengenalkan **Akalmatika**: platform pembelajaran matematika interaktif yang dirancang bukan untuk menguji, melainkan untuk **mendiagnosis dan menyembuhkan miskonsepsi matematika dasar** siswa secara adaptif, agar matematika kembali masuk akal bagi mereka."*

---

## 11. Narasi Penutup Demo
> *"Seperti yang telah kita lihat bersama, Akalmatika tidak menyodorkan bank berisi ribuan soal acak yang membuat anak stres. Akalmatika mendampingi siswa mengenali letak bolong fondasinya, memberikan jembatan berpikir lewat model visual konkret, melatihnya secara bertahap, hingga siswa benar-benar menguasainya secara mandiri.*
>
> *Di sisi lain, Akalmatika melengkapi guru dengan visualisasi data sebaran kesalahan kelas. Guru tidak lagi meraba-raba materi apa yang belum dipahami secara kolektif, melainkan langsung mendapatkan rekomendasi intervensi fisik yang siap diterapkan di kelas esok pagi.*
> *Akalmatika meredefinisi cara kita mengajarkan matematika: **Paham Dulu, Baru Rumus**. Terima kasih, saya kembalikan kepada forum untuk sesi tanya jawab."*

---

## 12. FAQ Singkat saat Tanya Jawab

### Q: "Apakah aplikasi ini sudah tersambung dengan database?"
**A**: *"Versi MVP Demo Stable v1 ini dirancang sebagai demo aplikasi mandiri (serverless client-side). Seluruh data kemajuan belajar siswa disimpan secara lokal di dalam peramban web (`localStorage`) sehingga demo dapat berjalan instan tanpa setup backend yang rumit. Di fase pengembangan selanjutnya, data layer ini akan langsung diintegrasikan dengan database backend (seperti PostgreSQL/MySQL) melalui REST API."*

### Q: "Apakah aplikasi ini menggunakan AI?"
**A**: *"Untuk saat ini, diagnosis dan deteksi miskonsepsi dilakukan menggunakan **mesin aturan pedagogis terstruktur** (pedagogical rule engine). Setiap pilihan opsi salah pada soal ujian didesain khusus berdasarkan hasil riset miskonsepsi matematika riil di sekolah. Dengan cara ini, diagnosis kami 100% presisi secara ilmiah dan dapat diandalkan tanpa risiko halusinasi AI. Namun, AI dapat diintegrasikan di masa depan untuk men-generasi variasi soal drill baru yang setara."*

### Q: "Apa bedanya aplikasi ini dengan platform bank soal biasa?"
**A**: *"Platform bank soal biasa berfokus pada kuantitas pengerjaan latihan dan skor akhir (benar/salah). Siswa yang salah hanya diberikan teks pembahasan statis lalu disuruh lanjut. Akalmatika berfokus pada kualitas pemahaman. Kami mendeteksi **pola** di balik jawaban salah siswa, mewajibkan mereka melewati Jembatan Konsep visual, dan mengunci materi tingkat lanjut sampai fondasinya terbukti kokoh."*

### Q: "Bagaimana cara praktis guru memakai dasbor ini di sekolah?"
**A**: *"Guru dapat membuka dasbor kelas sebelum memulai bab baru atau kelas pengayaan. Dengan melihat Peta Miskonsepsi Kelas, guru langsung tahu bahwa (misalnya) 18 dari 28 siswanya salah paham tentang konsep menyamakan penyebut. Guru tidak perlu mengulang materi pecahan dari awal secara membosankan, melainkan cukup mengambil modul aktivitas remediasi fisik (melipat kertas) yang disarankan oleh dasbor untuk diajarkan langsung secara klasikal."*

### Q: "Apakah aplikasi ini sudah bisa dipakai oleh siswa sekarang?"
**A**: *"Aplikasi ini sudah berstatus stabil untuk mendemokan alur belajar penuh (end-to-end) pada rantai topik: **Bilangan Bulat $\rightarrow$ Pecahan $\rightarrow$ Persen $\rightarrow$ Aljabar $\rightarrow$ PLSV**. Siapa pun dapat mengakses rute demo ini secara lokal maupun melalui hosting statis (seperti Vercel) untuk mencoba langsung seluruh alur diagnosis hingga kelulusan materi."*
