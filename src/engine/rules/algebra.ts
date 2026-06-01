import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const algebraCluster: DiagnosticQuestion[] = [
  { 
    expression: "2x + 3x", 
    questionText: "Berapakah hasil penjumlahan suku sejenis berikut?",
    correctAnswer: "5x", 
    options: ["5x", "6x^2", "5", "5x^2"],
    meta: { type: "simplify", coeff1: 2, var1: 'x', coeff2: 3, var2: 'x' } 
  },
  { 
    expression: "4y - y", 
    questionText: "Sederhanakan bentuk aljabar di bawah ini:",
    correctAnswer: "3y", 
    options: ["3y", "4", "4y", "3"],
    meta: { type: "simplify", coeff1: 4, var1: 'y', coeff2: -1, var2: 'y' } 
  },
  { 
    expression: "2x + 3y", 
    questionText: "Manakah bentuk yang paling sederhana dari ekspresi ini?",
    correctAnswer: "2x+3y", 
    options: ["2x+3y", "5xy", "5x", "5y"],
    meta: { type: "simplify", coeff1: 2, var1: 'x', coeff2: 3, var2: 'y' } 
  },
  { 
    expression: "5x - 2x", 
    questionText: "Sederhanakan ekspresi berikut:",
    correctAnswer: "3x", 
    options: ["3x", "3", "7x", "10x^2"],
    meta: { type: "simplify", coeff1: 5, var1: 'x', coeff2: -2, var2: 'x' } 
  }
];

export const algebraRules: MisconceptionRule[] = [
  {
    code: "MC-ALG-ADD-UNLIKE",
    name: "Adding Unlike Terms",
    description: "Student adds coefficients of different variables together.",
    pattern: "ax + by => (a+b)xy or (a+b)",
    remedialScaffold: "Suku dengan variabel yang berbeda itu seperti buah apel dan jeruk. Kamu tidak bisa menjumlahkan 2 apel + 3 jeruk menjadi 5 'apel-jeruk'! Biarkan mereka tetap terpisah.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { coeff1, var1, coeff2, var2 } = eq.meta || {};
        if (var1 !== var2) {
          // If they add them, they might write 5xy or just 5
          return `${coeff1 + coeff2}${var1}${var2}`;
        }
        return null;
      });
    }
  },
  {
    code: "MC-ALG-IGNORE-VAR",
    name: "Ignoring Variable When Coefficient is Implicit",
    description: "Student treats 'y' or '-y' as 0 instead of 1y or -1y.",
    pattern: "ay - y => ay",
    remedialScaffold: "Jika ada variabel berdiri sendiri seperti 'y', itu artinya ada 1 buah 'y'. Jadi 4y - y sama artinya dengan 4y - 1y.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { coeff1, var1, coeff2, var2 } = eq.meta || {};
        if (var1 === var2 && Math.abs(coeff2) === 1) {
          return `${coeff1}${var1}`;
        }
        return null;
      });
    }
  }
];
