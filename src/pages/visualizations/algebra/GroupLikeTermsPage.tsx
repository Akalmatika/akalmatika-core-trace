import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Group } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function GroupLikeTermsPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [isGrouped, setIsGrouped] = useState(false);
  
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
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Pengelompokan Suku Sejenis</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 lg:mt-1">
            Sebelum bisa dijumlah atau dikurang, dekatkan suku-suku yang sejenis.
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
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3 lg:p-12 shadow-sm min-h-[260px] lg:min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              
              <div className="relative h-16 lg:h-24 w-full max-w-lg mb-8 lg:mb-12 flex items-center justify-center">
                 {/* This uses absolute positioning to simulate motion when grouped */}
                 <div className={`absolute transition-all duration-1000 ease-in-out text-2xl lg:text-5xl font-mono font-black ${isGrouped ? 'left-[10%] text-indigo-600' : 'left-[10%] text-slate-700'}`}>
                    <InlineMath math="3x" />
                 </div>
                 <div className={`absolute transition-all duration-1000 ease-in-out text-2xl lg:text-5xl font-mono font-black ${isGrouped ? 'left-[60%] text-amber-600' : 'left-[35%] text-slate-700'}`}>
                    <InlineMath math="+ 5" />
                 </div>
                 <div className={`absolute transition-all duration-1000 ease-in-out text-2xl lg:text-5xl font-mono font-black ${isGrouped ? 'left-[35%] text-indigo-600' : 'left-[60%] text-slate-700'}`}>
                    <InlineMath math="- x" />
                 </div>
                 <div className={`absolute transition-all duration-1000 ease-in-out text-2xl lg:text-5xl font-mono font-black ${isGrouped ? 'left-[80%] text-amber-600' : 'left-[80%] text-slate-700'}`}>
                    <InlineMath math="- 2" />
                 </div>

                 {/* Underlines when grouped */}
                 <div className={`absolute bottom-0 left-[10%] w-[45%] h-0.5 lg:h-1 bg-indigo-500 rounded-full transition-all duration-700 ${isGrouped ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
                 <div className={`absolute bottom-0 left-[60%] w-[35%] h-0.5 lg:h-1 bg-amber-500 rounded-full transition-all duration-700 ${isGrouped ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
              </div>

              <button
                onClick={() => setIsGrouped(!isGrouped)}
                className={`flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold transition-all border-2 text-xs lg:text-base ${isGrouped ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' : 'bg-indigo-500 text-white border-indigo-600 shadow-sm hover:bg-indigo-600'}`}
              >
                <Group size={16} className="lg:w-5 lg:h-5" />
                {isGrouped ? 'Acak Kembali' : 'Kelompokkan Suku Sejenis'}
              </button>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Susun Ulang 1" : quizStep === 1 ? "Membawa Tanda" : "Suku Tiga"}
              questionText={
                quizStep === 0 
                  ? <span>Bagaimana susunan yang benar jika <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="2y + 4 + 5y - 1" /></span> dikelompokkan?</span>
                  : quizStep === 1
                  ? <span>Jika <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="4a + 7 - 3a" /></span> dikelompokkan, manakah yang benar?</span>
                  : <span>Kelompokkan persamaan ini: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="x^2 - 3x + 2x^2 + 5x" /></span></span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/like-term-operations"
              nextLabel="Lanjut: Operasi Suku Sejenis"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col gap-2.5 w-full">
                  {[
                    { label: '2y + 4 + 5y - 1', correct: false },
                    { label: '2y + 5y + 4 - 1', correct: true },
                    { label: '2y - 5y + 4 - 1', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-102 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-2.5 w-full">
                  {[
                    { label: '4a + 3a + 7', correct: false },
                    { label: '4a - 3a + 7', correct: true },
                    { label: '7a + 7', correct: false }, // Walau benar hasilnya, tapi ini nanya susunan pengelompokan
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-102 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                  {evalResult !== 'none' && (
                    <p className={`text-xs sm:text-sm font-bold mt-1.5 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Tanda minus milik 3a harus ikut pindah bersamanya! Jadi <InlineMath math="4a - 3a" />.
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-2.5 w-full">
                  {[
                    { label: 'x^2 + 2x^2 - 3x + 5x', correct: true },
                    { label: 'x^2 - 3x^2 + 2x + 5x', correct: false },
                    { label: 'x^2 + 2x^2 + 3x + 5x', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-102 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-indigo-50 border border-indigo-100 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-indigo-800 font-bold mb-2 text-xs lg:text-sm flex items-center gap-2">
               Strategi Komutatif
            </h3>
            <p className="text-xs lg:text-sm text-indigo-700 leading-relaxed mb-3 lg:mb-4">
               Pada penjumlahan dan pengurangan aljabar, kita bisa menukar-nukar posisi suku agar suku-suku yang sejenis letaknya saling berdekatan.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-indigo-200/50">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] lg:text-xs text-indigo-800/80 leading-relaxed font-bold">
                Kunci utamanya: Selalu bawa tanda (+ atau -) yang ada di depan suku tersebut saat dipindahkan!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
