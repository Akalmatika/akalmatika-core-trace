import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, Play, RefreshCcw } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function ExpandBracketsPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  // State for a(bx + c)
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(-5);

  const [step, setStep] = useState(0); 
  // 3: Result
  
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
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mesin Membuka Kurung</h2>
          <p className="text-slate-500 text-sm mt-1">
            Gunakan sifat distributif (kali pelangi) untuk menyebarkan pengali ke semua suku di dalam kurung.
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
              
              <div className="relative w-full max-w-lg mb-16 h-32 flex justify-center items-end text-5xl font-mono font-black">
                 {/* The expression: a ( bx + c ) */}
                 
                 <div className={`transition-all duration-300 z-10 ${step >= 1 ? 'text-rose-500' : 'text-indigo-600'}`}>
                    {a}
                 </div>
                 
                 <div className="text-slate-400 mx-2">(</div>
                 
                 <div className={`transition-all duration-300 z-10 ${step === 1 ? 'text-rose-500' : 'text-slate-700'}`}>
                    {b}x
                 </div>
                 
                 <div className={`mx-2 transition-all duration-300 z-10 ${step === 2 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {c >= 0 ? '+' : '-'}
                 </div>
                 
                 <div className={`transition-all duration-300 z-10 ${step === 2 ? 'text-rose-500' : 'text-slate-700'}`}>
                    {Math.abs(c)}
                 </div>
                 
                 <div className="text-slate-400 mx-2">)</div>

                 {/* Arcs (Rainbows) */}
                 <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 500 150">
                    {/* Arch to bx */}
                    <path 
                       d={`M ${175 - (a.toString().length - 1) * 15},85 Q 220,40 255,85`}
                       fill="none" 
                       stroke="#f43f5e" 
                       strokeWidth="4"
                       strokeDasharray="200"
                       strokeDashoffset={step >= 1 ? "0" : "200"}
                       className="transition-all duration-700 ease-in-out"
                       markerEnd="url(#arrowhead)"
                    />
                    {/* Arch to c */}
                    <path 
                       d={`M ${175 - (a.toString().length - 1) * 15},85 Q 250,20 ${315 + (b.toString().length - 1) * 10},85`}
                       fill="none" 
                       stroke="#f43f5e" 
                       strokeWidth="4"
                       strokeDasharray="300"
                       strokeDashoffset={step >= 2 ? "0" : "300"}
                       className="transition-all duration-700 ease-in-out"
                       markerEnd="url(#arrowhead)"
                    />
                    
                    <defs>
                       <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#f43f5e" />
                       </marker>
                    </defs>
                 </svg>
              </div>

              {/* Steps display */}
              <div className="flex flex-col items-center gap-4 min-h-[100px]">
                 <div className={`text-xl font-mono font-bold text-slate-500 transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    = <span className={step === 1 ? 'text-rose-500' : ''}>({a} &times; {b}x)</span> 
                    <span className={`transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}> + <span className={step === 2 ? 'text-rose-500' : ''}>({a} &times; {c})</span></span>
                 </div>
                 
                 <div className={`text-3xl font-mono font-black text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl border-4 border-emerald-100 transition-all duration-500 delay-300 ${step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    {a * b}x {a * c >= 0 ? '+' : '-'} {Math.abs(a * c)}
                 </div>
              </div>

              <div className="flex gap-4 mt-8">
                 {step < 3 && (
                    <button
                       onClick={() => setStep(s => s + 1)}
                       className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-indigo-500 text-white border-2 border-indigo-600 shadow-sm hover:bg-indigo-600 active:scale-95 transition-all"
                    >
                       <Play size={20} className="fill-white" /> Langkah {step + 1}
                    </button>
                 )}
                 {step === 3 && (
                    <button
                       onClick={() => setStep(0)}
                       className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-slate-100 text-slate-600 border-2 border-slate-300 shadow-sm hover:bg-slate-200 active:scale-95 transition-all"
                    >
                       <RefreshCcw size={20} /> Ulangi
                    </button>
                 )}
              </div>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Membuka Kurung 1" : quizStep === 1 ? "Minus di Luar" : "Minus di Dalam"}
              questionText={
                quizStep === 0 
                  ? <span>Hasil dari menjabarkan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="5(a + 2)" /></span> adalah...</span>
                  : quizStep === 1
                  ? <span>Hati-hati tanda! Hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="-2(x + 4)" /></span> adalah...</span>
                  : <span>Hasil dari penjabaran <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="3(2x - 5)" /></span> adalah...</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/substitution-machine"
              nextLabel="Lanjut: Mesin Substitusi"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex flex-col gap-4 w-full items-center">
                  <div className="flex gap-4 w-full">
                     {['5a + 2', '5a + 10', '7a'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '5a + 10')} 
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '5a + 10' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '5a + 10' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                  </div>
                  {evalResult !== 'none' && (
                    <p className={`text-sm font-bold mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: 5 harus dikalikan ke <InlineMath math="a" /> (jadi 5a) dan dikalikan juga ke <InlineMath math="+2" /> (jadi +10). Kesalahan umum adalah lupa mengalikan angka yang di belakang.
                    </p>
                  )}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex flex-col gap-4 w-full items-center">
                   <div className="flex gap-4 w-full">
                     {['-2x + 8', '-2x - 8', '-2x + 4'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '-2x - 8')} 
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '-2x - 8' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '-2x - 8' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                   {evalResult !== 'none' && (
                    <p className={`text-sm font-bold mt-2 text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: <InlineMath math="-2 \times x = -2x" /> dan <InlineMath math="-2 \times 4 = -8" />. Jadi hasilnya <InlineMath math="-2x - 8" />.
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col gap-4 items-center w-full">
                   <div className="flex gap-4 w-full">
                     {['6x - 5', '6x - 15', '5x - 15'].map((ans, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleEvaluate(ans === '6x - 15')} 
                         className={`w-full py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '6x - 15' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '6x - 15' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                       >
                         <InlineMath math={ans} />
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-4">
            <h3 className="text-slate-800 font-bold mb-4 text-sm">Ubah Persamaan</h3>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-xs font-bold text-indigo-500">Angka Luar (a)</span>
                     <span className="text-xs font-bold text-slate-500">{a}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={a} onChange={(e) => {setA(parseInt(e.target.value)); setStep(0);}}
                     className="w-full accent-indigo-500"
                  />
               </div>
               
               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-xs font-bold text-slate-700">Koefisien x (b)</span>
                     <span className="text-xs font-bold text-slate-500">{b}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={b} onChange={(e) => {setB(parseInt(e.target.value)); setStep(0);}}
                     className="w-full accent-slate-500"
                  />
               </div>

               <div>
                  <div className="flex justify-between mb-1">
                     <span className="text-xs font-bold text-rose-500">Konstanta (c)</span>
                     <span className="text-xs font-bold text-slate-500">{c}</span>
                  </div>
                  <input 
                     type="range" min="-10" max="10" 
                     value={c} onChange={(e) => {setC(parseInt(e.target.value)); setStep(0);}}
                     className="w-full accent-rose-500"
                  />
               </div>
            </div>
            
          </div>

          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-rose-800 font-bold mb-2 text-sm flex items-center gap-2">
               Sifat Distributif (Pelangi)
            </h3>
            <p className="text-sm text-rose-700 leading-relaxed mb-4">
               Semua yang ada di dalam tanda kurung adalah "satu kesatuan paket". Jika paket itu dikalikan dengan sebuah angka di luarnya, maka setiap isi paket harus mendapatkan perkalian tersebut.
            </p>
            <div className="flex items-start gap-2 pt-4 border-t border-rose-200/50">
              <Info className="text-rose-600 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-rose-800/80 font-bold">
                Miskonsepsi: Hanya mengalikan suku yang paling depan saja (misal {a}({b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}) jadi {a*b}x {c >= 0 ? '+' : '-'} {Math.abs(c)}). Itu keliru!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
