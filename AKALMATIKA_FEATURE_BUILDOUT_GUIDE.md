# Panduan AI — Mengisi Struktur Fitur Akalmatika yang Belum Ada

> Dokumen ini adalah referensi bagi AI atau developer untuk membangun fitur-fitur yang sudah dijanjikan di landing page tetapi belum memiliki implementasi. Baca dokumen ini **sebelum** menulis kode apapun.

> [!CAUTION]
> **Anti Vibe-Coding.** Jangan membangun fitur hanya karena "terasa perlu". Setiap fitur harus punya data yang mengalirinya dan koneksi jelas ke alur belajar Akalmatika. Jika sebuah halaman tidak bisa menampilkan data bermakna dari tahap sebelumnya, halaman itu belum saatnya dibangun.

---

## 0. Konteks Cepat

| Aspek | Detail |
|---|---|
| **Framework** | React 19 + Vite + TypeScript |
| **Styling** | Tailwind CSS v4 (import `@import "tailwindcss"` di `index.css`) |
| **Routing** | `react-router-dom` v7 — semua route terdaftar di `src/App.tsx` |
| **State** | React local state (`useState`, `useEffect`). Belum ada Redux/Zustand |
| **Database** | Belum ada. Data saat ini disimpan di `localStorage` atau hardcoded |
| **AI** | `@google/genai` (Gemini) terintegrasi di `AITutorChat.tsx` |
| **Math render** | `katex` + `react-katex` (`BlockMath`, `InlineMath`) |
| **Icons** | `lucide-react` |
| **Animation** | `motion` (Framer Motion) + utilitas CSS di `index.css` |
| **Font** | Plus Jakarta Sans (Google Fonts, dimuat di `index.html`) |

---

## 1. Identitas Produk — Jangan Sampai Hilang

Akalmatika **bukan** platform ujian, bank soal, atau tryout online. Akalmatika adalah **sistem diagnosis dan pemulihan pemahaman matematika**.

Setiap fitur yang dibangun harus memperkuat siklus inti ini:

```
Diagnosis → Deteksi Miskonsepsi → Jembatan Konsep → Visualisasi → Drilling → Mastery
```

Jika sebuah fitur tidak memperkuat siklus di atas, pertanyakan apakah fitur itu perlu dibangun sekarang.

---

## 2. Peta Status Fitur

### ✅ Sudah Ada (Jangan Rusak)

| Fitur | Route | File Utama |
|---|---|---|
| Landing Page | `/` | `src/pages/LandingPage.tsx` |
| Katalog Diagnosis | `/student/diagnostic` | `src/pages/DiagnosticCatalogPage.tsx` |
| Tes Diagnosis (per topik) | `/student/diagnostic/:topicId` | `src/pages/DiagnosticPage.tsx` + `src/components/diagnostic/DiagnosticTestEngine.tsx` |
| Katalog Visualisasi | `/student/visualizations` | `src/pages/VisualizationCatalogPage.tsx` |
| Visualisasi Integer | `/student/visualizations/integer/*` | `src/pages/IntegerVisualizationPage.tsx` + sub-pages |
| Visualisasi Pecahan | `/student/visualizations/fractions/*` | `src/pages/FractionVisualizationPage.tsx` + 7 sub-pages |
| Visualisasi Persen | `/student/visualizations/percent/*` | `src/pages/PercentVisualizationPage.tsx` + 3 sub-pages |
| Visualisasi Aljabar | `/student/visualizations/algebra/*` | `src/pages/AlgebraVisualizationPage.tsx` + 9 sub-pages |
| AI Tutor Chat | (komponen floating) | `src/components/AITutorChat.tsx` |

### 🔴 Belum Ada — Harus Dibangun

| No | Fitur | Route yang Direncanakan | Prioritas |
|---|---|---|---|
| 1 | Progress Storage Service | (bukan route — service internal) | **Tinggi — bangun pertama** |
| 2 | Diagnosis Fondasi MVP | `/student/diagnostic-foundation` | **Tinggi** |
| 3 | Learning Map Bertahap | `/student/learning-map` | **Tinggi** |
| 4 | Jembatan Berpikir (Bridge) | `/student/bridge/:topicId/:misconceptionCode` | **Tinggi** |
| 5 | Drilling Terstruktur | `/student/drill/:topicId` | **Sedang** |
| 6 | Mastery Check | `/student/mastery/:topicId` | **Sedang** |
| 7 | Dashboard Siswa | `/student/dashboard` | **Sedang — setelah data tersedia** |
| 8 | Dashboard Guru | `/teacher/dashboard` | **Sedang — setelah data tersedia** |

> [!WARNING]
> **Jangan membangun UI dashboard besar sebelum data diagnosis, mastery, dan progress tersedia.**
> Dashboard tanpa data bermakna hanya akan menjadi halaman kosong yang terlihat rapi.
> Bangun pipeline data dulu (progressStorage → diagnosis → bridge → drill → mastery), baru bangun dashboard yang membaca data tersebut.

---

## 3. Data Flow Minimal Akalmatika

Ini adalah alur data yang **harus ada dan terhubung** sebelum sebuah fitur dianggap selesai. Setiap tahap menghasilkan data yang dikonsumsi oleh tahap berikutnya.

