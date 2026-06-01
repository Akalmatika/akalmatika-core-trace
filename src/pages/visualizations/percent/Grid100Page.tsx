import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Grid, Percent } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function Grid100Page() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [percent, setPercent] = useState(25);
  
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
    <div className="max-w-4xl mx-auto py-3 lg:py-6 animate-fadeIn pb-24 md:pb-6 px-3 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 lg:mb-8 gap-3">
        <div>
          <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-2 lg:mb-3 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Galeri
          </Link>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Grid 100 Persen</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 lg:mt-1">
            Persen artinya "per seratus". Mari kita visualisasikan dengan 100 kotak!
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button 
            onClick={() => setMode('explore')}
            className={`px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold rounded-lg transition-all ${mode === 'explore' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Eksplorasi
          </button>
          <button 
            onClick={() => { setMode('evaluate'); handleRetryQuiz(); }}
            className={`px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold rounded-lg transition-all ${mode === 'evaluate' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Evaluasi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8">
          {mode === 'explore' && (
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
              
              <div className="flex items-center gap-4 lg:gap-6 mb-4 lg:mb-8 mt-1 lg:mt-4">
                <div className="flex items-center gap-1.5 text-2xl lg:text-4xl font-black text-indigo-600 font-mono">
                  {percent}<Percent strokeWidth={3} className="text-indigo-400 w-5 h-5 lg:w-8 lg:h-8" />
                </div>
                <div className="text-lg lg:text-2xl text-slate-300 font-black">=</div>
                <div className="flex flex-col items-center text-xl lg:text-3xl font-black font-mono text-emerald-600">
                  <div>{percent}</div>
                  <div className="w-full h-0.5 lg:h-1 bg-slate-800 my-0.5 lg:my-1 rounded-full"></div>
                  <div>100</div>
                </div>
              </div>

              {/* 10x10 Grid - Compact & Responsive */}
              <div className="w-full max-w-[200px] min-[350px]:max-w-[240px] sm:max-w-[320px] aspect-square grid grid-cols-10 grid-rows-10 gap-0.5 bg-slate-200 p-1 rounded-xl">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-full h-full rounded-[2px] transition-colors duration-300 ${i < percent ? 'bg-indigo-500 shadow-sm' : 'bg-white'}`}
                  ></div>
                ))}
              </div>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Membaca Grid" : quizStep === 1 ? "Miskonsepsi Persen" : "Nilai Penuh"}
              questionText={
                quizStep === 0 
                  ? <span>Berapa persen area yang diarsir pada gambar di bawah ini? (Asumsi total 100 kotak)</span>
                  : quizStep === 1
                  ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">5%</span> sama dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{50}{100}" /></span>?</span>
                  : <span>Jika semua 100 kotak diarsir penuh, maka pecahannya adalah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{100}{100}" /></span>. Berapa nilai persennya?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/percent/fraction-to-percent"
              nextLabel="Lanjut: Konversi Pecahan ke Persen"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-36 sm:w-48 aspect-square grid grid-cols-10 grid-rows-10 gap-0.5 bg-slate-200 p-1 rounded-lg pointer-events-none opacity-90">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className={`w-full h-full rounded-[1px] ${i < 30 ? 'bg-indigo-500' : 'bg-white'}`}></div>
                    ))}
                  </div>
                  <div className="flex gap-2 sm:gap-4">
                    {['13%', '30%', '300%'].map((ans, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleEvaluate(ans === '30%')} 
                        className={`w-16 h-12 sm:w-20 sm:h-16 rounded-xl border-2 font-bold text-sm sm:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '30%' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '30%'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex gap-4">
                    {['Ya', 'Tidak'].map((ans, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleEvaluate(ans === 'Tidak')} 
                        className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl border-2 font-bold text-base sm:text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === 'Tidak' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== 'Tidak'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {evalResult !== 'none' && (
                    <p className={`text-xs sm:text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: 5% artinya 5 per seratus (<InlineMath math="\frac{5}{100}" />). Sedangkan <InlineMath math="\frac{50}{100}" /> artinya 50%. Jangan sampai terbalik!
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex gap-4">
                  {['10%', '1%', '100%'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '100%')} 
                      className={`w-20 h-12 sm:w-24 sm:h-16 rounded-xl border-2 font-bold text-sm sm:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '100%' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '100%'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white border border-slate-200 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm mb-1 lg:mb-4">
            <h3 className="text-sm font-bold text-slate-700 mb-2 lg:mb-4 flex items-center gap-2">
               <Grid size={16} className="text-indigo-500" /> Atur Nilai Persen
            </h3>

            <div className="flex flex-col gap-3 lg:gap-4">
               <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 lg:mb-2">
                     <span>0%</span>
                     <span>100%</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={percent}
                     onChange={(e) => setPercent(parseInt(e.target.value))}
                     className="w-full accent-indigo-600 cursor-pointer"
                  />
               </div>

               <div className="grid grid-cols-4 gap-1.5 lg:gap-2 mt-1">
                  {[25, 50, 75, 100].map(val => (
                     <button
                        key={val}
                        onClick={() => setPercent(val)}
                        className={`py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-xs font-bold border transition-all active:scale-95 ${percent === val ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                     >
                        {val}%
                     </button>
                  ))}
               </div>
            </div>
            
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-3 lg:p-6 rounded-2xl lg:rounded-3xl">
            <div className="flex items-start gap-2.5">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] lg:text-xs text-indigo-800 leading-relaxed">
                Kata <strong>Persen</strong> berasal dari bahasa Latin <em>"per centum"</em>, yang artinya <strong>demi seratus</strong> atau dibagi seratus. Lambang persen (%) merepresentasikan pecahan dengan penyebut 100.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
