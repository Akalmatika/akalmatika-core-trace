import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const plsvCluster: DiagnosticQuestion[] = [
  { 
    expression: "x + 3 = 8", 
    questionText: "Tentukan nilai x yang memenuhi persamaan berikut:",
    correctAnswer: 5, 
    options: [5, 11, 24, 3],
    meta: { type: "add", val: 3, res: 8 } 
  },
  { 
    expression: "x - 4 = 6", 
    questionText: "Berapakah nilai x?",
    correctAnswer: 10, 
    options: [10, 2, 24, -2],
    meta: { type: "sub", val: 4, res: 6 } 
  },
  { 
    expression: "2x = 12", 
    questionText: "Selesaikan persamaan di bawah ini:",
    correctAnswer: 6, 
    options: [6, 24, 10, 14],
    meta: { type: "mul", val: 2, res: 12 } 
  },
  { 
    expression: "\\frac{x}{3} = 4", 
    questionText: "Carilah nilai x dari persamaan ini:",
    correctAnswer: 12, 
    options: [12, 1, 7, "\\frac{4}{3}"],
    meta: { type: "div", val: 3, res: 4 } 
  }
];

export const plsvRules: MisconceptionRule[] = [
  {
    code: "MC-PLSV-INV-OP-CONFUSION",
    name: "Inverse Operation Confusion",
    description: "Student uses the same operation instead of the inverse operation to isolate the variable.",
    pattern: "x + a = b => x = b + a",
    remedialScaffold: "Untuk memindahkan angka melintasi tanda sama dengan (=), kamu harus menggunakan kebalikannya (invers). Jika ditambah, lawannya adalah dikurang. Jika dikali, lawannya adalah dibagi. Ini agar keseimbangan timbangan tetap terjaga!",
    predictAnswers: (cluster) => {
      return cluster.map(eq => {
        const { type, val, res } = eq.meta || {};
        if (type === "add") return res + val; // should be res - val
        if (type === "sub") return res - val; // should be res + val
        if (type === "mul") return res * val; // should be res / val
        if (type === "div") return res / val; // should be res * val
        return null;
      });
    }
  }
];
