import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Play } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function LikeTermOperationsPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  const [coef1, setCoef1] = useState(3);
  const [coef2, setCoef2] = useState(-5);
  const [isCombining, setIsCombining] = useState(false);
  
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
    <div className="max-w-4xl mx-auto py-3 px-3 sm:px-6 animate-fadeIn pb-24 lg:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 lg:mb-8 gap-3">
        <div>
          <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs lg:text-sm mb-2 lg:mb-3 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Galeri
          </Link>
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">Mesin Operasi Suku Sejenis</h2>
          <p className="text-slate-500 text-xs lg:text-sm mt-0.5 lg:mt-1">
            Jika sukunya sejenis, jumlahkan/kurangkan koefisiennya saja. Variabelnya tetap!
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start scale-90 sm:scale-100 origin-left">
          <button 
            onClick={() => setMode('explore')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'explore' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Eksplorasi
          </button>
          <button 
            onClick={() => { setMode('evaluate'); handleRetryQuiz(); }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'evaluate' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Evaluasi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8">
          {mode === 'explore' && (
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3.5 lg:p-12 shadow-sm min-h-[260px] lg:min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              
              <div className="flex flex-col items-center justify-center relative w-full mb-6 lg:mb-8">
                 
                 <div className={`flex items-center text-3xl lg:text-5xl font-mono font-black mb-6 lg:mb-8 transition-all duration-700 ${isCombining ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                    <div className="text-indigo-600">{coef1}x</div>
                    <div className="mx-3 lg:mx-4 text-slate-400">{coef2 >= 0 ? '+' : '-'}</div>
                    <div className="text-amber-600">{Math.abs(coef2)}x</div>
                 </div>

                 <div className={`absolute top-0 flex items-center text-3xl lg:text-5xl font-mono font-black transition-all duration-1000 ${isCombining ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                    <div className="flex flex-col items-center">
                       <span className="text-emerald-500 bg-emerald-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl border-2 lg:border-4 border-emerald-100">
                          {coef1 + coef2}x
                       </span>
                       <span className="text-[10px] lg:text-sm font-bold text-slate-400 mt-2.5 lg:mt-4 tracking-widest uppercase">
                          ({coef1} {coef2 >= 0 ? '+' : '-'} {Math.abs(coef2)}) x
                       </span>
                    </div>
                 </div>

              </div>

              <button
                onClick={() => setIsCombining(!isCombining)}
                className={`flex items-center gap-1.5 px-6 py-2.5 lg:px-8 lg:py-4 rounded-xl font-bold text-sm lg:text-lg transition-all border-2 active:scale-95 ${isCombining ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' : 'bg-indigo-500 text-white border-indigo-600 shadow-sm hover:bg-indigo-600'}`}
              >
                {isCombining ? 'Kembali' : <><Play size={16} className="fill-white lg:w-5 lg:h-5" /> Gabungkan!</>}
              </button>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Miskonsepsi Kuadrat" : quizStep === 1 ? "Koefisien Negatif" : "Suku Nol"}
              questionText={
                quizStep === 0 
                  ? <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="3x + 2x" /></span>?</span>
                  : quizStep === 1
                  ? <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="4y - 6y" /></span>?</span>
                  : <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="5x - 5x" /></span>?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/expand-brackets"
              nextLabel="Lanjut: Membuka Kurung"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col gap-3 lg:gap-4 w-full items-center">
                  <div className="flex gap-2 lg:gap-4 w-full">
                     {['5x^2', '5x', '6x'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '5x')} 
                         className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '5x' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '5x'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                  </div>
                  {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Variabel tidak berubah menjadi kuadrat saat dijumlahkan! Sama seperti 3 apel + 2 apel = 5 apel (bukan 5 apel kuadrat).
                    </p>
                  )}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex gap-2 lg:gap-4 w-full">
                  {['2y', '-2y', '-10y'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '-2y')} 
                      className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-2y' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-2y'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-3 lg:gap-4 items-center w-full">
                   <div className="flex gap-2 lg:gap-4 w-full">
                     {['x', '0', '0x'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '0')} 
                         className={`w-full py-2.5 px-3 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '0' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '0'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: <InlineMath math="0x" /> itu nilainya adalah <InlineMath math="0" /> (nol dikali berapapun tetap nol). Jadi cukup ditulis 0.
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
            <h3 className="text-slate-800 font-bold mb-2 lg:mb-4 text-xs lg:text-sm">Ubah Koefisien</h3>
            
            <div className="space-y-4 lg:space-y-6">
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-[10px] lg:text-xs font-bold text-indigo-500">Suku Pertama (x)</span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-500">{coef1}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={coef1} onChange={(e) => {setCoef1(parseInt(e.target.value)); setIsCombining(false);}}
                     className="w-full accent-indigo-500 cursor-pointer"
                  />
               </div>
               
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-[10px] lg:text-xs font-bold text-amber-600">Suku Kedua (x)</span>
                     <span className="text-[10px] lg:text-xs font-bold text-slate-500">{coef2}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={coef2} onChange={(e) => {setCoef2(parseInt(e.target.value)); setIsCombining(false);}}
                     className="w-full accent-amber-500 cursor-pointer"
                  />
               </div>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-rose-800 font-bold mb-1.5 lg:mb-2 text-xs lg:text-sm flex items-center gap-2">
               Miskonsepsi Kuadrat
            </h3>
            <p className="text-xs lg:text-sm text-rose-700 leading-relaxed mb-2.5 lg:mb-4">
               Pangkat variabel tidak berubah saat dijumlahkan atau dikurangkan.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-rose-200/50">
              <Info className="text-rose-600 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] lg:text-xs text-rose-800/80 font-bold">
                Miskonsepsi: {coef1}x {coef2 >= 0 ? '+' : '-'} {Math.abs(coef2)}x bukan menjadi {coef1+coef2}x²!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
