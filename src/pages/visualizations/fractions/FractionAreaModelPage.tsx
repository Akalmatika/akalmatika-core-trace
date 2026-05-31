import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Minus, Plus, Box, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function FractionAreaModelPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  // Explore Mode State
  const [denominator, setDenominator] = useState<number>(4);
  const [selectedPieces, setSelectedPieces] = useState<boolean[]>([true, false, false, false]);

  // Evaluate Mode State
  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Sync selected pieces when denominator changes
  useEffect(() => {
    setSelectedPieces(prev => {
      if (prev.length === denominator) return prev;
      if (prev.length > denominator) return prev.slice(0, denominator);
      return [...prev, ...Array(denominator - prev.length).fill(false)];
    });
  }, [denominator]);

  const numerator = selectedPieces.filter(Boolean).length;

  const handlePieceClick = (index: number) => {
    setSelectedPieces(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const decreaseDenominator = () => {
    if (denominator > 1) setDenominator(d => d - 1);
  };

  const increaseDenominator = () => {
    if (denominator < 10) setDenominator(d => d + 1);
  };

  const handleEvaluate = (isCorrect: boolean) => {
    if (evalResult !== 'none') return; // Prevent multiple clicks

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
      
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Fraction Area Model</h2>
          <p className="text-slate-500 text-sm mt-1">
            Pahami bahwa pecahan adalah bagian dari keseluruhan yang dipotong SAMA BESAR.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex self-start md:self-auto border border-slate-200">
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

      {mode === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visualizer Area */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
            
            {/* Real-time Fraction Display */}
            <div className="mb-12 relative z-10">
              <div className="flex flex-col items-center justify-center text-5xl md:text-7xl font-black font-mono text-slate-800">
                <div className="transition-all duration-300 ease-out transform scale-100 origin-bottom text-indigo-600">
                  {numerator}
                </div>
                <div className="w-full h-1.5 md:h-2 bg-slate-800 my-2 rounded-full"></div>
                <div className="transition-all duration-300 ease-out transform scale-100 origin-top">
                  {denominator}
                </div>
              </div>
            </div>

            {/* The Area Model Canvas */}
            <div className="w-full max-w-lg h-32 md:h-40 flex overflow-hidden border-2 border-slate-300 shadow-inner relative z-10 bg-slate-50">
              {selectedPieces.map((isSelected, idx) => (
                <div 
                  key={idx}
                  onClick={() => handlePieceClick(idx)}
                  className={`
                    h-full flex-1 border-r-2 border-slate-300 last:border-r-0 cursor-pointer 
                    transition-colors duration-200 ease-out flex items-center justify-center
                    active:scale-95 origin-center
                    ${isSelected ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-transparent hover:bg-slate-200'}
                  `}
                >
                  <div className={`transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <Box size={24} className="text-white opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Area */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">0</div>
                Tentukan Pecahan
              </h3>
              
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat:</p>
                <div className="flex gap-2 flex-wrap">
                  {[[1,2], [3,4], [2,5], [5,8], [7,10]].map(([n, d]) => (
                    <button
                      key={`${n}-${d}`}
                      onClick={() => {
                        setDenominator(d);
                        setTimeout(() => {
                          setSelectedPieces(Array(d).fill(false).map((_, i) => i < n));
                        }, 50);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold font-mono transition-colors"
                    >
                      <InlineMath math={`\\frac{${n}}{${d}}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">Buat Soal Sendiri (Otomatis Arsir):</p>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                   <div className="flex flex-col items-center gap-1.5">
                     <input 
                       type="number" min="1" max={denominator} 
                       value={numerator}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         const n = Math.min(val, denominator);
                         setSelectedPieces(Array(denominator).fill(false).map((_, i) => i < n));
                       }}
                       className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                     />
                     <div className="w-10 h-0.5 bg-slate-300 rounded-full"></div>
                     <input 
                       type="number" min="1" max="10" 
                       value={denominator}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         const d = Math.max(val, 1);
                         setDenominator(d);
                         setTimeout(() => {
                           setSelectedPieces(Array(d).fill(false).map((_, i) => i < numerator));
                         }, 50);
                       }}
                       className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                     />
                   </div>
                </div>
              </div>
            </div>
            
            {/* Denominator Control */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
                Bagi Keseluruhan (Penyebut)
              </h3>
              
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-2 mb-4">
                <button 
                  onClick={decreaseDenominator}
                  disabled={denominator <= 1}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <Minus size={20} />
                </button>
                <div className="text-2xl font-black font-mono text-slate-800 w-16 text-center">
                  {denominator}
                </div>
                <button 
                  onClick={increaseDenominator}
                  disabled={denominator >= 10}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penyebut menentukan ke dalam berapa bagian <strong>SAMA BESAR</strong> satu balok keseluruhan dipotong.
              </p>
            </div>

            {/* Numerator Instruction */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs">2</div>
                Arsir Bagian (Pembilang)
              </h3>
              <p className="text-xs text-indigo-700/80 leading-relaxed mb-3">
                Tap (klik) potongan di layar untuk mengarsirnya. Jumlah potongan yang diarsir akan menjadi pembilang.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-indigo-400 rounded-full"></div>
                <div className="flex-1 h-2 bg-white rounded-full border border-indigo-200"></div>
                <div className="flex-1 h-2 bg-white rounded-full border border-indigo-200"></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {mode === 'evaluate' && (
        <QuizContainer
          title={quizStep === 0 ? "Miskonsepsi Check!" : quizStep === 1 ? "Membaca Pecahan" : "Membuat Pecahan"}
          questionText={
            quizStep === 0 
              ? <span>Hanya blok yang dipotong dengan <strong>ukuran yang benar-benar sama besar</strong> yang bisa disebut pecahan biasa. Yang manakah dari gambar di bawah ini yang mewakili bentuk pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{1}{3}" /></span> yang sah?</span>
              : quizStep === 1
              ? <span>Berapakah nilai pecahan dari area yang diarsir ungu pada gambar di bawah ini?</span>
              : <span>Yang manakah dari gambar di bawah ini yang mewakili bentuk pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{5}" /></span>?</span>
          }
          evalResult={evalResult}
          onNext={handleNextQuiz}
          isLastQuestion={quizStep === 2}
          nextPath="/student/visualizations/fractions/equivalent-fractions"
          nextLabel="Lanjut: Pecahan Senilai"
          isFinished={isFinished}
          score={score}
          totalQuestions={3}
          onRetry={handleRetryQuiz}
        >
          {quizStep === 0 && (
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center items-center">
              {/* Q1: Wrong 1 */}
              <button onClick={() => handleEvaluate(false)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-24 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'wrong' ? 'border-rose-400' : 'group-hover:border-indigo-400'}`}>
                  <div className="w-1/4 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                  <div className="w-1/2 h-full border-r-2 border-slate-300 bg-slate-50"></div>
                  <div className="w-1/4 h-full bg-slate-50"></div>
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-indigo-500">Pilihan A</div>
              </button>

              {/* Q1: Correct */}
              <button onClick={() => handleEvaluate(true)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-24 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'correct' ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'group-hover:border-indigo-400'}`}>
                  <div className="w-1/3 h-full border-r-2 border-slate-300 bg-slate-50"></div>
                  <div className="w-1/3 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                  <div className="w-1/3 h-full bg-slate-50"></div>
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-emerald-500">Pilihan B</div>
              </button>

              {/* Q1: Wrong 2 */}
              <button onClick={() => handleEvaluate(false)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-24 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'wrong' ? 'border-rose-400' : 'group-hover:border-indigo-400'}`}>
                  <div className="w-1/2 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                  <div className="w-[10%] h-full border-r-2 border-slate-300 bg-slate-50"></div>
                  <div className="w-[40%] h-full bg-slate-50"></div>
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-indigo-500">Pilihan C</div>
              </button>
            </div>
          )}

          {quizStep === 1 && (
            <div className="flex flex-col items-center w-full">
              <div className="w-64 h-24 border-2 border-slate-300 flex mb-12 shadow-inner">
                <div className="w-1/4 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                <div className="w-1/4 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                <div className="w-1/4 h-full border-r-2 border-slate-300 bg-indigo-400"></div>
                <div className="w-1/4 h-full bg-slate-50"></div>
              </div>
              <div className="flex gap-6">
                {[[1,4], [3,4], [4,3]].map(([n, d], idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleEvaluate(n === 3 && d === 4)} 
                    className={`w-24 h-24 rounded-2xl border-2 font-bold text-2xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && n === 3 ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && n !== 3 && evalResult !== 'none' ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                  >
                    <InlineMath math={`\\frac{${n}}{${d}}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center items-center">
              {/* Q3: Wrong 1 (3/4) */}
              <button onClick={() => handleEvaluate(false)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-20 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'wrong' ? 'border-rose-400' : 'group-hover:border-indigo-400'}`}>
                  {[1,2,3,4].map(i => <div key={i} className={`flex-1 h-full border-r-2 border-slate-300 last:border-r-0 ${i <= 3 ? 'bg-indigo-400' : 'bg-slate-50'}`}></div>)}
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-indigo-500">Pilihan A</div>
              </button>

              {/* Q3: Wrong 2 (2/5) */}
              <button onClick={() => handleEvaluate(false)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-20 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'wrong' ? 'border-rose-400' : 'group-hover:border-indigo-400'}`}>
                  {[1,2,3,4,5].map(i => <div key={i} className={`flex-1 h-full border-r-2 border-slate-300 last:border-r-0 ${i <= 2 ? 'bg-indigo-400' : 'bg-slate-50'}`}></div>)}
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-indigo-500">Pilihan B</div>
              </button>

              {/* Q3: Correct (3/5) */}
              <button onClick={() => handleEvaluate(true)} className={`group flex flex-col items-center ${evalResult !== 'none' ? 'pointer-events-none' : ''}`}>
                <div className={`w-48 h-20 border-2 border-slate-300 flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${evalResult === 'correct' ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'group-hover:border-indigo-400'}`}>
                  {[1,2,3,4,5].map(i => <div key={i} className={`flex-1 h-full border-r-2 border-slate-300 last:border-r-0 ${i <= 3 ? 'bg-indigo-400' : 'bg-slate-50'}`}></div>)}
                </div>
                <div className="mt-4 text-sm font-bold text-slate-400 group-hover:text-emerald-500">Pilihan C</div>
              </button>
            </div>
          )}

          {quizStep === 0 && evalResult !== 'none' && (
            <div className="mt-12 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-2xl w-full flex items-start gap-4">
              <Info className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Miskonsepsi umum adalah siswa membaca jumlah potongan dan jumlah arsiran tanpa memperhatikan ukurannya. 
                <strong> Padahal, pecahan <InlineMath math="\frac{1}{3}" /> berarti 1 bagian dari 3 potongan yang SAMA BESAR.</strong>
              </p>
            </div>
          )}
        </QuizContainer>
      )}

    </div>
  );
}
