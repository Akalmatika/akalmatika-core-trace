import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, CheckCircle2, XCircle, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

const SCENARIOS = [
  { n1: 2, d1: 5, n2: 4, d2: 5, label: "Penyebut Sama", tip: "Jika penyebutnya sama (ukuran potongan sama), lihat saja pembilangnya (jumlah potongannya)." },
  { n1: 2, d1: 3, n2: 2, d2: 5, label: "Pembilang Sama", tip: "Jika pembilangnya sama (jumlah potongan sama), yang penyebutnya lebih KECIL nilainya lebih BESAR (potongannya lebih tebal)." },
  { n1: 1, d1: 2, n2: 2, d2: 5, label: "Berbeda Keduanya", tip: "Melihat dari panjang area arsirannya, mana yang lebih mendominasi?" },
];

export default function CompareFractionsPage() {
  const [n1, setN1] = useState(2);
  const [d1, setD1] = useState(5);
  const [n2, setN2] = useState(4);
  const [d2, setD2] = useState(5);

  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [selectedOp, setSelectedOp] = useState<'<' | '>' | '=' | null>(null);
  const [isSameDenominator, setIsSameDenominator] = useState(false);

  const correct = (n1*d2 < n2*d1) ? '<' : (n1*d2 > n2*d1) ? '>' : '=';
  
  const matchingScenario = SCENARIOS.find(s => s.n1 === n1 && s.d1 === d1 && s.n2 === n2 && s.d2 === d2);
  const tip = matchingScenario ? matchingScenario.tip : "Bandingkan nilai kedua pecahan. Mengubah ke penyebut yang sama dapat membantumu melihatnya lebih jelas.";

  useEffect(() => {
    setEvalResult('none');
    setSelectedOp(null);
    setIsSameDenominator(false);
  }, [n1, d1, n2, d2]);

  const handleGuess = (op: '<' | '>' | '=') => {
    setSelectedOp(op);
    
    if (mode === 'evaluate') {
      const isCorrect = 
        (quizStep === 0 && op === '<') || 
        (quizStep === 1 && op === '>') || 
        (quizStep === 2 && op === '>');
        
      if (evalResult !== 'none') return;
      
      if (isCorrect) {
        setEvalResult('correct');
        setScore(s => s + 1);
      } else {
        setEvalResult('wrong');
      }
    } else {
      if (op === correct) {
        setEvalResult('correct');
      } else {
        setEvalResult('wrong');
        setTimeout(() => setEvalResult('none'), 2000);
      }
    }
  };

  const handleNextQuiz = () => {
    setEvalResult('none');
    setSelectedOp(null);
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
    setSelectedOp(null);
  };

  const renderFractionBar = (baseNum: number, baseDen: number, multiplier: number, color: string) => {
    const currentNum = baseNum * multiplier;
    const currentDen = baseDen * multiplier;

    return (
      <div className="flex items-center gap-2.5 lg:gap-4 w-full">
        <div className="flex flex-col items-center text-lg lg:text-xl font-bold font-mono text-slate-700 w-10 lg:w-12 transition-all">
          <div>{currentNum}</div>
          <div className="w-full h-0.5 bg-slate-800 my-0.5 rounded-full"></div>
          <div>{currentDen}</div>
        </div>
        <div className="flex-1 h-10 lg:h-16 relative bg-slate-50 overflow-hidden shadow-inner border-2 border-slate-300 w-full">
          {/* Base Color Fill */}
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${color}`}
            style={{ width: `${(baseNum / baseDen) * 100}%` }}
          />
          
          {/* Base Partitions */}
          {Array.from({ length: baseDen }).map((_, baseIdx) => (
            <div key={`col-${baseIdx}`} className="absolute top-0 h-full pointer-events-none" style={{ left: `${(baseIdx / baseDen) * 100}%`, width: `${(1 / baseDen) * 100}%` }}>
              <div className="absolute top-0 right-0 w-0.5 h-full bg-slate-300 pointer-events-none z-10" />
              {/* Multiplier Partitions */}
              <div className={`transition-all duration-500 w-full h-full absolute top-0 left-0 ${multiplier > 1 ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}>
                {Array.from({ length: Math.max(0, multiplier - 1) }).map((_, idx) => (
                  <div 
                    key={`slice-${idx}`}
                    className="absolute top-0 w-0.5 h-full bg-slate-300/80 pointer-events-none"
                    style={{ 
                      left: `${((idx + 1) / multiplier) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">Pembanding Pecahan</h2>
          <p className="text-slate-500 text-[10px] lg:text-sm mt-0.5 lg:mt-1">
            Bandingkan ukuran dua buah pecahan secara visual.
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-0.5 lg:p-1 rounded-xl self-start">
          <button 
            onClick={() => { setMode('explore'); setEvalResult('none'); setSelectedOp(null); }}
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
          
          {evalResult === 'correct' && (
            <div className="relative lg:absolute lg:top-6 lg:right-6 mx-auto lg:mx-0 mt-1 lg:mt-0 mb-3 lg:mb-0 w-fit z-20 bg-emerald-100 text-emerald-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl flex items-center gap-2 lg:gap-3 animate-bounce shadow-sm border border-emerald-200 text-xs lg:text-sm">
              <div className="flex items-center gap-1 lg:gap-1.5 font-bold">
                <CheckCircle2 size={16} className="lg:hidden" />
                <CheckCircle2 size={20} className="hidden lg:block" />
                Benar!
              </div>
              <div className="w-px h-4 lg:h-6 bg-emerald-300"></div>
              <div className="flex items-center gap-1.5 lg:gap-2 font-bold text-emerald-800">
                <InlineMath math={`\\frac{${n1}}{${d1}}`} /> 
                <span className="font-mono mt-0.5">{selectedOp}</span> 
                <InlineMath math={`\\frac{${n2}}{${d2}}`} />
              </div>
            </div>
          )}
          {evalResult === 'wrong' && (
            <div className="relative lg:absolute lg:top-6 lg:right-6 mx-auto lg:mx-0 mt-1 lg:mt-0 mb-3 lg:mb-0 w-fit z-20 bg-rose-100 text-rose-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl font-bold flex items-center gap-2 animate-shake text-xs lg:text-sm">
              <XCircle size={16} className="lg:hidden" />
              <XCircle size={20} className="hidden lg:block" />
              Coba perhatikan lagi!
            </div>
          )}

          <div className="w-full flex flex-col gap-2 lg:gap-6 mt-2 lg:mt-8 relative z-10 max-w-lg mx-auto">
            {renderFractionBar(n1, d1, isSameDenominator ? d2 : 1, 'bg-indigo-400')}
            
            <div className="flex justify-center my-0.5 lg:my-2 gap-2 lg:gap-4">
               {['<', '=', '>'].map((op) => (
                 <button 
                    key={op}
                    onClick={() => handleGuess(op as '<'|'>'|'=')}
                    className={`
                      w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl font-bold text-lg lg:text-2xl font-mono shadow-sm transition-all active:scale-95
                      ${selectedOp === op 
                          ? (evalResult === 'correct' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-rose-500 text-white border-rose-500')
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }
                    `}
                 >
                   {op}
                 </button>
               ))}
            </div>

            {renderFractionBar(n2, d2, isSameDenominator ? d1 : 1, 'bg-sky-400')}
            
            {/* Action Buttons */}
            {d1 !== d2 && (
              <div className="mt-2 lg:mt-4 flex justify-center w-full">
                <button
                  onClick={() => setIsSameDenominator(!isSameDenominator)}
                  className={`py-1.5 px-4 lg:py-3 lg:px-6 rounded-xl font-bold text-xs lg:text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isSameDenominator 
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 border-2 border-indigo-600'
                  }`}
                >
                  {isSameDenominator ? 'Kembalikan Penyebut Awal' : 'Samakan Penyebut'}
                </button>
              </div>
            )}
          </div>
        </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Penyebut Sama" : quizStep === 1 ? "Pembilang Sama" : "Beda Keduanya"}
              questionText={
                quizStep === 0 
                  ? <span>Bandingkan pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{5}" /></span> dan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{4}{5}" /></span>.</span>
                  : quizStep === 1
                  ? <span>Bandingkan pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{2}{3}" /></span> dan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{2}{5}" /></span>.</span>
                  : <span>Bandingkan pecahan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{3}{4}" /></span> dan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="\frac{4}{6}" /></span>.</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/fractions/same-denominator"
              nextLabel="Lanjut: Penjumlahan Pecahan"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              <div className="flex justify-center mt-8 gap-6">
                {['<', '=', '>'].map((op) => (
                  <button 
                    key={op}
                    onClick={() => handleGuess(op as '<'|'>'|'=')}
                    className={`
                      w-16 h-16 rounded-2xl font-bold text-3xl font-mono shadow-sm transition-all hover:scale-105 active:scale-95
                      ${evalResult !== 'none' ? 'pointer-events-none' : ''}
                      ${selectedOp === op 
                          ? (evalResult === 'correct' ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-rose-500 border-rose-600 text-white')
                          : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600'
                      }
                    `}
                  >
                    {op}
                  </button>
                ))}
              </div>
              
              {evalResult !== 'none' && quizStep === 0 && (
                <p className={`mt-8 text-sm font-bold ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Penjelasan: Penyebutnya sama, jadi potongan yang lebih banyak (4) nilainya lebih besar.
                </p>
              )}
              {evalResult !== 'none' && quizStep === 1 && (
                <p className={`mt-8 text-sm font-bold ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Penjelasan: Pembilangnya sama, tapi pembagian 3 lebih besar potongannya daripada pembagian 5.
                </p>
              )}
              {evalResult !== 'none' && quizStep === 2 && (
                <p className={`mt-8 text-sm font-bold ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Penjelasan: <InlineMath math="\frac{3}{4}" /> senilai dengan <InlineMath math="\frac{9}{12}" />, sedangkan <InlineMath math="\frac{4}{6}" /> senilai dengan <InlineMath math="\frac{8}{12}" />. Jadi <InlineMath math="\frac{3}{4}" /> lebih besar.
                </p>
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
              <div className="flex flex-col gap-1.5 lg:gap-3 mb-0 lg:mb-6">
                <p className="text-[10px] lg:text-xs font-bold text-slate-400">Pilihan Skenario:</p>
                {SCENARIOS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setN1(s.n1); setD1(s.d1); setN2(s.n2); setD2(s.d2); }}
                    className={`
                      py-1 lg:py-2.5 px-2 lg:px-4 rounded-xl text-[10px] lg:text-sm font-bold text-left transition-all active:scale-95
                      ${matchingScenario?.label === s.label ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    {s.label} (<InlineMath math={`\\frac{${s.n1}}{${s.d1}}`} /> vs <InlineMath math={`\\frac{${s.n2}}{${s.d2}}`} />)
                  </button>
                ))}
              </div>
 
              <div>
                <p className="text-[10px] lg:text-xs font-bold text-slate-400 mb-1 lg:mb-2">Buat Soal Sendiri:</p>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 lg:p-3 rounded-xl border border-slate-100 w-max">
                   <div className="flex flex-col items-center gap-1">
                     <input 
                       type="number" min="1" max={d1} 
                       value={n1}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setN1(Math.min(val, d1));
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                     <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                     <input 
                       type="number" min="1" max="20" 
                       value={d1}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setD1(Math.max(val, 1));
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                   </div>
                   
                   <div className="font-bold text-slate-400 text-xs">vs</div>
 
                   <div className="flex flex-col items-center gap-1">
                     <input 
                       type="number" min="1" max={d2} 
                       value={n2}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setN2(Math.min(val, d2));
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                     <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                     <input 
                       type="number" min="1" max="20" 
                       value={d2}
                       onChange={(e) => {
                         const val = parseInt(e.target.value) || 1;
                         setD2(Math.max(val, 1));
                       }}
                       className="w-12 lg:w-16 text-center border border-slate-200 rounded-md py-0.5 lg:py-1 font-mono text-xs lg:text-sm focus:outline-none focus:border-indigo-400"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="bg-amber-50 border border-amber-100 p-2.5 lg:p-6 rounded-2xl lg:rounded-3xl mt-1 lg:mt-4">
            <div className="flex items-start gap-2.5">
              <Info className="text-amber-600 shrink-0 mt-0.5 lg:hidden" size={14} />
              <Info className="text-amber-600 shrink-0 mt-0.5 hidden lg:block" size={16} />
              <p className="text-[10px] lg:text-xs text-amber-800 leading-relaxed">
                <strong>Tips:</strong> {tip}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
