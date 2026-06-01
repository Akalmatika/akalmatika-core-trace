import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import {
  ArrowLeft, Info, AlertTriangle, RotateCcw,
  ArrowRight, Undo, ShieldAlert, Award, ChevronDown, ChevronUp
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

/* ─── AST Types ──────────────────────────────────────────────── */
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

/* ─── Precedence ─────────────────────────────────────────────── */
function getOperatorPrecedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

/* ─── Tokenizer ──────────────────────────────────────────────── */
function tokenize(str: string): string[] {
  const clean = str.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/");
  return clean.match(/\d+|\+|-|\*|\/|\(|\)/g) || [];
}

/* ─── AST Builder (Shunting-yard) ────────────────────────────── */
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
      type: "operator", value: op, left, right,
    });
  };

  for (const token of tokens) {
    if (/\d+/.test(token)) {
      nodeStack.push({ id: `num-${token}-${idCounter++}-${Date.now()}`, type: "number", value: token });
    } else if (token === "(") {
      opStack.push(token);
    } else if (token === ")") {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== "(") createNode(opStack.pop()!);
      opStack.pop();
    } else {
      const prec = getOperatorPrecedence(token);
      while (opStack.length > 0 && opStack[opStack.length - 1] !== "(" && getOperatorPrecedence(opStack[opStack.length - 1]) >= prec) {
        createNode(opStack.pop()!);
      }
      opStack.push(token);
    }
  }
  while (opStack.length > 0) createNode(opStack.pop()!);
  return nodeStack.length === 1 ? nodeStack[0] : null;
}

/* ─── Get next clickable node (PEMDAS order) ─────────────────── */
function getClickableNode(root: TreeNode | null): string | null {
  if (!root) return null;
  const readyNodes: { node: TreeNode; order: number }[] = [];
  let traversalOrder = 0;

  function traverse(node: TreeNode) {
    if (node.left) traverse(node.left);
    if (node.type === "operator") {
      if (node.left?.type === "number" && node.right?.type === "number") {
        readyNodes.push({ node, order: traversalOrder });
      }
      traversalOrder++;
    }
    if (node.right) traverse(node.right);
  }
  traverse(root);
  if (readyNodes.length === 0) return null;

  let maxPrec = 0;
  for (const item of readyNodes) {
    const prec = getOperatorPrecedence(item.node.value);
    if (prec > maxPrec) maxPrec = prec;
  }
  const candidates = readyNodes.filter(item => getOperatorPrecedence(item.node.value) === maxPrec);
  candidates.sort((a, b) => a.order - b.order);
  return candidates[0].node.id;
}

/* ─── Tree → Infix string ────────────────────────────────────── */
function treeToInfix(node: TreeNode, parentPrecedence: number = 0): string {
  if (node.type === "number") return node.value;
  const currentPrecedence = getOperatorPrecedence(node.value);
  let opDisplay = node.value;
  if (node.value === "*") opDisplay = " × ";
  else if (node.value === "/") opDisplay = " ÷ ";
  else opDisplay = ` ${node.value} `;
  const leftStr = node.left ? treeToInfix(node.left, currentPrecedence) : "";
  const rightStr = node.right ? treeToInfix(node.right, currentPrecedence) : "";
  const infix = leftStr + opDisplay + rightStr;
  return currentPrecedence < parentPrecedence ? `(${infix})` : infix;
}

