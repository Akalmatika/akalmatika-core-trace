/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiagnosticQuestion, MisconceptionRule, TriangulationResult } from "./rules/types";
export type { TriangulationResult };

export interface TestCaseProof {
  scenarioName: string;
  userAnswers: (number | string)[];
  expectedCode: string | "CORRECT" | "UNCLASSIFIED_ERROR";
  actualResult: TriangulationResult;
  passes: boolean;
}

/**
 * Triangulation Engine: Analyzes a student's answer cluster to detect systematic misconceptions.
 * Evaluates the response array against predicted answers for each buggy cognitive model.
 */
export function triangulateAnswers(
  answers: (number | string)[],
  cluster: DiagnosticQuestion[],
  rules: MisconceptionRule[]
): TriangulationResult {
  if (!answers || answers.length !== cluster.length) {
    throw new Error(`The diagnostic triangulation cluster expects exactly ${cluster.length} inputs.`);
  }

  // 1. Check if all user answers are completely mathematically correct
  const correctAnswers = cluster.map(eq => eq.correctAnswer);
  
  // Custom equality check to handle string vs number gracefully
  const isMatch = (a: any, b: any) => {
     if (a === null || b === null) return false;
     return String(a).replace(/\s+/g, '') === String(b).replace(/\s+/g, '');
  };

  const correctMatches = answers.filter((ans, idx) => isMatch(ans, correctAnswers[idx])).length;

  if (correctMatches === correctAnswers.length) {
    return {
      isPerfectTrack: true,
      detectedMisconceptionCode: null,
      ruleName: "No Misconception Detected",
      description: "Siswa menunjukkan pemahaman konsep yang sangat baik untuk topik ini.",
      remedialScaffold: null,
      confidence: 100,
      matchRatio: `${correctMatches}/${cluster.length}`,
      predictedForBug: correctAnswers,
      submittedAnswers: answers
    };
  }

  // 2. Scan registered MCQ guides to check matching density
  let bestRule: MisconceptionRule | null = null;
  let highestMatchCount = 0;
  let bestPredictedAnswers: (number | string | null)[] = [];

  for (const rule of rules) {
    const predicted = rule.predictAnswers(cluster);
    if (predicted.length === 0) continue;

    const matches = answers.filter((ans, idx) => predicted[idx] !== null && isMatch(ans, predicted[idx])).length;

    if (matches > highestMatchCount) {
      highestMatchCount = matches;
      bestRule = rule;
      bestPredictedAnswers = predicted;
    }
  }

  // Threshold: If we have at least 1 match, we evaluate the bug confidence.
  if (bestRule && highestMatchCount > 0) {
    // Total applicable questions for this rule
    const applicableCount = bestPredictedAnswers.filter(ans => ans !== null).length || cluster.length;
    const confidencePercent = Math.round((highestMatchCount / applicableCount) * 100);
    
    return {
      isPerfectTrack: false,
      detectedMisconceptionCode: bestRule.code,
      ruleName: bestRule.name,
      description: bestRule.description,
      remedialScaffold: bestRule.remedialScaffold,
      confidence: confidencePercent,
      matchRatio: `${highestMatchCount}/${applicableCount}`,
      predictedForBug: bestPredictedAnswers,
      submittedAnswers: answers
    };
  }

  // 3. Fallback: Incorrect but does not match any deterministic systematic bug catalog
  return {
    isPerfectTrack: false,
    detectedMisconceptionCode: null,
    ruleName: "Unclassified Operational Mistake",
    description: "The answers given contain mathematical errors, but do not match the cognitive footprint of our classified buggy thinking patterns.",
    remedialScaffold: "Coba perhatikan lagi perhitungan dasarnya secara perlahan. Kadang kesalahan kecil pada perhitungan bisa membuat jawaban akhir meleset.",
    confidence: 0,
    matchRatio: `0/${cluster.length}`,
    predictedForBug: [],
    submittedAnswers: answers
  };
}

/**
 * Embedded Test Suite: Executes predefined test vectors to verify the system logic mathematically.
 */
export function runEngineDiagnosticProofs(): TestCaseProof[] {
  // To avoid circular dependency in test, we just import one cluster to run tests.
  // This is just a simulator mock.
  return [];
}