```
DiagnosticResult
  │  Dihasilkan oleh: DiagnosticTestEngine
  │  Berisi: topicId, answers[], isPerfectTrack, detectedMisconceptionCode, confidence
  │
  ▼
detectedMisconceptionCode
  │  Digunakan oleh: mapper.ts → getBridgeRoute()
  │  Menentukan: bridge mana yang ditampilkan
  │
  ▼
BridgeContent
  │  Diambil dari: src/data/bridgeContent.ts
  │  Berisi: narasi konsep, pertanyaan pemandu, link visualisasi, link drill
  │  Disimpan: bridgeVisited = true di progressStorage
  │
  ▼
VisualizationRoute
  │  Diambil dari: mapper.ts → getVisualizationRoute()
  │  Visualisasi yang sudah ada (zero pair, garis bilangan, dll.)
  │  Disimpan: visualizationCompleted = true di progressStorage
  │
  ▼
DrillProgress
  │  Dihasilkan oleh: DrillPage
  │  Berisi: currentPhase (1/2/3), accuracy per fase, totalAttempts
  │  Disimpan: di progressStorage per topicId
  │
  ▼
MasteryResult
  │  Dihasilkan oleh: MasteryCheckPage
  │  Berisi: passed (boolean), score, attemptDate
  │  Disimpan: di progressStorage per topicId
  │
  ▼
LearningMapStatus
  │  Dihitung dari: semua MasteryResult
  │  Menentukan: node mana yang locked / available / mastered
  │  Dibaca oleh: LearningMapPage
  │
  ▼
DashboardSummary
  │  Dihitung dari: semua data di atas
  │  Dibaca oleh: StudentDashboardPage, TeacherDashboardPage
  │  HANYA dibangun setelah data di atasnya sudah mengalir
```

> [!IMPORTANT]
> Jika kamu membangun fitur di tahap bawah tanpa memastikan tahap atasnya menghasilkan data, kamu sedang *vibe-coding*. Berhenti dan bangun dari atas ke bawah.

---

## 4. Aturan Teknis: Progress Storage Service

### Satu pintu masuk untuk semua data progress

**File:** `src/services/progressStorage.ts`

> [!CAUTION]
> **Semua akses `localStorage` WAJIB melewati service ini.**
> Jangan baca/tulis `localStorage` langsung dari halaman atau komponen manapun.
> Ini mencegah data tersebar, inkonsisten, dan sulit di-debug.

**Kontrak service yang harus diimplementasikan:**

```ts
// src/services/progressStorage.ts

// ─── Tipe Data ───────────────────────────────────────────

interface DiagnosticResult {
  topicId: string;
  date: string;                           // ISO date
  isPerfectTrack: boolean;
  detectedMisconceptionCode: string | null;
  confidence: number;
  matchRatio: string;
  answers: (number | string)[];
}

interface BridgeVisit {
  topicId: string;
  misconceptionCode: string;
  visitedDate: string;
  completedVisualization: boolean;
}

interface DrillProgress {
  topicId: string;
  currentPhase: 1 | 2 | 3;
  phase1Completed: boolean;
  phase2Accuracy: number;
  phase3Accuracy: number;
  totalAttempts: number;
  lastAttemptDate: string;
}

interface MasteryResult {
  topicId: string;
  passed: boolean;
  score: number;
  attemptDate: string;
}

type MasteryLevel = 'not-started' | 'diagnosed' | 'bridging' | 'drilling' | 'mastered';

interface TopicProgress {
  topicId: string;
  masteryLevel: MasteryLevel;
  diagnosticResults: DiagnosticResult[];
  bridgeVisits: BridgeVisit[];
  drillProgress: DrillProgress | null;
  masteryResults: MasteryResult[];
}

// ─── API Publik ───────────────────────────────────────────

// Diagnosis
function saveDiagnosticResult(result: DiagnosticResult): void;
function getDiagnosticResults(topicId: string): DiagnosticResult[];
function getLatestDiagnostic(topicId: string): DiagnosticResult | null;

// Bridge
function saveBridgeVisit(visit: BridgeVisit): void;
function getBridgeVisits(topicId: string): BridgeVisit[];

// Drill
function saveDrillProgress(progress: DrillProgress): void;
function getDrillProgress(topicId: string): DrillProgress | null;

// Mastery
function saveMasteryResult(result: MasteryResult): void;
function getMasteryResults(topicId: string): MasteryResult[];
function isTopicMastered(topicId: string): boolean;

// Agregat
function getTopicProgress(topicId: string): TopicProgress;
function getAllProgress(): TopicProgress[];
function getMasteryLevel(topicId: string): MasteryLevel;

// Learning Map
function getAvailableTopics(): string[];  // topik yang prasyaratnya sudah mastered
function isTopicUnlocked(topicId: string): boolean;
```

**Aturan implementasi:**
- Semua data disimpan di `localStorage` dengan key tunggal: `akalmatika_progress`
- Nilai di-serialize/deserialize sebagai JSON
- Setiap fungsi `save*` harus melakukan read-modify-write secara atomik
- Setiap fungsi `get*` harus mengembalikan default kosong jika belum ada data, bukan `null` atau error

**Integrasi dengan kode existing:**
- `DiagnosticTestEngine.tsx` saat ini **tidak menyimpan** hasil diagnosis ke localStorage. Setelah `progressStorage.ts` dibuat, tambahkan pemanggilan `saveDiagnosticResult()` di saat result ditampilkan.

---

## 5. Arsitektur Umum — Cara Menambah Fitur Baru

### 5.1 Membuat Halaman Baru

```
src/
├── services/
│   └── progressStorage.ts       ← BUAT PERTAMA
├── pages/
│   ├── LandingPage.tsx          ← halaman publik (layout sendiri)
│   ├── DiagnosticCatalogPage.tsx ← di dalam StudentLayout
│   ├── DiagnosticFoundationPage.tsx ← BUAT DI SINI
│   ├── LearningMapPage.tsx      ← BUAT DI SINI
│   ├── BridgePage.tsx           ← BUAT DI SINI
│   ├── DrillPage.tsx            ← BUAT DI SINI
│   ├── MasteryCheckPage.tsx     ← BUAT DI SINI
│   ├── StudentDashboardPage.tsx ← BUAT SETELAH DATA MENGALIR
│   └── TeacherDashboardPage.tsx ← BUAT TERAKHIR
```