/* ─── Build render coords ────────────────────────────────────── */
function buildRenderTree(
  node: TreeNode, x: number, y: number, level: number,
  hSpacing: number, vSpacing: number,
  parentId?: string, parentX?: number, parentY?: number,
  acc: RenderNode[] = []
): RenderNode[] {
  acc.push({ node, x, y, parentId, parentX, parentY });
  if (node.left)
    buildRenderTree(node.left, x - hSpacing / Math.pow(1.7, level + 1), y + vSpacing, level + 1, hSpacing, vSpacing, node.id, x, y, acc);
  if (node.right)
    buildRenderTree(node.right, x + hSpacing / Math.pow(1.7, level + 1), y + vSpacing, level + 1, hSpacing, vSpacing, node.id, x, y, acc);
  return acc;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Page Component                                                 */
/* ═══════════════════════════════════════════════════════════════ */
export default function OrderOfOperationsPage() {
  const presets = [
    { label: "Prioritas ×", expr: "2 + 3 * 4", correct: "14", wrong: "20" },
    { label: "Kurung ()", expr: "(5 - 2) * 4", correct: "12", wrong: "13" },
    { label: "÷ & Kurung", expr: "12 / (2 * 3) - 1", correct: "1", wrong: "1" },
  ];

  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  const [quizEval, setQuizEval] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  function handleEvaluateQuiz(isCorrect: boolean) {
    if (quizEval !== 'none') return;
    setQuizEval(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setQuizScore(1);
  }

  const [customExpr, setCustomExpr] = useState("");
  const [customError, setCustomError] = useState("");
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [stepsLog, setStepsLog] = useState<string[]>([]);
  const [clickableId, setClickableId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showMisconception, setShowMisconception] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(false);

  useEffect(() => { loadExpression(presets[activePresetIdx].expr); }, [activePresetIdx]);

  function loadExpression(expr: string) {
    const ast = buildAST(expr);
    if (ast) {
      setRootNode(ast); setHistory([]); setStepsLog([expr]); setIsFinished(false); setCustomError("");
    }
  }

  useEffect(() => {
    if (rootNode) {
      const activeId = getClickableNode(rootNode);
      setClickableId(activeId);
      if (!activeId && rootNode.type === "number") setIsFinished(true);
    }
  }, [rootNode]);

  function handleNodeClick(nodeId: string) {
    if (nodeId !== clickableId || !rootNode) return;
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(rootNode))]);

    function collapse(node: TreeNode): TreeNode {
      if (node.id === nodeId && node.type === "operator" && node.left && node.right) {
        const l = parseFloat(node.left.value), r = parseFloat(node.right.value);
        let res = 0;
        if (node.value === "+") res = l + r;
        else if (node.value === "-") res = l - r;
        else if (node.value === "*") res = l * r;
        else if (node.value === "/") res = l / r;
        return { id: `num-${res}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, type: "number", value: String(res) };
      }
      if (node.type === "operator") {
        return { ...node, left: node.left ? collapse(node.left) : undefined, right: node.right ? collapse(node.right) : undefined };
      }
      return node;
    }

    const nextTree = collapse(rootNode);
    setRootNode(nextTree);
    setStepsLog(prev => [...prev, treeToInfix(nextTree)]);
  }

  function handleUndo() {
    if (history.length === 0) return;
    setRootNode(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
    setStepsLog(prev => prev.slice(0, -1));
    setIsFinished(false);
  }

  function handleReset() { loadExpression(customExpr || presets[activePresetIdx].expr); }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customExpr.trim()) return;
    if (/[^0-9\s+\-*/()×÷]/.test(customExpr)) { setCustomError("Gunakan angka, kurung, dan operasi saja."); return; }
    const ast = buildAST(customExpr);
    if (!ast) { setCustomError("Format tidak valid."); return; }
    setRootNode(ast); setHistory([]); setStepsLog([customExpr]); setIsFinished(false); setCustomError("");
  }

  const renderNodes = rootNode ? buildRenderTree(rootNode, 200, 30, 0, 130, 50) : [];

  /* ─── Compact tree height calc ─────────────────────────────── */
  const maxY = renderNodes.reduce((m, r) => Math.max(m, r.y), 0);
  const svgHeight = Math.max(100, maxY + 40);

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 space-y-4 animate-fadeIn">
      {/* ─── Compact Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="min-w-0">
          <Link to="/student/visualizations/operasi-campuran" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-900 font-bold text-[10px] transition-colors">
            <ArrowLeft size={12} /> Galeri
          </Link>
          <h2 className="font-sans font-black text-slate-900 text-lg md:text-xl tracking-tight leading-tight">
            Urutan Operasi (PEMDAS)
          </h2>
        </div>
        <p className="text-[10px] text-slate-400 max-w-xs text-right hidden md:block leading-tight">
          Klik operasi terkuat terlebih dahulu untuk menyusutkan pohon ekspresi langkah demi langkah.
        </p>
      </div>

      {/* ─── Main content: Tree + Side panels in one row ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">

        {/* ── Left: Visualizer Card ──────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

          {/* Presets row + custom input */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => { setCustomExpr(""); setActivePresetIdx(idx); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  activePresetIdx === idx && !customExpr
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/50"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <form onSubmit={handleCustomSubmit} className="flex gap-1.5 items-center">
              <input
                type="text"
                placeholder="Rumus kustom…"
                value={customExpr}
                onChange={(e) => setCustomExpr(e.target.value)}
                className="bg-slate-50 focus:bg-white text-[11px] border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 rounded-lg px-2.5 py-1 w-36 font-mono text-slate-800 transition-all"
              />
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition-colors cursor-pointer">
                Buat
              </button>
            </form>
          </div>

          {customError && (
            <div className="relative z-10 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-3 py-1.5 rounded-xl mb-2 flex items-center gap-1.5">
              <AlertTriangle size={12} className="shrink-0" /> {customError}
            </div>
          )}

          {/* ── SVG Tree Canvas (compact) ─────────────────────── */}
          <div className="relative z-10 w-full border border-slate-200/60 bg-linear-to-b from-slate-50/50 to-slate-100/50 rounded-xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
            {rootNode ? (
              <svg width="100%" height={svgHeight} viewBox={`0 0 400 ${svgHeight}`} className="overflow-visible select-none">
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                </defs>

                {/* Connection curves */}
                {renderNodes.map((r) => {
                  if (!r.parentId || r.parentX === undefined || r.parentY === undefined) return null;
                  const dy = r.y - r.parentY;
                  const pathData = `M ${r.parentX} ${r.parentY} C ${r.parentX} ${r.parentY + dy * 0.55}, ${r.x} ${r.y - dy * 0.55}, ${r.x} ${r.y}`;
                  const isLinked = r.node.id === clickableId || r.parentId === clickableId;
                  return (
                    <g key={`link-${r.node.id}`}>
                      <path d={pathData} fill="none" stroke={isLinked ? "#c7d2fe" : "#f1f5f9"} strokeWidth="6" strokeLinecap="round" className="opacity-60 transition-all duration-500" />
                      <path d={pathData} fill="none" stroke={isLinked ? "#6366f1" : "#cbd5e1"} strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />
                    </g>
                  );
                })}

                {/* Nodes */}
                {renderNodes.map((r) => {
                  const isClickable = r.node.id === clickableId;
                  const isNumber = r.node.type === "number";
                  return (
                    <g
                      key={`node-g-${r.node.id}`}
                      onClick={() => !isNumber && handleNodeClick(r.node.id)}
                      className="cursor-pointer group transition-all duration-500"
                      style={{ pointerEvents: isNumber ? "none" : "auto" }}
                    >
                      {isClickable && (
                        <>
                          <circle cx={r.x} cy={r.y} r="22" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin opacity-75" style={{ animationDuration: "12s" }} />
                          <circle cx={r.x} cy={r.y} r="19" fill="none" stroke="#6366f1" strokeWidth="3" className="opacity-25 animate-pulse" />
                        </>
                      )}
                      <circle
                        cx={r.x} cy={r.y} r="15"
                        fill={isNumber ? "#ffffff" : isClickable ? "url(#activeGlow)" : "#475569"}
                        stroke={isNumber ? "#e2e8f0" : isClickable ? "#312e81" : "#1e293b"}
                        strokeWidth="2"
                        className="transition-all duration-500 drop-shadow-sm group-hover:scale-110"
                      />
                      <text x={r.x} y={r.y + 4} textAnchor="middle" fill={isNumber ? "#1e293b" : "#ffffff"} className="font-sans text-[11px] font-black select-none">
                        {r.node.value === "*" ? "×" : r.node.value === "/" ? "÷" : r.node.value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="text-slate-400 text-xs py-6">Pohon ekspresi kosong.</div>
            )}
          </div>

          {/* ── Steps log (inline compact) ─────────────────────── */}
          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold text-slate-700">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1 select-none">Langkah:</span>
            {stepsLog.map((step, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <ArrowRight size={10} className="text-slate-300" />}
                <span className={`px-1.5 py-0.5 rounded-md border ${
                  idx === stepsLog.length - 1
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-slate-150 text-slate-450 font-normal"
                }`}>
                  {step.replace(/\*/g, "×").replace(/\//g, "÷")}
                </span>
              </span>
            ))}
          </div>

          {/* ── Action buttons ─────────────────────────────────── */}
          <div className="relative z-10 flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors border ${
                history.length > 0
                  ? "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <Undo size={12} /> Undo
            </button>

            {isFinished && rootNode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                <Award size={12} /> Hasil: <span className="font-mono">{rootNode.value}</span> 🎉
              </span>
            )}

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* ── Right: Stacked compact panels ──────────────────── */}
        <div className="space-y-3">
          {/* PEMDAS Hierarchy (collapsible) */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowHierarchy(!showHierarchy)}
              className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Info size={12} className="text-indigo-500" /> HIERARKI OPERASI
              </h3>
              {showHierarchy ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </button>

            {showHierarchy && (
              <div className="px-4 pb-3 space-y-2 animate-fadeIn">
                {[
                  { icon: "()", label: "Tanda Kurung", desc: "Prioritas mutlak.", bg: "bg-slate-50 border-slate-100", iconBg: "bg-slate-200 text-slate-700" },
                  { icon: "×÷", label: "Kali & Bagi", desc: "Kiri ke kanan, sebelum +/-.", bg: "bg-indigo-50/60 border-indigo-100", iconBg: "bg-indigo-100 text-indigo-700" },
                  { icon: "+−", label: "Tambah & Kurang", desc: "Prioritas terendah.", bg: "bg-slate-50 border-slate-100", iconBg: "bg-slate-200 text-slate-700" },
                ].map((item) => (
                  <div key={item.icon} className={`flex items-center gap-2 ${item.bg} border p-2 rounded-xl`}>
                    <div className={`w-5 h-5 ${item.iconBg} rounded flex items-center justify-center font-black text-[9px] shrink-0 font-mono`}>{item.icon}</div>
                    <div className="min-w-0">
                      <span className="font-bold text-[10px] text-slate-800">{item.label}</span>
                      <span className="text-[9px] text-slate-500 ml-1">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Misconception Panel (collapsible) */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowMisconception(!showMisconception)}
              className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-rose-50 transition-colors"
            >
              <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-rose-500" /> MISKONSEPSI
              </h3>
              {showMisconception ? <ChevronUp size={14} className="text-rose-400" /> : <ChevronDown size={14} className="text-rose-400" />}
            </button>

            {showMisconception && (
              <div className="px-4 pb-3 space-y-2 animate-fadeIn">
                <p className="text-[10px] text-slate-600 leading-snug">
                  Banyak siswa membaca operasi dari kiri ke kanan tanpa memprioritaskan × atau ÷.
                </p>
                <div className="bg-white border border-rose-150 p-2.5 rounded-xl font-mono text-[10px] space-y-1">
                  <span className="font-bold text-rose-600 text-[9px] uppercase block">🚨 Salah (Kiri→Kanan):</span>
                  <div className="text-slate-600"><InlineMath math="2 + 3 = 5" /> → <InlineMath math="5 \times 4 = 20" /> ✗</div>
                </div>
                <div className="bg-white border border-emerald-150 p-2.5 rounded-xl font-mono text-[10px] space-y-1">
                  <span className="font-bold text-emerald-600 text-[9px] uppercase block">✅ Benar (PEMDAS):</span>
                  <div className="text-slate-600"><InlineMath math="3 \times 4 = 12" /> → <InlineMath math="2 + 12 = 14" /> ✓</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick tip box */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-3 text-[10px] text-indigo-800 leading-snug">
            <span className="font-bold">💡 Tip:</span> Node yang berpendar ungu adalah operasi yang <strong>harus diklik terlebih dahulu</strong> sesuai aturan PEMDAS.
          </div>
        </div>
      </div>

      {/* ─── Quiz (compact) ─────────────────────────────────── */}
      <QuizContainer
        title="Evaluasi Konsep"
        questionText={
          <span>
            Urutan pengerjaan yang benar untuk <InlineMath math="5 + 10 \div 2" /> ?
          </span>
        }
        evalResult={quizEval}
        onNext={() => setQuizFinished(true)}
        isLastQuestion={true}
        nextPath="/student/visualizations"
        nextLabel="Kembali ke Galeri"
        isFinished={quizFinished}
        score={quizScore}
        totalQuestions={1}
        onRetry={() => { setQuizEval('none'); setQuizScore(0); setQuizFinished(false); }}
      >
        <div className="flex flex-col gap-2 w-full max-w-xl">
          {[
            { text: "Kiri ke kanan: (5 + 10 = 15, lalu 15 ÷ 2 = 7.5)", correct: false },
            { text: "Dahulukan ÷: (10 ÷ 2 = 5, lalu 5 + 5 = 10)", correct: true },
            { text: "Keduanya sama kuat, bebas urutannya", correct: false },
            { text: "Dahulukan + karena posisinya di depan ÷", correct: false },
          ].map((opt, idx) => (
            <button
              key={idx}
              disabled={quizEval !== 'none'}
              onClick={() => handleEvaluateQuiz(opt.correct)}
              className={`w-full py-2.5 px-3.5 rounded-xl border-2 text-left text-[11px] transition-all hover:scale-[1.01] ${
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
