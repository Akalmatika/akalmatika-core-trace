# Akalmatika Current Project Context

*Dokumen ini merupakan hasil audit otomatis terhadap basis kode aktual per tahap terakhir pengembangan. Dokumen ini bertujuan menjadi referensi (single source of truth) untuk AI atau developer lanjutan.*

---

## 1. Identitas Proyek
- **Nama Proyek:** Akalmatika Core-Trace (Google JuaraVibeCode 2026)
- **Deskripsi Singkat:** Aplikasi web interaktif berbasis AI dan analitik kognitif untuk mendiagnosis dan memperbaiki miskonsepsi siswa pada operasi bilangan bulat negatif.
- **Tujuan Utama Produk:** Mengubah sistem penilaian "benar/salah" konvensional menjadi jejak pelacakan kognitif (*cognitive trace*) yang mendeteksi letak kesalahan pola pikir (bug logik) siswa.
- **Target Pengguna:** Siswa (untuk latihan/remedial) dan Guru (untuk dasbor analitik kelas), serta Developer (untuk inspeksi sistem).
- **Masalah Pendidikan yang Diselesaikan:** Banyak siswa hanya sekadar menghafal aturan (seperti "minus ketemu minus jadi plus") tanpa pemahaman konsep yang mendasar (seperti *zero-pair*), sehingga sering melakukan kesalahan sistematis.

---

## 2. Tech Stack
Berikut adalah teknologi aktual yang **benar-benar terpasang** di `package.json` dan digunakan dalam proyek:
- **Framework Utama:** React 19 + Vite (Single Page Application murni).
- **Bahasa:** TypeScript.
- **Styling System:** Tailwind CSS v4.
- **State Management:** React local state (`useState`, `useEffect`) lintas komponen (belum ada Redux/Zustand).
- **Pustaka AI:** `@google/genai` (Gemini AI terintegrasi di komponen `AITutorChat`).
- **Render Matematika:** `katex` dan `react-katex` untuk rendering persamaan matematika (*equation*).
- **Ikon dan Animasi:** `lucide-react` (SVG icons) dan `motion` (Framer Motion).
- **Backend/Database Aktual:** Saat ini masih menggunakan *Mock Data* dan `localStorage`. Integrasi Supabase yang tertulis di blueprint statis **belum** diimplementasikan ke dalam kode logika aktual.

---

## 3. Struktur Folder Penting
- `src/` (Root dari logika React)
  - `App.tsx` : Titik masuk utama aplikasi (berfungsi sebagai *Router*).
  - `blueprints.ts` : Berisi data master (katalog miskonsepsi, profil bug).
  - `components/` : Kumpulan blok antarmuka.
    - `StudentPortal.tsx` : Halaman siswa (Diagnostik, Remedial, Drilling).
    - `TeacherPortal.tsx` : Dasbor analitik guru.
    - `CoinSandbox.tsx` : Manipulatif visualisasi berbasis konsep elemen Es (Negatif) & Api (Positif) / *Zero-Pair*.
    - `InteractiveNumberLine.tsx` : Manipulatif garis bilangan.
    - `AITutorChat.tsx` : Komponen *chatbot* Gemini untuk intervensi pedagogis (scaffolding).
    - `TraceSimulator.tsx` : Alat developer untuk menguji mesin deteksi miskonsepsi.

---

## 4. Route Aktual
**PENTING:** Proyek ini **BUKAN** Next.js App Router, bukan Pages Router, dan **TIDAK MENGGUNAKAN** `react-router-dom`. Routing dilakukan sepenuhnya dengan manipulasi State (Conditional Rendering) di dalam `src/App.tsx`.