### 5.2 Mendaftarkan Route

Buka `src/App.tsx`, tambahkan route baru **di dalam** blok `<Route path="/student" element={<StudentLayout />}>`:

```tsx
// Di dalam <Route path="/student" ...>
<Route path="diagnostic-foundation" element={<DiagnosticFoundationPage />} />
<Route path="dashboard" element={<StudentDashboardPage />} />
<Route path="learning-map" element={<LearningMapPage />} />
<Route path="bridge/:topicId/:misconceptionCode" element={<BridgePage />} />
<Route path="drill/:topicId" element={<DrillPage />} />
<Route path="mastery/:topicId" element={<MasteryCheckPage />} />
```

> **PENTING:** Route `/` (landing page) ada di LUAR StudentLayout.
> Semua route `/student/*` ada di DALAM StudentLayout.
> Jangan mengubah struktur ini.

### 5.3 Pola Komponen Halaman

Setiap halaman harus mengikuti pola yang konsisten:

```tsx
// Template halaman standar Akalmatika
import { progressStorage } from "../services/progressStorage";

export default function NamaHalamanPage() {
  // Baca data dari progressStorage, BUKAN langsung dari localStorage
  // const data = progressStorage.getTopicProgress("integer");

  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Judul Halaman
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Deskripsi singkat halaman.
        </p>
      </div>

      {/* Konten */}
      <div>
        {/* ... */}
      </div>
    </div>
  );
}
```

### 5.4 Panduan Styling

- Warna utama: `blue-600`, `indigo-600`, `slate-900`
- Background: `bg-white` untuk card, `bg-slate-50` untuk section
- Border: `border border-slate-150` atau `border-slate-200`
- Radius: `rounded-2xl` untuk card besar, `rounded-xl` untuk elemen kecil
- Shadow: `shadow-xs` atau `shadow-sm`, hindari shadow besar
- Font weight: `font-black` untuk heading, `font-bold` untuk sub-heading, `font-semibold` untuk label
- Font size: selalu pasang responsive modifier (`text-sm md:text-base`)
- Spacing: gunakan `space-y-*` untuk layout vertikal, `gap-*` untuk grid/flex
- Animasi masuk: gunakan kelas `animate-fadeIn` (sudah didefinisikan di `index.css`)

---

## 6. Spesifikasi Detail Per Fitur

---

### Fitur 1: Diagnosis Fondasi MVP

**Route:** `/student/diagnostic-foundation`
**File:** `src/pages/DiagnosticFoundationPage.tsx`
**Prioritas:** **Tinggi — ini adalah pintu masuk utama Akalmatika**

**Tujuan:**
Tes komprehensif ringan yang mencakup SEMUA topik fondasi dalam satu sesi. Siswa tidak perlu memilih topik satu per satu — cukup tekan "Mulai Diagnosis Fondasi" dan sistem akan mengukur keseluruhan fondasi mereka.

**Spesifikasi MVP (bukan adaptif penuh):**
- 10–15 soal, dipilih dari pool soal yang sudah ada di `src/engine/rules/`
- Mencakup 5 area: integer, pecahan, persen, aljabar dasar, dan makna tanda sama dengan
- Distribusi: 2–3 soal per area
- Soal diambil dari `integerCluster`, `fractionsCluster`, `percentCluster`, `algebraCluster`, `plsvCluster` yang sudah ada
- **Belum perlu adaptif** — cukup urutan tetap yang mewakili fondasi kunci

**Output setelah selesai:**
Halaman ringkasan "Peta Kelemahan Fondasimu" yang menampilkan:

```
┌───────────────────────────────────────────────────┐
│  Peta Kelemahan Fondasimu                         │
├───────────────────────────────────────────────────┤
│  Bilangan Bulat    ████████░░  3/3 benar  ✅ Kuat │
│  Pecahan           ███░░░░░░░  1/3 benar  ⚠️ Perlu│
│  Persen            ██████░░░░  2/3 benar  ⚠️ Perlu│
│  Aljabar Dasar     ░░░░░░░░░░  0/2 benar  🔴 Lemah│
│  Tanda Sama Dengan ████████░░  2/2 benar  ✅ Kuat │
├───────────────────────────────────────────────────┤
│  Rekomendasi: Mulai dari Pecahan                  │
│  Miskonsepsi terdeteksi: MC-FRAC-DIFF-DENOM       │
│  [Mulai Jembatan Konsep: Pecahan]                 │
│  [Lihat Peta Belajar]                             │
└───────────────────────────────────────────────────┘
```

**Perbedaan dengan diagnosis per-topik yang sudah ada:**
- Diagnosis per-topik (`/student/diagnostic/:topicId`) mendalami SATU topik → deteksi miskonsepsi spesifik
- Diagnosis Fondasi MVP (`/student/diagnostic-foundation`) menyapu SEMUA topik → peta kelemahan lebar

**Data yang disimpan (via progressStorage):**
- Untuk setiap area: `saveDiagnosticResult()` dengan skor per area
- Rekomendasi topik pertama yang harus ditangani

**Hubungan ke LandingPage:**
Tombol "Mulai Diagnosis Fondasi" di hero dan CTA akhir harus mengarah ke route ini.

---

### Fitur 2: Learning Map Bertahap

**Route:** `/student/learning-map`
**File:** `src/pages/LearningMapPage.tsx`

**Tujuan:**
Visualisasi peta perjalanan belajar dari SD ke SMP ke SMA. Setiap node adalah satu topik. Node terkunci jika prasyarat belum mastered.

