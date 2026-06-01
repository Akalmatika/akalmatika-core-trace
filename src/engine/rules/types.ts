/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiagnosticQuestion {
  id?: string;
  questionText?: string;
  expression: string;
  correctAnswer: number | string;
  options?: (number | string)[]; // Multiple choice options (LaTeX strings or numbers)
  // Allow for arbitrary metadata (like a, b, op) to assist prediction logic
  meta?: Record<string, any>;
}

export interface MisconceptionRule {
  code: string;
  name: string;
  description: string;
  pattern: string;
  remedialScaffold: string;
  // Predicts the answers a student with this specific misconception would give for the active cluster.
  predictAnswers: (cluster: DiagnosticQuestion[]) => (number | string | null)[];
}

export interface TriangulationResult {
  isPerfectTrack: boolean;
  detectedMisconceptionCode: string | null;
  ruleName: string | null;
  description: string | null;
  remedialScaffold: string | null;
  confidence: number; // Percentage score (e.g. 100, 67, 33, 0)
  matchRatio: string; // e.g. "3/3", "2/3"
  predictedForBug: (number | string | null)[];
  submittedAnswers: (number | string)[];
}
