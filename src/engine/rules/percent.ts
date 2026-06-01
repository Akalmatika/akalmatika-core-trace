import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const percentCluster: DiagnosticQuestion[] = [
  { 
    expression: "\\frac{1}{4}", 
    questionText: "Berapa persenkah nilai pecahan berikut?",
    correctAnswer: "25\\%", 
    options: ["25\\%", "14\\%", "10\\%", "40\\%"],
    meta: { type: "frac_to_perc", n: 1, d: 4 } 
  },
  { 
    expression: "\\frac{3}{10}", 
    questionText: "Bentuk persen dari pecahan di bawah ini adalah:",
    correctAnswer: "30\\%", 
    options: ["30\\%", "3\\%", "13\\%", "300\\%"],
    meta: { type: "frac_to_perc", n: 3, d: 10 } 
  },
  { 
    expression: "\\frac{2}{5}", 
    questionText: "Ubah pecahan berikut ke dalam bentuk persen:",
    correctAnswer: "40\\%", 
    options: ["40\\%", "2\\%", "20\\%", "25\\%"],
    meta: { type: "frac_to_perc", n: 2, d: 5 } 
  },
  { 
    expression: "\\frac{7}{100}", 
    questionText: "Berapa persen nilai dari pecahan ini?",
    correctAnswer: "7\\%", 
    options: ["7\\%", "70\\%", "107\\%", "0.7\\%"],
    meta: { type: "frac_to_perc", n: 7, d: 100 } 
  }
];

export const percentRules: MisconceptionRule[] = [
  {
    code: "MC-PERC-NO-100",
    name: "Percent is just Numerator",
    description: "Student treats the numerator as the percentage, ignoring the denominator.",
    pattern: "a/b => a%",
    remedialScaffold: "Persen itu artinya 'per seratus'. Jika penyebutnya belum 100, kita belum bisa menjadikannya persen langsung dari pembilangnya. Ubah dulu penyebutnya jadi 100!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { n, d } = eq.meta || {};
        if (d !== 100) return `${n}\\%`;
        return null; // For 7/100, the numerator is actually the correct percent, so it doesn't indicate the misconception clearly for this specific item if treated in isolation, but triangulation will rely on the others.
      });
    }
  },
  {
    code: "MC-PERC-ADD-ZERO",
    name: "Adding Zeroes",
    description: "Student simply multiplies the numerator by 10 without regarding the denominator.",
    pattern: "a/b => (a*10)%",
    remedialScaffold: "Mengubah pecahan ke persen tidak sekadar menambahkan nol di belakang angka! Gunakan prinsip pecahan senilai untuk mengubah penyebutnya menjadi 100.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { n } = eq.meta || {};
        return `${n * 10}\\%`;
      });
    }
  }
];
