/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIAGNOSTIC_CLUSTER, ENGINE_RULES, MisconceptionRule, Equation } from "./rules";

export interface TriangulationResult {
  isPerfectTrack: boolean;
  detectedMisconceptionCode: string | null;
  ruleName: string | null;
  description: string | null;
  remedialScaffold: string | null;
  confidence: number; // Percentage score (e.g. 100, 67, 33, 0)
  matchRatio: string; // e.g. "3/3", "2/3"
  predictedForBug: (number | null)[];
  submittedAnswers: number[];
}

export interface TestCaseProof {
  scenarioName: string;
  userAnswers: number[];
  expectedCode: string | "CORRECT" | "UNCLASSIFIED_ERROR";
  actualResult: TriangulationResult;
  passes: boolean;
}

/**
 * Triangulation Engine: Analyzes a student's answer cluster to detect systematic misconceptions.
 * Evaluates the response array against predicted answers for each buggy cognitive model.
 */
export function triangulateAnswers(answers: number[]): TriangulationResult {
  if (!answers || answers.length !== DIAGNOSTIC_CLUSTER.length) {
    throw new Error(`The diagnostic triangulation cluster expects exactly ${DIAGNOSTIC_CLUSTER.length} numerical inputs.`);
  }

  // 1. Check if all user answers are completely mathematically correct
  const correctAnswers = DIAGNOSTIC_CLUSTER.map(eq => eq.correctAnswer);
  const correctMatches = answers.filter((ans, idx) => ans === correctAnswers[idx]).length;

  if (correctMatches === correctAnswers.length) {
    return {
      isPerfectTrack: true,
      detectedMisconceptionCode: null,
      ruleName: "No Misconception Detected",
      description: "Student demonstrates a robust conceptual understanding of integer operations with correct positive/negative transitions.",
      remedialScaffold: null,
      confidence: 100,
      matchRatio: `${correctMatches}/${DIAGNOSTIC_CLUSTER.length}`,
      predictedForBug: correctAnswers,
      submittedAnswers: answers
    };
  }

  // 2. Scan registered MCQ guides to check matching density
  let bestRule: MisconceptionRule | null = null;
  let highestMatchCount = 0;
  let bestPredictedAnswers: (number | null)[] = [];

  for (const rule of ENGINE_RULES) {
    const predicted = rule.predictAnswers(DIAGNOSTIC_CLUSTER);
    if (predicted.length === 0) continue;

    const matches = answers.filter((ans, idx) => predicted[idx] !== null && ans === predicted[idx]).length;

    if (matches > highestMatchCount) {
      highestMatchCount = matches;
      bestRule = rule;
      bestPredictedAnswers = predicted;
    }
  }

  // Threshold: If we have at least 1 match, we evaluate the bug confidence.
  if (bestRule && highestMatchCount > 0) {
    // Total applicable questions for this rule
    const applicableCount = bestPredictedAnswers.filter(ans => ans !== null).length || DIAGNOSTIC_CLUSTER.length;
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
    remedialScaffold: "Recommend reviewing basic coordinate line transitions step-by-step to identify local operational slips.",
    confidence: 0,
    matchRatio: "0/6",
    predictedForBug: [],
    submittedAnswers: answers
  };
}

/**
 * Embedded Test Suite: Executes predefined test vectors to verify the system logic mathematically.
 */
export function runEngineDiagnosticProofs(): TestCaseProof[] {
  const testScenarios = [
    {
      name: "All Answers Mathematically Correct Case",
      answers: [1, 2, 3, -5, 6, -2],
      expected: "CORRECT"
    },
    {
      name: "Classic Absolute Sum Rule Confusion Case",
      answers: [-5, -8, -5, -5, 6, -2],
      expected: "MC-ADD-SIGN-CONF"
    },
    {
      name: "Classic Sign Follows First Number Error Case",
      answers: [-1, -2, -3, -5, 6, -2],
      expected: "MC-SIGN-FIRST-NUM"
    },
    {
      name: "Absolute Addition (Ignoring negative indicators) Case",
      answers: [5, 8, 5, 5, 6, 4],
      expected: "MC-ADD-ABS-SUM"
    },
    {
      name: "Subtracting Negative acts as normal Subtraction",
      answers: [1, 2, 3, -5, 2, -4], 
      expected: "MC-SUB-IGNORE-NEG"
    },
    {
      name: "Random Incompatible Errors Case",
      answers: [100, -99, 12, 1, 2, 3],
      expected: "UNCLASSIFIED_ERROR"
    }
  ];

  return testScenarios.map(sc => {
    const result = triangulateAnswers(sc.answers);
    let expectedMatches = false;

    if (sc.expected === "CORRECT") {
      expectedMatches = result.isPerfectTrack;
    } else if (sc.expected === "UNCLASSIFIED_ERROR") {
      expectedMatches = !result.isPerfectTrack && result.detectedMisconceptionCode === null;
    } else {
      expectedMatches = result.detectedMisconceptionCode === sc.expected;
    }

    return {
      scenarioName: sc.name,
      userAnswers: sc.answers,
      expectedCode: sc.expected as any,
      actualResult: result,
      passes: expectedMatches
    };
  });
}
