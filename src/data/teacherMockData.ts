// src/data/teacherMockData.ts

export interface ClassSummary {
  studentCount: number;
  averageMasteryRate: number; // percentage (e.g. 64%)
  weakestTopic: string;
  topMisconception: string;
}

export interface HeatmapItem {
  topicId: "integer" | "fractions" | "percent" | "algebra" | "plsv";
  title: string;
  affectedCount: number;
  dominantMisconception: string;
  priority: "Rendah" | "Sedang" | "Tinggi";
  intervention: string;
}

export interface StudentRow {
  name: string;
  lastActiveTopic: string;
  masteredCount: number; // out of 5
  lastMisconception: string;
  recommendation: string;
}

export interface InterventionSuggestion {
  id: string;
  title: string;
  target: string;
  description: string;
}

export const mockClassSummary: ClassSummary = {
  studentCount: 28,
  averageMasteryRate: 64, // rata-rata menguasai 3.2 topik dari 5
  weakestTopic: "Pecahan",
  topMisconception: "Jumlah Pembilang & Penyebut Langsung"
};

export const mockMisconceptionHeatmap: HeatmapItem[] = [
  {
    topicId: "integer",
    title: "Bilangan Bulat",
    affectedCount: 8,
    dominantMisconception: "MC-ADD-SIGN-CONF (Bingung Tanda)",
    priority: "Sedang",
    intervention: "Gunakan visualisasi koin Es & Api untuk konsep zero-pair."
  },
  {
    topicId: "fractions",
    title: "Pecahan",
    affectedCount: 18,
    dominantMisconception: "MC-FRAC-ADD-NUM-DENOM (Jumlah Atas + Bawah)",
    priority: "Tinggi",
    intervention: "Adakan aktivitas konseptual melipat kertas / pizza setara."
  },
  {
    topicId: "percent",
    title: "Persen",
    affectedCount: 12,
    dominantMisconception: "MC-PERC-NO-100 (Persen dianggap Angka Bulat)",
    priority: "Sedang",
    intervention: "Gunakan visualisasi Grid 100 kotak untuk melatih arti per seratus."
  },
  {
    topicId: "algebra",
    title: "Aljabar Dasar",
    affectedCount: 15,
    dominantMisconception: "MC-ALG-ADD-UNLIKE (Jumlah Apel + Jeruk)",
    priority: "Tinggi",
    intervention: "Lakukan aktivitas pengelompokan fisik buah sebelum masuk ke simbol aljabar."
  },
  {
    topicId: "plsv",
    title: "Persamaan Linear (PLSV)",
    affectedCount: 10,
    dominantMisconception: "MC-PLSV-INV-OP-CONFUSION (Pindah Ruas Tanpa Makna)",
    priority: "Sedang",
    intervention: "Visualisasikan timbangan seimbang menggunakan operasi invers di kedua ruas."
  }
];

export const mockStudentRows: StudentRow[] = [
  {
    name: "Budi Santoso",
    lastActiveTopic: "Persamaan Linear (PLSV)",
    masteredCount: 4,
    lastMisconception: "Aturan Pindah Ruas Magis (PLSV)",
    recommendation: "Ulangi konsep keseimbangan timbangan dan operasi invers."
  },
  {
    name: "Siti Rahma",
    lastActiveTopic: "Pecahan",
    masteredCount: 1,
    lastMisconception: "Menjumlahkan Pembilang & Penyebut Langsung",
    recommendation: "Ajak bermain visualisasi menyamakan ukuran pizza/pecahan."
  },
  {
    name: "Aditya Pratama",
    lastActiveTopic: "Aljabar Dasar",
    masteredCount: 3,
    lastMisconception: "Menjumlahkan Suku Berbeda Jenis (3x + 2y = 5xy)",
    recommendation: "Gunakan analogi buah/kartu fisik untuk mengelompokkan suku sejenis."
  },
  {
    name: "Citra Dewi",
    lastActiveTopic: "Persen",
    masteredCount: 2,
    lastMisconception: "Menganggap 25% Sama dengan 25 Bulat",
    recommendation: "Latih konversi pecahan senilai berpenyebut 100 dengan model kotak."
  },
  {
    name: "Fajar Nugraha",
    lastActiveTopic: "Bilangan Bulat",
    masteredCount: 0,
    lastMisconception: "Bingung Tanda Minus Ganda (Pengurangan Bilangan Negatif)",
    recommendation: "Latih arah pergerakan melangkah di garis bilangan vektor."
  },
  {
    name: "Gita Lestari",
    lastActiveTopic: "Pecahan",
    masteredCount: 1,
    lastMisconception: "Menjumlahkan Pembilang & Penyebut Langsung",
    recommendation: "Ajak bermain visualisasi menyamakan ukuran pizza/pecahan."
  },
  {
    name: "Hadi Kusuma",
    lastActiveTopic: "Aljabar Dasar",
    masteredCount: 3,
    lastMisconception: "Mengabaikan Koefisien 1 Pada Suku Tunggal",
    recommendation: "Ingatkan kembali makna bahwa x adalah 1 apel."
  }
];

export const mockInterventionSuggestions: InterventionSuggestion[] = [
  {
    id: "int-1",
    title: "Aktivitas Remidiasi Kelompok Pecahan",
    target: "18 Siswa (Prioritas Tinggi)",
    description: "Sebagian besar siswa masih menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut secara langsung. Adakan aktivitas melipat kertas berpetak bersama untuk mendemonstrasikan secara fisik bahwa bagian yang dijumlahkan harus memiliki ukuran (penyebut) yang setara."
  },
  {
    id: "int-2",
    title: "Pendalaman Suku Sejenis Aljabar",
    target: "15 Siswa (Prioritas Tinggi)",
    description: "Siswa menggabungkan suku tidak sejenis (seperti 2x + 3y = 5xy). Gunakan model kartu warna-warni yang berbeda (misal: kartu biru untuk x, kartu kuning untuk y) dan minta siswa mengelompokkan kartu sejenis ke dalam kotak yang terpisah secara fisik."
  },
  {
    id: "int-3",
    title: "Konsep Garis Bilangan Vektor",
    target: "8 Siswa (Prioritas Sedang)",
    description: "Siswa kebingungan saat mengurangkan bilangan negatif. Adakan simulasi berjalan di lantai berpetak nomor. Arah hadap mewakili tanda operasi (+/-), dan melangkah maju/mundur mewakili nilai angka (+/-) untuk membangun intuisi arah gerak."
  }
];