| State (Role/Tab) | Lokasi File | Fungsi | Status |
|---|---|---|---|
| `activeRole === "landing"` | `App.tsx` | Menu utama pemilihan persona (Siswa, Guru, Developer). | Aktif |
| `activeRole === "siswa"` | `StudentPortal.tsx` | Alur ujian diagnostik, mode remedial visual, dan drilling tak berhingga. | Aktif |
| `activeRole === "guru"` | `TeacherPortal.tsx` | Dasbor statistik kelas, tingkat akurasi, dan jenis miskonsepsi. | Aktif (Sebagian Dummy Data) |
| `activeRole === "developer"` | `App.tsx` | Menampilkan sub-menu tab developer lab. | Aktif |
| `activeTab === "overview"` | `App.tsx` | Penjelasan ringkasan arsitektur (teks statis). | Aktif |
| `activeTab === "sandbox"` | `CoinSandbox.tsx` | Area bebas untuk eksperimen manipulasi Koin Zero-Pair. | Aktif |
| `activeTab === "simulation"` | `TraceSimulator.tsx` | Simulasi logik deteksi miskonsepsi. | Aktif |
| `activeTab === "schema"` | `DatabaseSchema.tsx` | Gambar skema ERD Supabase statis (Mock). | Aktif (Placeholder) |
| `activeTab === "stack"` | `StackSection.tsx` | Penjelasan spesifikasi tech stack (Mock). | Aktif (Placeholder) |
| `activeTab === "directory"` | `FolderStructure.tsx` | Penjelasan diagram arsitektur file (Mock). | Aktif (Placeholder) |

---

## 5. Komponen Utama Lintas Halaman
- **`CoinSandbox`**
  - **Lokasi:** `src/components/CoinSandbox.tsx`
  - **Fungsi:** Menyediakan ruang manipulasi koin (+1 dan -1). Koin berlawanan yang bertumpuk akan hangus (zero-pair). Tampilan mobile-nya baru saja dioptimasi agar tidak *overflow*.
- **`AITutorChat`**
  - **Lokasi:** `src/components/AITutorChat.tsx`
  - **Fungsi:** Komponen *floating chat* bertenaga Gemini yang dipanggil saat siswa gagal menjawab dengan benar, bertugas memberikan dialog Socratic / scaffolding.

---

## 6. Fitur yang Sudah Ada (Terimplementasi Penuh)
- Navigasi antar portal (*Role Selection*).
- **Portal Siswa:** Deteksi miskonsepsi melalui input soal `(a) operasi (b) = (input siswa)`. Terdapat mode pengerjaan, deteksi ketidaksesuaian logika, perolehan *streak score* (Drilling), dan lemparan ke mode Visualisasi saat salah.
- **Manipulasi Koin (*Coin Sandbox*):** Interaksi menambahkan koin positif/negatif untuk mencapai target kalkulasi.
- **Desain Responsif UI Mobile:** Teks *header* dan persamaan matematika besar otomatis mengecil dan melakukan *wrap* (termasuk tombol) di layar seluler.
- **AITutorChat:** Chat interface yang dapat mendiagnosis *bugcode* siswa.

---

## 7. Fitur yang Belum Ada / Masih Placeholder
- **Database & Auth Aktual:** Autentikasi guru/siswa dan persistensi data ke cloud (Supabase) belum di-coding sama sekali. Sebagian *history* saat ini disimpan lewat LocalStorage (`akalmatika_misconceptions`) atau langsung *hardcoded mock array*.
- **DatabaseSchema & FolderStructure:** Masih sekadar komponen presentasi UI, belum merefleksikan kondisi cloud sesungguhnya.

---

## 8. Bug / Masalah Aktif
- **Bug Layout / Mobile:** Telah diselesaikan secara mayor pada `StudentPortal.tsx` dan `CoinSandbox.tsx` (teks *overflow*, tumpukan tombol di mobile), namun harus dipantau setiap kali ada penambahan teks / angka yang sangat panjang.
- **Bug Data / Logic:** `TeacherPortal.tsx` masih mengandalkan variabel konstan `mockStudents` yang digabung paksa dengan `localStorage` history siswa. Angka akurasi belum tersinkronisasi murni dengan *database*.

---

