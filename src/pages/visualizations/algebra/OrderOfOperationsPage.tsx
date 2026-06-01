import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import { 
  ArrowLeft, Info, HelpCircle, AlertTriangle, RotateCcw, 
  ArrowRight, Undo, Play, ShieldAlert, Award, CheckCircle2
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

interface TreeNode {
  id: string;
  type: "operator" | "number";
  value: string;
  left?: TreeNode;
  right?: TreeNode;
}

interface RenderNode {
  node: TreeNode;
  x: number;
  y: number;
  parentId?: string;
  parentX?: number;
  parentY?: number;
}

// Precedence levels
function getOperatorPrecedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

// Basic Tokenizer
function tokenize(str: string): string[] {
  const clean = str.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/");
  const regex = /\d+|\+|-|\*|\/|\(|\)/g;
  return clean.match(regex) || [];
}

// AST Builder using Shunting-yard
function buildAST(expression: string): TreeNode | null {
  const tokens = tokenize(expression);
  const nodeStack: TreeNode[] = [];
  const opStack: string[] = [];
  let idCounter = 0;

  const createNode = (op: string) => {
    const right = nodeStack.pop();
    const left = nodeStack.pop();
    if (!left || !right) return;
    nodeStack.push({
      id: `op-${op}-${idCounter++}-${Date.now()}`,
      type: "operator",
      value: op,
      left,
      right
    });
  };

  for (const token of tokens) {
    if (/\d+/.test(token)) {
      nodeStack.push({
        id: `num-${token}-${idCounter++}-${Date.now()}`,
        type: "number",
        value: token
      });
    } else if (token === "(") {
      opStack.push(token);
    } else if (token === ")") {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== "(") {
        createNode(opStack.pop()!);
      }
      opStack.pop(); // Remove '('
    } else {
      // Operator
      const prec = getOperatorPrecedence(token);
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== "(" &&
        getOperatorPrecedence(opStack[opStack.length - 1]) >= prec
      ) {
        createNode(opStack.pop()!);
      }
      opStack.push(token);
    }
  }

  while (opStack.length > 0) {
    createNode(opStack.pop()!);
  }

  return nodeStack.length === 1 ? nodeStack[0] : null;
}

// Recursive function to find the next active clickable node based on PEMDAS
// 1. Collect all operator nodes that are "ready" (both left and right are numbers)
// 2. Find the maximum precedence among ready nodes
// 3. Keep only nodes with max precedence
// 4. Resolve tie by choosing the leftmost node (determined by in-order traversal index)
function getClickableNode(root: TreeNode | null): string | null {
  if (!root) return null;

  const readyNodes: { node: TreeNode; order: number }[] = [];
  let traversalOrder = 0;

  function traverse(node: TreeNode) {
    if (node.left) traverse(node.left);
    
    // Check if operator node is ready
    if (node.type === "operator") {
      const isLeftNum = node.left?.type === "number";
      const isRightNum = node.right?.type === "number";
      if (isLeftNum && isRightNum) {
        readyNodes.push({ node, order: traversalOrder });
      }
      traversalOrder++;
    }

    if (node.right) traverse(node.right);
  }

  traverse(root);

  if (readyNodes.length === 0) return null;

  // Find max precedence
  let maxPrec = 0;
  for (const item of readyNodes) {
    const prec = getOperatorPrecedence(item.node.value);
    if (prec > maxPrec) maxPrec = prec;
  }

  // Filter by max precedence
  const candidates = readyNodes.filter(item => getOperatorPrecedence(item.node.value) === maxPrec);

  // Pick leftmost (smallest traversal order)
  candidates.sort((a, b) => a.order - b.order);

  return candidates[0].node.id;
}

