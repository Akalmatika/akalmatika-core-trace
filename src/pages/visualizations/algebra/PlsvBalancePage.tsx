import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import { 
  ArrowLeft, Info, Scale, ShieldAlert, RotateCcw, 
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

interface Preset {
  label: string;
  equationStr: string;
  initialX: number;
  initialLeftXQty: number;
  initialLeftConst: number;
  initialRightConst: number;
}

export default function PlsvBalancePage() {
  const presets: Preset[] = [
    { label: "Level 1: Penjumlahan", equationStr: "x + 3 = 8", initialX: 5, initialLeftXQty: 1, initialLeftConst: 3, initialRightConst: 8 },
    { label: "Level 2: Pengurangan", equationStr: "x - 2 = 6", initialX: 8, initialLeftXQty: 1, initialLeftConst: -2, initialRightConst: 6 },
    { label: "Level 3: Perkalian Sederhana", equationStr: "2x = 8", initialX: 4, initialLeftXQty: 2, initialLeftConst: 0, initialRightConst: 8 }
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
  
  // State for current scale status
  const [leftXQty, setLeftXQty] = useState<number>(1);
  const [leftConst, setLeftConst] = useState<number>(3);
  const [rightConst, setRightConst] = useState<number>(8);
  const [targetX, setTargetX] = useState<number>(5); // Hidden actual value of x

  // UI State for customization / manual inputs
  const [opType, setOpType] = useState<"+" | "-" | "*" | "/">("-");
  const [opVal, setOpVal] = useState<number>(3);
  const [applySide, setApplySide] = useState<"both" | "left" | "right">("both");
  
  const [tiltMessage, setTiltMessage] = useState<string>("");
  const [tiltAngle, setTiltAngle] = useState<number>(0); // tilt angle in degrees (-15 to 15)
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  // Load Preset
  useEffect(() => {
    const preset = presets[activePresetIdx];
    setLeftXQty(preset.initialLeftXQty);
    setLeftConst(preset.initialLeftConst);
    setRightConst(preset.initialRightConst);
    setTargetX(preset.initialX);
    setTiltMessage("");
    setTiltAngle(0);
    setIsSolved(false);
  }, [activePresetIdx]);

  // Calculate current weights on pans
  const leftWeight = (leftXQty * targetX) + leftConst;
  const rightWeight = rightConst;

  // Calculate scale tilt dynamically based on weights
  useEffect(() => {
    const diff = leftWeight - rightWeight;
    if (diff === 0) {
      setTiltAngle(0);
      setTiltMessage("");
      // Check win condition: x is isolated on left with qty 1 and const 0, and rightConst is the targetX value
      if (leftXQty === 1 && leftConst === 0 && rightConst === targetX) {
        setIsSolved(true);
      }
    } else {
      setIsSolved(false);
      // Tilt: positive means left is heavier (tilt clockwise), negative means right is heavier (tilt counter-clockwise)
      const calculatedAngle = Math.max(-15, Math.min(15, diff * 1.5));
      setTiltAngle(calculatedAngle);
      setTiltMessage(
        diff > 0 
          ? "Ruas KIRI lebih berat! Timbangan miring ke kiri." 
          : "Ruas KANAN lebih berat! Timbangan miring ke kanan."
      );
    }
  }, [leftWeight, rightWeight, leftXQty, leftConst, rightConst, targetX]);

  // Execute operation toolbar action
  function handleApplyOperation() {
    if (opVal <= 0) return;

    let nextLeftXQty = leftXQty;
    let nextLeftConst = leftConst;
    let nextRightConst = rightConst;

    // Left Pan Calculation
    if (applySide === "both" || applySide === "left") {
      if (opType === "+") {
        nextLeftConst += opVal;
      } else if (opType === "-") {
        nextLeftConst -= opVal;
      } else if (opType === "*") {
        nextLeftXQty *= opVal;
        nextLeftConst *= opVal;
      } else if (opType === "/") {
        // Divide only if divisible or safe fraction
        nextLeftXQty = nextLeftXQty / opVal;
        nextLeftConst = nextLeftConst / opVal;
      }
    }

    // Right Pan Calculation
    if (applySide === "both" || applySide === "right") {
      if (opType === "+") {
        nextRightConst += opVal;
      } else if (opType === "-") {
        nextRightConst -= opVal;
      } else if (opType === "*") {
        nextRightConst *= opVal;
      } else if (opType === "/") {
        nextRightConst = nextRightConst / opVal;
      }
    }

    // Update state
    setLeftXQty(nextLeftXQty);
    setLeftConst(nextLeftConst);
    setRightConst(nextRightConst);

    if (applySide !== "both") {
      setTiltMessage("⚠ Peringatan: Kamu hanya memodifikasi SATU ruas! Timbangan menjadi tidak seimbang. Agar adil dan persamaan tetap setara, operasi harus selalu dilakukan pada KEDUA ruas.");
    }
  }

  function handleReset() {
    const preset = presets[activePresetIdx];
    setLeftXQty(preset.initialLeftXQty);
    setLeftConst(preset.initialLeftConst);
    setRightConst(preset.initialRightConst);
    setTiltMessage("");
    setTiltAngle(0);
    setIsSolved(false);
  }

  // Format rendering equation text
  function getEquationText(): string {
    const leftTerms = [];
    if (leftXQty > 0) {
      leftTerms.push(leftXQty === 1 ? "x" : `${leftXQty}x`);
    }
    if (leftConst !== 0) {
      leftTerms.push(leftConst > 0 ? `+ ${leftConst}` : `- ${Math.abs(leftConst)}`);
    }
    const leftSide = leftTerms.length > 0 ? leftTerms.join(" ") : "0";
    return `${leftSide} = ${rightConst}`;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <Link to="/student/visualizations/plsv" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs mb-3 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Galeri
        </Link>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Neraca Timbangan Persamaan (PLSV)
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Selesaikan persamaan linear satu variabel secara visual! Manfaatkan operasi invers untuk mengisolasi variabel $x$ pada ruas kiri sambil menjaga timbangan tetap seimbang.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Visual balance scale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

            {/* Presets and Status */}
            <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="flex gap-2 flex-wrap">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePresetIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      activePresetIdx === idx
                        ? "bg-teal-650 text-white shadow-sm"
                        : "bg-slate-100 text-slate-650 hover:bg-slate-200 border border-slate-200/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="font-mono text-lg font-black text-slate-800 bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-250/50 shadow-3xs">
                <InlineMath math={getEquationText()} />
              </div>
            </div>

            {/* Scale tilt status alert */}
            {tiltMessage && (
              <div className={`w-full relative z-10 border text-xs px-4 py-3 rounded-2xl mb-6 flex items-center gap-2 animate-fadeIn ${
                tiltAngle === 0 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}>
                <ShieldAlert size={14} className="shrink-0" />
                <span>{tiltMessage}</span>
              </div>
            )}            {/* Vector Scale SVG */}
            <div className="relative z-10 w-full max-w-lg min-h-[260px] border border-slate-200/60 bg-linear-to-b from-slate-50/50 to-slate-100/50 rounded-2xl p-6 flex items-center justify-center shadow-inner overflow-hidden">
              <svg width="100%" height="220" viewBox="0 0 400 220" className="overflow-visible select-none">
                <defs>
                  {/* Metallic Gradients */}
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
                  {/* Token Gradients */}
                  <radialGradient id="goldCoin" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </radialGradient>
                  <radialGradient id="balloonRed" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="60%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </radialGradient>
                  <linearGradient id="xBlock" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  {/* Glassmorphic Pan style */}
                  <linearGradient id="panGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Dial Gauge background */}
                <path d="M 170 90 A 30 30 0 0 1 230 90" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 3" />

                {/* Stand Pillar Base */}
                <rect x="188" y="90" width="24" height="110" fill="url(#metalStand)" rx="2" />
                <path d="M 140 200 L 260 200 L 245 208 L 155 208 Z" fill="#334155" />
                <rect x="130" y="208" width="140" height="4" fill="#1e293b" rx="2" />

                {/* Dial Pointer needle (Rotates to show imbalance indicator) */}
                <g transform={`translate(200, 90) rotate(${tiltAngle})`}>
                  <line x1="0" y1="0" x2="0" y2="-32" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <polygon points="-4,-24 0,-32 4,-24" fill="#ef4444" />
                </g>

                {/* Central Pivot point */}
                <circle cx="200" cy="90" r="10" fill="#1e293b" />
                <circle cx="200" cy="90" r="6" fill="#cbd5e1" />

                {/* Rotating Beam and Pans Group */}
                <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: "200px 90px", transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                  {/* Balance Beam line */}
                  <rect x="70" y="86" width="260" height="8" fill="url(#metalBeam)" rx="3" />
                  <circle cx="80" cy="90" r="4.5" fill="#1e293b" />
                  <circle cx="320" cy="90" r="4.5" fill="#1e293b" />

                  {/* Left hanger (Double suspension cords) */}
                  <line x1="80" y1="90" x2="52" y2="140" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="80" y1="90" x2="108" y2="140" stroke="#64748b" strokeWidth="1.5" />

                  {/* Left Hanger Pan Group - Counter rotated to keep perfectly level */}
                  <g transform={`translate(80, 140) rotate(${-tiltAngle})`} style={{ transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    {/* Hanging Pan Plate */}
                    <path d="M -30 0 L 30 0 L 22 12 L -22 12 Z" fill="url(#panGrad)" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />
                    
                    {/* Weights on Left Pan */}
                    <g transform="translate(0, -2)">
                      {/* Variable X blocks */}
                      {Array.from({ length: Math.max(0, leftXQty) }).map((_, i) => {
                        const cols = 2;
                        const row = Math.floor(i / cols);
                        const col = i % cols;
                        return (
                          <g key={`left-x-${i}`} transform={`translate(${-22 + col * 24}, ${-20 - row * 22})`}>
                            <rect
                              x="0"
                              y="0"
                              width="20"
                              height="20"
                              fill="url(#xBlock)"
                              stroke="#312e81"
                              strokeWidth="1.5"
                              rx="4"
                              className="shadow-md"
                            />
                            <text x="10" y="14" fill="#ffffff" textAnchor="middle" className="font-sans font-black text-[10px] select-none">x</text>
                          </g>
                        );
                      })}
                      {/* Constant positive blocks (Gold Coins) */}
                      {Array.from({ length: Math.min(10, Math.max(0, leftConst)) }).map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        return (
                          <circle
                            key={`left-c-pos-${i}`}
                            cx={-16 + col * 8}
                            cy={-6 - row * 10}
                            r="5"
                            fill="url(#goldCoin)"
                            stroke="#92400e"
                            strokeWidth="0.8"
                            className="shadow-2xs"
                          />
                        );
                      })}
                      {/* Negative Constant balloons */}
                      {Array.from({ length: Math.min(10, Math.max(0, -leftConst)) }).map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        const bx = -16 + col * 8;
                        const by = -32 - row * 14;
                        return (
                          <g key={`left-c-neg-${i}`} className="animate-pulse">
                            {/* Balloon string */}
                            <line x1={bx} y1={by} x2={bx} y2={by + 10} stroke="#94a3b8" strokeWidth="0.7" />
                            {/* Balloon body */}
                            <circle
                              cx={bx}
                              cy={by}
                              r="5"
                              fill="url(#balloonRed)"
                              stroke="#be123c"
                              strokeWidth="0.8"
                            />
                          </g>
                        );
                      })}
                    </g>
                  </g>

                  {/* Right hanger (Double suspension cords) */}
                  <line x1="320" y1="90" x2="292" y2="140" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="320" y1="90" x2="348" y2="140" stroke="#64748b" strokeWidth="1.5" />

                  {/* Right Hanger Pan Group - Counter rotated to keep perfectly level */}
                  <g transform={`translate(320, 140) rotate(${-tiltAngle})`} style={{ transition: "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    {/* Hanging Pan Plate */}
                    <path d="M -30 0 L 30 0 L 22 12 L -22 12 Z" fill="url(#panGrad)" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" />

                    {/* Weights on Right Pan */}
                    <g transform="translate(0, -2)">
                      {/* Constant positive blocks (Gold Coins) */}
                      {Array.from({ length: Math.min(15, Math.max(0, rightConst)) }).map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        return (
                          <circle
                            key={`right-c-pos-${i}`}
                            cx={-16 + col * 8}
                            cy={-6 - row * 10}
                            r="5"
                            fill="url(#goldCoin)"
                            stroke="#92400e"
                            strokeWidth="0.8"
                            className="shadow-2xs"
                          />
                        );
                      })}
                      {/* Negative Constant balloons */}
                      {Array.from({ length: Math.min(15, Math.max(0, -rightConst)) }).map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        const bx = -16 + col * 8;
                        const by = -32 - row * 14;
                        return (
                          <g key={`right-c-neg-${i}`} className="animate-pulse">
                            {/* Balloon string */}
                            <line x1={bx} y1={by} x2={bx} y2={by + 10} stroke="#94a3b8" strokeWidth="0.7" />
                            {/* Balloon body */}
                            <circle
                              cx={bx}
                              cy={by}
                              r="5"
                              fill="url(#balloonRed)"
                              stroke="#be123c"
                              strokeWidth="0.8"
                            />
                          </g>
                        );
                      })}
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            {/* Operations Control Toolbar */}
            <div className="relative z-10 w-full mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Panel Aksi Operasi Ruas:</span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Op selector */}
                <div className="flex bg-white border border-slate-200 rounded-xl p-1 shrink-0">
                  {["+", "-", "*", "/"].map((op) => (
                    <button
                      key={op}
                      onClick={() => setOpType(op as any)}
                      className={`flex-1 font-bold text-xs py-1.5 rounded-lg cursor-pointer ${
                        opType === op ? "bg-teal-600 text-white shadow-2xs" : "text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      {op === "*" ? "×" : op === "/" ? "÷" : op}
                    </button>
                  ))}
                </div>

                {/* Number input selector */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                  <button onClick={() => setOpVal(prev => Math.max(1, prev - 1))} className="px-2.5 py-1 font-bold text-slate-650 cursor-pointer">-</button>
                  <span className="flex-1 text-center text-xs font-bold font-mono text-slate-800">{opVal}</span>
                  <button onClick={() => setOpVal(prev => prev + 1)} className="px-2.5 py-1 font-bold text-slate-650 cursor-pointer">+</button>
                </div>

                {/* Apply Side selector */}
                <select
                  value={applySide}
                  onChange={(e) => setApplySide(e.target.value as any)}
                  className="bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="both">KEDUA RUAS (Rekomendasi)</option>
                  <option value="left">Hanya Ruas Kiri</option>
                  <option value="right">Hanya Ruas Kanan</option>
                </select>

                {/* Submit button */}
                <button
                  onClick={handleApplyOperation}
                  className="bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Terapkan Aksi
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 w-full flex items-center justify-end gap-4 mt-6 border-t border-slate-100 pt-5">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Mulai Ulang Timbangan</span>
              </button>
            </div>
          </div>

          {/* Solved / Win State Card */}
          {isSolved && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4 animate-scaleUp">
              <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-slate-900 text-sm">Persamaan Terselesaikan secara Sempurna! 🎉</h4>
                <p className="text-[11px] text-slate-650 mt-0.5">
                  Kamu sukses mengisolasi variabel <span className="font-bold text-indigo-700 font-mono">1x</span> sendirian di ruas kiri, seimbang dengan konstanta <span className="font-bold font-mono text-emerald-700">{rightConst}</span> di ruas kanan. Maka nilai <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1 rounded border border-teal-200">x = {rightConst}</span>!
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePresetIdx(prev => (prev + 1) % presets.length);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer w-full md:w-auto flex items-center justify-center gap-1"
              >
                <span>Level Berikutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Remediation Scaffolding & Miskonsepsi */}
        <div className="space-y-6">
          {/* Concept Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Info size={14} className="text-teal-600" />
              KONSEP TIMBANGAN ALJABAR
            </h3>

            <ul className="space-y-3 text-[11px] text-slate-600 leading-relaxed list-disc pl-4">
              <li>
                <span className="font-bold text-slate-800">Tanda Sama Dengan (=)</span> mewakili poros tengah timbangan. Nilai total di ruas kiri wajib sama dengan nilai di ruas kanan agar timbangan seimbang.
              </li>
              <li>
                <span className="font-bold text-slate-800">Isolasi Variabel:</span> Goal kita adalah menyisakan hanya satu kotak biru <span className="font-bold text-indigo-600">x</span> di ruas kiri.
              </li>
              <li>
                <span className="font-bold text-slate-800">Operasi Invers (Lawan):</span> Jika ada penjumlahan (<span className="font-bold text-emerald-600">+3</span>), gunakan pengurangan (<span className="font-bold text-rose-600">-3</span>) untuk membatalkannya. Jika ada perkalian, gunakan pembagian.
              </li>
            </ul>
          </div>

          {/* MC Remediation box */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-500" />
                MISKONSEPSI: OPERASI SEARAH
              </h3>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                {showExplanation ? "Sembunyikan" : "Tampilkan Analisis"}
              </button>
            </div>

            <p className="text-xs text-slate-650 leading-relaxed">
              Miskonsepsi umum siswa saat "memindahkan" angka melintasi tanda sama dengan adalah melupakan operasi invers (misal menganggap <span className="font-bold font-mono">x + 3 = 8</span> diselesaikan dengan <span className="font-bold font-mono">x = 8 + 3</span>).
            </p>

            {showExplanation && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="bg-white border border-rose-150 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <span className="font-bold text-rose-600 block text-[9px] uppercase">🚨 JIKA KAMU MENERAPKAN "+3" (Salah):</span>
                  <div className="space-y-1 text-slate-600">
                    <div>Persamaan: x + 3 = 8</div>
                    <div className="text-[10px] text-slate-450 mt-1">Ditambah 3 di kedua ruas:</div>
                    <div className="font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded inline-block">x + 6 = 11 (SALAH)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Variabel x tidak terisolasi dan angkanya justru semakin membesar!</div>
                  </div>
                </div>

                <div className="bg-white border border-emerald-150 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <span className="font-bold text-emerald-600 block text-[9px] uppercase">✅ MENERAPKAN OPERASI INVERS "-3" (Benar):</span>
                  <div className="space-y-1 text-slate-600">
                    <div>Persamaan: x + 3 = 8</div>
                    <div className="text-[10px] text-slate-450 mt-1">Dikurangi 3 di kedua ruas:</div>
                    <div className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-block">x = 5 (BENAR!)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Menambahkan lawan (invers) dari +3 berhasil menyisakan x sendirian.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Quiz Container to cement understanding */}
      <QuizContainer 
        title="Evaluasi Konsep"
        questionText={
          <span>
            Langkah awal apakah yang paling tepat untuk menyelesaikan persamaan di bawah ini pada timbangan? <br />
            <span className="font-bold text-teal-650 bg-teal-50 px-1.5 py-0.5 rounded"><InlineMath math="x - 4 = 6" /></span>
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
            { text: "Kurangi 4 pada kedua ruas", correct: false },
            { text: "Tambahkan 4 pada kedua ruas", correct: true },
            { text: "Kurangi 4 hanya pada ruas kiri", correct: false },
            { text: "Kalikan kedua ruas dengan 4", correct: false }
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
              {opt.text}
            </button>
          ))}
        </div>
      </QuizContainer>
    </div>
  );
}
