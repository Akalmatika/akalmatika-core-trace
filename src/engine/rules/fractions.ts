import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const fractionsCluster: DiagnosticQuestion[] = [
  { expression: "1/2 + 1/4", correctAnswer: "3/4", meta: { n1: 1, d1: 2, op: '+', n2: 1, d2: 4 } },
  { expression: "2/3 + 1/3", correctAnswer: "3/3", meta: { n1: 2, d1: 3, op: '+', n2: 1, d2: 3 } },
  { expression: "1/3 + 1/4", correctAnswer: "7/12", meta: { n1: 1, d1: 3, op: '+', n2: 1, d2: 4 } },
  { expression: "3/5 - 1/5", correctAnswer: "2/5", meta: { n1: 3, d1: 5, op: '-', n2: 1, d2: 5 } },
  { expression: "1/2 - 1/3", correctAnswer: "1/6", meta: { n1: 1, d1: 2, op: '-', n2: 1, d2: 3 } }
];

export const fractionsRules: MisconceptionRule[] = [
  {
    code: "MC-FRAC-ADD-NUM-DENOM",
    name: "Adding Numerators and Denominators",
    description: "Student adds numerators together and denominators together.",
    pattern: "a/b + c/d => (a+c)/(b+d)",
    remedialScaffold: "Ingat! Penyebut (angka di bawah) hanyalah ukuran potongan. Jika kamu punya 1 potong pizza (ukuran setengah) dan 1 potong lagi (ukuran seperempat), kamu tidak bisa menyebutnya 2 potong ukuran 'seperenam'. Ukuran potongannya harus disamakan dulu!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { n1, d1, op, n2, d2 } = eq.meta || {};
        if (op === '+') return `${n1 + n2}/${d1 + d2}`;
        if (op === '-') return `${n1 - n2}/${d1 - d2}`;
        return null;
      });
    }
  },
  {
    code: "MC-FRAC-DIFF-DENOM-IGNORE",
    name: "Ignoring Different Denominators",
    description: "Student adds numerators but leaves the denominator as one of the original ones (usually the larger one), ignoring the need for common denominators.",
    pattern: "a/b + c/d => (a+c)/max(b,d)",
    remedialScaffold: "Penyebut yang berbeda berarti ukuran potongannya berbeda. Kita tidak bisa langsung menjumlahkannya. Samakan dulu ukuran potongannya (KPK) agar adil!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { n1, d1, op, n2, d2 } = eq.meta || {};
        if (d1 !== d2) {
          if (op === '+') return `${n1 + n2}/${Math.max(d1, d2)}`;
          if (op === '-') return `${n1 - n2}/${Math.max(d1, d2)}`;
        }
        return null;
      });
    }
  }
];
