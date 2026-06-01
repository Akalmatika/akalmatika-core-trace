import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Settings2, ArrowDown } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

const SnakeBorder = ({ active, color = "#818cf8" }: { active: boolean; color?: string }) => {
  if (!active) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
      <rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" repeatCount="1" fill="freeze" />
      </rect>
    </svg>
  );
};

const GrowingArrow = ({ active, delay = "0ms" }: { active: boolean; delay?: string }) => {
  return (
    <div className={`w-full h-full flex justify-center transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: active ? delay : '0ms' }}>
      <svg width="24" height="100%" viewBox="0 0 24 40" preserveAspectRatio="none" className="overflow-visible">
         <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
               <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
            </marker>
         </defs>
         <line x1="12" y1="0" x2="12" y2="36" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrowhead)"
               pathLength="100" strokeDasharray="100" 
               strokeDashoffset={active ? "0" : "100"}
               style={{ transition: `stroke-dashoffset 1s ease-in-out ${active ? delay : '0ms'}` }} />
      </svg>
    </div>
  );
};

export default function SubstitutionMachinePage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  // f(x) = ax + b
  const [coeff, setCoeff] = useState<number>(2);
  const [constVal, setConstVal] = useState<number>(5);
  const [xVal, setXVal] = useState<number>(3);
  const [step, setStep] = useState(0); 
  // 0: Initial
  // 1: Substituted x
  // 2: Multiply
  // 3: Drop constant
  // 4: Add
  
  // Re-run steps animation on any input change
  useEffect(() => {
    setStep(0);
  }, [xVal, coeff, constVal]);

  // Evaluate Mode State
  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleEvaluate = (isCorrect: boolean) => {
    if (evalResult !== 'none') return;
    if (isCorrect) {
      setEvalResult('correct');
      setScore(s => s + 1);
    } else {
      setEvalResult('wrong');
    }
  };

  const handleNextQuiz = () => {
    setEvalResult('none');
    if (quizStep < 2) {
      setQuizStep(s => s + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    setQuizStep(0);
    setScore(0);
    setIsFinished(false);
    setEvalResult('none');
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-3 px-3 sm:px-6 pb-24 lg:pb-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-3 lg:mb-8">
        <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-650 font-bold text-xs lg:text-sm mb-2 lg:mb-3 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Galeri
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-xl lg:text-4xl font-black text-slate-800 mb-0.5 lg:mb-2">Substitution Machine</h1>
            <p className="text-slate-500 text-xs lg:text-sm">Ganti huruf (variabel) dengan angka dan hitung nilainya langkah demi langkah.</p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit scale-90 sm:scale-100 origin-left">
            <button 
              onClick={() => { setMode('explore'); setStep(0); }}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${mode === 'explore' ? 'bg-white text-indigo-650 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Eksplorasi
            </button>
            <button 
              onClick={() => { setMode('evaluate'); setStep(0); }}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${mode === 'evaluate' ? 'bg-white text-indigo-650 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Evaluasi
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8">
          {mode === 'explore' && (
            <div className="bg-slate-800 rounded-2xl lg:rounded-3xl p-3.5 lg:p-12 shadow-inner min-h-[300px] lg:min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden text-white">
              
              <div className="absolute top-3 left-4 text-slate-450 font-mono text-xs uppercase tracking-widest flex items-center gap-1.5">
                 <Settings2 size={14} className="lg:w-4 lg:h-4" /> Mesin Fungsi
              </div>

              <div className="flex justify-center w-full mt-6 lg:mt-8 mb-3 lg:mb-4 overflow-x-auto pb-2">
                 <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-1 sm:gap-x-4 lg:gap-x-6 items-center text-base sm:text-3xl lg:text-5xl font-mono font-black justify-items-center whitespace-nowrap min-w-max px-2 lg:px-4">
                    
                    {/* ROW 1 */}
                    <div className="text-slate-400 justify-self-end py-1 lg:py-2 relative flex items-center p-1.5 lg:p-3 rounded-xl h-9 sm:h-14 lg:h-16">
                       f(
                       <span className="relative inline-flex justify-center items-center mx-0.5 lg:mx-1 min-w-[0.8rem] lg:min-w-[1.5rem]">
                          {step === 1 && <SnakeBorder active={true} color="#818cf8" />}
                          <span className="invisible">{step >= 1 ? xVal : 'x'}</span>
                          <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-0' : 'opacity-100'}`}>x</span>
                          <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-emerald-400`}>{xVal}</span>
                       </span>
                       ) =
                    </div>
                    
                    {/* ROW 1: coeff(x) Cell */}
                    <div className={`relative flex items-center justify-center p-1.5 lg:p-3 rounded-xl h-9 sm:h-14 lg:h-16 transition-all duration-500 ${step === 2 ? 'bg-indigo-900/60 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-transparent'}`}>
                       <SnakeBorder active={step === 2} color="#818cf8" />
                       
                       <div className="text-white relative flex items-center z-10">
                          <span 
                            className={`px-1.5 py-0.5 rounded border-b border-dashed border-indigo-400 hover:bg-slate-700/80 cursor-pointer transition-colors ${step > 0 ? 'pointer-events-none border-b-0' : ''}`}
                            onClick={() => {
                              if (step === 0) setCoeff(c => c === 10 ? -10 : c + 1);
                            }}
                            title="Klik untuk mengubah koefisien"
                          >
                            {coeff}
                          </span>
                          <span className="relative inline-flex justify-center items-center ml-0.5 lg:ml-1 min-w-[1.2rem] lg:min-w-[2.5rem]">
                             {step === 1 && <SnakeBorder active={true} color="#818cf8" />}
                             <span className="invisible">{step >= 1 ? `(${xVal})` : 'x'}</span>
                             <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-0' : 'opacity-100'} text-indigo-400`}>x</span>
                             <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-emerald-400`}>({xVal})</span>
                          </span>
                       </div>

                       {/* Flying Clone for step 2 */}
                       <div className={`absolute inset-0 z-30 transition-transform duration-[1500ms] ease-in-out pointer-events-none ${step >= 2 ? 'translate-y-[64px] sm:translate-y-[96px] lg:translate-y-[112px]' : 'translate-y-0'} ${step === 2 ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="relative w-full h-full flex justify-center items-center">
                             <div className={`absolute transition-opacity duration-500 ${step >= 2 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-white">{coeff}</span><span className="text-emerald-400">({xVal})</span>
                             </div>
                             <div className={`absolute transition-opacity duration-500 ${step >= 2 ? 'opacity-100 delay-[1000ms]' : 'opacity-0'}`}>
                                <span className="text-white">{coeff * xVal}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="text-slate-400 flex items-center h-9 sm:h-14 lg:h-16">+</div>
                    
                    {/* ROW 1: constVal Cell */}
                    <div className={`relative flex items-center justify-center p-1.5 lg:p-3 rounded-xl h-9 sm:h-14 lg:h-16 transition-all duration-500 ${step === 3 ? 'bg-amber-900/30 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-transparent'}`}>
                       <SnakeBorder active={step === 3} color="#fbbf24" />
                       
                       <div className="text-amber-400 z-10">
                          <span 
                            className={`px-1.5 py-0.5 rounded border-b border-dashed border-amber-400 hover:bg-slate-700/80 cursor-pointer transition-colors ${step > 0 ? 'pointer-events-none border-b-0' : ''}`}
                            onClick={() => {
                              if (step === 0) setConstVal(c => c === 10 ? -10 : c + 1);
                            }}
                            title="Klik untuk mengubah konstanta"
                          >
                            {constVal}
                          </span>
                       </div>

                       {/* Flying Clone for step 3 */}
                       <div className={`absolute inset-0 z-30 transition-transform duration-[1500ms] ease-in-out pointer-events-none ${step >= 3 ? 'translate-y-[64px] sm:translate-y-[96px] lg:translate-y-[112px]' : 'translate-y-0'} ${step === 3 ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="w-full h-full flex items-center justify-center">
                             <span className="text-amber-400">{constVal}</span>
                          </div>
                       </div>
                    </div>

                    {/* ROW 2 (Arrows 1) */}
                    <div className="justify-self-end"></div>
                    <div className={`flex items-center w-full transition-all duration-[500ms] ${step >= 2 ? 'h-6 sm:h-10 lg:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 2} delay="0ms" />
                    </div>
                    <div></div>
                    <div className={`flex items-center w-full transition-all duration-[500ms] ${step >= 3 ? 'h-6 sm:h-10 lg:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 3} delay="0ms" />
                    </div>

                    {/* ROW 3 (Multiplication & Drop Result) */}
                    <div className={`justify-self-end flex items-center h-9 sm:h-14 lg:h-16 transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                       <span className="text-slate-400 py-1 lg:py-2">=</span>
                    </div>
                    
                    {/* ROW 3: coeff*xVal Cell */}
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 2 ? 'h-9 sm:h-14 lg:h-16' : 'h-0 overflow-hidden'}`}>
                       <div className={`relative flex items-center justify-center p-1.5 lg:p-3 rounded-xl transition-all duration-500 ${step === 4 ? 'bg-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-transparent'}`}>
                          <SnakeBorder active={step === 4} color="#10b981" />
                          
                          {/* Static element ONLY appears at step >= 3 to avoid overlapping with clone at step 2 */}
                          <div className={`${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                             <span className="text-white">{coeff * xVal}</span>
                          </div>

                          {/* Flying Clone for step 4 (Left operand) */}
                          <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 4 ? 'translate-y-[64px] sm:translate-y-[100px] lg:translate-y-[128px] translate-x-[40px] sm:translate-x-[70px] lg:translate-x-[90px]' : 'translate-y-0 translate-x-0'} ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${step >= 4 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-white">{coeff * xVal}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 3 ? 'h-9 sm:h-14 lg:h-16 opacity-100 delay-[500ms]' : 'h-0 overflow-hidden opacity-0'}`}>
                       <div className="p-1.5 lg:p-3 text-slate-300">+</div>
                    </div>
                    
                    {/* ROW 3: constVal Cell */}
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 3 ? 'h-9 sm:h-14 lg:h-16' : 'h-0 overflow-hidden'}`}>
                       <div className={`relative flex items-center justify-center p-1.5 lg:p-3 rounded-xl transition-all duration-500 ${step === 4 ? 'bg-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-transparent'}`}>
                          <SnakeBorder active={step === 4} color="#10b981" />
                          
                          {/* Static element ONLY appears at step >= 4 to avoid overlapping with clone at step 3 */}
                          <div className={`${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <span className="text-amber-400">{constVal}</span>
                          </div>

                          {/* Flying Clone for step 4 (Right operand) */}
                          <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 4 ? 'translate-y-[64px] sm:translate-y-[100px] lg:translate-y-[128px] -translate-x-[40px] sm:-translate-x-[70px] lg:-translate-x-[90px]' : 'translate-y-0 translate-x-0'} ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${step >= 4 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-amber-400">{constVal}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* ROW 4 (Arrow 2) */}
                    <div></div>
                    <div className={`col-span-3 flex items-center justify-center transition-all duration-[500ms] w-full ${step >= 4 ? 'h-6 sm:h-10 lg:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 4} delay="0ms" />
                    </div>

                    {/* ROW 5 (Final Result) */}
                    <div className={`justify-self-end flex items-center transition-all duration-[500ms] ${step >= 4 ? 'h-10 sm:h-16 lg:h-24 opacity-100 delay-[1000ms]' : 'h-0 overflow-hidden opacity-0'}`}>
                       <span className="text-slate-400">=</span>
                    </div>
                    <div className={`col-span-3 flex items-center justify-center transition-all duration-[500ms] ${step >= 4 ? 'h-10 sm:h-16 lg:h-24' : 'h-0 overflow-hidden'}`}>
                       <div className="relative">
                          {/* Final morphed result fades in just as the step 4 clones fade out */}
                          <span className={`block transition-all duration-500 ${step >= 4 ? 'opacity-100 delay-[1000ms]' : 'opacity-0'} text-xl sm:text-4xl lg:text-6xl text-emerald-400 bg-emerald-900/50 px-3 py-1 sm:px-6 sm:py-2 rounded-xl lg:rounded-2xl border-2 lg:border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]`}>
                             {coeff * xVal + constVal}
                          </span>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Explanation Box */}
              <div className="w-full max-w-lg bg-slate-700/50 border border-slate-600 p-3 lg:p-5 rounded-xl lg:rounded-2xl text-center min-h-[3.5rem] lg:min-h-[5rem] flex items-center justify-center mb-4 lg:mb-8 shadow-inner">
                <p className="text-slate-350 text-xs lg:text-sm leading-relaxed transition-opacity duration-500">
                  {step === 0 && "Fungsi awal sebelum substitusi. Variabel x siap diganti."}
                  {step === 1 && `Substitusi: Ganti variabel x di ruas kiri dan kanan menjadi angka ${xVal}.`}
                  {step === 2 && `Kalikan ${coeff} dengan ${xVal} menghasilkan ${coeff * xVal}.`}
                  {step === 3 && `Konstanta ${constVal} diturunkan ke bawah karena tidak ada operasi lain di sekitarnya.`}
                  {step === 4 && `Jumlahkan hasil perkalian dengan konstanta untuk mendapatkan hasil akhir dari f(${xVal}).`}
                </p>
              </div>

              <div className="w-full flex justify-center">
                 {step < 4 ? (
                    <button
                       onClick={() => {
                          setStep(s => s + 1);
                       }}
                       className="px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl font-bold text-sm lg:text-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                    >
                       Proses Langkah {step + 1}
                    </button>
                 ) : (
                    <button
                       onClick={() => setStep(0)}
                       className="px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl font-bold text-sm lg:text-lg bg-slate-600 text-slate-300 hover:bg-slate-500 transition-colors active:scale-95 cursor-pointer"
                    >
                       Reset Mesin
                    </button>
                 )}
              </div>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Substitusi Dasar" : quizStep === 1 ? "Hati-hati Kuadrat" : "Substitusi Negatif"}
              questionText={
                quizStep === 0 
                  ? <span>Jika <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="x = 4" /></span>, berapakah nilai dari <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="3x - 2" /></span>?</span>
                  : quizStep === 1
                  ? <span>Jika <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="a = 3" /></span>, berapakah nilai dari <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="a^2 + 1" /></span>?</span>
                  : <span>Ini agak menjebak! Jika <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="y = -2" /></span>, berapakah nilai dari <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="5y" /></span>?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/word-to-expression"
              nextLabel="Lanjut: Kalimat ke Bentuk Aljabar"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex gap-2 lg:gap-4 w-full">
                  {['10', '14', '7'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '10')} 
                      className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-3 lg:gap-4 w-full items-center">
                   <div className="flex gap-2 lg:gap-4 w-full">
                     {['7', '10', '6'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '10')} 
                         className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: <InlineMath math="3^2 = 9" />, lalu ditambah 1 menjadi 10. (Bukan 3x2=6!).
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-3 lg:gap-4 items-center w-full">
                   <div className="flex gap-2 lg:gap-4 w-full">
                     {['-10', '10', '-7'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '-10')} 
                         className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: 5 dikali -2 hasilnya -10. Ingat positif kali negatif hasilnya negatif.
                    </p>
                  )}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-white border border-slate-200 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm mb-1 lg:mb-4">
            <h3 className="text-slate-800 font-bold mb-2 lg:mb-4 text-xs lg:text-sm">Pengaturan Fungsi & Nilai x</h3>
            
            <div className="space-y-4 lg:space-y-6">
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-[10px] lg:text-xs font-bold text-indigo-500">Koefisien (a)</span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-500">{coeff}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={coeff} disabled={step > 0}
                     onChange={(e) => setCoeff(parseInt(e.target.value) || 0)}
                     className="w-full accent-indigo-500 cursor-pointer disabled:opacity-50"
                  />
               </div>

               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-[10px] lg:text-xs font-bold text-indigo-500">Konstanta (b)</span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-500">{constVal}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={constVal} disabled={step > 0}
                     onChange={(e) => setConstVal(parseInt(e.target.value) || 0)}
                     className="w-full accent-indigo-500 cursor-pointer disabled:opacity-50"
                  />
               </div>

               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-[10px] lg:text-xs font-bold text-indigo-500">Nilai x</span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-500">{xVal}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={xVal} onChange={(e) => setXVal(parseInt(e.target.value) || 0)}
                     className="w-full accent-indigo-500 cursor-pointer"
                  />
               </div>
            </div>
          </div>

          <div className="bg-slate-850 border border-slate-700 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-white font-bold mb-1.5 lg:mb-2 text-xs lg:text-sm flex items-center gap-2">
               Substitusi (Penggantian)
            </h3>
            <p className="text-xs lg:text-sm leading-relaxed mb-2.5 lg:mb-4 text-slate-300">
               Variabel seperti <InlineMath math="x" /> hanyalah "wadah" kosong yang mewakili sebuah angka rahasia. Ketika kita melakukan substitusi, kita membongkar "wadah" tersebut dan menggantinya dengan angka asli, lalu menghitungnya.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-slate-700">
              <Info className="text-indigo-400 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] lg:text-xs font-bold text-slate-400">
                Gunakan kurung ( ) saat mengganti huruf menjadi angka agar perkaliannya tidak keliru dibaca.
                Contoh: {coeff}x dengan x = {xVal} menjadi {coeff}({xVal}), bukan {coeff}{Math.abs(xVal)}.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