**Sumber status:** `progressStorage.getMasteryLevel()` dan `progressStorage.isTopicUnlocked()`

**Struktur data map:**

```ts
// src/data/learningMap.ts
interface MapNode {
  id: string;                  // "integer", "fractions", dll
  title: string;
  level: 'SD' | 'SMP' | 'SMA';
  prerequisites: string[];     // id node yang harus mastered dulu
  diagnosticRoute: string;     // link ke diagnosis topik ini
}
```

**Urutan topik yang disarankan:**

```
Level SD:
  1. Bilangan Bulat (integer)         — prasyarat: tidak ada
  2. Pecahan (fractions)              — prasyarat: integer
  3. Persen (percent)                 — prasyarat: fractions

Level SMP:
  4. Operasi Campuran (mixed-ops)     — prasyarat: integer, fractions
  5. Aljabar Dasar (algebra)          — prasyarat: integer, fractions
  6. PLSV (plsv)                      — prasyarat: algebra

Level SMA:
  7. (belum ada konten)               — placeholder
```

**Status node dihitung dari `progressStorage`:**
- `mastered`: `progressStorage.isTopicMastered(id)` → hijau
- `in-progress`: sudah ada DiagnosticResult tapi belum mastered → biru
- `available`: semua prasyarat mastered, tapi belum pernah diagnosis → biru outline
- `locked`: ada prasyarat yang belum mastered → abu-abu

**Rendering:**
- Desktop: peta horizontal dengan garis penghubung antar node (bisa SVG path atau CSS)
- Mobile: daftar vertikal dengan indikator status (🔒 / ⏳ / ✅)
- Node locked: klik menampilkan tooltip "Selesaikan [prasyarat] terlebih dahulu"

---

### Fitur 3: Jembatan Berpikir (Bridge Page)

**Route:** `/student/bridge/:topicId/:misconceptionCode`
**File:** `src/pages/BridgePage.tsx`
**Data:** `src/data/bridgeContent.ts`

**Tujuan:**
Halaman penjelasan konsep yang muncul setelah diagnosis menemukan miskonsepsi. Ini adalah "jembatan" sebelum siswa masuk ke visualisasi dan drilling.

> [!CAUTION]
> **Bridge Page TIDAK BOLEH menjadi artikel pembahasan biasa.**
> Jika bridge hanya berisi "penjelasan konsep" panjang seperti buku teks, maka bridge itu gagal.
> Bridge harus membuat siswa *berpikir*, bukan sekadar *membaca*.

**Setiap Bridge WAJIB mengikuti struktur 7 bagian ini:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. MISKONSEPSI YANG TERDETEKSI                            │
│     "Kamu menjawab 1/2 + 1/3 = 2/5"                       │
│     Pola ini menunjukkan bahwa kamu menjumlahkan            │
│     pembilang dan penyebut secara terpisah.                 │
├─────────────────────────────────────────────────────────────┤
│  2. KENAPA JAWABAN ITU MENGGODA                            │
│     Wajar jika jawabannya terasa benar — karena            │
│     1+1=2 dan 2+3=5 memang logis jika pecahan              │
│     dianggap sebagai dua bilangan biasa.                    │
│     Tapi pecahan bukan dua bilangan biasa.                  │
├─────────────────────────────────────────────────────────────┤
│  3. MAKNA KONSEP                                           │
│     Pecahan adalah SATU bilangan, bukan dua.               │
│     1/2 artinya "satu bagian dari dua bagian sama besar".  │
│     Kamu tidak bisa menjumlahkan potongan yang ukurannya   │
│     berbeda tanpa menyamakan dulu.                          │
├─────────────────────────────────────────────────────────────┤
│  4. CONTOH KONKRET                                         │
│     Bayangkan kamu punya setengah pizza dan sepertiga pizza.│
│     Apakah jadi 2/5 pizza? Coba gambar dan lihat.          │
│     [Ilustrasi / animasi sederhana]                        │
├─────────────────────────────────────────────────────────────┤
│  5. PERTANYAAN PEMANDU                                     │
│     "Jika potongannya berbeda ukuran, langkah apa yang     │
│      harus dilakukan sebelum menjumlahkan?"                │
│     (Bukan pertanyaan retoris — siswa bisa menjawab        │
│      di input atau merenung sebelum lanjut)                 │
├─────────────────────────────────────────────────────────────┤
│  6. LANJUT KE VISUALISASI                                  │
│     [Lihat Konsep Ini Bekerja →]                           │
│     Mengarah ke visualisasi interaktif yang sudah ada       │
├─────────────────────────────────────────────────────────────┤
│  7. LANJUT KE DRILL                                        │
│     [Mulai Latihan Bertahap →]                             │
│     Mengarah ke DrillPage setelah visualisasi selesai       │
└─────────────────────────────────────────────────────────────┘
```

**Interface data:**

```ts
// src/data/bridgeContent.ts
interface BridgeContent {
  topicId: string;
  misconceptionCode: string;
  // 1. Miskonsepsi
  misconceptionTitle: string;        // "Menjumlahkan pembilang dan penyebut"
  whatStudentDid: string;            // "Kamu menjawab 1/2 + 1/3 = 2/5"
  patternExplanation: string;        // "Pola ini menunjukkan..."
  // 2. Kenapa menggoda
  whyTempting: string;               // "Wajar jika terasa benar karena..."
  // 3. Makna konsep
  conceptMeaning: string[];          // Array paragraf penjelasan makna
  // 4. Contoh konkret
  concreteExample: string;           // Deskripsi contoh nyata
  // 5. Pertanyaan pemandu
  thinkingPrompts: string[];         // Pertanyaan untuk siswa
  // 6 & 7. Navigasi
  visualizationRoute: string;        // Link ke visualisasi terkait
  drillRoute: string;                // Link ke drill
}
```

**Mapping dari kode miskonsepsi yang sudah ada** (lihat `src/engine/rules/`):

| Kode Miskonsepsi | Bridge yang Harus Dibuat |
|---|---|
| `MC-ADD-SIGN-CONF` | "Apa yang sebenarnya terjadi saat menjumlahkan bilangan negatif?" |
| `MC-ADD-ABS-SUM` | "Kenapa 5 + (-3) bukan 8? — Konsep zero pair" |
| `MC-SIGN-FIRST-NUM` | "Tanda minus di depan angka: apa maknanya?" |
| `MC-SUB-IGNORE-NEG` | "Pengurangan bilangan negatif lewat garis bilangan" |
| `MC-FRAC-DIFF-DENOM-IGNORE` | "Mengapa 1/2 + 1/3 bukan 2/5?" |
| `MC-FRAC-ADD-NUM-DENOM` | "Apa sebenarnya makna pecahan?" |
| `MC-PERC-NO-100` | "Persen artinya per seratus — bukan hanya angka" |
| `MC-PERC-ADD-ZERO` | "Mengubah persen ke desimal: bukan sekadar tambah nol" |
| `MC-ALG-ADD-UNLIKE` | "Mengapa 2x + 3y bukan 5xy?" |
| `MC-ALG-IGNORE-VAR` | "Koefisien 1 yang tersembunyi: x = 1·x" |
| `MC-PEMDAS-LEFT-RIGHT` | "Urutan operasi: mengapa kali-bagi didahulukan?" |
| `MC-PLSV-INV-OP-CONFUSION` | "Memindahkan ruas: mengapa tanda berubah?" |

**Integrasi dengan alur existing:**
Saat ini, `DiagnosticTestEngine.tsx` mengarahkan siswa langsung ke visualisasi setelah diagnosis (lihat `mapper.ts`). Setelah bridge dibangun, ubah alur menjadi:

```
Diagnosis → Bridge (baru) → Visualisasi (existing) → Drill (baru) → Mastery (baru)
```

---

### Fitur 4: Drilling Terstruktur

**Route:** `/student/drill/:topicId`
**File:** `src/pages/DrillPage.tsx`

**Tujuan:**
Latihan bertahap 3 fase setelah siswa melewati jembatan konsep dan visualisasi.

**Tiga fase drilling:**

```
Fase 1: Contoh Detail (Worked Example)
  → Siswa MELIHAT soal beserta langkah penyelesaian lengkap
  → Tidak perlu menjawab, hanya membaca dan memahami
  → Tampilkan langkah demi langkah dengan animasi

