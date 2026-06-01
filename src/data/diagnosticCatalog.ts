import { LucideIcon, Hash, PieChart, Percent, ArrowRightLeft, Equal, Variable, Grip, Scale } from "lucide-react";

export interface DiagnosticItem {
  id: string;
  title: string;
  description: string;
  targetConcept: string;
  href: string;
  icon: LucideIcon;
}

export const diagnosticCatalog: DiagnosticItem[] = [
  {
    id: "bilangan-bulat",
    title: "Bilangan Bulat",
    description: "Uji pemahaman tentang positif-negatif, tambah-kurang, arah gerak, dan operasi campuran bilangan bulat.",
    targetConcept: "Sifat operasi dan garis bilangan",
    href: "/student/diagnostic/integer",
    icon: Hash
  },
  {
    id: "pecahan",
    title: "Pecahan",
    description: "Uji pemahaman tentang makna pecahan, pecahan senilai, perbandingan, dan operasi pecahan.",
    targetConcept: "Pecahan senilai dan penyebut sama/beda",
    href: "/student/diagnostic/fractions",
    icon: PieChart
  },
  {
    id: "persen",
    title: "Persen",
    description: "Uji pemahaman tentang persen sebagai per seratus dan hubungan persen dengan pecahan.",
    targetConcept: "Konsep per seratus",
    href: "/student/diagnostic/percent",
    icon: Percent
  },
  {
    id: "aljabar",
    title: "Aljabar Dasar",
    description: "Uji pemahaman tentang suku, variabel, koefisien, tanda suku, dan suku sejenis.",
    targetConcept: "Suku dan operasi aljabar dasar",
    href: "/student/diagnostic/algebra",
    icon: Variable
  },
  {
    id: "operasi-campuran",
    title: "Operasi Campuran",
    description: "Uji pemahaman tentang urutan operasi, prioritas kali-bagi, dan peran tanda kurung.",
    targetConcept: "PEMDAS / KurKaBaTaKu",
    href: "/student/diagnostic/mixed-operations",
    icon: Grip
  },
  {
    id: "plsv",
    title: "PLSV",
    description: "Uji pemahaman tentang bentuk persamaan linear satu variabel dan makna tanda sama dengan.",
    targetConcept: "Kesetaraan dan variabel tunggal",
    href: "/student/diagnostic/plsv",
    icon: Scale
  }
];
