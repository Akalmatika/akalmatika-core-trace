# Akalmatika Web App Interaktif v2  
## Standar Terpadu Pedagogi, UI/UX, Mobile, dan Kode

Dokumen ini adalah **acuan utama** untuk membangun ulang atau mengembangkan **Akalmatika Web App Interaktif v2**.

Fungsi dokumen ini:
1. Menyatukan standar pedagogi, desain, UX mobile, dan kualitas kode.
2. Menjadi *source of truth* untuk manusia maupun AI coding agent.
3. Mencegah pengembangan yang hanya mempercantik tampilan tetapi gagal menyelesaikan masalah belajar siswa.
4. Menjadi checklist sebelum fitur dianggap selesai.

---

# 0. Keputusan Inti v2

Akalmatika Web App Interaktif v2 bukan sekadar aplikasi latihan soal.  
Aplikasi ini harus menjadi **mesin rehabilitasi pemahaman matematika**:

> dari miskonsepsi → menuju pengalaman konkret → menuju simbol matematika → menuju latihan adaptif → menuju penguasaan.

Setiap fitur wajib menjawab pertanyaan:

1. **Miskonsepsi apa yang sedang disasar?**
2. **Representasi konkret apa yang dipakai untuk membuat konsep masuk akal?**
3. **Bagaimana siswa melihat perubahan dari benda/visual ke bentuk simbolik?**
4. **Bagaimana sistem tahu siswa sudah paham atau belum?**
5. **Apakah fitur ini tetap nyaman di layar HP kecil?**

Jika sebuah fitur tidak menjawab minimal tiga dari lima pertanyaan di atas, fitur itu belum layak masuk v2.

---

# 1. Prinsip Pedagogi Utama

## 1.1 Konkret Sebelum Abstrak

Jangan langsung memberi rumus cepat.

Contoh yang harus dihindari:
- “Minus ketemu minus jadi plus.”
- “Kalau negatif dikurang negatif, tinggal jadi tambah.”
- “Utang dikurangi utang berarti ...”

Standar v2:
- Mulai dari pengalaman manipulatif.
- Siswa melihat benda/visual bekerja.
- Baru kemudian ditunjukkan bentuk simboliknya.
- Rumus muncul sebagai kesimpulan, bukan sebagai perintah awal.

Urutan baku:

```text
Manipulatif konkret → gerak/animasi → persamaan simbolik → kesimpulan → drill
```

---

## 1.2 Gunakan Zero-Pair sebagai Fondasi Bilangan Negatif

Untuk operasi bilangan bulat, gunakan konsep **Pasangan Nol / Zero-Pair**.

Standar representasi:
- **Es = +1**
- **Api = -1**
- Satu Es dan satu Api saling menetralkan menjadi 0.
- Netralisasi dapat divisualkan sebagai hilang, uap, redup, atau efek “cancel”.

Larangan:
- Jangan memakai analogi “utang”, “uang kas”, “kaya”, “miskin” sebagai fondasi utama.
- Jangan memakai objek abstrak tanpa makna jika metafora Es–Api bisa digunakan.
- Jangan membalik makna: **Api adalah negatif, Es adalah positif.**

---

## 1.3 Pengurangan Harus Didefinisikan Secara Konsisten

Pengurangan bilangan negatif tidak boleh dijelaskan sebagai “dibuang” atau “diambil” secara mentah.

Definisi baku:

> Mengurangkan suatu bilangan sama artinya dengan menambahkan lawannya.

Bentuk simbolik:

```text
a - b = a + (-b)
a - (-b) = a + b
```

Untuk animasi, perubahan harus terlihat:

```text
5 - (-2)
→ 5 + 2
→ 7
```

Standar animasi:
1. Sorot bilangan awal.
2. Sorot tanda kurang.
3. Munculkan pesan: “Mengurangkan berarti menambahkan lawannya.”
4. Sorot bilangan yang dikurangkan.
5. Ubah bilangan itu menjadi lawannya.
6. Ubah operasi menjadi penjumlahan.
7. Jalankan gerak di garis bilangan.
8. Tampilkan kesimpulan statis.

---

## 1.4 Hindari Rumus Hafalan Tanpa Jejak Nalar

