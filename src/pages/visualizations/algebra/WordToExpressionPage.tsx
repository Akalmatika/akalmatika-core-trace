import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Search } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function WordToExpressionPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  const scenarios = [
    { text: ["Tiga", "kali", "x"], math: "3x", tip: "Kata 'kali' dalam aljabar ditulis langsung berdampingan, tanpa spasi." },
    { text: ["x", "ditambah", "lima"], math: "x + 5", tip: "Penjumlahan diterjemahkan langsung berurutan." },
    { text: ["Dua", "kurangnya", "dari", "x"], math: "x - 2", tip: "Awas jebakan! 'kurangnya dari' berarti angkanya ditaruh di BELAKANG, bukan 2 - x." },
    { text: ["Setengah", "dari", "y"], math: "\\frac{1}{2}y", tip: "'Dari' pada sebuah pecahan berarti dikali pecahan tersebut." },
    { text: ["Kuadrat", "dari", "x"], math: "x^2", tip: "Kuadrat berarti pangkat dua." },
  ];

  const [activeScenario, setActiveScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);

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
          <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-650 font-bold text-xs lg:text-sm mb-2 lg:mb-3 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Galeri
          </Link>
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">Kalimat ke Bentuk Aljabar</h2>
          <p className="text-slate-500 text-xs lg:text-sm mt-0.5 lg:mt-1">
            Matematika adalah bahasa. Terjemahkan kata-kata menjadi simbol aljabar.
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
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3.5 lg:p-12 shadow-sm min-h-[300px] lg:min-h-[450px] flex flex-col relative overflow-hidden">
              
              <div className="flex justify-between items-center mb-6 lg:mb-12">
                 <h3 className="font-bold text-slate-500 flex items-center gap-1.5 text-xs lg:text-sm"><Search size={16} /> Pindai Kalimat</h3>
                 <span className="text-[10px] lg:text-sm font-bold bg-slate-100 text-slate-600 px-2 py-0.5 lg:px-3 lg:py-1 rounded-lg">
                    Skenario {activeScenario + 1} / {scenarios.length}
                 </span>
              </div>

              <div className="flex flex-col items-center flex-1">
                 
                 {/* Word Blocks */}
                 <div className="flex flex-wrap justify-center gap-1.5 lg:gap-3 mb-4 lg:mb-8">
                    {scenarios[activeScenario].text.map((word, idx) => (
                       <div key={idx} className="bg-slate-800 text-white font-bold text-sm lg:text-xl px-3 py-1.5 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl shadow-sm border border-slate-700">
                          {word}
                       </div>
                    ))}
                 </div>

                 {/* Translate Action */}
                 <div className="relative w-full flex justify-center min-h-[120px] lg:min-h-[180px]">
                    {!showResult ? (
                       <button
                          onClick={() => setShowResult(true)}
                          className="px-4 py-2.5 lg:px-8 lg:py-4 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-lg active:scale-95 h-fit mt-2 lg:mt-4 text-xs lg:text-base cursor-pointer"
                       >
                          Terjemahkan ke Simbol
                       </button>
                    ) : (
                       <div className="flex flex-col items-center animate-fadeInUp w-full px-2">
                          <div className="text-2xl lg:text-5xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl border-2 lg:border-4 border-indigo-100 shadow-inner">
                             <InlineMath math={scenarios[activeScenario].math} />
                          </div>
                          
                          <div className="mt-3 lg:mt-4 bg-amber-50 border border-amber-200 p-3 lg:p-4 rounded-xl w-full max-w-sm flex gap-2 lg:gap-3 text-xs lg:text-sm text-amber-800">
                             <Info className="shrink-0 mt-0.5 text-amber-500" size={16} />
                             <span className="font-medium leading-relaxed">{scenarios[activeScenario].tip}</span>
                          </div>
                       </div>
                    )}
                 </div>

              </div>

              <div className="flex justify-between mt-3 lg:mt-8 pt-3 lg:pt-6 border-t border-slate-100">
                 <button
                    onClick={() => { setActiveScenario(prev => Math.max(0, prev - 1)); setShowResult(false); }}
                    disabled={activeScenario === 0}
                    className="px-4 py-1.5 rounded-lg font-bold text-xs lg:text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                 >
                    Sebelumnya
                 </button>
                 <button
                    onClick={() => { setActiveScenario(prev => Math.min(scenarios.length - 1, prev + 1)); setShowResult(false); }}
                    disabled={activeScenario === scenarios.length - 1}
                    className="px-4 py-1.5 rounded-lg font-bold text-xs lg:text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                 >
                    Selanjutnya
                 </button>
              </div>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Jebakan Selisih" : quizStep === 1 ? "Terjemahan Beruntun" : "Logika Kalimat"}
              questionText={
                quizStep === 0 
                  ? <span>Bentuk aljabar untuk <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">"Tiga kurangnya dari x"</span> adalah...</span>
                  : quizStep === 1
                  ? <span>Bentuk aljabar untuk <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">"Dua kali x ditambah empat"</span> adalah...</span>
                  : <span>Manakah yang benar untuk menerjemahkan kalimat <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">"Setengah dari kuadrat x"</span>?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations"
              nextLabel="Selesai: Kembali ke Galeri"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col gap-2.5 lg:gap-4 w-full">
                  {[
                    { label: '3 - x', correct: false },
                    { label: 'x - 3', correct: true },
                    { label: '3x', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-2.5 px-4 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                  {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Jika uangmu 3 kurangnya dari uang temanku (x), berarti uangmu adalah uang temanku dikurangi 3 (<InlineMath math="x - 3" />), bukan 3 dikurangi uang temanku!
                    </p>
                  )}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-2.5 lg:gap-4 w-full">
                  {[
                    { label: '2x + 4', correct: true },
                    { label: '2 + x + 4', correct: false },
                    { label: 'x^2 + 4', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-2.5 px-4 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-2.5 lg:gap-4 w-full">
                  {[
                    { label: '\\frac{1}{2}x^2', correct: true },
                    { label: '(\\frac{1}{2}x)^2', correct: false },
                    { label: '\\frac{1}{2} + x^2', correct: false },
                  ].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans.correct)} 
                      className={`w-full py-2.5 px-4 lg:py-4 lg:px-6 rounded-xl border-2 font-bold text-sm lg:text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans.correct ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && !ans.correct  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans.label} />
                    </button>
                  ))}
                  {evalResult !== 'none' && (
                    <p className={`text-xs lg:text-sm font-bold mt-1.5 lg:mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: "Kuadrat x" dikerjakan dulu menjadi <InlineMath math="x^2" />. Baru kemudian diambil setengahnya, menjadi <InlineMath math="\frac{1}{2}x^2" />.
                    </p>
                  )}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-emerald-50 border border-emerald-100 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-emerald-800 font-bold mb-2 lg:mb-4 text-xs lg:text-sm flex items-center gap-1.5">
               Kosakata Penting Aljabar
            </h3>
            
            <ul className="space-y-2.5 lg:space-y-4 text-xs lg:text-sm">
               <li className="flex items-start gap-2">
                  <span className="font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold whitespace-nowrap text-[10px] lg:text-xs">+ Tambah</span>
                  <span className="text-emerald-700 leading-normal">Jumlah dari, ditambahkan dengan, lebihnya dari.</span>
               </li>
               <li className="flex items-start gap-2">
                  <span className="font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold whitespace-nowrap text-[10px] lg:text-xs">- Kurang</span>
                  <span className="text-emerald-700 leading-normal">Selisih, dikurangi, kurangnya dari (dibalik letaknya).</span>
               </li>
               <li className="flex items-start gap-2">
                  <span className="font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold whitespace-nowrap text-[10px] lg:text-xs">&times; Kali</span>
                  <span className="text-emerald-700 leading-normal">Kali, dari, produk.</span>
               </li>
            </ul>

            <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-emerald-200/50 flex items-start gap-1.5">
              <Info className="text-emerald-600 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] lg:text-xs text-emerald-800/80 font-bold leading-normal">
                Membaca dengan pelan dan memahami logika bahasa adalah kunci utamanya.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
