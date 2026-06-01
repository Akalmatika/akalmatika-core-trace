import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info, CheckCircle2, RotateCcw } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

type Term = { id: string; math: string; type: 'x' | 'x2' | 'y' | 'const' };

export default function LikeTermSorterPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  
  const initialTerms: Term[] = [
    { id: '1', math: '3x', type: 'x' },
    { id: '2', math: '-5x^2', type: 'x2' },
    { id: '3', math: '7', type: 'const' },
    { id: '4', math: '-2y', type: 'y' },
    { id: '5', math: '-x', type: 'x' },
    { id: '6', math: 'y', type: 'y' },
    { id: '7', math: '10', type: 'const' },
    { id: '8', math: '4x^2', type: 'x2' }
  ];

  const [unassignedTerms, setUnassignedTerms] = useState<Term[]>(initialTerms);
  const [bins, setBins] = useState<Record<string, Term[]>>({
    'x': [],
    'x2': [],
    'y': [],
    'const': []
  });

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectTerm = (term: Term) => {
    setSelectedTerm(term);
    setErrorMsg(null);
  };

  const handleSelectBin = (binType: 'x' | 'x2' | 'y' | 'const') => {
    if (!selectedTerm) return;
    
    if (selectedTerm.type === binType) {
      setBins(prev => ({
        ...prev,
        [binType]: [...prev[binType], selectedTerm]
      }));
      setUnassignedTerms(prev => prev.filter(t => t.id !== selectedTerm.id));
      setSelectedTerm(null);
      setErrorMsg(null);
    } else {
      setErrorMsg(`Suku ${selectedTerm.math} bukan sejenis dengan kotak ${binType === 'const' ? 'Konstanta' : binType}!`);
      setTimeout(() => setErrorMsg(null), 3000);
      setSelectedTerm(null);
    }
  };

  const handleReset = () => {
    setUnassignedTerms(initialTerms);
    setBins({ 'x': [], 'x2': [], 'y': [], 'const': [] });
    setSelectedTerm(null);
    setErrorMsg(null);
  };
  
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
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Sorter Suku Sejenis</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 lg:mt-1">
            Suku sejenis harus memiliki <strong>variabel</strong> dan <strong>pangkat</strong> yang sama persis.
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
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-3 lg:p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[300px] lg:min-h-[500px]">
              
              <div className="flex justify-between items-center mb-3 lg:mb-6">
                <h3 className="text-xs lg:text-sm font-bold text-slate-700">Pilih suku, lalu masukkan ke keranjang!</h3>
                <button onClick={handleReset} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Reset">
                   <RotateCcw size={16} className="lg:w-5 lg:h-5" />
                </button>
              </div>

              {/* Scattered Terms */}
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-8 min-h-[60px] p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 items-center justify-center">
                {unassignedTerms.length === 0 ? (
                  <div className="w-full text-center text-emerald-500 font-bold flex flex-col items-center gap-1 text-xs lg:text-sm">
                    <CheckCircle2 size={24} className="lg:w-8 lg:h-8" />
                    Luar biasa! Semua suku sudah disortir.
                  </div>
                ) : (
                  unassignedTerms.map(term => (
                    <button
                      key={term.id}
                      onClick={() => handleSelectTerm(term)}
                      className={`px-3 py-1.5 lg:px-4 lg:py-2 text-xs sm:text-xl font-bold font-mono rounded-lg sm:rounded-xl border transition-all shadow-xs ${selectedTerm?.id === term.id ? 'bg-indigo-500 border-indigo-600 text-white scale-105 shadow-md ring-2 ring-indigo-200' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={term.math} />
                    </button>
                  ))
                )}
              </div>

              {errorMsg && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white font-bold text-xs sm:text-sm px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg z-20 animate-bounce">
                  {errorMsg}
                </div>
              )}

              {/* Bins */}
              <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-auto">
                {[
                  { id: 'x', label: 'Keranjang x', color: 'indigo' },
                  { id: 'x2', label: 'Keranjang x²', color: 'emerald' },
                  { id: 'y', label: 'Keranjang y', color: 'amber' },
                  { id: 'const', label: 'Konstanta', color: 'slate' }
                ].map(bin => (
                  <div 
                    key={bin.id}
                    onClick={() => handleSelectBin(bin.id as any)}
                    className={`flex flex-col min-h-[90px] sm:min-h-[120px] rounded-xl border-2 transition-all cursor-pointer ${selectedTerm ? `hover:bg-slate-50 border-${bin.color}-300 border-dashed` : 'border-slate-200 bg-white'}`}
                  >
                    <div className={`text-center py-1 lg:py-2 text-[10px] lg:text-sm font-bold text-slate-700 bg-slate-50 rounded-t-lg border-b border-slate-200/50`}>
                      {bin.label}
                    </div>
                    <div className="p-1.5 lg:p-3 flex flex-wrap gap-1 lg:gap-2 content-start flex-1 bg-slate-50/20">
                      {bins[bin.id].map(term => (
                        <div key={term.id} className={`px-2 py-0.5 lg:px-3 lg:py-1 bg-white text-slate-800 border border-slate-200 rounded-md font-mono font-bold text-[10px] lg:text-sm shadow-2xs`}>
                          <InlineMath math={term.math} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Beda Pangkat" : quizStep === 1 ? "Variabel Terbalik" : "Koefisien Berbeda"}
              questionText={
                quizStep === 0 
                  ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="3x" /></span> sejenis dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="3x^2" /></span>?</span>
                  : quizStep === 1
                  ? <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="2xy" /></span> sejenis dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="5yx" /></span>?</span>
                  : <span>Apakah <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="x" /></span> sejenis dengan <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="4x" /></span> walau angkanya beda?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/group-like-terms"
              nextLabel="Lanjut: Mengelompokkan Suku"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    {['Ya', 'Tidak'].map((ans, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleEvaluate(
                           quizStep === 0 ? ans === 'Tidak' :
                           quizStep === 1 ? ans === 'Ya' :
                           ans === 'Ya'
                        )} 
                        className={`px-6 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl border-2 font-bold text-base sm:text-xl transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${
                           evalResult === 'correct' && (
                              (quizStep === 0 && ans === 'Tidak') || 
                              (quizStep === 1 && ans === 'Ya') || 
                              (quizStep === 2 && ans === 'Ya')
                           ) ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 
                           evalResult === 'wrong' && (
                              (quizStep === 0 && ans !== 'Tidak') || 
                              (quizStep === 1 && ans !== 'Ya') || 
                              (quizStep === 2 && ans !== 'Ya')
                           )  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-650 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  
                  {evalResult !== 'none' && quizStep === 0 && (
                    <p className={`text-xs sm:text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Salah satu jebakan paling umum! Walau variabelnya sama-sama x, pangkatnya berbeda (x pangkat 1 dan x pangkat 2). Mereka <strong>tidak sejenis</strong>.
                    </p>
                  )}
                  {evalResult !== 'none' && quizStep === 1 && (
                    <p className={`text-xs sm:text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Ya, mereka <strong>sejenis</strong>. Dalam perkalian, xy itu sama persis dengan yx (sifat komutatif).
                    </p>
                  )}
                  {evalResult !== 'none' && quizStep === 2 && (
                    <p className={`text-xs sm:text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Ya, mereka <strong>sejenis</strong>. Syarat suku sejenis hanyalah variabel dan pangkatnya yang harus sama. Koefisien (angka depan) boleh berbeda. (Catatan: x itu sama dengan 1x).
                    </p>
                  )}
                </div>
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-3 lg:gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-amber-50 border border-amber-200 p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm">
            <h3 className="text-amber-800 font-bold mb-2 text-xs lg:text-sm flex items-center gap-2">
               Syarat Suku Sejenis
            </h3>
            <ul className="text-xs lg:text-sm text-amber-950 font-medium space-y-2 lg:space-y-3 pl-4 list-disc marker:text-amber-500">
               <li>Memiliki <strong>variabel yang sama persis</strong>.</li>
               <li>Memiliki <strong>pangkat yang sama persis</strong>.</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-amber-250/30 flex items-start gap-2">
              <Info className="text-amber-600 shrink-0 mt-0.5" size={14} />
              <p className="text-[10px] lg:text-xs text-amber-700/80 leading-relaxed">
                Ingat, angka yang menempel (koefisien) tidak berpengaruh pada penentuan apakah mereka sejenis atau bukan. <br/> Contoh: <InlineMath math="5x" /> dan <InlineMath math="-2x" /> adalah sejenis.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
