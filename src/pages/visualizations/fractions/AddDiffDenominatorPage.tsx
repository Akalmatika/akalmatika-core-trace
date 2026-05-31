import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, CheckCircle2, XCircle, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function AddDiffDenominatorPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0); 
  // 0 = beda penyebut, 1 = samakan penyebut, 2 = gabung
  const [errorMsg, setErrorMsg] = useState(false);

  const [n1, setN1] = useState(1);
  const [den1, setDen1] = useState(2);
  const [n2, setN2] = useState(1);
  const [den2, setDen2] = useState(4);

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

  const multiplier = den2 / den1;
  const eqN1 = n1 * multiplier;
  const resultNum = eqN1 + n2;

  const handleAdd = () => {
    if (step === 0) {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 3000);
    } else if (step === 1) {
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Operasi Pecahan Penyebut Beda</h2>
          <p className="text-slate-500 text-sm mt-1">
            Samakan ukuran potongan terlebih dahulu sebelum menggabungkannya.
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[450px] flex flex-col items-center relative overflow-hidden">
          
          {errorMsg && (
            <div className="absolute top-6 right-6 z-20 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-shake">
              <XCircle size={20} /> Tidak bisa! Ukuran potongannya masih berbeda.
            </div>
          )}
          {step === 2 && (
            <div className="absolute top-6 right-6 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={20} /> Berhasil digabungkan!
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col items-center text-3xl font-black font-mono text-indigo-600 transition-all">
              <div>{step === 0 ? n1 : eqN1}</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>{step === 0 ? den1 : den2}</div>
            </div>
            <div className="text-2xl font-bold text-slate-400">+</div>
            <div className="flex flex-col items-center text-3xl font-black font-mono text-sky-500">
              <div>{n2}</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>{den2}</div>
            </div>
            <div className={`transition-all duration-300 flex items-center gap-4 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="text-2xl font-bold text-slate-400">=</div>
              <div className="flex flex-col items-center text-4xl font-black font-mono text-emerald-600">
                <div>{resultNum}</div>
                <div className="w-full h-1.5 bg-slate-800 my-1.5 rounded-full"></div>
                <div>{den2}</div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="w-full flex flex-col items-center gap-6 relative z-10 max-w-lg mt-4">
             
             {/* Box 1: 1/2 or 2/4 */}
             <div className="w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner">
                {Array.from({ length: step === 0 ? den1 : den2 }).map((_, idx) => {
                  let bgColor = 'bg-transparent';
                  if (step === 0 && idx < n1) bgColor = 'bg-indigo-400';
                  else if (step >= 1 && idx < eqN1) bgColor = 'bg-indigo-400';
                  
                  // Fill the merged pieces
                  if (step === 2 && idx >= eqN1 && idx < resultNum) bgColor = 'bg-sky-400';

                  return (
                    <div 
                      key={idx}
                      className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-500 ${bgColor}`}
                    />
                  );
                })}
             </div>

             {/* Box 2: 1/4 (Only visible in step 0 or 1) */}
             <div className={`w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner transition-all duration-500 transform origin-top ${step === 2 ? 'opacity-0 scale-y-0 h-0 border-0' : 'opacity-100 scale-y-100'}`}>
                {Array.from({ length: den2 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-500 ${idx < n2 ? 'bg-sky-400' : 'bg-transparent'}`}
                  />
                ))}
             </div>

          </div>
        </div>
        )}

        {mode === 'evaluate' && (
          <QuizContainer
            title={quizStep === 0 ? "Penjumlahan 1" : quizStep === 1 ? "Miskonsepsi" : "Penjumlahan 2"}
            questionText={
              quizStep === 0 
                ? <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{2} + \frac{1}{4}" /></span>?</span>
                : quizStep === 1
                ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{2} + \frac{2}{6}" /></span> sama dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{8}" /></span>?</span>
                : <span>Berapakah hasil dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{3} + \frac{2}{9}" /></span>?</span>
            }
            evalResult={evalResult}
            onNext={handleNextQuiz}
            isLastQuestion={quizStep === 2}
            nextPath="/student/visualizations/fractions"
            nextLabel="Selesai: Kembali ke Galeri"
            isFinished={isFinished}
            score={score}
            totalQuestions={3}
            onRetry={handleRetryQuiz}
          >
            {quizStep === 0 && (
              <div className="flex gap-6">
                {[[2,6], [3,4], [2,4]].map(([n, d], idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleEvaluate(n === 3 && d === 4)} 
                    className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 3 && d === 4 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 3 || d !== 4) && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
                      className={`px-8 py-4 rounded-2xl border-2 font-bold text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === 'Tidak' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== 'Tidak' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
                {evalResult !== 'none' && (
                  <p className={`text-sm font-bold ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Penjelasan: Penyebut harus disamakan dahulu (menjadi 6). Hasil yang benar adalah 5/6.
                  </p>
                )}
              </div>
            )}

            {quizStep === 2 && (
              <div className="flex gap-6">
                {[[3,12], [5,9], [3,9]].map(([n, d], idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleEvaluate(n === 5 && d === 9)} 
                    className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 5 && d === 9 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 5 || d !== 9) && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
        <div className={`lg:col-span-4 flex flex-col gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-4">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">0</div>
              Tentukan Pecahan
            </h3>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat:</p>
              <div className="flex gap-2 flex-wrap">
                {[[1,2,1,4], [1,3,2,6], [1,2,3,8], [2,3,1,9], [1,5,3,10]].map(([a, b, c, d]) => (
                  <button
                    key={`${a}-${b}-${c}-${d}`}
                    onClick={() => { setN1(a); setDen1(b); setN2(c); setDen2(d); setStep(0); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold font-mono transition-colors"
                  >
                    <InlineMath math={`\\frac{${a}}{${b}}`} /> + <InlineMath math={`\\frac{${c}}{${d}}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Pecahan Beda Penyebut (Kelipatan):</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={den1} 
                     value={n1}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setN1(Math.min(val, den1));
                       setStep(0);
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="2" max="10" 
                     value={den1}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 2;
                       setDen1(Math.max(val, 2));
                       setDen2(val * 2); // Auto scale den2 for simple visualization
                       setN1(Math.min(n1, Math.max(val, 2)));
                       setStep(0);
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                 </div>
                 
                 <div className="font-bold text-slate-400">+</div>

                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={den2} 
                     value={n2}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setN2(Math.min(val, den2));
                       setStep(0);
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" disabled
                     value={den2}
                     className="w-12 text-center border border-slate-200 bg-slate-100 text-slate-400 rounded-md py-1 font-mono text-xs"
                   />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={step !== 0}
                className="w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95"
              >
                1. Samakan Penyebut
              </button>
              
              <button
                onClick={handleAdd}
                disabled={step === 2}
                className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${step === 2 ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'}`}
              >
                2. Gabungkan Blok
              </button>

              {step === 2 && (
                <button onClick={() => setStep(0)} className="text-sm text-slate-500 font-bold hover:text-slate-800 mt-2">
                  Ulangi Simulasi
                </button>
              )}
            </div>
            
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed">
                Sebelum digabung, kita tidak tahu akan menamai potongannya apa (berbeda ukuran). Kita mengubah pecahan <InlineMath math={`\\frac{${n1}}{${den1}}`} /> menjadi bentuk <strong>Pecahan Senilai</strong> (<InlineMath math={`\\frac{${eqN1}}{${den2}}`} />) agar ukurannya seragam.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