Kalimat seperti “minus ketemu minus jadi plus” hanya boleh muncul sebagai **catatan akhir**, bukan inti pembelajaran.

Format yang benar:

```text
Bukan: minus ketemu minus jadi plus.
Tetapi: mengurangkan -2 berarti menambahkan lawannya, yaitu +2.
Maka 5 - (-2) = 5 + 2 = 7.
```

---

## 1.5 Transparansi Transformasi Persamaan

Jika bentuk persamaan berubah, prosesnya harus terlihat.

Contoh:

```text
-3 - (-5)
```

Tidak boleh langsung menjadi:

```text
-3 + 5
```

Harus ada jembatan visual:

```text
-3 - (-5)
   ↓ tanda kurang berarti tambah lawannya
-3 + (+5)
   ↓ tanda + pada bilangan positif boleh tidak ditulis
-3 + 5
```

Standar UI:
- Tanda operasi dan tanda bilangan harus dibedakan.
- Sorot bagian yang sedang berubah.
- Jangan menampilkan semua penjelasan sekaligus.
- Satu langkah animasi = satu beban berpikir.

---

## 1.6 Eksplorasi Ekuivalensi

Siswa harus sadar bahwa satu nilai dapat dibentuk oleh berbagai bentuk persamaan.

Contoh nilai akhir 2:

```text
5 + (-3) = 2
-3 + 5 = 2
5 - 3 = 2
-3 - (-5) = 2
```

Standar fitur:
- Pada mode eksplorasi bebas, sediakan panel **Kemungkinan Soal Ekuivalen**.
- Setiap opsi punya tombol **Pilih**.
- Saat dipilih, sistem langsung menjalankan animasi persamaan tersebut.
- Tujuan: siswa melihat bahwa “hasil sama” tidak selalu berarti “bentuk soal sama”.

---

## 1.7 Diagnostik Harus Presisi

Latihan tidak boleh sekadar acak.

Setiap jawaban salah harus dipetakan ke miskonsepsi tertentu.

Contoh kode:
- `MC-SUB-AS-TAKEAWAY`: siswa menganggap pengurangan selalu “mengambil benda”.
- `MC-NEG-SIGN-CONF`: siswa bingung membedakan tanda operasi dan tanda bilangan.
- `MC-ZERO-PAIR-MISS`: siswa belum paham bahwa +1 dan -1 menetralkan.
- `MC-DIRECTION-NEG`: siswa salah arah saat menambahkan bilangan negatif di garis bilangan.
- `MC-SUB-NEG-INVERSE`: siswa belum paham bahwa mengurangi negatif berarti menambah positif.

Setiap kode miskonsepsi harus punya:
1. Pesan diagnosis singkat.
2. Visual remediasi.
3. Soal ulang yang spesifik.
4. Kriteria lolos.
5. Rekomendasi drill berikutnya.

---

# 2. Struktur Pengalaman Belajar v2

## 2.1 Dua Mode Utama: Sandbox dan Misi

Setiap alat manipulatif wajib punya dua mode.

### A. Eksplorasi Bebas / Sandbox

Tujuan:
- Siswa mencoba tanpa takut salah.
- Siswa membangun intuisi.
- Sistem tidak menilai benar/salah terlalu cepat.

Fitur minimal:
- Spawn Es.
- Spawn Api.
- Drag/tap elemen.
- Reset kanvas.
- Hitung nilai total.
- Tampilkan pasangan nol.
- Tombol **Kunci Soal & Selesaikan**.

### B. Misi / Drill

Tujuan:
- Siswa mengerjakan soal terarah.
- Sistem mendeteksi pola kesalahan.
- Latihan berikutnya menyesuaikan kebutuhan siswa.

Fitur minimal:
- Soal bertahap.
- Jawaban siswa.
- Feedback benar/salah.
- Animasi remediasi.
- Drill lanjutan sesuai miskonsepsi.
- Mastery check.

---

## 2.2 Lock & Animate

Pada mode bebas, siswa boleh menyusun elemen sendiri.

Setelah itu, siswa menekan:

```text
Kunci Soal & Selesaikan
```

