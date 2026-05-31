export interface StackItem {
  name: string;
  category: "frontend" | "backend" | "database" | "deployment" | "ai";
  iconName: string;
  version: string;
  description: string;
  rationale: string;
}

export interface FolderNode {
  name: string;
  type: "file" | "folder";
  description: string;
  children?: FolderNode[];
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    description: string;
  }[];
  rlsRules: string[];
}

export interface MisconceptionRule {
  code: string;
  name: string;
  pattern: string;
  exampleProblem: string;
  studentAnswer: string;
  expectedAnswer: string;
  underlyingBug: string;
  remedialSocioCognitiveHook: string;
}

export const STACK_CHOICES: StackItem[] = [
  {
    name: "React + Vite (TypeScript)",
    category: "frontend",
    iconName: "Cpu",
    version: "React 19, Vite 6",
    description: "Lightweight, blazing-fast client framework optimized for highly responsive interactive nodes.",
    rationale: "Vite provides extremely rapid cold-starts. TypeScript gives structural state-guarantees for managing students' multi-step mathematical trace timelines."
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    iconName: "Palette",
    version: "v4",
    description: "Utility-first design paradigm for rapid layout tuning and structural breathing room.",
    rationale: "Ensures we can build a highly focused, accessible UI matching the modern cognitive load requirements of young learners without writing bulky custom stylesheets."
  },
  {
    name: "Supabase Database & Auth",
    category: "database",
    iconName: "Database",
    version: "PostgreSQL v15",
    description: "Open-source Firebase alternative providing auto-generated REST APIs and Row-Level Security (RLS).",
    rationale: "PostgreSQL ensures relational integrity between students, sessions, dynamic questionnaires, and trace symptoms. Supabase Auth gives passwordless or OAuth client access out-of-the-box."
  },
  {
    name: "Supabase Edge Functions",
    category: "backend",
    iconName: "Terminal",
    version: "Deno",
    description: "Serverless server-side TypeScript execution to run AI model requests and complex validation logic.",
    rationale: "Allows secure API key calls to Gemini models and isolates intellectual property of our rule-based misconception grading engines from client-side tampering."
  },
  {
    name: "Vercel Build Environment",
    category: "deployment",
    iconName: "CloudLightning",
    version: "Production Edge Services",
    description: "Optimized hosting provider with automatic Git integration and high-performance CDN deployment.",
    rationale: "Vercel automates previews and builds directly from GitHub. Perfectly integrates with Supabase configuration through production environment variable inheritance."
  },
  {
    name: "Google Gemini API SDK",
    category: "ai",
    iconName: "Sparkles",
    version: "@google/genai ^2.4",
    description: "Cognitive-level model to provide dynamic socio-cognitive remedial hints when mathematical errors occur.",
    rationale: "While deterministic rules classify errors (e.g., subtracting negative looks like adding), Gemini synthesizes custom remedial prompts, adapting tone based on historical struggle levels."
  }
];

