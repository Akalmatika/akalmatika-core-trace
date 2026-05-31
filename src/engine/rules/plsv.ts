import { DiagnosticQuestion, MisconceptionRule } from "./types";

export const plsvCluster: DiagnosticQuestion[] = [
  { expression: "x + 3 = 8", correctAnswer: 5, meta: { type: "add", val: 3, res: 8 } },
  { expression: "x - 4 = 6", correctAnswer: 10, meta: { type: "sub", val: 4, res: 6 } },
  { expression: "2x = 12", correctAnswer: 6, meta: { type: "mul", val: 2, res: 12 } },
  { expression: "x/3 = 4", correctAnswer: 12, meta: { type: "div", val: 3, res: 4 } }
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
