import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { InlineMath, BlockMath } from 'react-katex';
import { ArrowLeft, Info, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function FractionToPercentPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  // Available predefined fractions
  const PRESETS = [
    { n: 1, d: 2 },
    { n: 1, d: 4 },
    { n: 3, d: 4 },
    { n: 1, d: 5 },
    { n: 2, d: 5 },
    { n: 1, d: 10 },
  ];
  const ALLOWED_DENOMS = [2, 4, 5, 10, 20, 25, 50];
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customN, setCustomN] = useState<number>(3);
  const [customD, setCustomD] = useState<number>(20);
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0 = fraction, 1 = /100, 2 = percent
  
  const currentFraction = isCustom ? { n: customN, d: customD } : PRESETS[selectedPreset];
  const multiplier = 100 / currentFraction.d;
  const percentValue = currentFraction.n * multiplier;
  
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
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Konverter Pecahan ke Persen</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 lg:mt-1">
            Ubah pecahan agar penyebutnya menjadi 100 untuk menjadikannya persen.
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
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3 lg:p-12 shadow-sm min-h-[300px] lg:min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 relative z-10 w-full mt-2 mb-4">
                {/* 1. Base Fraction */}
                <div className="flex flex-col items-center text-3xl lg:text-5xl font-black font-mono text-slate-400 transition-all">
                  <div>{currentFraction.n}</div>
                  <div className="w-full h-1 bg-slate-300 my-1 lg:my-2 rounded-full"></div>
                  <div>{currentFraction.d}</div>
                </div>

                <div className={`transition-all duration-500 flex flex-col md:flex-row items-center gap-4 md:gap-12 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                  <ArrowRight className="text-slate-300 hidden md:block" size={32} />
                  
                  {/* 2. xMultiplier /100 */}
                  <div className="flex flex-col items-center relative">
                    <div className="absolute -top-7 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded shadow-sm">x{multiplier}</div>
                    <div className="flex flex-col items-center text-3xl lg:text-5xl font-black font-mono text-emerald-500">
                      <div>{percentValue}</div>
                      <div className="w-full h-1 bg-emerald-300 my-1 lg:my-2 rounded-full"></div>
                      <div>100</div>
                    </div>
                    <div className="absolute -bottom-7 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded shadow-sm">x{multiplier}</div>
                  </div>
                </div>

                <div className={`transition-all duration-500 flex flex-col md:flex-row items-center gap-4 md:gap-12 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                  <ArrowRight className="text-slate-300 hidden md:block" size={32} />
                  
                  {/* 3. Percent! */}
                  <div className="flex items-center gap-1 text-4xl lg:text-6xl font-black font-mono text-indigo-600 bg-indigo-50 px-4 py-2 lg:px-6 lg:py-4 rounded-2xl lg:rounded-3xl border-2 lg:border-4 border-indigo-100 shadow-inner">
                    {percentValue}<span className="text-2xl lg:text-4xl text-indigo-400">%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 relative z-10 mt-6 w-full max-w-xs">
                <button
                  onClick={() => setStep(1)}
                  disabled={step !== 0}
                  className="flex-1 py-2 lg:py-3 text-xs lg:text-sm rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-50 text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-100 active:scale-95"
                >
                  Ubah ke /100
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={step !== 1}
                  className="flex-1 py-2 lg:py-3 text-xs lg:text-sm rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 active:scale-95"
                >
                  Jadikan %
                </button>
              </div>
            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Konversi Pecahan Sederhana" : quizStep === 1 ? "Miskonsepsi" : "Konversi Lanjutan"}
              questionText={
                quizStep === 0 
                  ? <span>Berapa bentuk persen dari pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{2}" /></span>?</span>
                  : quizStep === 1
                  ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{5}" /></span> sama dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">15%</span>?</span>
                  : <span>Berapa bentuk persen dari pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{4}" /></span>?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/percent"
              nextLabel="Selesai: Kembali ke Galeri"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex gap-4">
                  {['20%', '50%', '12%'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '50%')} 
                      className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl border-2 font-bold text-sm sm:text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '50%' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '50%'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
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
                      Penjelasan: Salah! Kita harus mengalikan penyebut agar menjadi 100. 5 dikali 20 sama dengan 100. Maka pembilang 1 juga dikali 20, hasilnya 20/100 = 20%.
                    </p>
                  )}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex gap-4">
                  {['34%', '75%', '43%'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '75%')} 
                      className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl border-2 font-bold text-sm sm:text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '75%' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '75%'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
              Pilih Pecahan
            </h3>

            <div className="grid grid-cols-3 gap-2 lg:gap-3">
               {PRESETS.map((preset, idx) => (
                 <button
                   key={idx}
                   onClick={() => { setSelectedPreset(idx); setIsCustom(false); setStep(0); }}
                   className={`py-2 rounded-xl border-2 transition-all active:scale-95 flex flex-col items-center font-mono font-bold text-xs lg:text-sm ${!isCustom && selectedPreset === idx ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                 >
                   <span>{preset.n}</span>
                   <span className={`w-4 lg:w-6 h-0.5 my-0.5 lg:my-1 ${!isCustom && selectedPreset === idx ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
                   <span>{preset.d}</span>
                 </button>
               ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <h4 className="text-[10px] lg:text-xs font-bold text-slate-500 mb-2">Buat Soal Sendiri</h4>
              <div className="flex items-center justify-center gap-2 lg:gap-3">
                <input
                  type="number"
                  min="1"
                  value={customN}
                  onChange={(e) => { setCustomN(parseInt(e.target.value) || 1); setIsCustom(true); setStep(0); }}
                  className={`w-12 lg:w-16 py-1 px-2 border border-slate-200 rounded-lg text-center font-mono font-bold outline-none text-xs lg:text-sm transition-colors ${isCustom ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600'}`}
                />
                <span className="font-bold text-slate-400">/</span>
                <select
                  value={customD}
                  onChange={(e) => { setCustomD(parseInt(e.target.value)); setIsCustom(true); setStep(0); }}
                  className={`w-16 lg:w-20 py-1 px-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold outline-none text-xs lg:text-sm transition-colors appearance-none cursor-pointer ${isCustom ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600'}`}
                >
                  {ALLOWED_DENOMS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-3 lg:p-6 rounded-2xl lg:rounded-3xl">
            <div className="flex items-start gap-2.5">
              <Info className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] lg:text-xs text-emerald-800 leading-relaxed">
                Ingat: Nilai pecahan tidak berubah jika kita mengalikan pembilang dan penyebut dengan <strong>angka yang sama</strong>. Inilah yang disebut dengan pecahan senilai!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