Sistem wajib:
1. Membaca susunan Es dan Api.
2. Mengubahnya menjadi persamaan matematika.
3. Menjalankan animasi penyelesaian.
4. Menampilkan kesimpulan akhir.

Contoh:

```text
3 Es + 2 Api
→ 3 + (-2)
→ satu Es dan satu Api membentuk pasangan nol
→ tersisa 1 Es
→ hasil = 1
```

Makna pedagogis:
- Siswa tidak hanya bermain objek.
- Siswa tahu arti matematis dari tindakannya.
- Jembatan konkret–abstrak terjadi secara eksplisit.

---

## 2.3 Quick-Test untuk Kasus Sulit

Jangan biarkan layar kosong.

Sediakan tombol soal instan yang menyasar miskonsepsi utama.

Contoh untuk operasi bilangan bulat:
- `3 + (-2)`
- `-3 + 5`
- `4 - 7`
- `4 - (-3)`
- `-3 - (-5)`
- `-2 + (-4)`
- `0 - (-6)`
- `-5 - 3`

Setiap quick-test harus:
- Bisa langsung ditekan.
- Menjalankan animasi.
- Menampilkan kesimpulan.
- Bisa diulang.

---

## 2.4 Aturan Terlihat di Dekat Kanvas

Aturan dasar tidak boleh disembunyikan jauh dari area interaksi.

Untuk garis bilangan:
- Menjumlahkan positif → bergerak ke kanan.
- Menjumlahkan negatif → bergerak ke kiri.
- Mengurangkan bilangan → menambahkan lawannya.

Untuk Zero-Pair:
- Es = +1.
- Api = -1.
- Es + Api = 0.
- Yang tersisa menentukan hasil.

Standar:
- Aturan tampil permanen di dekat kanvas.
- Tidak terlalu panjang.
- Gunakan ikon/warna konsisten.
- Tooltip hanya untuk catatan tambahan, bukan aturan utama.

---

## 2.5 Micro-Learning

Penjelasan kecil boleh disisipkan, tetapi jangan membebani siswa.

Contoh:
- Setelah hasil positif, tampilkan tooltip:
  > Tahukah kamu? Bilangan positif seperti +3 biasanya cukup ditulis 3.
- Setelah siswa menyelesaikan `a - (-b)`, tampilkan:
  > Mengurangi bilangan negatif sama dengan menambah bilangan positif.

Aturan:
- Satu tooltip = satu ide.
- Jangan tampilkan semua catatan sekaligus.
- Tooltip di HP harus bisa muncul dengan tap/focus, bukan hover saja.

---

# 3. Standar UI/UX Umum

## 3.1 Kompak dan Terintegrasi

Informasi yang saling menjelaskan harus berada dalam satu area.

Jangan memisahkan terlalu jauh:
- Soal.
- Persamaan.
- Visualisasi.
- Tombol animasi.
- Kesimpulan.

Struktur ideal:

```text
[Soal + Persamaan Aktif]
[Kanvas Visualisasi]
[Kontrol Utama]
[Kesimpulan / Feedback]
```

Hindari:
- Terlalu banyak kartu.
- Padding kosong berlebihan.
- Scroll panjang untuk satu aktivitas kecil.
- Penjelasan yang tercerai dari visualnya.

---

## 3.2 Hierarki Visual

Urutan perhatian siswa harus jelas:

1. Soal aktif.
2. Area visualisasi.
3. Langkah yang sedang terjadi.
4. Tombol tindakan utama.
5. Catatan tambahan.

Standar:
- Gunakan ukuran teks berbeda.
- Gunakan warna sorot hanya untuk elemen yang sedang aktif.
- Jangan semua elemen dibuat mencolok.
- Feedback salah/benar harus terlihat tanpa membuat siswa merasa “dihukum”.

---

## 3.3 Teks Edukatif Selalu Terbaca

Teks penting tidak boleh tertutup elemen animasi.

Standar:
- Teks di atas kanvas harus punya background pill/kapsul.
- Gunakan shadow atau backdrop blur.
- Z-index teks edukatif harus lebih tinggi dari objek visual.
- Jangan letakkan caption panjang sebagai absolute bebas.
- Jika absolute wajib dipakai, gunakan invisible spacer pada parent.

---

## 3.4 Heroic Feedback

