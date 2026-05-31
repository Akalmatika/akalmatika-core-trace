import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const mixedOperationsCluster: DiagnosticQuestion[] = [
  { expression: "2 + 3 × 4", correctAnswer: 14, meta: { type: "precedence", a: 2, op1: '+', b: 3, op2: '*', c: 4 } },
  { expression: "10 - 4 ÷ 2", correctAnswer: 8, meta: { type: "precedence", a: 10, op1: '-', b: 4, op2: '/', c: 2 } },
  { expression: "(2 + 3) × 4", correctAnswer: 20, meta: { type: "parentheses", a: 2, op1: '+', b: 3, op2: '*', c: 4 } },
  { expression: "5 × 2 + 3", correctAnswer: 13, meta: { type: "precedence_right", a: 5, op1: '*', b: 2, op2: '+', c: 3 } }
];

export const mixedOperationsRules: MisconceptionRule[] = [
  {
    code: "MC-PEMDAS-LEFT-RIGHT",
    name: "Strict Left-to-Right Execution",
    description: "Student ignores operator precedence and just executes operations strictly from left to right.",
    pattern: "a + b * c => (a+b)*c",
    remedialScaffold: "Operasi campuran tidak dibaca seperti buku dari kiri ke kanan! Perkalian dan pembagian lebih kuat dan harus dikerjakan terlebih dahulu dibandingkan penjumlahan atau pengurangan.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { a, op1, b, op2, c } = eq.meta || {};
        if (op1 === '+' && op2 === '*') return (a + b) * c;
        if (op1 === '-' && op2 === '/') return (a - b) / c;
        return null; // The third equation has parentheses, left-to-right happens to be correct. The fourth one also left-to-right matches precedence.
      });
    }
  }
];
