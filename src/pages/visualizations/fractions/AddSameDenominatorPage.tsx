import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Box, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function AddSameDenominatorPage() {
  const [step, setStep] = useState<0 | 1>(0); // 0 = split, 1 = merged

  const [n1, setN1] = useState(2);
  const [n2, setN2] = useState(1);
  const [den, setDen] = useState(5);

  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
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
    <div className="max-w-4xl mx-auto py-2.5 lg:py-6 animate-fadeIn pb-4 lg:pb-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 lg:mb-8 gap-2 lg:gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-bold text-xs lg:text-sm mb-1 lg:mb-3 transition-colors">
            <ArrowLeft size={14} className="lg:hidden" />
            <ArrowLeft size={16} className="hidden lg:inline" />
            Galeri Pecahan
          </Link>
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">Operasi Pecahan Penyebut Sama</h2>
          <p className="text-slate-500 text-[10px] lg:text-sm mt-0.5 lg:mt-1">
            Lihat mengapa pembilang dijumlahkan, sementara penyebut tetap.
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-0.5 lg:p-1 rounded-xl self-start">
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
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-2.5 lg:p-12 shadow-sm min-h-[120px] lg:min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
           
           <div className="flex items-center gap-2 mb-3 lg:mb-8">
             <div className="flex flex-col items-center text-2xl lg:text-3xl font-black font-mono text-indigo-600 w-12 lg:w-16">
               <div>{n1}</div>
               <div className="w-full h-0.5 lg:h-1 bg-slate-800 my-0.5 lg:my-1 rounded-full"></div>
               <div>{den}</div>
             </div>
             <div className="text-xl lg:text-2xl font-bold text-slate-400">+</div>
             <div className="flex flex-col items-center text-2xl lg:text-3xl font-black font-mono text-sky-500 w-12 lg:w-16">
               <div>{n2}</div>
               <div className="w-full h-0.5 lg:h-1 bg-slate-800 my-0.5 lg:my-1 rounded-full"></div>
               <div>{den}</div>
             </div>
             <div className={`transition-all duration-[1500ms] ease-in-out flex items-center gap-2 lg:gap-4 ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
               <div className="text-xl lg:text-2xl font-bold text-slate-400">=</div>
               <div className="flex flex-col items-center text-3xl lg:text-4xl font-black font-mono text-emerald-600 w-16 lg:w-20">
                 <div>{n1 + n2}</div>
                 <div className="w-full h-0.5 lg:h-1.5 bg-slate-800 my-0.5 lg:my-1.5 rounded-full"></div>
                 <div>{den}</div>
               </div>
             </div>
           </div>
 
           {/* Visualization Area */}
           <div className="w-full flex flex-col items-center gap-1.5 lg:gap-6 relative z-10 max-w-lg mt-2 lg:mt-4">
              
              {/* Box 1 */}
              <div className="w-full h-8 lg:h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner rounded-lg">
                 {Array.from({ length: den }).map((_, idx) => {
                   let bgColor = 'bg-transparent';
                   if (idx < n1) bgColor = 'bg-indigo-400';
                   else if (step === 1 && idx < n1 + n2) bgColor = 'bg-sky-400';
 
                   return (
                     <div 
                       key={idx}
                       className={`h-full flex-1 border-r border-slate-300/40 last:border-r-0 transition-colors duration-[1500ms] ease-in-out ${bgColor}`}
                     />
                   );
                 })}
              </div>
 
              {/* Box 2 (Only visible in step 0) */}
              <div className={`w-full h-8 lg:h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner transition-all duration-[1500ms] ease-in-out transform origin-top rounded-lg ${step === 1 ? 'opacity-0 scale-y-0 h-0 border-0' : 'opacity-100 scale-y-100'}`}>
                 {Array.from({ length: den }).map((_, idx) => (
                   <div 
                     key={idx}
                     className={`h-full flex-1 border-r border-slate-300/40 last:border-r-0 transition-colors duration-[1500ms] ease-in-out ${idx < n2 ? 'bg-sky-400' : 'bg-transparent'}`}
                   />
                 ))}
              </div>
 
           </div>
 
           <div className={`mt-2.5 lg:mt-12 text-center text-slate-500 font-medium bg-white/80 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl border border-slate-100 shadow-sm transition-all duration-[1500ms] ease-in-out text-[10px] lg:text-sm ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
            Miskonsepsi umum adalah ikut menjumlahkan penyebutnya (menjadi <InlineMath math={`\\frac{${n1 + n2}}{${den + den}}`} />). Padahal, penyebut hanya menunjukkan <strong>ukuran potongan</strong>, bukan jumlah barangnya.
          </div>

        </div>
        )}

        {mode === 'evaluate' && (
          <QuizContainer
            title={quizStep === 0 ? "Penjumlahan 1" : quizStep === 1 ? "Miskonsepsi" : "Penjumlahan 2"}
            questionText={
              quizStep === 0 
                ? <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{5} + \frac{2}{5}" /></span>?</span>
                : quizStep === 1
                ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{2}{7} + \frac{3}{7}" /></span> sama dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{5}{14}" /></span>?</span>
                : <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{8} + \frac{4}{8}" /></span>?</span>
            }
            evalResult={evalResult}
            onNext={handleNextQuiz}
            isLastQuestion={quizStep === 2}
            nextPath="/student/visualizations/fractions/different-denominator"
            nextLabel="Lanjut: Penyebut Berbeda"
            isFinished={isFinished}
            score={score}
            totalQuestions={3}
            onRetry={handleRetryQuiz}
          >
            {quizStep === 0 && (
              <div className="flex gap-6">
                {[[3,5], [3,10], [1,10]].map(([n, d], idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleEvaluate(n === 3 && d === 5)} 
                    className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 3 && d === 5 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 3 || d !== 5)  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                  >
                    <InlineMath math={`\\frac{${n}}{${d}}`} />
                  </button>
                ))}
              </div>
            )}

            {quizStep === 1 && (
              <div className="flex flex-col gap-6 items-center">
                <div className="flex gap-6">
                  {['Ya', 'Tidak'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === 'Tidak')} 
                      className={`px-8 py-4 rounded-2xl border-2 font-bold text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === 'Tidak' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== 'Tidak'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
                {evalResult !== 'none' && (
                  <p className={`text-sm font-bold ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Penjelasan: Penyebut tidak ikut dijumlahkan. Hasil yang benar adalah 5/7.
                  </p>
                )}
              </div>
            )}

            {quizStep === 2 && (
              <div className="flex gap-6">
                {[[7,8], [7,16], [12,8]].map(([n, d], idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleEvaluate(n === 7 && d === 8)} 
                    className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 7 && d === 8 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 7 || d !== 8)  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                  >
                    <InlineMath math={`\\frac{${n}}{${d}}`} />
                  </button>
                ))}
              </div>
            )}
          </QuizContainer>
        )}
      </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white border border-slate-200 p-2.5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-2 lg:mb-4 flex items-center gap-2">
              Tentukan Pecahan
            </h3>
            
            <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-3 items-start lg:block">
              <div className="mb-0 lg:mb-4">
                <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 lg:mb-2">Pilihan Cepat:</p>
                <div className="flex gap-1.5 lg:gap-2 flex-wrap">
                  {[[1,2,4], [2,3,6], [3,4,8], [2,2,5], [3,1,5]].map(([num1, num2, d]) => (
                    <button
                      key={`${num1}-${num2}-${d}`}
                      onClick={() => { setN1(num1); setN2(num2); setDen(d); setStep(0); }}
                      className="px-2 py-1 lg:px-3 lg:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] lg:text-xs font-bold font-mono transition-colors"
                    >
                      <InlineMath math={`\\frac{${num1}}{${d}}`} /> + <InlineMath math={`\\frac{${num2}}{${d}}`} />
                    </button>
                  ))}
                </div>
              </div>
 
              <div>
                <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 lg:mb-2">Buat Soal Sendiri:</p>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 lg:p-3 rounded-xl border border-slate-100 w-max">
                   <div className="flex flex-col items-center gap-1">
                     <input 
                       type="number" min="1" max={den} 
                       value={n1}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setN1(Math.min(val, den));
                         setStep(0);
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                     <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                     <input 
                       type="number" min="1" max="20" 
                       value={den}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setDen(Math.max(val, 1));
                         setStep(0);
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                   </div>
                   
                   <div className="font-bold text-slate-400 text-xs">+</div>
 
                   <div className="flex flex-col items-center gap-1">
                     <input 
                       type="number" min="1" max={den} 
                       value={n2}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setN2(Math.min(val, den));
                         setStep(0);
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                     <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                     <input 
                       type="number" disabled
                       value={den}
                       className="w-12 lg:w-16 text-center border border-slate-200 bg-slate-100 text-slate-400 rounded-md py-0.5 lg:py-1 font-mono text-xs cursor-not-allowed"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="bg-white border border-slate-200 p-2.5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-2 lg:mb-4 flex items-center gap-2">
              Lakukan Penjumlahan
            </h3>
            
            <button
              onClick={() => setStep(step === 0 ? 1 : 0)}
              className="w-full py-2 lg:py-3 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm flex items-center justify-center gap-2 text-xs lg:text-sm"
            >
              {step === 0 ? 'Gabungkan Blok' : 'Ulangi'}
            </button>
            
          </div>
 
          <div className="bg-rose-50 border border-rose-100 p-2.5 lg:p-6 rounded-2xl lg:rounded-3xl mt-1 lg:mt-4">
            <div className="flex items-start gap-2.5">
              <Info className="text-rose-600 shrink-0 mt-0.5 lg:hidden" size={14} />
              <Info className="text-rose-600 shrink-0 mt-0.5 hidden lg:block" size={16} />
              <p className="text-[10px] lg:text-xs text-rose-800 leading-relaxed">
                <strong>Miskonsepsi:</strong> Siswa sering kali menjumlahkan penyebut (menjadi <InlineMath math={`\\frac{${n1 + n2}}{${den + den}}`} />). 
                Visualisasi ini membuktikan bahwa menggabungkan <InlineMath math={`\\frac{${n1}}{${den}}`} /> dan <InlineMath math={`\\frac{${n2}}{${den}}`} /> tidak mengubah ukuran wadah pemotongannya.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