Saat siswa menekan tombol penting seperti **Animasikan**, **Soal Baru**, atau **Kunci Soal**, UI harus memberi respons yang terasa hidup.

Standar:
- Auto-scroll ke area kanvas.
- Container utama diberi efek pop singkat.
- Glow/box-shadow ringan.
- Animasi tidak boleh berlebihan sampai mengganggu fokus.

Contoh perilaku:
- Jawaban benar → pulse hijau/emerald ringan.
- Jawaban salah → shake halus, bukan agresif.
- Target berikutnya → bounce/pulse kecil.
- Objek berpindah → transition halus.

---

## 3.5 Desain Premium, Bukan Ramai

Arah visual:
- Modern.
- Bersih.
- Kaya secukupnya.
- Bukan flat mentah.
- Bukan terlalu kekanak-kanakan.

Standar warna:
- Hindari merah/biru murni yang terasa default.
- Gunakan palet Tailwind seperti `indigo`, `emerald`, `rose`, `sky`, `slate`, `amber`.
- Es sebaiknya bernuansa dingin: `sky`, `cyan`, `blue`.
- Api sebaiknya bernuansa panas/negatif: `rose`, `orange`, `red`.
- Tetap konsisten: **Es = positif, Api = negatif.**

Elemen visual:
- Gunakan `lucide-react` untuk ikon.
- Gunakan `drop-shadow` secukupnya.
- Gunakan `backdrop-blur` untuk panel melayang.
- Gunakan radius besar dan shadow lembut.
- Jangan membuat semua komponen glossy.

---

## 3.6 Branding dan Escape Hatch

Logo **Akalmatika** harus:
- Tertulis benar, bukan “Alamatika”.
- Konsisten kapitalisasinya.
- Bisa diklik untuk kembali ke beranda / portal peran.
- Berfungsi sebagai escape hatch dari halaman mana pun.

Watermark:
- Boleh gunakan `AKALMATIKA ENGINE` pada lapisan visual.
- Jangan mengganggu fokus belajar.
- Jadikan penanda orisinalitas, bukan dekorasi berlebihan.

---

# 4. Standar Mobile-First

Akalmatika v2 harus dianggap gagal jika nyaman di desktop tetapi rusak di HP.

## 4.1 Jangan Pakai Fixed Width/Height yang Kaku

Larangan:
```tsx
w-[400px]
min-w-[120px]
min-h-[450px]
```

Gunakan:
```tsx
w-full
max-w-full
min-w-0 md:min-w-[120px]
h-full
```

Alasan:
- HP kecil bisa 320px.
- Fixed width memicu horizontal scroll.
- Konten matematika sering panjang dan butuh wrapping.

---

## 4.2 Teks Harus Bisa Membungkus

Larangan:
```tsx
whitespace-nowrap
```

kecuali untuk:
- badge pendek,
- tombol pendek,
- label mini,
- tooltip kecil.

Gunakan:
```tsx
flex-wrap
max-w-full
break-words
min-w-0
```

Untuk persamaan panjang:
- Biarkan turun baris.
- Atau bungkus dalam container scroll horizontal lokal.
- Jangan sampai seluruh halaman ikut melebar.

---

## 4.3 Absolute Positioning Tidak Boleh untuk Caption Panjang

Larangan:
```tsx
<div className="absolute">penjelasan panjang...</div>
```

Gunakan:
```tsx
<div className="relative block">penjelasan panjang...</div>
```

Jika absolute wajib untuk animasi fusion:
```tsx
<div className="relative h-16 flex items-center justify-center">
  <span className="invisible px-1">{teksTerpanjang}</span>
  <span className="absolute animate-fadeIn">{teksLama}</span>
  <span className="absolute animate-fadeOut">{teksBaru}</span>
</div>
```

---

## 4.4 Touch-First Interactivity

HTML5 native drag-and-drop tidak boleh dijadikan satu-satunya mekanisme interaksi.

Standar:
- Gunakan `onTouchStart`.
- Gunakan `onTouchMove`.
- Gunakan `onTouchEnd`.
- Tambahkan `touch-none` pada draggable object dan area kanvas.
- Pastikan layar tidak scroll saat siswa menyeret objek.

