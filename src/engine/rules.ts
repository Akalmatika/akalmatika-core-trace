/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Equation {
  expression: string;
  a: number;
  b: number;
  op: '+' | '-';
  correctAnswer: number;
}

export interface MisconceptionRule {
  code: string;
  name: string;
  description: string;
  pattern: string;
  remedialScaffold: string;
  // Predicts the answers a student with this specific misconception would give for the active cluster.
  predictAnswers: (cluster: Equation[]) => (number | null)[];
}

// The exact math cluster defined for diagnosis
export const DIAGNOSTIC_CLUSTER: Equation[] = [
  { expression: "-2 + 3", a: -2, b: 3, op: '+', correctAnswer: 1 },
  { expression: "-3 + 5", a: -3, b: 5, op: '+', correctAnswer: 2 },
  { expression: "-1 + 4", a: -1, b: 4, op: '+', correctAnswer: 3 },
  { expression: "-2 + (-3)", a: -2, b: -3, op: '+', correctAnswer: -5 },
  { expression: "4 - (-2)", a: 4, b: -2, op: '-', correctAnswer: 6 },
  { expression: "-3 - (-1)", a: -3, b: -1, op: '-', correctAnswer: -2 }
];

export const ENGINE_RULES: MisconceptionRule[] = [
  {
    code: "MC-ADD-SIGN-CONF",
    name: "Absolute Sum Rule Confusion",
    description: "Student treats '-a + b' by adding the absolute values together and assigning a negative sign, i.e., -(a + b).",
    pattern: "-a + b => -(abs(a) + abs(b))",
    remedialScaffold: "Help the student realize addition is dynamic tracking. If you start with $2 debt and earn $3, you do not sink deeper to $5 debt! Feel the positive movement on a number line.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        if (eq.op === '+' && eq.a < 0 && eq.b > 0) return -(Math.abs(eq.a) + Math.abs(eq.b));
        return null;
      });
    }
  },
  {
    code: "MC-SIGN-FIRST-NUM",
    name: "Sign Follows First Number Error",
    description: "Student subtracts the smaller absolute value from the larger, but forces the sign of the result to match the sign of the first term regardless of relative values.",
    pattern: "-a + b => -(|b| - |a|) since the first term is negative.",
    remedialScaffold: "Ask the student: 'Which amount is larger: your debt or your cash?' Since your cash ($3) is larger than your debt ($2), the final result has to be in the positive balance field.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        if (eq.op === '+' && eq.a < 0 && eq.b > 0) return -Math.abs(Math.abs(eq.b) - Math.abs(eq.a));
        return null;
      });
    }
  },
  {
    code: "MC-ADD-ABS-SUM",
    name: "Absolute Addition (Ignore Negatives)",
    description: "Student ignores negative signs completely, treating all additions and subtractions as absolute positive sum calculations.",
    pattern: "-a + b => abs(a) + abs(b)",
    remedialScaffold: "Direct the student's attention to signs: 'Signs aren't decorations; they are active operators.' Help them feel the physical difference between holding money and being in debt.",
    predictAnswers: (cluster) => {
      return cluster.map(eq => Math.abs(eq.a) + Math.abs(eq.b));
    }
  },
  {
    code: "MC-SUB-IGNORE-NEG",
    name: "Subtracting Negative acts as normal Subtraction",
    description: "Student treats a - (-b) as just a - b, ignoring the negative sign on the second operand.",
    pattern: "a - (-b) => a - b",
    remedialScaffold: "Remind the student that subtracting a negative is like taking away a debt. When someone takes away your debt, your wealth actually increases!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        if (eq.op === '-' && eq.b < 0) return eq.a - Math.abs(eq.b);
        return null;
      });
    }
  }
];