## 9. Keputusan Desain yang Sudah Dikunci
- **Bilingual / Copywriting:** Pola bahasa bercampur Indonesia-Inggris (Indonesia untuk narasi utama pembelajaran, Inggris untuk UI Developer/Sistem).
- **Warna & Layout:** Estetika *premium glassmorphism* dan *border radius* melingkar (rounded-2xl/3xl) menggunakan palet Indigo, Slate, Emerald, dan Rose.
- **Mobile First Constraint:** Semua pembaharuan UI wajib memastikan font ukuran besar (`text-5xl` dst) menggunakan modifier penurun resolusi (contoh: `text-3xl md:text-5xl`).

---

## 10. Prinsip Pedagogi Produk
- **Scaffolding sebelum Jawaban (Productive Struggle):** Sistem (maupun AITutorChat) dilarang keras langsung membeberkan jawaban yang benar. Aplikasi selalu berusaha mengumpan pemikiran siswa menggunakan *socratic questioning*.
- **Visualisasi Konkret (Zero-Pair):** Pembelajaran tidak mengandalkan hafal-menghafal aturan mutlak (mis: "minus kali minus jadi plus"). Siswa dipaksa membuktikan dengan menetralkan utang (koin es/merah) dan uang (koin api/biru) secara logis.

---

## 11. Cara Menjalankan Project
Karena ini proyek murni Vite + React:
1. **Install dependencies:** `npm install`
2. **Jalankan local server:** `npm run dev`
3. **Build produksi:** `npm run build`
4. **Deploy:** Menggunakan CLI Vercel (`npx vercel --prod`).

---

## 12. Prioritas Pengembangan Berikutnya
1. **Wajib Dibereskan:** Integrasi backend nyata (mungkin Firebase atau Supabase) agar data hasil pengerjaan siswa benar-benar mengalir ke dasbor Guru secara langsung (*real-time*).
2. **Penting Setelah Stabil:** Memperluas bank soal kognitif (menambahkan lebih dari penjumlahan/pengurangan bilangan bulat standar).
3. **Polishing:** Transisi perpindahan komponen (*framer-motion*) yang lebih *smooth* pada bagian Drill.

---

## 13. Catatan Penting untuk AI Lanjutan
- **JANGAN asumsikan proyek ini memakai Next.js atau React Router.** Setiap *route* dilakukan secara *conditional rendering* (berbasis State) di dalam `App.tsx`.
- **Selalu baca isi komponen secara utuh (`view_file`) sebelum menebak nama props.**
- Apabila diminta membuat *feature* baru atau memperbaiki *bug layout*, prioritas Anda adalah **pengalaman pengguna di layar HP**. Selalu pasang *responsive modifier* (`sm:`, `md:`, `lg:`) pada *class* Tailwind yang menangani ukuran huruf (`text-`) dan *flexbox direction* (`flex-col md:flex-row`).
- Pertahankan prinsip pedagogi Akalmatika: jangan menulis fungsi logika yang langsung memberikan *"correct answer"* di baris pertama sapaan AI.

## 14. Catatan Audit Visual Terbaru

Berdasarkan screenshot HP terbaru, mobile layout belum sepenuhnya aman.

Masalah yang masih terlihat:
- Teks caption animasi terpotong secara horizontal.
- Area visualisasi bilangan bulat terlalu tinggi/lebar untuk layar HP.
- Ekspresi matematika besar seperti (-6) - (-2) berisiko terlalu mendominasi layar.
- Tombol visualisasi terlalu besar pada mobile.
- Header/branding memakan ruang vertikal cukup besar.
- Beberapa card terlihat masih desktop-minded walaupun sudah diberi responsive class.

Status mobile saat ini:
PARTIALLY FIXED — perlu audit ulang menyeluruh berbasis viewport dan screenshot.

Instruksi untuk AI lanjutan:
Jangan percaya klaim “mobile sudah selesai” sebelum menjalankan audit pada viewport 320px, 360px, 375px, 390px, 414px, dan 430px.