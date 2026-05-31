import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Settings2, ArrowDown } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function SubstitutionMachinePage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  // y = 2x + 5
  const [xVal, setXVal] = useState<number>(3);
  const [step, setStep] = useState(0); 
  // 0: input x
  // 1: replace x with (val)
  // 2: multiply
  // 3: add
  
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
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Galeri
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Substitution Machine</h2>
          <p className="text-slate-500 text-sm mt-1">
            Ganti huruf (variabel) dengan angka dan hitung nilainya langkah demi langkah.
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button 
            onClick={() => setMode('explore')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'explore' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Eksplorasi
          </button>
          <button 
            onClick={() => { setMode('evaluate'); handleRetryQuiz(); }}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'evaluate' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Evaluasi
          </button>
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

              <div className="flex flex-col gap-2 w-full max-w-xl mt-8 mb-4 items-center">
                 
                 <div className="flex flex-col text-4xl md:text-5xl font-mono font-black items-start">
                    
                    {/* ROW 1 */}
                    <div className="flex items-center gap-2 md:gap-4">
                       <div className="w-24 md:w-32 text-right text-slate-400">
                          f({step >= 1 ? <span className="text-emerald-400 transition-colors duration-1000">{xVal}</span> : <span className="text-indigo-400 transition-colors duration-1000">x</span>}) =
                       </div>
                       <div className="flex items-center gap-2 md:gap-4">
                          <div className={`w-24 md:w-32 text-center transition-all duration-1000 ${step === 2 ? 'bg-indigo-900/80 ring-4 ring-indigo-400 rounded-xl p-2 scale-110 shadow-lg' : 'p-2'}`}>
                             <span className="text-white">2</span>
                             <span className={`transition-all duration-1000 ${step >= 1 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {step >= 1 ? `(${xVal})` : 'x'}
                             </span>
                          </div>
                          <div className="w-8 text-center text-slate-400">+</div>
                          <div className={`w-16 md:w-20 text-center text-amber-400 transition-all duration-1000 ${step === 2 ? 'bg-indigo-900/80 ring-4 ring-indigo-400 rounded-xl p-2 scale-110 shadow-lg' : 'p-2'}`}>
                             5
                          </div>
                       </div>
                    </div>

                    {/* ROW 2 (Arrows 1) */}
                    <div className={`flex items-center gap-2 md:gap-4 transition-all duration-[1000ms] ${step >= 2 ? 'opacity-100 h-12 delay-[1500ms]' : 'opacity-0 h-0 overflow-hidden delay-0'}`}>
                       <div className="w-24 md:w-32"></div>
                       <div className="flex items-center gap-2 md:gap-4">
                          <div className="w-24 md:w-32 flex justify-center"><ArrowDown className="text-slate-400 animate-bounce" /></div>
                          <div className="w-8"></div>
                          <div className="w-16 md:w-20 flex justify-center"><ArrowDown className="text-slate-400 animate-bounce" /></div>
                       </div>
                    </div>

                    {/* ROW 3 */}
                    <div className={`flex items-center gap-2 md:gap-4 transition-all duration-[1000ms] ${step >= 2 ? 'opacity-100 h-16 md:h-20 delay-[3000ms]' : 'opacity-0 h-0 overflow-hidden delay-0'}`}>
                       <div className="w-24 md:w-32 text-right text-slate-400">=</div>
                       <div className="flex items-center gap-2 md:gap-4">
                          <div className={`w-24 md:w-32 text-center text-white transition-all duration-1000 ${step === 3 ? 'bg-indigo-900/80 ring-4 ring-indigo-400 rounded-xl p-2 scale-110 shadow-lg' : 'p-2'}`}>
                             {2 * xVal}
                          </div>
                          <div className={`w-8 text-center text-slate-400 transition-all duration-1000 ${step === 3 ? 'bg-indigo-900/80 ring-4 ring-indigo-400 rounded-xl p-2 scale-110 shadow-lg' : 'p-2'}`}>
                             +
                          </div>
                          <div className={`w-16 md:w-20 text-center text-amber-400 transition-all duration-1000 ${step === 3 ? 'bg-indigo-900/80 ring-4 ring-indigo-400 rounded-xl p-2 scale-110 shadow-lg' : 'p-2'}`}>
                             5
                          </div>
                       </div>
                    </div>

                    {/* ROW 4 (Arrow 2) */}
                    <div className={`flex items-center gap-2 md:gap-4 transition-all duration-[1000ms] ${step >= 3 ? 'opacity-100 h-12 delay-[1500ms]' : 'opacity-0 h-0 overflow-hidden delay-0'}`}>
                       <div className="w-24 md:w-32"></div>
                       <div className="flex items-center gap-2 md:gap-4 w-[13rem] md:w-[16rem] justify-center">
                          <ArrowDown className="text-slate-400 animate-bounce" />
                       </div>
                    </div>

                    {/* ROW 5 (Result) */}
                    <div className={`flex items-center gap-2 md:gap-4 transition-all duration-[1000ms] ${step >= 3 ? 'opacity-100 h-20 md:h-24 delay-[3000ms]' : 'opacity-0 h-0 overflow-hidden delay-0'}`}>
                       <div className="w-24 md:w-32 text-right text-slate-400">=</div>
                       <div className="flex items-center gap-2 md:gap-4 w-[13rem] md:w-[16rem] justify-center">
                          <span className="text-5xl md:text-6xl text-emerald-400 bg-emerald-900/50 px-6 py-2 rounded-2xl border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
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
                  {step === 1 && `Substitusi: Ganti variabel x di ruas kiri dan kanan menjadi angka ${xVal}. Perhatikan f(x) menjadi f(${xVal}).`}
                  {step === 2 && `Kalikan 2 dengan ${xVal} menghasilkan ${2*xVal}, sedangkan konstanta 5 diturunkan ke bawah.`}
                  {step === 3 && `Jumlahkan hasil perkalian dengan konstanta untuk mendapatkan hasil akhir dari f(${xVal}).`}
                </p>
              </div>

              <div className="w-full flex justify-center">
                 {step < 3 ? (
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
                      className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '10' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-10' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
