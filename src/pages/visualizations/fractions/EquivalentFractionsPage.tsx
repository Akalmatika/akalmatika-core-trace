import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function EquivalentFractionsPage() {
  const [baseNumerator, setBaseNumerator] = useState(1);
  const [baseDenominator, setBaseDenominator] = useState(2);
  const [multiplier, setMultiplier] = useState(1);
  
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentNumerator = baseNumerator * multiplier;
  const currentDenominator = baseDenominator * multiplier;

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
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pecahan Senilai: Split & Merge</h2>
          <p className="text-slate-500 text-sm mt-1">
            Lihat bagaimana bentuk pecahan bisa berubah, tetapi nilainya (luas areanya) tetap sama.
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
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-8 md:gap-16 mb-12 relative z-10 w-full justify-center">
            {/* Original Fraction */}
            <div className="flex flex-col items-center text-4xl md:text-5xl font-black font-mono text-slate-400">
              <div>{baseNumerator}</div>
              <div className="w-full h-1 bg-slate-300 my-1 rounded-full"></div>
              <div>{baseDenominator}</div>
            </div>

            <div className="flex flex-col gap-1 items-center justify-center text-indigo-400 font-bold font-mono px-2 md:px-4">
               <div className={`transition-all duration-500 ${multiplier > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>× {multiplier}</div>
               <div className="text-3xl md:text-4xl font-bold">=</div>
               <div className={`transition-all duration-500 ${multiplier > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>× {multiplier}</div>
            </div>

            {/* Equivalent Fraction */}
            <div className="flex flex-col items-center text-5xl md:text-7xl font-black font-mono text-indigo-600 transition-all duration-300 transform">
              <div className="flex items-center gap-2">
                {currentNumerator}
              </div>
              <div className="w-full h-1.5 md:h-2 bg-slate-800 my-2 rounded-full"></div>
              <div className="flex items-center gap-2">
                {currentDenominator}
              </div>
            </div>
          </div>

          {/* Area Model */}
          <div className="w-full max-w-lg h-32 md:h-40 relative z-10 bg-slate-50 border-2 border-slate-300 overflow-hidden shadow-inner">
             
             {/* The Colored Area */}
             <div className="absolute top-0 left-0 w-full h-full flex">
                {Array.from({ length: baseDenominator }).map((_, idx) => (
                  <div 
                    key={`color-${idx}`}
                    className={`h-full flex-1 transition-colors duration-700 ${idx < baseNumerator ? 'bg-indigo-400' : 'bg-transparent'}`}
                  />
                ))}
             </div>

             {/* Vertical Cuts (Base Denominator) */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {Array.from({ length: baseDenominator - 1 }).map((_, idx) => (
                  <div 
                    key={`v-${idx}`}
                    className="absolute top-0 w-[2px] h-full bg-slate-300/80"
                    style={{ left: `${((idx + 1) / baseDenominator) * 100}%` }}
                  />
                ))}
             </div>

             {/* Vertical Cuts (Multiplier) */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {Array.from({ length: baseDenominator }).map((_, baseIdx) => (
                  <div key={`col-${baseIdx}`} className="absolute top-0 h-full" style={{ left: `${(baseIdx / baseDenominator) * 100}%`, width: `${(1 / baseDenominator) * 100}%` }}>
                    {Array.from({ length: multiplier - 1 }).map((_, idx) => (
                      <div 
                        key={`m-${idx}`}
                        className="absolute top-0 w-[2px] h-full bg-slate-300/80 transition-all duration-700 ease-in-out"
                        style={{ 
                           left: `${((idx + 1) / multiplier) * 100}%`,
                           animation: 'fadeIn 0.5s ease-out'
                        }}
                      />
                    ))}
                  </div>
                ))}
             </div>
          </div>

          <div className="mt-8 text-center text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-xl border border-slate-100 shadow-sm relative z-10">
            Luas area yang diarsir <strong className="text-indigo-600">tidak berubah</strong>.
          </div>
        </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Identifikasi Pecahan Senilai" : quizStep === 1 ? "Apakah Pecahan Ini Senilai?" : "Mengubah Pecahan"}
              questionText={
                quizStep === 0 
                  ? <span>Manakah dari pecahan di bawah ini yang senilai dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{2}" /></span>?</span>
                  : quizStep === 1
                  ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{4}" /></span> senilai dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{6}{8}" /></span>?</span>
                  : <span>Jika pembilang dan penyebut pada pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{2}{3}" /></span> sama-sama dikalikan 3, maka pecahannya menjadi:</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/fractions/simplify"
              nextLabel="Lanjut: Menyederhanakan Pecahan"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {quizStep === 0 && (
                <div className="flex gap-6">
                  {[[2,5], [2,4], [3,5]].map(([n, d], idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(n === 2 && d === 4)} 
                      className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 2 && d === 4 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 2 || d !== 4) && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={`\\frac{${n}}{${d}}`} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex gap-6">
                  {['Ya', 'Tidak'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === 'Ya')} 
                      className={`px-8 py-4 rounded-2xl border-2 font-bold text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === 'Ya' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== 'Ya' && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex gap-6">
                  {[[5,6], [6,9], [2,9]].map(([n, d], idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(n === 6 && d === 9)} 
                      className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 6 && d === 9 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && (n !== 6 || d !== 9) && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
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
        <div className={`lg:col-span-4 flex flex-col gap-6 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
              Tentukan Pecahan Dasar
            </h3>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat:</p>
              <div className="flex gap-2 flex-wrap">
                {[[1,2], [1,3], [2,3], [3,4], [1,4]].map(([n, d]) => (
                  <button
                    key={`${n}-${d}`}
                    onClick={() => { setBaseNumerator(n); setBaseDenominator(d); setMultiplier(1); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold font-mono transition-colors"
                  >
                    <InlineMath math={`\\frac{${n}}{${d}}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Buat Soal Sendiri:</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={baseDenominator} 
                     value={baseNumerator}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setBaseNumerator(Math.min(val, baseDenominator));
                       setMultiplier(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-10 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="1" max="10" 
                     value={baseDenominator}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setBaseDenominator(Math.max(val, baseNumerator));
                       setMultiplier(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</div>
              Ubah Potongan (Faktor Pengali)
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setMultiplier(num)}
                  className={`
                    py-3 rounded-xl font-bold font-mono transition-all active:scale-95
                    ${multiplier === num ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  x {num}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Mengalikan pembilang dan penyebut dengan bilangan yang sama identik dengan <strong>memotong ulang setiap blok</strong>, sehingga jumlahnya bertambah namun ukurannya mengecil.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed">
                Miskonsepsi umum adalah mengira <InlineMath math={`\\frac{${currentNumerator}}{${currentDenominator}}`} /> lebih besar dari <InlineMath math={`\\frac{${baseNumerator}}{${baseDenominator}}`} /> karena angkanya lebih besar. Padahal, keduanya melambangkan <strong>kuantitas yang persis sama</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