export const FOLDER_STRUCTURE: FolderNode = {
  name: "alamatika-core-trace",
  type: "folder",
  description: "Workspace Root Project Directory",
  children: [
    {
      name: "supabase",
      type: "folder",
      description: "Containment directory for database configurations and migrations.",
      children: [
        {
          name: "migrations",
          type: "folder",
          description: "SQL migration scripts tracking table definitions, foreign keys, and RLS rules chronological changes.",
          children: [
            { name: "20260529_init_schema.sql", type: "file", description: "Creates students, diagnostics, responses, and RLS policies." }
          ]
        },
        { name: "config.toml", type: "file", description: "Supabase CLI configuration for local development ports and seed targets." }
      ]
    },
    {
      name: "src",
      type: "folder",
      description: "Frontend source directory containing modular views, core states, and API hooks.",
      children: [
        {
          name: "components",
          type: "folder",
          description: "Highly granular, reusable client components (cards, number lines, diagrams).",
          children: [
            { name: "CoinSandbox.tsx", type: "file", description: "Tactile manipulative canvas where students drag oppositely signed coins to witness zero-pair neutralization." },
            { name: "FolderStructure.tsx", type: "file", description: "Interactive directory representation for pedagogical inspection of file architecture." },
            { name: "DatabaseSchema.tsx", type: "file", description: "A structured view outlining SQL tables and Row-Level Security profiles." },
            { name: "TraceSimulator.tsx", type: "file", description: "Interactive control station and logger verifying the math triangulation parser." }
          ]
        },
        {
          name: "lib",
          type: "folder",
          description: "Helper files, client singletons, and deterministic math rule processors.",
          children: [
            { name: "supabaseClient.ts", type: "file", description: "Initializes the isomorphic Supabase DB connection using public anon keys." },
            { name: "traceEngine.ts", type: "file", description: "Core evaluation algorithms. Takes step-by-step math entries and outputs matching misconception codes." }
          ]
        },
        {
          name: "engine",
          type: "folder",
          description: "Core deterministic logic engine containing sign-parsing rules and mathematical triangulation controllers.",
          children: [
            { name: "rules.ts", type: "file", description: "Encapsulates diagnostic error definitions, expected responses, and pedagogical remediation hooks." },
            { name: "parser.ts", type: "file", description: "Triangulates arrays of user answers, computes bug probability, and runs core unit verify blocks." }
          ]
        },
        {
          name: "views",
          type: "folder",
          description: "Full-page screens backing different student and educator route parameters.",
          children: [
            { name: "DashboardView.tsx", type: "file", description: "Entry hub tracking students active diagnostic paths and visual progress charts." },
            { name: "DiagnosticTestView.tsx", type: "file", description: "Screen featuring math problems with virtual sketchpads and math inputs." },
            { name: "EducatorInsightView.tsx", type: "file", description: "Dashboard for math teachers displaying aggregated class misconceptions." }
          ]
        },
        { name: "App.tsx", type: "file", description: "Global layout hub, client-side routing, and theme wrapper state." },
        { name: "main.tsx", type: "file", description: "React application physical entry rendering the root level DOM node." },
        { name: "index.css", type: "file", description: "Global styling containing tailwind imports and display typography config." }
      ]
    },
    { name: "package.json", type: "file", description: "Dependency registry enclosing Vite, Tailwind, Lucide, and Motion declarations." },
    { name: "tsconfig.json", type: "file", description: "Typescript compile specifications, mapping import aliases (@/*) and module boundaries." },
    { name: "vite.config.ts", type: "file", description: "Compile & bundle directives configuring hot reloading limits and proxy ports." }
  ]
};

export const DATABASE_SCHEMA: SchemaTable[] = [
  {
    name: "students",
    description: "Key record tracking student identities, classes, and aggregate cognitive status.",
    columns: [
      { name: "id", type: "uuid", isPrimary: true, description: "Unique database identifier (mapped to auth.users.id)." },
      { name: "display_name", type: "varchar", description: "Human friendly student name or screen moniker." },
      { name: "school_class_code", type: "varchar", description: "Code grouping students into designated classrooms for teacher search grids." },
      { name: "created_at", type: "timestamp with time zone", description: "Exact moment the profile record was captured." }
    ],
    rlsRules: [
      "ENABLE ROW LEVEL SECURITY;",
      "CREATE POLICY student_self_select ON students FOR SELECT TO authenticated USING (auth.uid() = id);",
      "CREATE POLICY teacher_select_all ON students FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM teachers t WHERE t.user_id = auth.uid() AND t.school_code = students.school_class_code));"
    ]
  },
  {
    name: "diagnostic_sessions",
    description: "Sessions record representing a student attempting or reviewing a diagnostic module.",
    columns: [
      { name: "id", type: "uuid", isPrimary: true, description: "Unique session tracking identifier." },
      { name: "student_id", type: "uuid", isForeign: true, references: "students.id", description: "Relational identifier binding this session to a registered student profile." },
      { name: "status", type: "varchar", description: "Current progression phase ('active_solving', 'completed_analysis')." },
      { name: "started_at", type: "timestamp with time zone", description: "Creation capture timestamp." },
      { name: "completed_at", type: "timestamp with time zone", description: "Completion and final grade timestamp." }
    ],
    rlsRules: [
      "CREATE POLICY session_student_access ON diagnostic_sessions FOR ALL TO authenticated USING (student_id = auth.uid());"
    ]
  },
  {
    name: "student_responses",
    description: "Individual answer inputs, including intermediate steps and drawing paths.",
    columns: [
      { name: "id", type: "uuid", isPrimary: true, description: "Response primary key." },
      { name: "session_id", type: "uuid", isForeign: true, references: "diagnostic_sessions.id", description: "Points to active session." },
      { name: "problem_id", type: "varchar", description: "Key referencing numerical problems configuration (e.g. 'P4-SUB-NEG')." },
      { name: "problem_context", type: "jsonb", description: "Details of the math problem (formula like -5 - (-3), terms, etc.)." },
      { name: "student_answer", type: "varchar", description: "Final character code typed or selected by student (e.g. '-8')." },
      { name: "confidence_score", type: "integer", description: "Self-assessed certainty confidence scalar (1 to 5) indicating guess probability." },
      { name: "sketch_data", type: "text", description: "Base64 canvas coordinates storing visual coordinate movements or number line edits." }
    ],
    rlsRules: [
      "CREATE POLICY response_student_access ON student_responses FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM diagnostic_sessions s WHERE s.id = session_id AND s.student_id = auth.uid()));"
    ]
  },
  {
    name: "diagnostic_results",
    description: "Analyzed misconception traces produced by the deterministic engine comparing responses.",
    columns: [
      { name: "id", type: "uuid", isPrimary: true, description: "Result entry identifier." },
      { name: "response_id", type: "uuid", isForeign: true, references: "student_responses.id", description: "Primary response relation under analysis." },
      { name: "detected_misconception_code", type: "varchar", description: "Underlying error code matching catalog descriptors (e.g., 'SUB-NEG-ADD')." },
      { name: "engine_confidence", type: "numeric", description: "Confidence probability vector calculated from the trace rule pattern." },
      { name: "remedial_scaffold_prompt", type: "text", description: "Pedagogical prompt delivered to help scaffold understanding based on cognitive bug." }
    ],
    rlsRules: [
      "CREATE POLICY result_student_access ON diagnostic_results FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM student_responses r JOIN diagnostic_sessions s ON r.session_id = s.id WHERE r.id = response_id AND s.student_id = auth.uid()));"
    ]
  }
];

