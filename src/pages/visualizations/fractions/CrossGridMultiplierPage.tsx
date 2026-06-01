import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import { 
  ArrowLeft, Info, HelpCircle, Layers, Grid3x3, RotateCcw, 
  ArrowRight, Sparkles, CheckCircle2, ChevronRight
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

// Greatest common divisor helper for fraction simplification
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

export default function CrossGridMultiplierPage() {
  const [opMode, setOpMode] = useState<"multiply" | "divide">("multiply");

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

  // Multiplication states (f1 = n1/d1, f2 = n2/d2)
  const [n1, setN1] = useState<number>(1);
  const [d1, setD1] = useState<number>(2);
  const [n2, setN2] = useState<number>(2);
  const [d2, setD2] = useState<number>(3);

  // Division states (f3 = n3/d3, f4 = n4/d4)
  const [n3, setN3] = useState<number>(1);
  const [d3, setD3] = useState<number>(2);
  const [n4, setN4] = useState<number>(1);
  const [d4, setD4] = useState<number>(4);
  
  // Interactive fit division counter
  const [divisionFits, setDivisionFits] = useState<number>(0);

  // Multiplication result
  const prodNum = n1 * n2;
  const prodDenom = d1 * d2;
  const prodGCD = getGCD(prodNum, prodDenom);
  const simplifiedProdNum = prodNum / prodGCD;
  const simplifiedProdDenom = prodDenom / prodGCD;

  // Division result
  const divValue = (n3 / d3) / (n4 / d4);

  // Reset division fits when preset changes
  useEffect(() => {
    setDivisionFits(0);
  }, [n3, d3, n4, d4, opMode]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs mb-3 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Galeri
        </Link>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Arsir Silang Perkalian & Pembagian Pecahan
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Gunakan model arsir dua dimensi transparan untuk memahami perkalian pecahan sebagai "bagian dari suatu bagian", serta bar pembagian untuk melihat berapa banyak pecahan kecil muat ke dalam pecahan besar!
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/50 shadow-3xs">
        <button
          onClick={() => setOpMode("multiply")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            opMode === "multiply" ? "bg-indigo-650 text-white shadow-2xs" : "text-slate-650 hover:bg-slate-50"
          }`}
        >
          <Grid3x3 size={14} />
          <span>Perkalian Arsir Silang</span>
        </button>
        <button
          onClick={() => setOpMode("divide")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            opMode === "divide" ? "bg-indigo-650 text-white shadow-2xs" : "text-slate-650 hover:bg-slate-50"
          }`}
        >
          <Layers size={14} />
          <span>Pembagian Bar Pecahan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: Interactive Visual Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

            {opMode === "multiply" ? (
              // MULTIPLICATION GRID MODE
              <div className="relative z-10 w-full space-y-6 flex flex-col items-center">
                {/* Inputs Toolbar */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-5">
                  {/* Fraction 1 */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Pecahan 1:</span>
                    <div className="flex flex-col gap-1">
                      <select value={n1} onChange={(e) => setN1(parseInt(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {Array.from({ length: d1 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      <div className="h-0.5 bg-slate-350 w-full"></div>
                      <select value={d1} onChange={(e) => { const nextD = parseInt(e.target.value); setD1(nextD); setN1(Math.min(n1, nextD)); }} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {[2, 3, 4, 5, 6, 8, 10].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <span className="text-xl font-black text-slate-400">×</span>

                  {/* Fraction 2 */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Pecahan 2:</span>
                    <div className="flex flex-col gap-1">
                      <select value={n2} onChange={(e) => setN2(parseInt(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {Array.from({ length: d2 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      <div className="h-0.5 bg-slate-350 w-full"></div>
                      <select value={d2} onChange={(e) => { const nextD = parseInt(e.target.value); setD2(nextD); setN2(Math.min(n2, nextD)); }} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {[2, 3, 4, 5, 6, 8, 10].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Math equation result representation */}
                  <div className="bg-slate-55 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 font-mono text-xs text-indigo-950 font-bold shadow-3xs">
                    <InlineMath math={`\\frac{${n1}}{${d1}} \\times \\frac{${n2}}{${d2}} = \\frac{${prodNum}}{${prodDenom}} = \\frac{${simplifiedProdNum}}{${simplifiedProdDenom}}`} />
                  </div>
                </div>

                {/* 2D Cross Grid Visualizer */}
                <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-6 flex items-center justify-center min-w-[280px] shadow-inner overflow-hidden">
                  <div className="grid border border-indigo-200 shadow-xl ring-4 ring-indigo-500/5 bg-white rounded-xl overflow-hidden transition-all duration-300" style={{
                    gridTemplateColumns: `repeat(${d2}, 1fr)`,
                    gridTemplateRows: `repeat(${d1}, 1fr)`,
                    width: "230px",
                    height: "230px"
                  }}>
                    {Array.from({ length: d1 }).map((_, rIdx) => 
                      Array.from({ length: d2 }).map((_, cIdx) => {
                        const isHorizontalShaded = rIdx < n1;
                        const isVerticalShaded = cIdx < n2;
                        const isOverlap = isHorizontalShaded && isVerticalShaded;

                        let cellBg = "bg-transparent hover:bg-slate-50";
                        if (isOverlap) cellBg = "bg-emerald-500/85 border border-emerald-400/50 text-white font-extrabold shadow-inner animate-pulse";
                        else if (isHorizontalShaded) cellBg = "bg-sky-500/40 border border-sky-400/20 text-sky-900";
                        else if (isVerticalShaded) cellBg = "bg-amber-400/45 border border-amber-300/20 text-amber-950";

                        return (
                          <div 
                            key={`cell-${rIdx}-${cIdx}`} 
                            className={`w-full h-full border border-slate-100 transition-all duration-500 flex flex-col items-center justify-center text-[9px] font-mono font-bold select-none ${cellBg}`}
                          >
                            <span className="scale-90 opacity-90">1/{d1 * d2}</span>
                            {isOverlap && <span className="text-[6px] uppercase tracking-tighter opacity-75 font-sans">Overlap</span>}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Description and Legends */}
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-sky-400/50 border border-sky-500/35"></span>
                      <span>Horizontal (F1): <span className="font-bold">{n1}/{d1}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-amber-400/40 border border-amber-500/35"></span>
                      <span>Vertikal (F2): <span className="font-bold">{n2}/{d2}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-400/90 border border-emerald-500/35"></span>
                      <span>Overlaps (Hasil): <span className="font-bold text-emerald-800">{prodNum}/{prodDenom}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // DIVISION BAR MODE
              <div className="relative z-10 w-full space-y-6 flex flex-col items-center">
                {/* Inputs Toolbar */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Pecahan Besar:</span>
                    <div className="flex flex-col gap-1">
                      <select value={n3} onChange={(e) => setN3(parseInt(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {Array.from({ length: d3 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      <div className="h-0.5 bg-slate-350 w-full"></div>
                      <select value={d3} onChange={(e) => { const nextD = parseInt(e.target.value); setD3(nextD); setN3(Math.min(n3, nextD)); }} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {[2, 3, 4, 5, 6, 8, 10].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <span className="text-xl font-black text-slate-400">÷</span>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Dibagi Pecahan:</span>
                    <div className="flex flex-col gap-1">
                      <select value={n4} onChange={(e) => setN4(parseInt(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {Array.from({ length: d4 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                      <div className="h-0.5 bg-slate-350 w-full"></div>
                      <select value={d4} onChange={(e) => { const nextD = parseInt(e.target.value); setD4(nextD); setN4(Math.min(n4, nextD)); }} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer">
                        {[2, 3, 4, 5, 6, 8, 10].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 font-mono text-xs text-indigo-950 font-bold shadow-3xs">
                    <InlineMath math={`\\frac{${n3}}{${d3}} \\div \\frac{${n4}}{${d4}} = \\frac{${n3}}{${d3}} \\times \\frac{${d4}}{${n4}} = ${divValue.toFixed(2)}`} />
                  </div>
                </div>

                {/* Division Interactive Fraction Bar Representation */}
                <div className="w-full bg-slate-50/50 border border-slate-150 rounded-2xl p-6 space-y-6 shadow-inner flex flex-col items-center">
                  
                  {/* Bar 1: Big Fraction */}
                  <div className="w-full max-w-md space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Pecahan Yang Dibagi ({n3}/{d3}):</span>
                    <div className="h-10 w-full bg-slate-100 rounded-xl border border-slate-200/50 flex overflow-hidden shadow-3xs">
                      {Array.from({ length: d3 }).map((_, i) => (
                        <div 
                          key={`b1-${i}`}
                          className={`h-full border-r border-slate-200/55 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                            i < n3 ? "bg-sky-400 text-sky-950" : "bg-slate-50 text-slate-400"
                          }`}
                          style={{ width: `${100 / d3}%` }}
                        >
                          1/{d3}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bar 2: Fitting Pan (Interactive clicks to stack) */}
                  <div className="w-full max-w-md space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Muatan Pecahan Pembagi ({n4}/{d4}):</span>
                      <button
                        onClick={() => setDivisionFits(prev => Math.min(Math.floor(divValue), prev + 1))}
                        className="bg-indigo-50 border border-indigo-150 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold text-[10px] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Pasang 1 Bagian
                      </button>
                    </div>

                    <div className="h-10 w-full bg-slate-100 rounded-xl border border-slate-200/50 flex overflow-hidden shadow-3xs relative">
                      {/* Active fits overlay */}
                      {Array.from({ length: Math.floor(divValue) }).map((_, i) => {
                        const show = i < divisionFits;
                        return (
                          <div 
                            key={`fit-${i}`}
                            className={`h-full border-r border-indigo-250 flex items-center justify-center font-mono font-bold text-xs bg-indigo-500 text-white transition-opacity duration-500`}
                            style={{ width: `${(100 / d4) * n4}%`, opacity: show ? 1 : 0 }}
                          >
                            Bagian {i+1}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-slate-400 text-center block mt-1">Klik tombol di atas untuk menyusun pecahan kecil dan melihat berapa kali dia muat!</span>
                  </div>
                </div>

                {/* Division status result */}
                {divisionFits === Math.floor(divValue) && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 w-full flex items-center gap-3 animate-scaleUp">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span className="text-xs text-slate-650">
                      Terbukti secara visual bahwa pecahan <span className="font-bold font-mono">{n4}/{d4}</span> dapat masuk sebanyak <span className="font-bold font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-250">{divValue.toFixed(1)}</span> kali ke dalam pecahan besar <span className="font-bold font-mono">{n3}/{d3}</span>.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Remediation Info Box */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Info size={14} className="text-indigo-650" />
              MAKNA VISUAL OPERASI
            </h3>

            <div className="space-y-3 text-[11px] text-slate-600 leading-relaxed">
              {opMode === "multiply" ? (
                <>
                  <p>
                    <span className="font-bold text-slate-800">Perkalian Pecahan (x)</span> pada dasarnya mencari luas area irisan. Ketika mengalikan $1/2 \times 2/3$, kita menanyakan: *Berapakah 2/3 bagian dari sepotong area berukuran 1/2?*
                  </p>
                  <p>
                    Grid arsir silang membuktikannya. Irisan arsir biru dan kuning membentuk area **hijau** baru berukuran $2/6$, yang senilai dengan $1/3$ dari keseluruhan grid awal.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold text-slate-800">Pembagian Pecahan (÷)</span> bermakna mencari perbandingan isi. Ketika menghitung $1/2 \div 1/4$, kita menanyakan: *Berapa banyak potongan 1/4 dapat dimasukkan ke dalam wadah berukuran 1/2?*
                  </p>
                  <p>
                    Secara visual, kamu dapat menyusun tepat **2** potongan pecahan berukuran $1/4$ ke dalam bar berukuran $1/2$, membuktikan mengapa pembagian pecahan menghasilkan angka bulat $2$!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Quiz Container */}
      <QuizContainer 
        title="Evaluasi Konsep"
        questionText={
          <span>
            Manakah ilustrasi visual yang paling tepat untuk mewakili perkalian pecahan di bawah ini? <br />
            <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="\\frac{1}{2} \\times \\frac{1}{2}" /></span>
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
            { text: "Menyusun 2 bar berukuran 1/2 sehingga membentuk 1 keseluruhan utuh", correct: false },
            { text: "Irisan arsir silang yang menghasilkan 1 dari total 4 kotak keseluruhan (1/4)", correct: true },
            { text: "Memotong grid 1/2 menjadi 2 bagian yang tidak sama besar", correct: false },
            { text: "Menambahkan potongan 1/2 ke piringan yang sudah berisi 1/2 bagian", correct: false }
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
