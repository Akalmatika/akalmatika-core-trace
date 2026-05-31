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
  
  // y = 2x + 5
  const [xVal, setXVal] = useState<number>(3);
  const [step, setStep] = useState(0); 
  // 0: Initial
  // 1: Substituted x
  // 2: Multiply
  // 3: Drop constant
  // 4: Add
  
  // Re-run steps animation on x change
  useEffect(() => {
    setStep(0);
  }, [xVal]);

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
    <div className="w-full max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <Link to="/visualizations" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
          <ArrowLeft size={20} /> Kembali ke Galeri
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">Substitution Machine</h1>
            <p className="text-slate-500">Ganti huruf (variabel) dengan angka dan hitung nilainya langkah demi langkah.</p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => { setMode('explore'); setStep(0); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'explore' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Eksplorasi
            </button>
            <button 
              onClick={() => { setMode('evaluate'); setStep(0); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'evaluate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Evaluasi
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8">
          {mode === 'explore' && (
            <div className="bg-slate-800 rounded-3xl p-6 md:p-12 shadow-inner min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden text-white">
              
              <div className="absolute top-4 left-6 text-slate-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                 <Settings2 size={16} /> Mesin Fungsi
              </div>

              <div className="flex justify-center w-full mt-8 mb-4 overflow-x-auto pb-4">
                 <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-2 md:gap-x-4 lg:gap-x-6 items-center text-3xl md:text-4xl lg:text-5xl font-mono font-black justify-items-center whitespace-nowrap min-w-max px-4">
                    
                    {/* ROW 1 */}
                    <div className="text-slate-400 justify-self-end py-2 relative flex items-center p-3 rounded-xl">
                       f(
                       <span className="relative inline-flex justify-center items-center mx-1 min-w-[1.5rem]">
                          {step === 1 && <SnakeBorder active={true} color="#818cf8" />}
                          <span className="invisible">{step >= 1 ? xVal : 'x'}</span>
                          <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-0' : 'opacity-100'}`}>x</span>
                          <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-emerald-400`}>{xVal}</span>
                       </span>
                       ) =
                    </div>
                    
                    {/* ROW 1: 2(x) Cell */}
                    <div className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-500 ${step === 2 ? 'bg-indigo-900/60 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-transparent'}`}>
                       <SnakeBorder active={step === 2} color="#818cf8" />
                       
                       <div className="text-white relative flex items-center z-10">
                          2
                          <span className="relative inline-flex justify-center items-center ml-1 min-w-[2.5rem]">
                             {step === 1 && <SnakeBorder active={true} color="#818cf8" />}
                             <span className="invisible">{step >= 1 ? `(${xVal})` : 'x'}</span>
                             <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-0' : 'opacity-100'} text-indigo-400`}>x</span>
                             <span className={`absolute transition-opacity duration-[1500ms] delay-[1000ms] ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-emerald-400`}>({xVal})</span>
                          </span>
                       </div>

                       {/* Flying Clone for step 2 */}
                       <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 2 ? 'translate-y-[98px] md:translate-y-[110px]' : 'translate-y-0'} ${step === 2 ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="relative w-full h-full flex justify-center items-center">
                             <div className={`absolute transition-opacity duration-500 ${step === 2 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-white">2</span><span className="text-emerald-400">({xVal})</span>
                             </div>
                             <div className={`absolute transition-opacity duration-500 ${step === 2 ? 'opacity-100 delay-[1000ms]' : 'opacity-0'}`}>
                                <span className="text-white">{2 * xVal}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="text-slate-400 py-2">+</div>
                    
                    {/* ROW 1: 5 Cell */}
                    <div className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-500 ${step === 3 ? 'bg-amber-900/30 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-transparent'}`}>
                       <SnakeBorder active={step === 3} color="#fbbf24" />
                       
                       <div className="text-amber-400 z-10">5</div>

                       {/* Flying Clone for step 3 */}
                       <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 3 ? 'translate-y-[98px] md:translate-y-[110px]' : 'translate-y-0'} ${step === 3 ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="w-full h-full flex items-center justify-center">
                             <span className="text-amber-400">5</span>
                          </div>
                       </div>
                    </div>

                    {/* ROW 2 (Arrows 1) */}
                    <div className="justify-self-end"></div>
                    <div className={`flex items-center w-full transition-all duration-[500ms] ${step >= 2 ? 'h-10 md:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 2} delay="0ms" />
                    </div>
                    <div></div>
                    <div className={`flex items-center w-full transition-all duration-[500ms] ${step >= 3 ? 'h-10 md:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 3} delay="0ms" />
                    </div>

                    {/* ROW 3 (Multiplication & Drop Result) */}
                    <div className="justify-self-end"></div>
                    
                    {/* ROW 3: 2*xVal Cell */}
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 2 ? 'h-14 md:h-16' : 'h-0 overflow-hidden'}`}>
                       <div className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-500 ${step === 4 ? 'bg-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-transparent'}`}>
                          <SnakeBorder active={step === 4} color="#10b981" />
                          
                          {/* Static element ONLY appears at step >= 3 to avoid overlapping with clone at step 2 */}
                          <div className={`transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                             <span className="text-white">{2 * xVal}</span>
                          </div>

                          {/* Flying Clone for step 4 (Left operand) */}
                          <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 4 ? 'translate-y-[100px] md:translate-y-[128px] translate-x-[70px] md:translate-x-[90px]' : 'translate-y-0 translate-x-0'} ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${step === 4 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-white">{2 * xVal}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 3 ? 'h-14 md:h-16 opacity-100 delay-[500ms]' : 'h-0 overflow-hidden opacity-0'}`}>
                       <div className="p-3 text-slate-300">+</div>
                    </div>
                    
                    {/* ROW 3: 5 Cell */}
                    <div className={`flex items-center transition-all duration-[500ms] ${step >= 3 ? 'h-14 md:h-16' : 'h-0 overflow-hidden'}`}>
                       <div className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-500 ${step === 4 ? 'bg-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-transparent'}`}>
                          <SnakeBorder active={step === 4} color="#10b981" />
                          
                          {/* Static element ONLY appears at step >= 4 to avoid overlapping with clone at step 3 */}
                          <div className={`transition-opacity duration-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <span className="text-amber-400">5</span>
                          </div>

                          {/* Flying Clone for step 4 (Right operand) */}
                          <div className={`absolute inset-0 z-30 transition-all duration-[1500ms] ease-in-out pointer-events-none ${step >= 4 ? 'translate-y-[100px] md:translate-y-[128px] -translate-x-[70px] md:-translate-x-[90px]' : 'translate-y-0 translate-x-0'} ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${step === 4 ? 'opacity-0 delay-[1000ms]' : 'opacity-100'}`}>
                                <span className="text-amber-400">5</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* ROW 4 (Arrow 2) */}
                    <div></div>
                    <div className={`col-span-3 flex items-center justify-center transition-all duration-[500ms] w-full ${step >= 4 ? 'h-10 md:h-12' : 'h-0 overflow-hidden'}`}>
                       <GrowingArrow active={step >= 4} delay="0ms" />
                    </div>

                    {/* ROW 5 (Final Result) */}
                    <div className={`justify-self-end flex items-center transition-all duration-[500ms] ${step >= 4 ? 'h-16 md:h-24 opacity-100 delay-[1000ms]' : 'h-0 overflow-hidden opacity-0'}`}>
                       <span className="text-slate-400">=</span>
                    </div>
                    <div className={`col-span-3 flex items-center justify-center transition-all duration-[500ms] ${step >= 4 ? 'h-16 md:h-24' : 'h-0 overflow-hidden'}`}>
                       <div className="relative">
                          {/* Final morphed result fades in just as the step 4 clones fade out */}
                          <span className={`block transition-opacity duration-500 ${step >= 4 ? 'opacity-100 delay-[1000ms]' : 'opacity-0'} text-4xl md:text-5xl lg:text-6xl text-emerald-400 bg-emerald-900/50 px-6 py-2 rounded-2xl border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]`}>
                             {2 * xVal + 5}
                          </span>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Explanation Box */}
              <div className="w-full max-w-lg bg-slate-700/50 border border-slate-600 p-5 rounded-2xl text-center min-h-[5rem] flex items-center justify-center mb-8 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed transition-opacity duration-500">
                  {step === 0 && "Fungsi awal sebelum substitusi. Variabel x siap diganti."}
                  {step === 1 && `Substitusi: Ganti variabel x di ruas kiri dan kanan menjadi angka ${xVal}.`}
                  {step === 2 && `Kalikan 2 dengan ${xVal} menghasilkan ${2*xVal}.`}
                  {step === 3 && `Konstanta 5 diturunkan ke bawah karena tidak ada operasi lain di sekitarnya.`}
                  {step === 4 && `Jumlahkan hasil perkalian dengan konstanta untuk mendapatkan hasil akhir dari f(${xVal}).`}
                </p>
              </div>

              <div className="w-full flex justify-center">
                 {step < 4 ? (
                    <button
                       onClick={() => {
                          setStep(s => s + 1);
                       }}
                       className="px-8 py-3 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25"
                    >
                       Proses Langkah {step + 1}
                    </button>
                 ) : (
                    <button
                       onClick={() => setStep(0)}
                       className="px-8 py-3 rounded-xl font-bold bg-slate-600 text-slate-300 hover:bg-slate-500 transition-colors"
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
                  ? <span>Jika <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="x = 4" /></span>, berapakah nilai dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="3x - 2" /></span>?</span>
                  : quizStep === 1
                  ? <span>Jika <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="a = 3" /></span>, berapakah nilai dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="a^2 + 1" /></span>?</span>
                  : <span>Ini agak menjebak! Jika <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="y = -2" /></span>, berapakah nilai dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="5y" /></span>?</span>
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
                <div className="flex gap-4 w-full">
                  {['10', '14', '7'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '10')} 
                      className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-4 w-full items-center">
                   <div className="flex gap-4 w-full">
                     {['7', '10', '6'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '10')} 
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-sm font-bold mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: <InlineMath math="3^2 = 9" />, lalu ditambah 1 menjadi 10. (Bukan 3x2=6!).
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-4 items-center w-full">
                   <div className="flex gap-4 w-full">
                     {['-10', '10', '-7'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '-10')} 
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-10' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-sm font-bold mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: 5 dikali -2 hasilnya -10. Ingat positif kali negatif hasilnya negatif.
                    </p>
                  )}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-slate-800 font-bold mb-4 text-sm">Input Nilai x</h3>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-xs font-bold text-indigo-500">Nilai x</span>
                     <span className="text-xs font-bold text-slate-500">{xVal}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={xVal} onChange={(e) => setXVal(parseInt(e.target.value))}
                     className="w-full accent-indigo-500"
                  />
               </div>
            </div>
          </div>

          <div className="bg-slate-800 text-slate-300 border border-slate-700 p-6 rounded-3xl shadow-sm">
            <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
               Substitusi (Penggantian)
            </h3>
            <p className="text-sm leading-relaxed mb-4">
               Variabel seperti <InlineMath math="x" /> hanyalah "wadah" kosong yang mewakili sebuah angka rahasia. Ketika kita melakukan substitusi, kita membongkar "wadah" tersebut dan menggantinya dengan angka asli, lalu menghitungnya.
            </p>
            <div className="flex items-start gap-2 pt-4 border-t border-slate-700">
              <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
              <p className="text-xs font-bold text-slate-400">
                Gunakan kurung ( ) saat mengganti huruf menjadi angka agar perkaliannya tidak keliru dibaca.
                Contoh: 2x dengan x = {xVal} menjadi 2({xVal}), bukan 2{Math.abs(xVal)}.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
