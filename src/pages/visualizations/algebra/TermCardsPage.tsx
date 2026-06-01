import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info } from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";

export default function TermCardsPage() {
  const [mode, setMode] = useState<'explore' | 'evaluate'>('explore');
  const [activeTab, setActiveTab] = useState<'suku' | 'variabel' | 'koefisien' | 'konstanta'>('suku');
  
  // Expression: 3x^2 - 5y + 7
  const expressionParts = [
    { text: "3", type: "koefisien", parent: "suku1" },
    { text: "x^2", type: "variabel", parent: "suku1" },
    { text: " - 5", type: "koefisien", parent: "suku2" },
    { text: "y", type: "variabel", parent: "suku2" },
    { text: " + 7", type: "konstanta", parent: "suku3" }
  ];

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

  const getHighlightClass = (partType: string, parent: string) => {
    if (mode === 'evaluate') return 'text-slate-800'; // No highlight in quiz unless specified

    if (activeTab === 'suku') {
      if (parent === 'suku1') return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      if (parent === 'suku2') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (parent === 'suku3') return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (activeTab === partType) {
      return 'bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-400';
    }
    return 'text-slate-300 border-transparent';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Galeri
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Kartu Suku Aljabar</h2>
          <p className="text-slate-500 text-sm mt-1">
            Kenali bagian-bagian dari bentuk aljabar: Suku, Variabel, Koefisien, dan Konstanta.
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center relative">
              
              <div className="flex flex-wrap justify-center items-center gap-1 text-4xl md:text-5xl font-mono font-black mb-12">
                {expressionParts.map((part, idx) => (
                  <span 
                    key={idx} 
                    className={`px-2 py-1 border-b-4 rounded transition-all duration-500 ${getHighlightClass(part.type, part.parent)}`}
                  >
                    <InlineMath math={part.text} />
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {['suku', 'variabel', 'koefisien', 'konstanta'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 rounded-xl font-bold capitalize transition-all border-2 ${activeTab === tab ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm scale-105' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'evaluate' && (
            <QuizContainer
              title={quizStep === 0 ? "Identifikasi Koefisien" : quizStep === 1 ? "Identifikasi Konstanta" : "Miskonsepsi Variabel"}
              questionText={
                quizStep === 0 
                  ? <span>Berapakah koefisien dari <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="x^2" /></span> pada persamaan di bawah?</span>
                  : quizStep === 1
                  ? <span>Manakah yang merupakan konstanta dari persamaan tersebut?</span>
                  : <span>Apakah angka <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">2</span> pada <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><InlineMath math="x^2" /></span> disebut sebagai koefisien?</span>
              }
              evalResult={evalResult}
              onNext={handleNextQuiz}
              isLastQuestion={quizStep === 2}
              nextPath="/student/visualizations/algebra/sign-belongs-to-term"
              nextLabel="Lanjut: Tanda Milik Suku"
              isFinished={isFinished}
              score={score}
              totalQuestions={3}
              onRetry={handleRetryQuiz}
            >
              {(quizStep === 0 || quizStep === 1) && (
                <div className="flex justify-center items-center gap-1 text-3xl font-mono font-black mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <InlineMath math="3x^2 - 5y + 7" />
                </div>
              )}

              {quizStep === 0 && (
                <div className="flex gap-4">
                  {['3', '-5', '7'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '3')} 
                      className={`w-20 h-16 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '3' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '3'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 1 && (
                <div className="flex gap-4">
                  {['3', '-5y', '7'].map((ans, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleEvaluate(ans === '7')} 
                      className={`px-6 h-16 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 hover:shadow-md ${evalResult !== 'none' ? 'pointer-events-none' : ''} ${evalResult === 'correct' && ans === '7' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : evalResult === 'wrong' && ans !== '7'  ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                    >
                      <InlineMath math={ans} />
                    </button>
                  ))}
                </div>
              )}

              {quizStep === 2 && (
                <div className="flex flex-col items-center gap-6">
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
                    <p className={`text-sm font-bold max-w-md text-center ${evalResult === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Penjelasan: Salah. Angka 2 pada <InlineMath math="x^2" /> adalah <strong>pangkat</strong>, bukan koefisien. Koefisien adalah angka yang berada di <strong>depan</strong> variabel yang mengalikan variabel tersebut (misal angka 3 pada <InlineMath math="3x^2" />).
                    </p>
                  )}
                </div>
              )}
            </QuizContainer>
          )}

        </div>

        {/* Controls */}
        <div className={`lg:col-span-4 flex flex-col gap-4 ${mode === 'evaluate' ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
            <h3 className="text-indigo-800 font-bold mb-2 text-sm">Apa itu {activeTab}?</h3>
            <p className="text-sm text-indigo-700 leading-relaxed mb-4">
              {activeTab === 'suku' && "Suku adalah bagian-bagian dari bentuk aljabar yang dipisahkan oleh tanda tambah (+) atau kurang (-)."}
              {activeTab === 'variabel' && "Variabel adalah huruf atau simbol (seperti x, y) yang mewakili nilai yang belum diketahui."}
              {activeTab === 'koefisien' && "Koefisien adalah angka yang berada tepat di depan variabel. Koefisien berfungsi mengalikan variabel."}
              {activeTab === 'konstanta' && "Konstanta adalah angka tunggal yang berdiri sendiri, tanpa memiliki variabel di belakangnya."}
            </p>
            <div className="flex items-start gap-2 pt-4 border-t border-indigo-200/50">
              <Info className="text-indigo-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-indigo-600/80">
                Pilih tombol di sebelah kiri untuk melihat highlight (sorotan) bagian mana yang dimaksud.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
