import { LucideIcon, Hash, PieChart, Percent, Calculator } from "lucide-react";

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
    visualCount: 6,
    previewTags: ["Area Model", "Pecahan Senilai", "Operasi Pecahan"],
    href: "/student/visualizations/fractions",
    icon: PieChart
  },
  {
    id: "percent",
    title: "Persen",
    description: "Pahami persen sebagai per seratus dan hubungan pecahan dengan persen.",
    visualCount: 2,
    previewTags: ["Grid 100", "Pecahan ke Persen"],
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
    icon: Calculator
  }
];