Alternatif lebih aman:
- Tap untuk memilih objek.
- Tap area kanvas untuk menaruh objek.
- Tombol `+ Es` dan `+ Api` untuk menambah objek.
- Drag hanya sebagai peningkatan pengalaman, bukan satu-satunya cara.

---

## 4.5 Target Sentuh Minimal

Tombol HP tidak boleh pipih.

Standar minimal:
```tsx
px-3 py-2
min-h-[44px]
min-w-[44px]
```

Larangan:
```tsx
p-1
h-6
text-xs untuk tombol utama
```

Tombol utama seperti **Animasikan**, **Kunci Soal**, **Cek Jawaban** harus mudah ditekan dengan jempol.

---

## 4.6 Hover Tidak Boleh Jadi Satu-satunya Cara

HP tidak punya hover.

Jika memakai tooltip:
- Tambahkan `tabIndex={0}`.
- Dukung `focus`.
- Dukung `focus-within`.
- Dukung `active`.
- Bisa dibuka dengan tap.

Jangan hanya:
```tsx
group-hover:opacity-100
```

---

## 4.7 Tabel, Grid, dan Tab Lebar

Jika elemen terlalu lebar, scroll harus terjadi di dalam komponen, bukan seluruh halaman.

Struktur:

```tsx
<div className="w-full max-w-full overflow-hidden">
  <div className="w-full overflow-x-auto hide-scrollbar">
    <table className="min-w-full">
      {/* isi */}
    </table>
  </div>
</div>
```

Tab horizontal di HP:

```tsx
className="flex overflow-x-auto flex-nowrap md:flex-wrap hide-scrollbar"
```

---

## 4.8 Accordion / Collapse

Konten dinamis di HP sering lebih tinggi dari perkiraan.

Larangan:
```tsx
max-h-[1000px]
```

Gunakan:
```tsx
max-h-[5000px] opacity-100
```

atau gunakan pendekatan state + height auto dengan library animasi yang aman.

---

## 4.9 Mobile-First Tailwind

Tulis default untuk HP, lalu naikkan untuk desktop.

Benar:
```tsx
flex-col md:flex-row text-sm md:text-base p-4 md:p-8
```

Salah:
```tsx
flex-row text-base p-8
```

lalu panik memperbaiki HP belakangan.

---

# 5. Standar Navigasi dan State

## 5.1 URL Harus Mewakili Perubahan Besar

Jangan hanya mengandalkan React state internal untuk perubahan besar.

Gunakan:
- route,
- search params,
- segment path,
- atau state persistence yang kompatibel dengan browser navigation.

Contoh:
```text
/?role=student
/student/sandbox/integer
/student/drill/integer
/student/progress
```

Tujuan:
- Tombol Back browser bekerja.
- Siswa tidak kehilangan konteks.
- Guru/orang lain bisa membuka link langsung.
- Debug lebih mudah.

---

## 5.2 State Belajar Harus Tahan Refresh

Minimal state:
- hasil diagnostik,
- miskonsepsi aktif,
- progress topik,
- mastery level,
- riwayat jawaban,
- rekomendasi drill berikutnya.

Untuk MVP:
- `localStorage` cukup.

Untuk versi lebih matang:
- database user,
- session tracking,
- analytics event,
- teacher dashboard.

---

## 5.3 Jangan Campur Semua Logika di UI

Pisahkan:
- `components/` untuk tampilan.
- `lib/diagnostics/` untuk pemetaan miskonsepsi.
- `lib/pedagogy/` untuk aturan konsep.
- `lib/animation/` untuk langkah animasi.
- `data/` untuk soal dan learning map.
- `types/` untuk tipe data.

Komponen UI tidak boleh menjadi tempat utama logika pedagogi.

---

# 6. Standar Modul Interaktif

Setiap modul matematika v2 minimal punya struktur ini:

```text
1. Identitas Modul
2. Tujuan Konseptual
3. Miskonsepsi Target
4. Mode Eksplorasi Bebas
5. Mode Misi/Drill
6. Visualisasi Utama
7. Jembatan Konkret ke Simbolik
8. Quick-Test
9. Feedback Adaptif
10. Mastery Check
11. Catatan Mobile UX
12. Data Soal dan Rubrik
```

