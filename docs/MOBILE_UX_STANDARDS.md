# Akalmatika Core-Trace: Mobile UX & UI Development Standards

Dokumen ini berisi standar pengembangan antarmuka (UI) dan pengalaman pengguna (UX) khusus untuk perangkat *mobile* (smartphone). Standar ini dirumuskan berdasarkan audit empiris terhadap kendala *overflow*, *overlapping*, dan keterbacaan yang pernah terjadi.

Jadikan dokumen ini sebagai rujukan kebenaran (Ground Truth) setiap kali Anda merancang komponen, halaman, atau materi interaktif baru di proyek ini.

---

## 1. Hindari *Fixed Width* dan *Fixed Height* yang Kaku
Jangan menggunakan nilai absolut yang memaksa dimensi elemen melebihi layar ponsel terkecil (320px).
- **❌ JANGAN:** `w-[400px]`, `min-w-[120px]`, `min-h-[450px]`
- **✅ GUNAKAN:** `w-full`, `max-w-full`, `min-w-0 md:min-w-[120px]`, `h-full`
- **Kenapa?** Ukuran layar HP sangat bervariasi. Memaksa *fixed min-width* akan menyebabkan *horizontal scroll* yang tidak diinginkan (halaman bisa tergeser ke kiri/kanan).

## 2. Aturan Teks dan Pembungkusan (Text Wrapping)
Teks keterangan, instruksi, dan persamaan matematika yang panjang harus bisa turun ke baris bawah jika ruangnya sempit.
- **❌ JANGAN:** Membiarkan komponen dibungkus oleh `whitespace-nowrap` yang memaksa teks memanjang menyamping ke luar layar.
- **✅ GUNAKAN:** `flex-wrap`, `max-w-full`, dan `break-words`. 
- **Pengecualian:** `whitespace-nowrap` hanya boleh digunakan pada elemen mini seperti *Badge*, Tombol pendek, atau *Tooltip* mungil.

## 3. Bahaya Posisi Absolut (*Absolute Positioning*) pada Teks/Konten Dinamis
Komponen *caption* atau instruksi dinamis sebaiknya tidak melayang bebas karena tinggi (height) kontainernya tidak akan bisa mendeteksi ukuran teks *absolute* tersebut.
- **❌ JANGAN:** Menggunakan `absolute` untuk meletakkan teks panjang atau *caption* responsif. Ini akan menyebabkan teks menabrak elemen di bawahnya.
- **✅ GUNAKAN:** `relative block` agar elemen mengikuti aliran dokumen (*document flow*) dan mendorong elemen di bawahnya dengan rapi.
- **Solusi Animasi Bertumpuk (*Fusion*):** Jika elemen **wajib** dibuat `absolute` demi keperluan animasi bertumpuk/transisi (misal: angka `3` berubah transisi menjadi `5`), pastikan kontainer induknya memiliki **teks tak terlihat (invisible spacer)**.
  ```tsx
  {/* Teks invisible menjaga ukuran lebar/tinggi asli kontainer meski anak lainnya absolute */}
  <div className="relative h-16 flex items-center justify-center">
    <span className="invisible px-1">{teksTerpanjang}</span>
    <span className="absolute animate-fadeIn">{teksLama}</span>
    <span className="absolute animate-fadeOut">{teksBaru}</span>
  </div>
  ```

## 4. Penanganan Tabel dan Daftar yang Lebar (Horizontal Scrolling)
Tabel matriks, daftar nilai, atau elemen *grid* pedagogi yang terlalu lebar harus bisa di-*scroll* secara independen, BUKAN menyeret seluruh layar ponsel.
- **✅ STRUKTUR YANG BENAR:**
  ```tsx
  <div className="w-full max-w-full overflow-hidden">
    <div className="w-full overflow-x-auto hide-scrollbar">
      <table className="min-w-full">
         {/* Isi Tabel */}
      </table>
    </div>
  </div>
  ```

## 5. Tab Navigasi (*Horizontal Tabs*)
Rentetan tombol filter atau tab menu tidak boleh dirender menumpuk rapat (*dense*) yang akan memakan porsi tinggi layar HP secara berlebihan.
- **✅ GUNAKAN:** Scroll horizontal pada HP, dan alihkan ke *Wrap* pada Desktop.
  `className="flex overflow-x-auto flex-nowrap md:flex-wrap hide-scrollbar"`

## 6. Animasi Transisi *Collapse/Expand* (Tirai Accordion)
Saat merancang elemen yang bisa membuka/menutup (seperti melihat detail pengerjaan soal), kita sering mengandalkan batas `max-h` untuk transisi CSS.
- **❌ JANGAN:** Menggunakan batas pas-pasan seperti `max-h-[1000px]`. Konten dinamis seperti *chat AI* atau deret perhitungan panjang di HP akan mudah terpotong (*clipped*) pada bagian bawahnya.
- **✅ GUNAKAN:** Batas toleransi yang sangat besar untuk state terbuka, contohnya: `max-h-[5000px] opacity-100`.

## 7. Filosofi *Mobile-First Styling* (Tailwind)
Tulislah *class* CSS standar selalu untuk layar HP terlebih dahulu, lalu timpa perubahannya untuk layar yang lebih besar dengan awalan `md:` (tablet) atau `lg:` (desktop).
- **Contoh Benar:** `flex-col md:flex-row text-sm md:text-base p-4 md:p-8`

---
*Dokumen ini merupakan standar wajib bagi semua kolaborator AI yang terlibat dalam modifikasi kode Akalmatika Core-Trace selanjutnya.*
