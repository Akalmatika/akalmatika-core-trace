import { LucideIcon, Hash, PieChart, Percent, Variable, Grip, Scale } from "lucide-react";

export interface VisualizationCategory {
  id: string;
  title: string;
  description: string;
  visualCount: number;
  previewTags: string[];
  href: string;
  icon: LucideIcon;
}

export const visualizationCategories: VisualizationCategory[] = [
  {
    id: "integer",
    title: "Bilangan Bulat",
    description: "Pahami positif-negatif, pasangan nol, arah gerak, dan pengurangan sebagai menambahkan lawan.",
    visualCount: 2,
    previewTags: ["Es–Api", "Garis Bilangan"],
    href: "/student/visualizations/integer",
    icon: Hash
  },
  {
    id: "fractions",
    title: "Pecahan",
    description: "Pahami bagian dari keseluruhan, pecahan senilai, penyederhanaan, perbandingan, dan operasi pecahan.",
    visualCount: 7, // Incremented from 6 to 7 for cross-grid-multiplier
    previewTags: ["Area Model", "Pecahan Senilai", "Operasi Pecahan", "Arsir Silang"],
    href: "/student/visualizations/fractions",
    icon: PieChart
  },
  {
    id: "percent",
    title: "Persen",
    description: "Pahami persen sebagai per seratus dan hubungan pecahan dengan persen.",
    visualCount: 3, // Incremented from 2 to 3 for discount-simulator
    previewTags: ["Grid 100", "Pecahan ke Persen", "Diskon & Pajak"],
    href: "/student/visualizations/percent",
    icon: Percent
  },
  {
    id: "algebra",
    title: "Aljabar Dasar",
    description: "Pahami suku, variabel, koefisien, tanda suku, pengelompokan, dan transformasi aljabar.",
    visualCount: 8,
    previewTags: ["Suku Aljabar", "Suku Sejenis", "Substitusi"],
    href: "/student/visualizations/algebra",
    icon: Variable
  },
  {
    id: "operasi-campuran",
    title: "Operasi Campuran",
    description: "Pahami prioritas urutan operasi matematika (PEMDAS / Kabataku) dan kekuatan tanda kurung.",
    visualCount: 1,
    previewTags: ["PEMDAS", "Kabataku", "Prioritas Operasi"],
    href: "/student/visualizations/operasi-campuran",
    icon: Grip
  },
  {
    id: "plsv",
    title: "Persamaan Linear (PLSV)",
    description: "Pahami konsep kesetaraan nilai dan penyelesaian persamaan satu variabel dengan visualisasi timbangan.",
    visualCount: 1,
    previewTags: ["Keseimbangan Ruas", "Neraca Timbangan", "Operasi Invers"],
    href: "/student/visualizations/plsv",
    icon: Scale
  }
];

