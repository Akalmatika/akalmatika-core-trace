import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Scissors } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function SignBelongsToTermPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [isCut, setIsCut] = useState(false);
  
  // Expression: 4x - 2y + 5
  // When not cut: it's one block. When cut, it's 3 blocks, and the sign goes with the term.
  
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
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Tanda Milik Suku</h2>
          <p className="text-slate-500 text-sm mt-1">
            Pisahkan bentuk aljabar menjadi potongan suku. Ingat, tanda di depan selalu ikut!
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              
              <div className={`flex items-center text-4xl md:text-5xl font-mono font-black mb-12 transition-all duration-700 ${isCut ? 'gap-6' : 'gap-0 bg-slate-50 border-2 border-slate-200 p-4 rounded-xl'}`}>
                <div className={`transition-all duration-500 ${isCut ? 'bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl shadow-sm text-indigo-700' : ''}`}>
                  <InlineMath math="4x" />
                </div>
                {!isCut && <div className="mx-2 text-slate-400"><InlineMath math="-" /></div>}
                <div className={`transition-all duration-500 flex ${isCut ? 'bg-rose-50 border-2 border-rose-200 p-4 rounded-xl shadow-sm text-rose-700' : ''}`}>
                  {isCut && <span className="mr-2"><InlineMath math="-" /></span>}
                  <InlineMath math="2y" />
                </div>
                {!isCut && <div className="mx-2 text-slate-400"><InlineMath math="+" /></div>}
                <div className={`transition-all duration-500 flex ${isCut ? 'bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl shadow-sm text-emerald-700' : ''}`}>
                  {isCut && <span className="mr-2"><InlineMath math="+" /></span>}
                  <InlineMath math="5" />
                </div>
              </div>

              <button
                onClick={() => setIsCut(!isCut)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${isCut ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' : 'bg-indigo-500 text-white border-indigo-600 shadow-sm hover:bg-indigo-600'}`}
              >
                <Scissors size={20} />
                {isCut ? 'Satukan Kembali' : 'Gunting Persamaan'}
              </button>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Memotong Suku 1" : quizStep === 1 ? "Suku Tersembunyi" : "Tanda Tepat"}
              questionText={
                quizStep === 0 
                  ? <span>Manakah di bawah ini pemisahan suku yang benar untuk <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="3a - 7b" /></span>?</span>
                  : quizStep === 1
                  ? <span>Berapakah koefisien dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="y" /></span> pada persamaan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="5x - y + 2" /></span>?</span>
                  : <span>Suku konstanta pada persamaan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="2x^2 - 4x - 9" /></span> adalah...</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/like-term-sorter"
              nextLabel="Lanjut: Sorter Suku Sejenis"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col gap-4 w-full">
                  {[
                    { label: '3a dan 7b', correct: false },
                    { label: '3a dan -7b', correct: true },
                    { label: '-3a dan -7b', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                  {evalResult !== 'none' && (
                    <p className={`text-sm font-bold mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Tanda minus di depan 7b adalah miliknya, jadi sukunya adalah -7b!
                    </p>
                  )}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-6 items-center">
                  <div className="flex gap-4">
                    {['1', '-1', '0'].map((ans, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleEvaluate(ans === '-1')} 
                        className={`w-20 h-16 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-1' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-1' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {evalResult !== 'none' && (
                    <p className={`text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Suku tersebut dipisahkan menjadi <InlineMath math="-y" />. Ingat bahwa <InlineMath math="-y" /> sama saja dengan <InlineMath math="-1y" />, sehingga koefisiennya adalah -1.
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex gap-4">
                  {['9', '-9', '0'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '-9')} 
                      className={`w-20 h-16 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-9' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-9' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
        <div className={`lg:col-span-4 flex flex-col gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-emerald-800 font-bold mb-2 text-sm flex items-center gap-2">
               Tanda di Depan = Milik Suku Tersebut
            </h3>
            <p className="text-sm text-emerald-700 leading-relaxed mb-4">
              Dalam aljabar, tanda positif (<strong>+</strong>) dan negatif (<strong>-</strong>) tidak hanya berfungsi sebagai operasi tambah dan kurang. Tanda-tanda itu sebenarnya menempel pada angka atau variabel di belakangnya.
            </p>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 mb-4 text-center font-mono font-bold text-slate-700">
               -2y berarti sukunya adalah negatif 2y
            </div>
            <div className="flex items-start gap-2 pt-2">
              <Info className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-emerald-600/80">
                Jika suku paling depan tidak memiliki tanda (seperti 4x), itu berarti tanda positif (+) secara implisit.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
