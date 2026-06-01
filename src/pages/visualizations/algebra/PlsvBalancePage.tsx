import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import {
  ArrowLeft, Info, RotateCcw, CheckCircle2,
  ChevronRight, ShieldAlert, ChevronUp, ChevronDown
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

/* ─── Presets ─────────────────────────────────────────────────────── */
interface Preset {
  label: string;
  /** Display-only equation string (KaTeX) */
  katex: string;
  /** The hidden true value of x that makes this preset balanced */
  answerX: number;
  /** Initial state for each spinner */
  leftX: number;
  leftConst: number;
  rightX: number;
  rightConst: number;
}

const PRESETS: Preset[] = [
  { label: "Level 1",  katex: "x + 3 = 8",     answerX: 5,  leftX: 1, leftConst: 3, rightX: 0, rightConst: 8 },
  { label: "Level 2",  katex: "x + 5 = 12",    answerX: 7,  leftX: 1, leftConst: 5, rightX: 0, rightConst: 12 },
  { label: "Level 3",  katex: "2x + 1 = 9",    answerX: 4,  leftX: 2, leftConst: 1, rightX: 0, rightConst: 9 },
  { label: "Level 4",  katex: "x + 4 = x + 4", answerX: 0,  leftX: 1, leftConst: 4, rightX: 1, rightConst: 4 },
];

const MAX_TOKENS = 15;

/* ─── Spinner (up / down / type) ──────────────────────────────────── */
function Spinner({
  value,
  onChange,
  label,
  color,
  min = 0,
  max = MAX_TOKENS,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  color: "indigo" | "amber";
  min?: number;
  max?: number;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  const ring = color === "indigo"
    ? "focus-within:ring-indigo-400/30 border-indigo-200"
    : "focus-within:ring-amber-400/30 border-amber-200";
  const btnBase = color === "indigo"
    ? "text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100"
    : "text-amber-600 hover:bg-amber-50 active:bg-amber-100";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
        {label}
      </span>
      <div className={`flex items-center gap-0 border rounded-xl bg-white shadow-3xs overflow-hidden ring-2 ring-transparent focus-within:ring-2 ${ring} transition-all`}>
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          className={`px-2 py-1.5 ${btnBase} disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors`}
          aria-label={`Kurangi ${label}`}
        >
          <ChevronDown size={16} />
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onChange(clamp(v));
          }}
          className="w-10 text-center text-sm font-black font-mono text-slate-800 bg-transparent outline-none border-x border-slate-150 py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={min}
          max={max}
        />

        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          className={`px-2 py-1.5 ${btnBase} disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors`}
          aria-label={`Tambah ${label}`}
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Page                                                         */
/* ═══════════════════════════════════════════════════════════════════ */
export default function PlsvBalancePage() {
  /* ── Preset selection ────────────────── */
  const [presetIdx, setPresetIdx] = useState(0);

  /* ── Per-side editable values ─────────── */
  const [leftX, setLeftX] = useState(PRESETS[0].leftX);
  const [leftConst, setLeftConst] = useState(PRESETS[0].leftConst);
  const [rightX, setRightX] = useState(PRESETS[0].rightX);
  const [rightConst, setRightConst] = useState(PRESETS[0].rightConst);

  /* ── Derived ─────────────────────────── */
  const preset = PRESETS[presetIdx];
  const answerX = preset.answerX;

  // Weight = (numX * answerX) + const
  const leftWeight = leftX * answerX + leftConst;
  const rightWeight = rightX * answerX + rightConst;
  const diff = leftWeight - rightWeight;
  const isBalanced = diff === 0;
  // Solved = balanced AND x is fully isolated on exactly one side with qty 1 (or both sides are simple equal constants)
  const isSolved =
    isBalanced &&
    ((leftX === 1 && leftConst === 0 && rightX === 0) ||
     (rightX === 1 && rightConst === 0 && leftX === 0) ||
     (leftX === 0 && rightX === 0 && leftConst === rightConst));

  /* Tilt angle (clamped ±15°) */
  const tiltAngle = Math.max(-15, Math.min(15, diff * 2));

  /* ── KaTeX live equation ─────────────── */
  const buildSide = (xQty: number, c: number): string => {
    const parts: string[] = [];
    if (xQty > 0) parts.push(xQty === 1 ? "x" : `${xQty}x`);
    if (c > 0) {
      parts.push(parts.length > 0 ? `+ ${c}` : `${c}`);
    } else if (c < 0) {
      parts.push(`- ${Math.abs(c)}`);
    }
    return parts.length > 0 ? parts.join(" ") : "0";
  };
  const equationKatex = `${buildSide(leftX, leftConst)} = ${buildSide(rightX, rightConst)}`;

  /* ── Preset loader ───────────────────── */
  const loadPreset = useCallback((idx: number) => {
    const p = PRESETS[idx];
    setPresetIdx(idx);
    setLeftX(p.leftX);
    setLeftConst(p.leftConst);
    setRightX(p.rightX);
    setRightConst(p.rightConst);
  }, []);

  const handleReset = () => loadPreset(presetIdx);

  /* ── Quiz state ──────────────────────── */
  const [quizEval, setQuizEval] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function handleEvaluateQuiz(isCorrect: boolean) {
    if (quizEval !== 'none') return;
    setQuizEval(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setQuizScore(1);
  }

  /* ── Render helper: token grid ──────── */
  const renderXBlocks = (count: number, prefix: string) =>
    Array.from({ length: Math.min(count, MAX_TOKENS) }).map((_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      return (
        <g key={`${prefix}-x-${i}`} transform={`translate(${-16 + col * 22}, ${-18 - row * 22})`}>
          <rect x="0" y="0" width="18" height="18" fill="url(#xBlock)" stroke="#312e81" strokeWidth="1.2" rx="4">
            <animate attributeName="y" from="-6" to="0" dur="0.35s" fill="freeze" />
          </rect>
          <text x="9" y="13" fill="#fff" textAnchor="middle" className="font-sans font-black text-[9px] select-none">x</text>
        </g>
      );
    });

  const renderConstMarbles = (count: number, prefix: string) =>
    Array.from({ length: Math.min(count, MAX_TOKENS) }).map((_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      return (
        <circle
          key={`${prefix}-c-${i}`}
          cx={-14 + col * 8}
          cy={-7 - row * 10}
          r="4.5"
          fill="url(#goldCoin)"
          stroke="#92400e"
          strokeWidth="0.7"
        >
          <animate attributeName="cy" from={`${-17 - row * 10}`} to={`${-7 - row * 10}`} dur="0.3s" fill="freeze" />
        </circle>
      );
    });

  /* ══════════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <Link to="/student/visualizations/plsv" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs mb-3 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Galeri
        </Link>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Neraca Timbangan Penjumlahan
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Atur jumlah kotak <InlineMath math="x" /> dan kelereng di masing-masing ruas agar timbangan seimbang. Gunakan tombol <strong>▲ ▼</strong> atau ketik langsung nilainya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main Column: Scale ────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

            {/* Presets + Live Equation */}
            <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
              <div className="flex gap-2 flex-wrap">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(idx)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      presetIdx === idx
                        ? "bg-teal-650 text-white shadow-sm"
                        : "bg-slate-100 text-slate-650 hover:bg-slate-200 border border-slate-200/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="font-mono text-lg font-black text-slate-800 bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-250/50 shadow-3xs">
                <InlineMath math={equationKatex} />
              </div>
            </div>

            {/* Balance tilt warning */}
            {!isBalanced && (
              <div className="w-full relative z-10 border text-xs px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 animate-fadeIn bg-rose-50 border-rose-100 text-rose-700">
                <ShieldAlert size={14} className="shrink-0" />
                <span>
                  {diff > 0
                    ? "Ruas KIRI lebih berat! Timbangan miring ke kiri."
                    : "Ruas KANAN lebih berat! Timbangan miring ke kanan."}
                </span>
              </div>
            )}
            {isBalanced && !isSolved && (
              <div className="w-full relative z-10 border text-xs px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 animate-fadeIn bg-emerald-50 border-emerald-100 text-emerald-700">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>Timbangan seimbang! Namun variabel <InlineMath math="x" /> belum terisolasi.</span>
              </div>
            )}

            {/* ── SVG Scale ──────────────────────────── */}
            <div className="relative z-10 w-full max-w-lg min-h-[280px] border border-slate-200/60 bg-linear-to-b from-slate-50/50 to-slate-100/50 rounded-2xl p-6 flex items-center justify-center shadow-inner overflow-hidden">
              <svg width="100%" height="240" viewBox="0 0 400 240" className="overflow-visible select-none">
                <defs>
                  <linearGradient id="metalStand" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="metalBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <radialGradient id="goldCoin" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </radialGradient>
                  <linearGradient id="xBlock" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="panGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Dial arc */}
                <path d="M 170 100 A 30 30 0 0 1 230 100" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 3" />

                {/* Stand pillar */}
                <rect x="188" y="100" width="24" height="110" fill="url(#metalStand)" rx="2" />
                <path d="M 140 210 L 260 210 L 245 218 L 155 218 Z" fill="#334155" />
                <rect x="130" y="218" width="140" height="4" fill="#1e293b" rx="2" />

                {/* Dial needle */}
                <g transform={`translate(200, 100) rotate(${tiltAngle})`}>
                  <line x1="0" y1="0" x2="0" y2="-32" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <polygon points="-4,-24 0,-32 4,-24" fill="#ef4444" />
                </g>

                {/* Pivot */}
                <circle cx="200" cy="100" r="10" fill="#1e293b" />
                <circle cx="200" cy="100" r="6" fill="#cbd5e1" />

                {/* Beam + pans (rotates) */}
                <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: "200px 100px", transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                  {/* Beam */}
                  <rect x="60" y="96" width="280" height="8" fill="url(#metalBeam)" rx="3" />
                  <circle cx="70" cy="100" r="4.5" fill="#1e293b" />
                  <circle cx="330" cy="100" r="4.5" fill="#1e293b" />

                  {/* ── Left hanger ── */}
                  <line x1="70" y1="100" x2="42" y2="150" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="70" y1="100" x2="98" y2="150" stroke="#64748b" strokeWidth="1.5" />

                  <g transform={`translate(70, 150) rotate(${-tiltAngle})`} style={{ transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    <path d="M -32 0 L 32 0 L 24 12 L -24 12 Z" fill="url(#panGrad)" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
                    {/* Ruas KIRI label */}
                    <text x="0" y="24" textAnchor="middle" className="text-[8px] font-bold fill-slate-400 select-none">KIRI</text>
                    {/* Tokens */}
                    <g transform="translate(0, -2)">
                      {renderXBlocks(leftX, "l")}
                      <g transform={`translate(0, ${-leftX > 0 ? leftX <= 3 ? -Math.ceil(leftX / 3) * 22 : -Math.ceil(leftX / 3) * 22 : 0})`}>
                        {renderConstMarbles(leftConst, "l")}
                      </g>
                    </g>
                  </g>

                  {/* ── Right hanger ── */}
                  <line x1="330" y1="100" x2="302" y2="150" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="330" y1="100" x2="358" y2="150" stroke="#64748b" strokeWidth="1.5" />

                  <g transform={`translate(330, 150) rotate(${-tiltAngle})`} style={{ transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    <path d="M -32 0 L 32 0 L 24 12 L -24 12 Z" fill="url(#panGrad)" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
                    <text x="0" y="24" textAnchor="middle" className="text-[8px] font-bold fill-slate-400 select-none">KANAN</text>
                    <g transform="translate(0, -2)">
                      {renderXBlocks(rightX, "r")}
                      <g transform={`translate(0, ${-rightX > 0 ? rightX <= 3 ? -Math.ceil(rightX / 3) * 22 : -Math.ceil(rightX / 3) * 22 : 0})`}>
                        {renderConstMarbles(rightConst, "r")}
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            {/* ── Value controls (replaces operations panel) ─────── */}
            <div className="relative z-10 w-full mt-6 grid grid-cols-2 gap-6">
              {/* Left side controls */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block text-center select-none">Ruas Kiri</span>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Spinner value={leftX}     onChange={setLeftX}     label="Kotak (x)"    color="indigo" />
                  <Spinner value={leftConst} onChange={setLeftConst} label="Kelereng (+1)" color="amber" />
                </div>
                <div className="text-center text-[10px] text-slate-500 font-mono">
                  Berat = {leftX > 0 && <><span className="text-indigo-600 font-bold">{leftX}x</span>{leftConst > 0 ? " + " : ""}</>}
                  {leftConst > 0 && <span className="text-amber-600 font-bold">{leftConst}</span>}
                  {leftX === 0 && leftConst === 0 && <span className="text-slate-400">0</span>}
                  {" "}= <span className="font-bold text-slate-800">{leftWeight}</span>
                </div>
              </div>

              {/* Right side controls */}
              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest block text-center select-none">Ruas Kanan</span>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Spinner value={rightX}     onChange={setRightX}     label="Kotak (x)"    color="indigo" />
                  <Spinner value={rightConst} onChange={setRightConst} label="Kelereng (+1)" color="amber" />
                </div>
                <div className="text-center text-[10px] text-slate-500 font-mono">
                  Berat = {rightX > 0 && <><span className="text-indigo-600 font-bold">{rightX}x</span>{rightConst > 0 ? " + " : ""}</>}
                  {rightConst > 0 && <span className="text-amber-600 font-bold">{rightConst}</span>}
                  {rightX === 0 && rightConst === 0 && <span className="text-slate-400">0</span>}
                  {" "}= <span className="font-bold text-slate-800">{rightWeight}</span>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="relative z-10 w-full flex items-center justify-end gap-4 mt-5 border-t border-slate-100 pt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Mulai Ulang</span>
              </button>
            </div>
          </div>

          {/* Solved / Win */}
          {isSolved && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 animate-scaleUp">
              <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-slate-900 text-sm">Persamaan Terselesaikan! 🎉</h4>
                <p className="text-[11px] text-slate-650 mt-0.5">
                  Timbangan seimbang sempurna. <InlineMath math={`x = ${answerX}`} />
                </p>
              </div>
              <button
                onClick={() => loadPreset((presetIdx + 1) % PRESETS.length)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer w-full md:w-auto flex items-center justify-center gap-1"
              >
                <span>Level Berikutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Right column: Guide + Misconception ─────────── */}
        <div className="space-y-6">
          {/* Concept Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Info size={14} className="text-teal-600" />
              CARA BERMAIN
            </h3>
            <ul className="space-y-3 text-[11px] text-slate-600 leading-relaxed list-disc pl-4">
              <li>
                <span className="font-bold text-slate-800">Kotak biru</span> <InlineMath math="x" /> mewakili variabel yang belum diketahui nilainya. Satu kotak = <InlineMath math="x" />.
              </li>
              <li>
                <span className="font-bold text-slate-800">Kelereng emas</span> mewakili konstanta <InlineMath math="+1" />.
              </li>
              <li>
                Gunakan tombol <strong>▲ ▼</strong> atau ketik angka untuk <strong>menambah / mengurangi</strong> kotak dan kelereng di setiap ruas.
              </li>
              <li>
                <span className="font-bold text-slate-800">Tujuan:</span> Isolasi satu kotak <InlineMath math="x" /> sendirian di satu ruas sehingga timbangan seimbang.
              </li>
            </ul>
          </div>

          {/* Misconception panel */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-rose-100 pb-2">
              <ShieldAlert size={14} className="text-rose-500" />
              MISKONSEPSI: OPERASI SATU RUAS
            </h3>
            <p className="text-xs text-slate-650 leading-relaxed">
              Banyak siswa keliru "memindahkan" angka ke seberang tanda <InlineMath math="=" /> tanpa melakukan operasi invers. Perhatikan timbangan: apa pun yang kamu lakukan pada satu sisi, <strong>harus</strong> juga kamu lakukan pada sisi lain agar tetap seimbang!
            </p>
            <div className="bg-white border border-rose-150 p-4 rounded-2xl space-y-2 font-mono text-xs">
              <span className="font-bold text-rose-600 block text-[9px] uppercase">🚨 Contoh Salah:</span>
              <div className="text-slate-600">
                <InlineMath math="x + 3 = 8" /> → Menghapus 3 dari kiri tanpa mengurangi kanan → <InlineMath math="x = 8" /> ✗
              </div>
            </div>
            <div className="bg-white border border-emerald-150 p-4 rounded-2xl space-y-2 font-mono text-xs">
              <span className="font-bold text-emerald-600 block text-[9px] uppercase">✅ Cara Benar:</span>
              <div className="text-slate-600">
                <InlineMath math="x + 3 = 8" /> → Kurangi 3 di <strong>kedua</strong> ruas → <InlineMath math="x = 5" /> ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <QuizContainer
        title="Evaluasi Konsep"
        questionText={
          <span>
            Jika timbangan menunjukkan <InlineMath math="x + 4 = 9" />, berapakah nilai <InlineMath math="x" />?
          </span>
        }
        evalResult={quizEval}
        onNext={() => setQuizFinished(true)}
        isLastQuestion={true}
        nextPath="/student/visualizations"
        nextLabel="Selesai: Kembali ke Galeri"
        isFinished={quizFinished}
        score={quizScore}
        totalQuestions={1}
        onRetry={() => { setQuizEval('none'); setQuizScore(0); setQuizFinished(false); }}
      >
        <div className="flex flex-col gap-3 w-full max-w-xl">
          {[
            { text: "x = 13", correct: false },
            { text: "x = 5", correct: true },
            { text: "x = 4", correct: false },
            { text: "x = 9", correct: false }
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
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-600'
              }`}
            >
              <InlineMath math={opt.text} />
            </button>
          ))}
        </div>
      </QuizContainer>
    </div>
  );
}