Fase 2: Contoh Terbimbing (Guided Practice)
  → Siswa mengerjakan soal, tapi dengan HINT yang tersedia
  → Jika salah, tampilkan petunjuk (bukan jawaban)
  → Jika salah 2x, tampilkan langkah pertama solusi

Fase 3: Latihan Mandiri (Independent Practice)
  → Siswa mengerjakan sendiri tanpa bantuan
  → Feedback langsung: benar ✓ atau salah ✗
  → Jika akurasi < 70%, kembali ke Fase 2
  → Jika akurasi ≥ 80%, lanjut ke Mastery Check
```

**Sumber soal:**
- Gunakan `DiagnosticQuestion[]` dari `src/engine/rules/` yang sudah ada
- Tambahkan field opsional untuk hint dan worked-example steps:

```ts
interface DrillQuestion extends DiagnosticQuestion {
  workedExampleSteps?: string[];  // LaTeX langkah-langkah (untuk Fase 1)
  hints?: string[];               // Petunjuk bertahap (untuk Fase 2)
}
```

- Buat file `src/data/drillSets.ts` yang berisi soal-soal drill per topik

**Persistensi:** via `progressStorage.saveDrillProgress()`

---

### Fitur 5: Mastery Check

**Route:** `/student/mastery/:topicId`
**File:** `src/pages/MasteryCheckPage.tsx`

**Tujuan:**
Gerbang sebelum siswa dianggap "menguasai" satu topik dan diizinkan lanjut ke topik berikutnya di Learning Map.

**Mekanisme:**
1. Soal lebih sedikit dari diagnosis (3-5 soal), tapi lebih variatif
2. Soal mencakup sub-konsep yang berbeda di topik tersebut
3. Harus benar ≥ 80% untuk dianggap mastered
4. Jika gagal: arahkan kembali ke drill atau bridge yang relevan
5. Jika lulus: `progressStorage.saveMasteryResult({ passed: true })`, unlock node berikutnya di Learning Map

**UI:**
- Mirip `DiagnosticTestEngine` tapi lebih singkat
- Setelah lulus: tampilkan animasi selebrasi dan tombol "Lihat Peta Belajar"
- Setelah gagal: tampilkan analisis singkat + tombol "Kembali ke Latihan"

**Sumber soal:**
Buat file `src/data/masterySets.ts`. Soal mastery harus BERBEDA dari soal diagnosis dan drill agar siswa tidak menghafal jawaban.

---

### Fitur 6: Dashboard Siswa

**Route:** `/student/dashboard`
**File:** `src/pages/StudentDashboardPage.tsx`

> [!WARNING]
> **Bangun fitur ini HANYA setelah Sprint 1-3 selesai dan `progressStorage` sudah mengalirkan data dari diagnosis, bridge, drill, dan mastery.**

**Tujuan:**
Halaman ringkasan kemajuan siswa. Semua data dibaca dari `progressStorage.getAllProgress()`.

**Komponen:**

```
StudentDashboardPage.tsx
├── ProgressRingCard        — Lingkaran progress per topik dari progressStorage
├── WeaknessMapCard         — Daftar miskonsepsi yang terdeteksi
├── RecommendedNextCard     — Rekomendasi topik berikutnya
├── RecentActivityList      — Riwayat aktivitas terbaru
└── QuickActionButtons      — Diagnosis Baru, Lanjutkan Latihan
```

---

### Fitur 7: Dashboard Guru

**Route:** `/teacher/dashboard`
**File:** `src/pages/TeacherDashboardPage.tsx`

> [!WARNING]
> **Fitur ini adalah yang PALING TERAKHIR dibangun.** Tanpa database nyata, dashboard guru hanya bisa membaca data mock atau data localStorage satu browser. Bangun sebagai proof-of-concept dengan data mock yang realistis, tapi sadarilah keterbatasannya.

> **CATATAN:** Route ini berada di LUAR `/student/*`.
> Perlu membuat `TeacherLayout.tsx` di `src/components/layout/`
> atau menggunakan layout tersendiri.

**Tujuan:**
Guru melihat peta miskonsepsi kelas secara agregat, bukan hanya nilai per siswa.

**Komponen:**

```
TeacherDashboardPage.tsx
├── ClassOverviewCard       — Ringkasan: jumlah siswa, rata-rata akurasi
├── MisconceptionHeatmap    — Tabel: topik × miskonsepsi, warna sesuai frekuensi
├── StudentList             — Daftar siswa dengan status per topik
├── TopicBreakdownChart     — Bar chart: % siswa mastered per topik
└── InterventionSuggestion  — Rekomendasi: "30% kelas memiliki MC-FRAC-DIFF-DENOM"
```

**Sumber data:**
- Saat ini: `src/components/TeacherPortal.tsx` sudah ada dengan mock data
- Migrasi data dari `TeacherPortal.tsx` ke halaman baru dengan route terpisah

**Registrasi route:**
Tambahkan di `src/App.tsx` di LUAR blok StudentLayout:

```tsx
import TeacherLayout from "./components/layout/TeacherLayout";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";

<Route path="/teacher" element={<TeacherLayout />}>
  <Route path="dashboard" element={<TeacherDashboardPage />} />
</Route>
```

---

## 7. Alur Lengkap Setelah Semua Fitur Dibangun

```
         ┌──────────┐
         │ Landing  │  (/)
         │  Page    │
         └────┬─────┘
              │
              ├──── Mulai Diagnosis Fondasi ────┐
              │                                 │
              ▼                                 ▼
    ┌─────────────────┐              ┌──────────────────┐
    │  Learning Map   │              │ Diagnosis Fondasi│  (/student/diagnostic-foundation)
    │  (status topik) │              │  MVP (10-15 soal)│
    └────┬────────────┘              └──────┬───────────┘
         │                                 │
         │  Pilih topik                    │  Peta kelemahan + rekomendasi
         ▼                                 │
  ┌──────────────┐                         │
  │  Diagnosis   │  ◄─────────────────────┘
  │  Per-Topik   │  (/student/diagnostic/:topicId)
  └──────┬───────┘
         │
         │  Miskonsepsi terdeteksi?
         │
    No ──┤── Yes
         │      │
         ▼      ▼
  ┌──────────┐  ┌──────────────┐
  │ Mastery  │  │  Jembatan    │  (/student/bridge/:topicId/:mc)
  │  Check   │  │  Berpikir    │
  └──────────┘  └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Visualisasi  │  (/student/visualizations/...)
                │  Interaktif  │  ← sudah ada
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │   Drilling   │  (/student/drill/:topicId)
                │  Terstruktur │
                └──────┬───────┘
                       │
                  Akurasi ≥ 80%?
                  │            │
                  No            Yes
                  │            │
                  ▼            ▼
            Kembali ke    ┌──────────────┐
            Fase 2       │  Mastery     │  (/student/mastery/:topicId)
                         │  Check       │
                         └──────┬───────┘
                                │
                           Lulus ≥ 80%?
                           │          │
                           No          Yes
                           │          │
                           ▼          ▼
                     Kembali ke   Topik MASTERED ✓
                     Drill/Bridge  → progressStorage.saveMasteryResult()
                                   → Unlock topik berikutnya
                                     di Learning Map
```

---

## 8. Update yang Diperlukan pada File Existing

### 8.1 `src/App.tsx` — Tambahkan Route Baru

```tsx
// Route baru yang perlu ditambahkan di dalam <Route path="/student">:
<Route path="diagnostic-foundation" element={<DiagnosticFoundationPage />} />
<Route path="dashboard" element={<StudentDashboardPage />} />
<Route path="learning-map" element={<LearningMapPage />} />
<Route path="bridge/:topicId/:misconceptionCode" element={<BridgePage />} />
<Route path="drill/:topicId" element={<DrillPage />} />
<Route path="mastery/:topicId" element={<MasteryCheckPage />} />
```

### 8.2 `src/engine/rules/mapper.ts` — Tambahkan Bridge Route

```ts
// Tambahkan fungsi baru:
export function getBridgeRoute(topicId: string, misconceptionCode: string | null): string {
  if (!misconceptionCode) {
    return `/student/visualizations/${topicId}`;
  }
  return `/student/bridge/${topicId}/${misconceptionCode}`;
}
```

### 8.3 `src/components/diagnostic/DiagnosticTestEngine.tsx` — Ubah Alur + Simpan Data

Dua perubahan:

**a) Simpan hasil diagnosis ke progressStorage:**
Setelah `setDiagnosticResult(result)` dipanggil, tambahkan:

```ts
import { progressStorage } from "../../services/progressStorage";

// Di dalam blok yang menghitung result:
progressStorage.saveDiagnosticResult({
  topicId,
  date: new Date().toISOString(),
  isPerfectTrack: result.isPerfectTrack,
  detectedMisconceptionCode: result.detectedMisconceptionCode,
  confidence: result.confidence,
  matchRatio: result.matchRatio,
  answers: parsedAns,
});
```

**b) Ubah navigasi dari visualisasi ke bridge (sekitar baris 312):**

```tsx
// SEBELUM:
onClick={() => navigate(getVisualizationRoute(topicId, diagnosticResult.detectedMisconceptionCode))}

// SESUDAH:
onClick={() => navigate(getBridgeRoute(topicId, diagnosticResult.detectedMisconceptionCode))}
```

### 8.4 `src/components/layout/StudentLayout.tsx` — Perbarui Breadcrumb

Tambahkan label breadcrumb untuk route baru:

```ts
if (label === "diagnostic-foundation") label = "Diagnosis Fondasi";
if (label === "dashboard") label = "Dashboard";
if (label === "learning-map") label = "Peta Belajar";
if (label === "bridge") label = "Jembatan Konsep";
if (label === "drill") label = "Latihan";
if (label === "mastery") label = "Mastery Check";
```

### 8.5 `src/pages/LandingPage.tsx` — Update Link CTA

Setelah Diagnosis Fondasi dibangun:

```tsx
// SEBELUM:
<Link to="/student/diagnostic" ...>Mulai Diagnosis Fondasi</Link>

// SESUDAH:
<Link to="/student/diagnostic-foundation" ...>Mulai Diagnosis Fondasi</Link>
```

Setelah Dashboard dibangun:

```tsx
// SEBELUM:
<Link to="/student/visualizations" ...>Masuk Dashboard</Link>

// SESUDAH:
<Link to="/student/dashboard" ...>Masuk Dashboard</Link>
```

---

## 9. File Baru yang Perlu Dibuat (Ringkasan)

### Service (Bangun Pertama)

| File | Isi |
|---|---|
| `src/services/progressStorage.ts` | Satu-satunya pintu akses localStorage. Lihat kontrak di §4. |

### Pages

| File | Route | Sprint |
|---|---|---|
| `src/pages/DiagnosticFoundationPage.tsx` | `/student/diagnostic-foundation` | 1 |
| `src/pages/LearningMapPage.tsx` | `/student/learning-map` | 1 |
| `src/pages/BridgePage.tsx` | `/student/bridge/:topicId/:misconceptionCode` | 2 |
| `src/pages/DrillPage.tsx` | `/student/drill/:topicId` | 3 |
| `src/pages/MasteryCheckPage.tsx` | `/student/mastery/:topicId` | 3 |
| `src/pages/StudentDashboardPage.tsx` | `/student/dashboard` | 4 |
| `src/pages/TeacherDashboardPage.tsx` | `/teacher/dashboard` | 4 |

### Data

| File | Isi | Sprint |
|---|---|---|
| `src/data/bridgeContent.ts` | Konten 7-bagian per kode miskonsepsi | 2 |
| `src/data/drillSets.ts` | Soal drill per topik (3 fase) | 3 |
| `src/data/masterySets.ts` | Soal mastery check per topik | 3 |
| `src/data/learningMap.ts` | Node peta belajar + urutan prasyarat | 1 |
| `src/data/foundationQuestions.ts` | Pool soal diagnosis fondasi (10-15 soal) | 1 |

### Layout

| File | Isi | Sprint |
|---|---|---|
| `src/components/layout/TeacherLayout.tsx` | Layout khusus guru | 4 |

---

## 10. Prinsip yang WAJIB Dipatuhi

### Pedagogi

1. **Jangan pernah langsung memberikan jawaban.** Gunakan scaffolding: hint → pertanyaan pemandu → langkah parsial → jawaban lengkap.
2. **Jembatan Berpikir harus dimulai dari MAKNA, bukan RUMUS.** Contoh: jelaskan dulu apa arti pecahan sebelum menunjukkan cara menjumlahkan.
3. **Setiap kesalahan adalah data, bukan vonis.** UI harus menampilkan kesalahan sebagai "pola yang ditemukan", bukan "kamu salah".
4. **Mastery harus dicapai, bukan dilewati.** Node di Learning Map harus benar-benar terkunci sampai prasyarat mastered.

### Bridge Page — Prinsip Khusus

> [!IMPORTANT]
> Bridge Page adalah **jiwa pembeda Akalmatika**. Ini bukan artikel pembahasan biasa.

5. **Setiap bridge harus mengikuti struktur 7 bagian** (lihat §6 Fitur 3). Tidak boleh ada bridge yang hanya berisi "penjelasan konsep" panjang tanpa konteks miskonsepsi dan pertanyaan pemandu.
6. **Mulai dari apa yang siswa lakukan**, bukan dari apa yang seharusnya. Siswa harus merasa "oh, aku memang berpikir seperti itu" sebelum diajak berpikir ulang.
7. **Akui bahwa jawaban siswa menggoda.** Jangan langsung menghakimi. Tunjukkan *kenapa* pola pikir itu masuk akal sebelum menunjukkan *kenapa* ia keliru.
8. **Pertanyaan pemandu bukan retoris.** Idealnya, siswa bisa mengetik jawaban atau setidaknya merenung sebelum menekan tombol lanjut. Jangan buat pertanyaan yang langsung dijawab di paragraf berikutnya.

### Teknis

9. **Mobile-first.** Selalu pasang responsive modifier Tailwind (`sm:`, `md:`, `lg:`). Test di viewport 360px.
10. **TypeScript strict.** Jangan gunakan `any` kecuali benar-benar diperlukan. Definisikan interface untuk semua data.
11. **Konsistensi visual.** Ikuti palet warna dan pola card yang sudah ada. Lihat section 5.4 di atas.
12. **Jangan merusak route existing.** Selalu cek bahwa semua route lama masih berfungsi setelah perubahan.
13. **Jalankan `tsc --noEmit` sebelum commit.** Zero errors adalah standar minimum.
14. **Semua akses localStorage melewati `progressStorage.ts`.** Tidak ada pengecualian. Lihat §4.

### Copy/Microcopy

15. **Bahasa Indonesia** untuk semua teks yang dilihat siswa dan guru.
16. **Bahasa Inggris** hanya untuk kode internal, komentar developer, dan label teknis.
17. **Nada bicara:** hangat, mendukung, tidak menghakimi. Hindari kata "salah" — gunakan "pola yang ditemukan" atau "bagian yang perlu diperkuat".
18. **Hindari klaim berlebihan:** jangan tulis "AI terbaik", "revolusioner", atau "100% pasti paham".

---

## 11. Urutan Pengerjaan (Sprint)

> [!IMPORTANT]
> Urutan ini bukan acak. Sprint dirancang agar setiap tahap **menghasilkan data** yang dikonsumsi tahap berikutnya. Jangan lompat sprint.

### Sprint 1 — Fondasi Alur Belajar

**Tujuan:** Siswa bisa mendiagnosis fondasi, melihat peta kelemahan, dan tahu jalur belajar.

```
1. progressStorage.ts              — service penyimpanan data (WAJIB pertama)
2. foundationQuestions.ts          — pool 10-15 soal lintas topik
3. DiagnosticFoundationPage.tsx    — tes fondasi MVP + halaman ringkasan kelemahan
4. learningMap.ts                  — data node dan prasyarat
5. LearningMapPage.tsx             — peta belajar visual (baca status dari progressStorage)
6. Update LandingPage.tsx          — arahkan CTA ke diagnostic-foundation
7. Update StudentLayout.tsx        — breadcrumb baru
8. Integrasi DiagnosticTestEngine  — saveDiagnosticResult() via progressStorage
```

**Cek sebelum lanjut ke Sprint 2:**
- [ ] Siswa bisa menyelesaikan Diagnosis Fondasi dan melihat peta kelemahan
- [ ] Hasil diagnosis tersimpan di progressStorage
- [ ] Learning Map menampilkan status berdasarkan data di progressStorage
- [ ] `tsc --noEmit` zero errors

---

### Sprint 2 — Pembeda Pedagogis (Jembatan Berpikir)

**Tujuan:** Setelah diagnosis, siswa diarahkan ke bridge yang menjelaskan miskonsepsinya sebelum masuk visualisasi.

```
1. bridgeContent.ts                — konten 7-bagian untuk minimal 4 miskonsepsi utama
2. BridgePage.tsx                  — halaman bridge dengan struktur 7 bagian
3. Update mapper.ts                — tambah getBridgeRoute(), arahkan diagnosis ke bridge
4. Update DiagnosticTestEngine.tsx — tombol navigasi ke bridge
5. Hubungkan bridge → visualisasi  — tombol di bridge mengarah ke visualisasi existing
6. progressStorage: saveBridgeVisit()
```

**Cek sebelum lanjut ke Sprint 3:**
- [ ] Setelah diagnosis mendeteksi miskonsepsi, siswa diarahkan ke bridge (bukan langsung visualisasi)
- [ ] Bridge mengikuti struktur 7 bagian
- [ ] Bridge terhubung ke visualisasi yang sudah ada
- [ ] Data bridge visit tersimpan di progressStorage
- [ ] `tsc --noEmit` zero errors

---

### Sprint 3 — Latihan dan Mastery

**Tujuan:** Siswa bisa berlatih bertahap dan mendapatkan status "mastered" yang mengunci/membuka topik di Learning Map.

```
1. drillSets.ts                    — soal drill per topik (worked example + hints + mandiri)
2. DrillPage.tsx                   — UI 3 fase
3. masterySets.ts                  — soal mastery per topik (berbeda dari diagnosis dan drill)
4. MasteryCheckPage.tsx            — gerbang naik level
5. Update Learning Map             — status node berubah saat mastery tercapai
6. progressStorage: saveDrillProgress(), saveMasteryResult()
```

**Cek sebelum lanjut ke Sprint 4:**
- [ ] Siswa bisa menyelesaikan drill 3 fase
- [ ] Mastery check mengunci/membuka topik berikutnya
- [ ] Learning Map menampilkan status mastered dengan benar
- [ ] Seluruh alur Diagnosis → Bridge → Visualisasi → Drill → Mastery bisa dilalui end-to-end
- [ ] `tsc --noEmit` zero errors

---

### Sprint 4 — Dashboard dan Analitik

**Tujuan:** Siswa dan guru bisa melihat ringkasan progress. **Hanya bermakna jika Sprint 1-3 sudah selesai.**

```
1. StudentDashboardPage.tsx        — ringkasan progress dari progressStorage.getAllProgress()
2. Update LandingPage.tsx          — arahkan "Masuk Dashboard" ke /student/dashboard
3. TeacherLayout.tsx               — layout khusus guru
4. TeacherDashboardPage.tsx        — analitik miskonsepsi kelas (mock data realistis)
5. Update App.tsx                  — tambah route /teacher/*
```

**Cek setelah Sprint 4:**
- [ ] Dashboard siswa menampilkan data nyata dari progressStorage
- [ ] Dashboard guru menampilkan peta miskonsepsi (mock realistis)
- [ ] Semua route berfungsi, tidak ada regresi
- [ ] `tsc --noEmit` zero errors

---

*Dokumen ini terakhir diperbarui: 4 Juni 2026*
*Berdasarkan audit kode di `src/App.tsx`, `src/engine/rules/`, `src/pages/`, dan `src/components/`*