// Convert Tree to Infix formula string
function treeToInfix(node: TreeNode, parentPrecedence: number = 0): string {
  if (node.type === "number") {
    return node.value;
  }

  const currentPrecedence = getOperatorPrecedence(node.value);
  let opDisplay = node.value;
  if (node.value === "*") opDisplay = " × ";
  else if (node.value === "/") opDisplay = " ÷ ";
  else opDisplay = ` ${node.value} `;

  // Recursively format children
  // For same precedence, right side of subtraction or division might need parens to be safe,
  // but standard PEMDAS parentheses are mostly for lower precedence under higher.
  const leftStr = node.left ? treeToInfix(node.left, currentPrecedence) : "";
  const rightStr = node.right ? treeToInfix(node.right, currentPrecedence) : "";

  const infix = leftStr + opDisplay + rightStr;

  if (currentPrecedence < parentPrecedence) {
    return `(${infix})`;
  }

  return infix;
}

// Build render coordinates for nodes in SVG
function buildRenderTree(
  node: TreeNode,
  x: number,
  y: number,
  level: number,
  hSpacing: number,
  vSpacing: number,
  parentId?: string,
  parentX?: number,
  parentY?: number,
  acc: RenderNode[] = []
): RenderNode[] {
  acc.push({ node, x, y, parentId, parentX, parentY });

  if (node.left) {
    buildRenderTree(
      node.left,
      x - hSpacing / Math.pow(1.7, level + 1),
      y + vSpacing,
      level + 1,
      hSpacing,
      vSpacing,
      node.id,
      x,
      y,
      acc
    );
  }
  if (node.right) {
    buildRenderTree(
      node.right,
      x + hSpacing / Math.pow(1.7, level + 1),
      y + vSpacing,
      level + 1,
      hSpacing,
      vSpacing,
      node.id,
      x,
      y,
      acc
    );
  }
  return acc;
}

