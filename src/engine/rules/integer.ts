import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const integerCluster: DiagnosticQuestion[] = [
  { expression: "-2 + 3", questionText: "Berapakah hasil dari:", correctAnswer: 1, meta: { a: -2, b: 3, op: '+' } },
  { expression: "-3 + 5", questionText: "Hitunglah hasil operasi berikut:", correctAnswer: 2, meta: { a: -3, b: 5, op: '+' } },
  { expression: "-1 + 4", questionText: "Berapakah nilainya?", correctAnswer: 3, meta: { a: -1, b: 4, op: '+' } },
  { expression: "-2 + (-3)", questionText: "Tentukan hasil perhitungan ini:", correctAnswer: -5, meta: { a: -2, b: -3, op: '+' } },
  { expression: "4 - (-2)", questionText: "Berapakah hasil dari:", correctAnswer: 6, meta: { a: 4, b: -2, op: '-' } },
  { expression: "-3 - (-1)", questionText: "Hitunglah hasil operasi berikut:", correctAnswer: -2, meta: { a: -3, b: -1, op: '-' } }
];

export const integerRules: MisconceptionRule[] = [
  {
    code: "MC-ADD-SIGN-CONF",
    name: "Absolute Sum Rule Confusion",
    description: "Student treats '-a + b' by adding the absolute values together and assigning a negative sign, i.e., -(a + b).",
    pattern: "-a + b => -(abs(a) + abs(b))",
    remedialScaffold: "Help the student realize addition is dynamic tracking of opposite elements. If you have 2 negative elements and add 3 positive elements, they neutralize to form zero-pairs, leaving 1 positive element!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { a, b, op } = eq.meta || {};
        if (op === '+' && a < 0 && b > 0) return -(Math.abs(a) + Math.abs(b));
        return null;
      });
    }
  },
  {
    code: "MC-SIGN-FIRST-NUM",
    name: "Sign Follows First Number Error",
    description: "Student subtracts the smaller absolute value from the larger, but forces the sign of the result to match the sign of the first term regardless of relative values.",
    pattern: "-a + b => -(|b| - |a|) since the first term is negative.",
    remedialScaffold: "Ask the student: 'Which amount is larger: your negative elements or your positive elements?' Since your positive elements (3) are more than your negative elements (2), the final result has to be positive.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { a, b, op } = eq.meta || {};
        if (op === '+' && a < 0 && b > 0) return -Math.abs(Math.abs(b) - Math.abs(a));
        return null;
      });
    }
  },
  {
    code: "MC-ADD-ABS-SUM",
    name: "Absolute Addition (Ignore Negatives)",
    description: "Student ignores negative signs completely, treating all additions and subtractions as absolute positive sum calculations.",
    pattern: "-a + b => abs(a) + abs(b)",
    remedialScaffold: "Direct the student's attention to signs: 'Signs aren't decorations; they represent opposite types of elements.' Help them feel the physical difference between positive elements and negative elements neutralizing.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { a, b } = eq.meta || {};
        return Math.abs(a) + Math.abs(b);
      });
    }
  },
  {
    code: "MC-SUB-IGNORE-NEG",
    name: "Subtracting Negative acts as normal Subtraction",
    description: "Student treats a - (-b) as just a - b, ignoring the negative sign on the second operand.",
    pattern: "a - (-b) => a - b",
    remedialScaffold: "Remind the student that subtracting a number is mathematically equivalent to adding its opposite. Therefore, subtracting a negative number is exactly the same as adding a positive number!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { a, b, op } = eq.meta || {};
        if (op === '-' && b < 0) return a - Math.abs(b);
        return null;
      });
    }
  }
];
