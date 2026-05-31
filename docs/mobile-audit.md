# Mobile UX Audit Report

## 1. Landing Portal (`App.tsx`, activeRole === "landing")
- **Viewport Bermasalah:** 320x640, 360x740
- **Masalah Visual:** Judul besar berisiko terpotong atau wrap tidak bagus.
- **Penyebab Teknis:** `text-3xl md:text-5xl` mungkin butuh clamp() atau sm: breakpoint.
- **Risiko Pedagogis:** Kesan pertama buruk, terlihat tidak profesional.
- **Status:** WARN
- **Rencana Perbaikan:** Tambahkan `text-[clamp(1.75rem,5vw,3rem)]` atau susun padding.

## 2. Student Portal (`StudentPortal.tsx`, activeRole === "siswa")
- **Viewport Bermasalah:** 320x640
- **Masalah Visual:** 
  - Soal dengan teks tebal (4 - (-3)) mungkin menyentuh margin box.
  - Curtain transition (animasi buka tutup visualisasi) menggunakan `max-h-[1200px]` dan `max-h-[2500px]` yang berisiko terpotong jika konten sangat panjang di mobile.
- **Penyebab Teknis:** `text-3xl sm:text-4xl` bisa diganti `text-[clamp(1.5rem,8vw,3rem)]`. Transisi tinggi fixed max-h.
- **Status:** WARN
- **Rencana Perbaikan:** Gunakan fluid text sizing. Ubah `max-h-[1200px]` ke `grid-template-rows` atau height auto dengan framer-motion jika memungkinkan, tapi untuk sementara tingkatkan limit atau hapus m-0.

## 3. Teacher Portal (`TeacherPortal.tsx`, activeRole === "guru")
- **Viewport Bermasalah:** 320x640, 375x812
- **Masalah Visual:**
  - Tabel siswa scroll horizontal (horizontal scroll) menutupi layar atau tidak kelihatan shadow-nya.
  - Box pedoman strategi (Kanan) `min-h-[450px]` bisa membuang spasi kosong atau terpotong.
- **Penyebab Teknis:** Tabel tidak dibungkus `overflow-x-auto max-w-full`. `min-h-[450px]`.
- **Status:** WARN
- **Rencana Perbaikan:** Tambahkan container tabel `w-full overflow-x-auto`. Hapus `min-h-[450px]` dan gunakan `h-full` atau flex-grow.

## 4. Developer Lab - Tabs (`App.tsx`, activeRole === "developer")
- **Viewport Bermasalah:** 320x640
- **Masalah Visual:** Deretan tab "Overview", "Sandbox", dll. melebar dan turun berantakan.
- **Penyebab Teknis:** `<nav>` menggunakan `flex flex-wrap gap-1 max-w-full` tanpa padding yang cukup di mobile.
- **Status:** PASS (Sudah flex-wrap, tapi butuh cek ulang padding).
- **Rencana Perbaikan:** Tambahkan `overflow-x-auto flex-nowrap md:flex-wrap` agar bisa discroll di HP.

## 5. Trace Simulator (`TraceSimulator.tsx`, activeTab === "simulation")
- **Viewport Bermasalah:** 360x740
- **Masalah Visual:** Panel output console terlalu kecil atau besar.
- **Penyebab Teknis:** `min-h-[460px]`, `max-h-[150px]` pada log.
- **Status:** WARN
- **Rencana Perbaikan:** Gunakan aspect-ratio atau `h-[50vh]` untuk console log.

## 6. Coin Sandbox (`CoinSandbox.tsx`, activeTab === "sandbox")
- **Viewport Bermasalah:** 320x640, 390x844
- **Masalah Visual:**
  - Caption (text penjelasan guru) "absolute" di atas canvas sering keluar layar dan terpotong horizontal.
  - `whitespace-nowrap` di beberapa popup membuat teks nabrak margin.
- **Penyebab Teknis:** `absolute w-full max-w-sm` pada text caption.
- **Risiko Pedagogis:** Penjelasan zero-pair tidak terbaca utuh, siswa kehilangan konteks pembelajaran.
- **Status:** FAIL
- **Rencana Perbaikan:** Ganti caption dari `absolute` menjadi block biasa `relative flex-col` di atas/bawah area interaktif. Hapus `whitespace-nowrap` yang berisiko.

## 7. Interactive Number Line (`InteractiveNumberLine.tsx`)
- **Viewport Bermasalah:** 320x640
- **Masalah Visual:** Angka pada garis dan persamaan vektor bertumpuk.
- **Penyebab Teknis:** `min-w-[64px] absolute whitespace-nowrap`.
- **Risiko Pedagogis:** Vektor negatif vs positif membingungkan karena tertutup padding.
- **Status:** FAIL
- **Rencana Perbaikan:** Ubah layout formula dari absolute horizontal ke wrap atau ubah ukuran font. Gunakan flex-wrap.