export default function OrderOfOperationsPage() {
  const presets = [
    { label: "Prioritas Kali", expr: "2 + 3 * 4", correct: "14", wrong: "20" },
    { label: "Kekuatan Kurung", expr: "(5 - 2) * 4", correct: "12", wrong: "13" },
    { label: "Bagi & Kurung Kompleks", expr: "12 / (2 * 3) - 1", correct: "1", wrong: "1" }
  ];

  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  
  // Local Quiz State
  const [quizEval, setQuizEval] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  function handleEvaluateQuiz(isCorrect: boolean) {
    if (quizEval !== 'none') return;
    setQuizEval(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setQuizScore(1);
    }
  }

  function handleNextQuiz() {
    setQuizFinished(true);
  }

  function handleRetryQuiz() {
    setQuizEval('none');
    setQuizScore(0);
    setQuizFinished(false);
  }

  const [customExpr, setCustomExpr] = useState<string>("");
  const [customError, setCustomError] = useState<string>("");

  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [stepsLog, setStepsLog] = useState<string[]>([]);
  const [clickableId, setClickableId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showMisconceptionPanel, setShowMisconceptionPanel] = useState<boolean>(false);

  // Initialize preset
  useEffect(() => {
    loadExpression(presets[activePresetIdx].expr);
  }, [activePresetIdx]);

  function loadExpression(expr: string) {
    const ast = buildAST(expr);
    if (ast) {
      setRootNode(ast);
      setHistory([]);
      setStepsLog([expr]);
      setIsFinished(false);
      setCustomError("");
    }
  }

  // Set next clickable active node when tree updates
  useEffect(() => {
    if (rootNode) {
      const activeId = getClickableNode(rootNode);
      setClickableId(activeId);
      if (!activeId && rootNode.type === "number") {
        setIsFinished(true);
      }
    }
  }, [rootNode]);

  // Handle clicking a node to collapse it
  function handleNodeClick(nodeId: string) {
    if (nodeId !== clickableId || !rootNode) return;

    // Save current tree for undo
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(rootNode))]);

    // Collapse target operator
    function collapse(node: TreeNode): TreeNode {
      if (node.id === nodeId) {
        if (node.type === "operator" && node.left && node.right) {
          const leftVal = parseFloat(node.left.value);
          const rightVal = parseFloat(node.right.value);
          let res = 0;
          if (node.value === "+") res = leftVal + rightVal;
          else if (node.value === "-") res = leftVal - rightVal;
          else if (node.value === "*") res = leftVal * rightVal;
          else if (node.value === "/") res = leftVal / rightVal;

          return {
            id: `num-${res}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: "number",
            value: String(res)
          };
        }
      }

      if (node.type === "operator") {
        return {
          ...node,
          left: node.left ? collapse(node.left) : undefined,
          right: node.right ? collapse(node.right) : undefined
        };
      }
      return node;
    }

    const nextTree = collapse(rootNode);
    setRootNode(nextTree);

    // Append to expression steps log
    const updatedExpr = treeToInfix(nextTree);
    setStepsLog(prev => [...prev, updatedExpr]);
  }

  function handleUndo() {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRootNode(previous);
    setHistory(prev => prev.slice(0, -1));
    setStepsLog(prev => prev.slice(0, -1));
    setIsFinished(false);
  }

  function handleReset() {
    loadExpression(customExpr || presets[activePresetIdx].expr);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customExpr.trim()) return;

    // Basic validation of characters
    if (/[^0-9\s+\-*/()×÷]/.test(customExpr)) {
      setCustomError("Gunakan angka, tanda kurung (), dan tanda operasi (+, -, x, /) saja.");
      return;
    }

    const ast = buildAST(customExpr);
    if (!ast) {
      setCustomError("Format persamaan tidak valid. Periksa tanda kurung atau operasi beruntun.");
      return;
    }

    setRootNode(ast);
    setHistory([]);
    setStepsLog([customExpr]);
    setIsFinished(false);
    setCustomError("");
  }

  // Dynamic layout calculation for root
  const renderNodes = rootNode ? buildRenderTree(rootNode, 250, 40, 0, 160, 60) : [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link to="/student/visualizations/operasi-campuran" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs mb-3 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Galeri
          </Link>
          <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
            Visualizer Urutan Operasi (PEMDAS)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Selesaikan perhitungan dengan mengklik operasi yang paling kuat terlebih dahulu. Perhatikan bagaimana tanda kurung dan perkalian/pembagian mendominasi alur pohon ekspresi!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel Kiri & Tengah: Visualisasi Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

            {/* Presets and Custom Inputs */}
            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="flex gap-2 flex-wrap">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomExpr("");
                      setActivePresetIdx(idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      activePresetIdx === idx && !customExpr
                        ? "bg-indigo-650 text-white shadow-sm"
                        : "bg-slate-100 text-slate-650 hover:bg-slate-200 border border-slate-200/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Input Builder */}
              <form onSubmit={handleCustomSubmit} className="flex gap-2 w-full md:w-auto max-w-sm">
                <input
                  type="text"
                  placeholder="Ketik rumus sendiri (misal: 2 * (3 + 4))"
                  value={customExpr}
                  onChange={(e) => setCustomExpr(e.target.value)}
                  className="bg-slate-50 focus:bg-white text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 rounded-xl px-3 py-2 w-full md:w-56 font-mono text-slate-800 transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
                >
                  Buat
                </button>
              </form>
            </div>

            {customError && (
              <div className="w-full relative z-10 bg-rose-50 border border-rose-100 text-rose-700 text-xs px-4 py-3 rounded-2xl mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{customError}</span>
              </div>
            )}

            {/* Tree Canvas */}
            <div className="relative z-10 w-full max-w-lg min-h-[300px] border border-slate-150 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center shadow-inner">
              {rootNode ? (
                <svg width="100%" height="260" viewBox="0 0 500 260" className="overflow-visible select-none">
                  {/* Draw connection lines */}
                  {renderNodes.map((r) => {
                    if (!r.parentId || r.parentX === undefined || r.parentY === undefined) return null;
                    return (
                      <line
                        key={`line-${r.node.id}`}
                        x1={r.parentX}
                        y1={r.parentY}
                        x2={r.x}
                        y2={r.y}
                        stroke="#cbd5e1"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Draw nodes */}
                  {renderNodes.map((r) => {
                    const isClickable = r.node.id === clickableId;
                    const isNumber = r.node.type === "number";

                    return (
                      <g
                        key={`node-g-${r.node.id}`}
                        onClick={() => !isNumber && handleNodeClick(r.node.id)}
                        className={`cursor-pointer ${isClickable ? "animate-pulse" : ""}`}
                        style={{ pointerEvents: isNumber ? "none" : "auto" }}
                      >
                        {/* Glow effect for clickable active node */}
                        {isClickable && (
                          <circle
                            cx={r.x}
                            cy={r.y}
                            r="22"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="4"
                            className="opacity-75"
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          cx={r.x}
                          cy={r.y}
                          r="17"
                          fill={isNumber ? "#ffffff" : isClickable ? "#4f46e5" : "#64748b"}
                          stroke={isNumber ? "#cbd5e1" : isClickable ? "#4338ca" : "#475569"}
                          strokeWidth="2.5"
                          className="transition-all duration-300 shadow-xs hover:scale-105"
                        />

                        {/* Node Text value */}
                        <text
                          x={r.x}
                          y={r.y + 4.5}
                          textAnchor="middle"
                          fill={isNumber ? "#334155" : "#ffffff"}
                          className="font-mono text-sm font-black select-none"
                        >
                          {r.node.value === "*" ? "×" : r.node.value === "/" ? "÷" : r.node.value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="text-slate-400 text-xs">Pohon ekspresi kosong.</div>
              )}
            </div>

            {/* Steps log below the tree */}
            <div className="relative z-10 w-full mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alur Penyusutan Kalimat:</span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold text-slate-700">
                {stepsLog.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <ArrowRight size={14} className="text-slate-400" />}
                    <span
                      className={`px-2 py-0.5 rounded-lg border ${
                        idx === stepsLog.length - 1
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-500 font-normal"
                      }`}
                    >
                      {step.replace(/\*/g, " × ").replace(/\//g, " ÷ ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions toolbar */}
            <div className="relative z-10 w-full flex items-center justify-between gap-4 mt-6 border-t border-slate-100 pt-5">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors border ${
                  history.length > 0
                    ? "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                    : "bg-slate-50 border-slate-100 text-slate-350 cursor-not-allowed"
                }`}
              >
                <Undo size={14} />
                <span>Undo Langkah</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Mulai Ulang</span>
              </button>
            </div>
          </div>

          {/* Selesai / Success State Card */}
          {isFinished && rootNode && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 animate-scaleUp">
              <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Award size={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-slate-900 text-base">Perhitungan Selesai! 🎉</h4>
                <p className="text-xs text-slate-650 mt-1">
                  Kamu berhasil menyusutkan ekspresi hingga tersisa nilai akhir tunggal yaitu <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-250">{rootNode.value}</span>.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer w-full md:w-auto"
              >
                Coba Preset Lain
              </button>
            </div>
          )}
        </div>

        {/* Panel Kanan: Miskonsepsi Panel & Scaffold */}
        <div className="space-y-6">
          {/* PEMDAS Hierarchy Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Info size={14} className="text-indigo-500" />
              HIERARKI OPERASI
            </h3>
            
            <div className="space-y-3">
              {/* Parentheses */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center font-black text-xs text-slate-700 shrink-0 shadow-2xs font-mono">()</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">1. Tanda Kurung</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Memiliki prioritas mutlak di atas segalanya.</p>
                </div>
              </div>

              {/* Multiplication / Division */}
              <div className="flex items-start gap-3 bg-indigo-50/50 border border-indigo-100 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center font-black text-xs shrink-0 shadow-2xs font-mono">×/÷</div>
                <div>
                  <h4 className="font-bold text-xs text-indigo-905">2. Perkalian & Pembagian</h4>
                  <p className="text-[10px] text-slate-550 mt-0.5">Sama kuat, dikerjakan dari kiri ke kanan sebelum penjumlahan/pengurangan.</p>
                </div>
              </div>

              {/* Addition / Subtraction */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center font-black text-xs text-slate-700 shrink-0 shadow-2xs font-mono">+/-</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">3. Penjumlahan & Pengurangan</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Prioritas terlemah, dieksekusi paling akhir dari kiri ke kanan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Miskonsepsi Simulation Section */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-500" />
                SIMULASI MISKONSEPSI
              </h3>
              <button
                onClick={() => setShowMisconceptionPanel(!showMisconceptionPanel)}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                {showMisconceptionPanel ? "Sembunyikan" : "Tampilkan Analisis"}
              </button>
            </div>

            <p className="text-xs text-slate-650 leading-relaxed">
              Miskonsepsi umum siswa adalah membaca operasi matematika layaknya membaca buku: **strictly dari kiri ke kanan** (mengabaikan prioritas operator).
            </p>

            {showMisconceptionPanel && (
              <div className="space-y-4 pt-2 border-t border-rose-100 animate-fadeIn">
                <div className="bg-white border border-rose-150 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <span className="font-bold text-rose-600 block text-[10px] uppercase">🚨 ALUR SALAH (Strict Left-to-Right):</span>
                  <div className="space-y-1 text-slate-600">
                    <div>1. Hitung penjumlahan dulu:</div>
                    <div className="font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded inline-block">2 + 3 = 5</div>
                    <div className="text-[10px] text-slate-400 mt-1">2. Lalu kalikan hasilnya:</div>
                    <div className="font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded inline-block">5 × 4 = 20 (SALAH)</div>
                  </div>
                </div>

                <div className="bg-white border border-emerald-150 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <span className="font-bold text-emerald-600 block text-[10px] uppercase">✅ ALUR BENAR (Aturan PEMDAS):</span>
                  <div className="space-y-1 text-slate-600">
                    <div>1. Dahulukan perkalian:</div>
                    <div className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-block">3 × 4 = 12</div>
                    <div className="text-[10px] text-slate-400 mt-1">2. Terakhir hitung penjumlahannya:</div>
                    <div className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-block">2 + 12 = 14 (BENAR)</div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-[10px] text-indigo-900 leading-relaxed space-y-1">
                  <span className="font-bold block">💡 Mengapa Aturan Ini Ada?</span>
                  <p>
                    Perkalian mewakili pengelompokan berulang (3 kelompok isi 4). Menjumlahkan 2 terlebih dahulu sebelum membentuk kelompok isi 4 adalah kesalahan logika yang mengubah arti asli dari ekspresi tersebut.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quiz Section to lock in understanding */}
      <QuizContainer 
        title="Evaluasi Konsep"
        questionText={
          <span>
            Manakah urutan pengerjaan yang benar untuk ekspresi di bawah ini? <br />
            <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="5 + 10 \div 2" /></span>
          </span>
        }
        evalResult={quizEval}
        onNext={handleNextQuiz}
        isLastQuestion={true}
        nextPath="/student/visualizations"
        nextLabel="Selesai: Kembali ke Galeri"
        isFinished={quizFinished}
        score={quizScore}
        totalQuestions={1}
        onRetry={handleRetryQuiz}
      >
        <div className="flex flex-col gap-3 w-full max-w-xl">
          {[
            { text: "Hitung dari kiri ke kanan (5 + 10 = 15, lalu 15 ÷ 2 = 7.5)", correct: false },
            { text: "Dahulukan pembagian (10 ÷ 2 = 5, kemudian jumlahkan 5 + 5 = 10)", correct: true },
            { text: "Kedua operasi sama kuat sehingga bebas dikerjakan yang mana saja", correct: false },
            { text: "Dahulukan penjumlahan karena posisinya di depan pembagian", correct: false }
          ].map((opt, idx) => (
            <button
              key={idx}
              disabled={quizEval !== 'none'}
              onClick={() => handleEvaluateQuiz(opt.correct)}
              className={`w-full py-3 px-4 rounded-xl border-2 text-left text-xs transition-all hover:scale-[1.01] ${
                quizEval !== 'none' ? 'pointer-events-none' : 'cursor-pointer'
              } ${
                quizEval === 'correct' && opt.correct
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : quizEval === 'wrong' && !opt.correct
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </QuizContainer>
    </div>
  );
}
