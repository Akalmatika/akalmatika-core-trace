// src/data/learningMap.ts

export interface LearningMapNode {
  id: string;
  title: string;
  level: 'SD' | 'SMP' | 'SMA';
  prerequisites: string[];
  diagnosticRoute: string;
}

export const learningMapNodes: LearningMapNode[] = [
  {
    id: "integer",
    title: "Bilangan Bulat",
    level: "SD",
    prerequisites: [],
    diagnosticRoute: "/student/diagnostic/integer"
  },
  {
    id: "fractions",
    title: "Pecahan",
    level: "SD",
    prerequisites: ["integer"],
    diagnosticRoute: "/student/diagnostic/fractions"
  },
  {
    id: "percent",
    title: "Persen",
    level: "SD",
    prerequisites: ["fractions"],
    diagnosticRoute: "/student/diagnostic/percent"
  },
  {
    id: "algebra",
    title: "Aljabar Dasar",
    level: "SMP",
    prerequisites: ["integer", "fractions"],
    diagnosticRoute: "/student/diagnostic/algebra"
  },
  {
    id: "plsv",
    title: "Persamaan Linear (PLSV)",
    level: "SMP",
    prerequisites: ["algebra"],
    diagnosticRoute: "/student/diagnostic/plsv"
  }
];
