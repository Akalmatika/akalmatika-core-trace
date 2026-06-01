import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const fractionsCluster: DiagnosticQuestion[] = [
  { 
    expression: "\\frac{1}{2} + \\frac{1}{4}", 
    questionText: "Berapakah hasil penjumlahan pecahan berikut?",
    correctAnswer: "\\frac{3}{4}", 
    options: ["\\frac{3}{4}", "\\frac{2}{6}", "\\frac{2}{4}", "\\frac{1}{6}"],
    meta: { n1: 1, d1: 2, op: '+', n2: 1, d2: 4 } 
  },
  { 
    expression: "\\frac{2}{3} + \\frac{1}{3}", 
    questionText: "Jumlahkan kedua pecahan di bawah ini:",
    correctAnswer: "\\frac{3}{3}", 
    options: ["\\frac{3}{3}", "\\frac{3}{6}", "\\frac{2}{9}", "\\frac{1}{3}"],
    meta: { n1: 2, d1: 3, op: '+', n2: 1, d2: 3 } 
  },
  { 
    expression: "\\frac{1}{3} + \\frac{1}{4}", 
    questionText: "Berapakah hasil dari:",
    correctAnswer: "\\frac{7}{12}", 
    options: ["\\frac{7}{12}", "\\frac{2}{7}", "\\frac{2}{4}", "\\frac{7}{7}"],
    meta: { n1: 1, d1: 3, op: '+', n2: 1, d2: 4 } 
  },
  { 
    expression: "\\frac{3}{5} - \\frac{1}{5}", 
    questionText: "Kurangkan pecahan berikut:",
    correctAnswer: "\\frac{2}{5}", 
    options: ["\\frac{2}{5}", "\\frac{2}{0}", "\\frac{4}{5}", "\\frac{2}{10}"],
    meta: { n1: 3, d1: 5, op: '-', n2: 1, d2: 5 } 
  },
  { 
    expression: "\\frac{1}{2} - \\frac{1}{3}", 
    questionText: "Berapakah hasil pengurangan pecahan ini?",
    correctAnswer: "\\frac{1}{6}", 
    options: ["\\frac{1}{6}", "\\frac{0}{-1}", "\\frac{0}{3}", "\\frac{1}{5}"],
    meta: { n1: 1, d1: 2, op: '-', n2: 1, d2: 3 } 
  }
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
        if (op === '+') return `\\frac{${n1 + n2}}{${d1 + d2}}`;
        if (op === '-') return `\\frac{${n1 - n2}}{${d1 - d2}}`;
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
          if (op === '+') return `\\frac{${n1 + n2}}{${Math.max(d1, d2)}}`;
          if (op === '-') return `\\frac{${n1 - n2}}{${Math.max(d1, d2)}}`;
        }
        return null;
      });
    }
  }
];