Template metadata:

```ts
type AkalmatikaModule = {
  id: string;
  title: string;
  conceptGoal: string;
  prerequisites: string[];
  targetMisconceptions: MisconceptionCode[];
  manipulatives: string[];
  representations: ("concrete" | "visual" | "symbolic" | "verbal")[];
  quickTests: QuickTest[];
  masteryCriteria: MasteryCriteria;
};
```

---

# 7. Standar Feedback dan Adaptasi

## 7.1 Feedback Salah

Feedback salah tidak boleh hanya:

```text
Salah.
```

Format standar:

```text
Belum tepat. Pola jawabanmu menunjukkan kamu mungkin masih menganggap tanda kurang sebagai “ambil langsung”.
Coba lihat: mengurangkan -3 berarti menambahkan lawannya, yaitu +3.
```

Harus ada:
1. Validasi ringan.
2. Diagnosis miskonsepsi.
3. Penjelasan satu langkah.
4. Tombol remediasi visual.

---

## 7.2 Feedback Benar

Feedback benar tidak boleh hanya:

```text
Benar.
```

Format standar:

```text
Tepat. Kamu sudah melihat bahwa 4 - (-3) sama dengan 4 + 3, karena mengurangkan bilangan negatif berarti menambahkan lawannya.
```

Harus menguatkan nalar, bukan sekadar skor.

---

## 7.3 Adaptasi Drill

Setelah siswa salah:
- jangan langsung naik tingkat,
- jangan acak soal baru,
- berikan soal yang memukul miskonsepsi sama.

Contoh:
Jika salah pada `4 - (-3)`, lanjutkan dengan:
- `2 - (-5)`
- `0 - (-4)`
- `-3 - (-2)`

Baru setelah beberapa benar berturut-turut, naik variasi.

---

# 8. Standar Kode dan Kestabilan

## 8.1 Validasi Wajib Sebelum Selesai

Sebelum melaporkan selesai, jalankan:

```bash
npx tsc --noEmit
npm run build
```

Jika ada test:
```bash
npm test
```

Jika ada lint:
```bash
npm run lint
```

Fitur belum selesai jika:
- build gagal,
- TypeScript error,
- halaman utama crash,
- interaksi HP rusak,
- ada horizontal scroll tidak disengaja,
- tombol utama terlalu kecil,
- teks tertutup objek.

---

## 8.2 Console Hygiene

Larangan:
- `console.log` debug berserakan.
- `console.error` uji coba di luar error handling.

Boleh:
- log dalam `catch`,
- log dev-only dengan guard,
- error boundary yang jelas.

---

## 8.3 Deployment-Ready

Jika targetnya SPA/static:
- siapkan `Dockerfile`,
- `.dockerignore`,
- `nginx.conf`,
- fallback route untuk internal routing agar refresh halaman tidak 404.

Jika Next.js:
- sesuaikan dengan mode deployment yang dipakai.
- Jangan mencampur konfigurasi SPA murni dan SSR tanpa sadar.

---

# 9. Checklist Wajib v2

Gunakan checklist ini sebelum fitur dianggap selesai.

## 9.1 Pedagogi

- [ ] Miskonsepsi target ditulis jelas.
- [ ] Tidak langsung memberi rumus cepat.
- [ ] Ada representasi konkret.
- [ ] Ada transisi konkret → simbolik.
- [ ] Transformasi persamaan terlihat langkah demi langkah.
- [ ] Pengurangan dijelaskan sebagai menambahkan lawannya.
- [ ] Zero-Pair dipakai untuk bilangan positif/negatif.
- [ ] Ada kesimpulan akhir statis.
- [ ] Ada quick-test kasus sulit.
- [ ] Ada feedback sesuai pola salah siswa.

## 9.2 UI/UX

- [ ] Soal, visualisasi, kontrol, dan kesimpulan tidak tercerai.
- [ ] Tidak ada ruang kosong berlebihan.
- [ ] Teks penting tidak tertutup objek/tombol.
- [ ] Ada hierarki visual jelas.
- [ ] Ada micro-animation untuk aksi penting.
- [ ] Logo Akalmatika benar dan bisa diklik ke Home.
- [ ] Warna Es/Api konsisten.
- [ ] Tombol utama mudah terlihat.