export const MISCONCONCEPTION_CATALOG: MisconceptionRule[] = [
  {
    code: "MC-SUB-NEG-ADD",
    name: "Subtract Negative as Normal Addition Error",
    pattern: "a - (-b) => a - b",
    exampleProblem: "5 - (-3)",
    studentAnswer: "2",
    expectedAnswer: "8",
    underlyingBug: "The student views double negatives as a single negative, effectively subtracting b from a instead of flipping the operation polarity to addition.",
    remedialSocioCognitiveHook: "Direct student to number lines: 'Flipping direction twice' analogy. If a negative means walking backwards, subtracting a negative means deleting a step backward, which carries you forwards."
  },
  {
    code: "MC-ADD-SIGN-CONF",
    name: "Absolute Sum Rule confusion",
    pattern: "-a + b => -(a + b)",
    exampleProblem: "-5 + 3",
    studentAnswer: "-8",
    expectedAnswer: "-2",
    underlyingBug: "The student sees the negative sign on a, is confused by operation, and adds values together then applies the sign of the first variable.",
    remedialSocioCognitiveHook: "Analogous ledger model: 'You owe 5 dollars, but then you earn 3 dollars. Do you now owe 8?' Let them feel the balance correction."
  },
  {
    code: "MC-MUL-SIGN-DOM",
    name: "Negative Addition Multiplicative Projection",
    pattern: "-a + (-b) => positive answer",
    exampleProblem: "-4 + (-2)",
    studentAnswer: "6",
    expectedAnswer: "-6",
    underlyingBug: "Student has overgeneralized the rule 'negative times negative is positive' to simple negative summation operations.",
    remedialSocioCognitiveHook: "Help the student decouple multi-operator logic. 'A negative times a negative belongs to scalar multiplications. Adding debt makes you even poorer, not richer!'"
  },
  {
    code: "MC-SUB-ORDER-INV",
    name: "Order Irrelevance in subtraction",
    pattern: "a - b => b - a",
    exampleProblem: "3 - 8",
    studentAnswer: "5",
    expectedAnswer: "-5",
    underlyingBug: "Student believes subtraction is commutative or that you must always subtract the smaller number from the larger number to avoid negative domains.",
    remedialSocioCognitiveHook: "Dynamic thermometer visualization: 'Start at temperature 3 degrees. Drop it by 8 degrees. Do you cross below zero?'"
  }
];