## 9.3 Mobile

- [ ] Tidak ada fixed width/height yang merusak HP.
- [ ] Tidak ada horizontal scroll global.
- [ ] Teks panjang bisa wrap.
- [ ] Touch interaction berjalan.
- [ ] Draggable area memakai `touch-none`.
- [ ] Tombol minimal 44x44 px.
- [ ] Tooltip bisa tap/focus, bukan hover saja.
- [ ] Tab lebar scroll lokal.
- [ ] Accordion tidak memotong konten.

## 9.4 Kode

- [ ] Logika pedagogi tidak bercampur penuh di komponen UI.
- [ ] Data soal dipisah dari tampilan.
- [ ] Kode miskonsepsi terdokumentasi.
- [ ] TypeScript aman.
- [ ] Build berhasil.
- [ ] Tidak ada debug console liar.
- [ ] Navigasi kompatibel dengan browser Back.
- [ ] State penting tidak hilang saat refresh.

---

# 10. Definisi Selesai untuk Akalmatika Web App Interaktif v2

Sebuah fitur dinyatakan selesai jika:

1. **Benar secara matematika.**
2. **Jelas secara pedagogi.**
3. **Terasa hidup secara interaktif.**
4. **Tidak pecah di HP.**
5. **Memiliki feedback adaptif.**
6. **Build berhasil tanpa error.**
7. **Bisa dijelaskan ulang oleh siswa setelah mencobanya.**

Kalimat kuncinya:

> Fitur Akalmatika tidak selesai ketika tampilannya bagus.  
> Fitur selesai ketika siswa yang tadinya bingung punya jembatan berpikir yang bisa ia ikuti.

---

# 11. Prompt Siap Pakai untuk Antigravity / AI Coding Agent

Salin prompt ini ketika memulai pembangunan Akalmatika Web App Interaktif v2.

```text
# GOAL
Bangun Akalmatika Web App Interaktif v2 dengan menjadikan dokumen standar terpadu ini sebagai source of truth utama.

Aplikasi ini bukan sekadar latihan soal. Tujuannya adalah membangun mesin pembelajaran matematika interaktif yang membantu siswa keluar dari hafalan dangkal menuju pemahaman yang masuk akal melalui:
1. diagnosis miskonsepsi,
2. manipulatif konkret,
3. visualisasi langkah demi langkah,
4. transformasi konkret ke simbolik,
5. latihan adaptif,
6. mastery check,
7. pengalaman mobile-first yang benar-benar nyaman.

# NON-NEGOTIABLE PEDAGOGY
- Jangan langsung memakai rumus cepat seperti “minus ketemu minus jadi plus”.
- Untuk bilangan bulat, gunakan Zero-Pair.
- Es = +1 dan Api = -1.
- Jangan pakai analogi utang/kaya/miskin sebagai fondasi utama.
- Pengurangan harus dijelaskan sebagai “menambahkan lawannya”.
- Setiap perubahan persamaan harus divisualkan langkah demi langkah.
- Setiap jawaban salah harus dipetakan ke kode miskonsepsi, bukan diberi feedback acak.
- Latihan lanjutan harus merespons miskonsepsi siswa.

# REQUIRED LEARNING FLOW
Untuk setiap modul interaktif, buat alur:
1. Portal / pemilihan modul.
2. Eksplorasi Bebas atau Sandbox.
3. Kunci Soal & Selesaikan.
4. Animasi penyelesaian.
5. Kesimpulan statis.
6. Misi / Drill.
7. Feedback adaptif.
8. Mastery Check.
9. Progress ringkas.

# REQUIRED INTEGER MODULE FEATURES
Untuk modul Operasi Bilangan Bulat:
- Mode Es & Api / Zero-Pair.
- Mode Garis Bilangan.
- Quick-test kasus sulit:
  - 3 + (-2)
  - -3 + 5
  - 4 - 7
  - 4 - (-3)
  - -3 - (-5)
  - -2 + (-4)
  - 0 - (-6)
  - -5 - 3
- Panel Kemungkinan Soal Ekuivalen.
- Tooltip “Tahukah Kamu?” untuk aturan konvensi seperti +3 cukup ditulis 3.
- Kesimpulan akhir seperti:
  “Kesimpulan: 5 - (-2) = 5 + 2 = 7.”

# UI/UX REQUIREMENTS
- Desain harus kompak, rapi, modern, dan premium.
- Soal, visualisasi, kontrol, dan kesimpulan harus berada dalam satu alur visual yang dekat.
- Jangan membuat kartu-kartu tercerai dengan blank space berlebihan.
- Elemen edukatif seperti rumus dan caption harus selalu terbaca.
- Gunakan background pill, shadow, z-index aman untuk teks di atas kanvas.
- Gunakan micro-animation:
  - shake halus untuk salah,
  - pulse/bounce untuk target berikutnya,
  - pop/glow untuk kanvas yang baru diperbarui.
- Gunakan auto-scroll ke area visualisasi setelah aksi penting.
- Logo Akalmatika harus benar, konsisten, dan clickable menuju Home.

# MOBILE-FIRST REQUIREMENTS
- Tulis styling untuk mobile dulu, baru md/lg.
- Jangan gunakan fixed width/height yang memecah layar HP.
- Hindari horizontal scroll global.
- Teks panjang harus wrap dengan `break-words`, `min-w-0`, `max-w-full`.
- Jangan gunakan absolute positioning untuk caption panjang.
- Jika absolute wajib untuk animasi, gunakan invisible spacer.
- Touch interaction harus berjalan:
  - onTouchStart,
  - onTouchMove,
  - onTouchEnd,
  - touch-none.
- Tombol utama minimal 44x44 px.
- Tooltip harus bisa dibuka dengan tap/focus, bukan hover saja.
- Tab lebar harus scroll horizontal lokal di HP.
- Accordion/collapse tidak boleh memotong konten.

# ARCHITECTURE REQUIREMENTS
Pisahkan:
- components/ untuk UI,
- data/ untuk soal dan modul,
- lib/diagnostics/ untuk pemetaan miskonsepsi,
- lib/pedagogy/ untuk aturan konsep,
- lib/animation/ untuk langkah animasi,
- types/ untuk tipe data.

Jangan campur semua logika pedagogi di satu komponen besar.

# STATE AND ROUTING
- Perubahan halaman/peran/modul harus tercermin di URL.
- Browser Back harus bekerja.
- State penting seperti hasil diagnostik, miskonsepsi aktif, dan progress tidak boleh hilang saat refresh.
- Untuk MVP boleh gunakan localStorage.

# QUALITY BAR
Sebelum menyatakan selesai:
1. Jalankan `npx tsc --noEmit`.
2. Jalankan `npm run build`.
3. Bersihkan console.log debug.
4. Audit tampilan mobile 320px, 375px, 390px, dan desktop.
5. Pastikan tidak ada teks tertutup, overlap, horizontal scroll global, atau tombol terlalu kecil.
6. Uji alur siswa dari sandbox → lock & animate → drill → feedback → mastery.

# OUTPUT EXPECTATION
Kerjakan dengan pendekatan self-audit:
1. Implementasikan fitur.
2. Jalankan validasi.
3. Audit pedagogi.
4. Audit mobile.
5. Perbaiki masalah yang ditemukan.
6. Laporkan file yang dibuat/diubah, hasil build, dan sisa risiko dengan jujur.

Jangan hanya mempercantik tampilan. Utamakan jembatan berpikir siswa.
```

---

# 12. Catatan Arah v2

Arah terbaik untuk v2 adalah:

```text
Mulai dari satu modul kecil yang benar-benar tajam:
Operasi Bilangan Bulat → Es/Api + Garis Bilangan + Diagnostik Miskonsepsi.
```

Jangan langsung membuat banyak topik.

Lebih baik satu modul:
- pedagoginya kuat,
- animasinya jelas,
- HP-nya rapi,
- feedback-nya adaptif,
- bisa dipakai sebagai template semua modul berikutnya.

Setelah modul bilangan bulat matang, barulah pola ini diturunkan ke:
- pecahan,
- desimal,
- persen,
- perbandingan,
- PLSV,
- fungsi,
- peluang,
- statistika,
- kalkulus dasar.

---
