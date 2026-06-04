// src/pages/MasteryCheckPage.tsx

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Trophy, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Award,
  BookOpen
} from "lucide-react";
import { InlineMath } from "react-katex";
import { masteryQuestions } from "../data/masterySets";
import { progressStorage } from "../services/progressStorage";
import { learningMapNodes } from "../data/learningMap";

export default function MasteryCheckPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topicNode = topicId ? learningMapNodes.find(n => n.id === topicId) : undefined;
  const topicTitle = topicNode ? topicNode.title : "Topik Ini";

  // MVP supports fractions, percent, integer, algebra, and plsv
  if (topicId !== "fractions" && topicId !== "percent" && topicId !== "integer" && topicId !== "algebra" && topicId !== "plsv") {
    return (
      <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center space-y-4">
        <Trophy size={48} className="text-slate-400 animate-pulse" />
        <h3 className="text-xl font-sans font-black text-slate-800">
          Mastery Check Belum Tersedia
        </h3>
        <p className="text-sm text-slate-500 max-w-sm font-sans">
          Mastery Check untuk topik ini belum tersedia pada versi demo saat ini. Silakan coba topik Pecahan.
        </p>
        <Link
          to="/student/learning-map"
          className="bg-indigo-650 hover:bg-indigo-550 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Kembali ke Peta Belajar
        </Link>
      </div>
    );
  }

  // Filter questions by topicId
  const questions = masteryQuestions.filter(q => q.topicId === topicId);

  // State Variables
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // LaTeX helper
  const renderMathText = (text: string) => {
    if (!text) return null;
    const parts = text.split("$");
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        const cleaned = part.replace(/\\\\/g, "\\");
        return <InlineMath key={idx} math={cleaned} />;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const handleOptionClick = (option: string, correctAns: string) => {
    if (selected !== null) return; // already answered current question

    setSelected(option);
    if (option === correctAns) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      // Complete mastery check
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 80;

      progressStorage.saveMasteryResult({
        topicId: topicId as "fractions" | "percent" | "integer" | "algebra" | "plsv",
        passed,
        score,
        attemptDate: new Date().toISOString()
      });

      setIsFinished(true);
    }
  };

  const activeQuestion = questions[qIndex];
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 80;

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-2xl mx-auto space-y-8 animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <Link 
          to="/student/learning-map" 
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <ArrowLeft size={12} /> Kembali ke Peta Belajar
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight flex items-center gap-2">
          <Award className="text-indigo-650" size={28} /> Mastery Check: {topicTitle}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Buktikan pemahamanmu untuk menyelesaikan bab ini dan membuka bab berikutnya.
        </p>
      </div>

      {!isFinished && activeQuestion ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-6 animate-fadeIn">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-1.5">
              <span className="text-3xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wide">Pertanyaan {qIndex + 1}/{questions.length}</span>
              <span className="text-3xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wide">Target 80%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200/50">
              <div 
                className="bg-indigo-650 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-2">
            <div className="p-5 bg-slate-55 border border-slate-150 rounded-2xl font-sans text-base md:text-lg font-black text-slate-800 leading-relaxed shadow-3xs">
              {renderMathText(activeQuestion.question)}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {activeQuestion.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrectOpt = opt === activeQuestion.correctAnswer;
              
              let btnClass = "bg-white border-slate-250 text-slate-700 hover:bg-slate-50";
              let dotClass = "border-slate-300 bg-white";

              if (selected !== null) {
                if (isSelected) {
                  if (isCorrectOpt) {
                    btnClass = "bg-emerald-50 border-emerald-350 text-emerald-800 font-bold";
                    dotClass = "border-emerald-600 bg-emerald-500 text-white";
                  } else {
                    btnClass = "bg-rose-50 border-rose-350 text-rose-800 font-bold";
                    dotClass = "border-rose-600 bg-rose-500 text-white";
                  }
                } else if (isCorrectOpt) {
                  btnClass = "bg-emerald-50 border-emerald-250 text-emerald-700 opacity-90";
                  dotClass = "border-emerald-600 bg-emerald-500 text-white";
                } else {
                  btnClass = "bg-white border-slate-150 text-slate-350 opacity-55";
                  dotClass = "border-slate-200 bg-slate-50";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={selected !== null}
                  onClick={() => handleOptionClick(opt, activeQuestion.correctAnswer)}
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm text-left flex items-center gap-3 transition-all ${
                    selected === null ? "cursor-pointer" : "cursor-default"
                  } ${btnClass}`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-3xs font-bold font-mono transition-colors ${dotClass}`}>
                    {isSelected ? (isCorrectOpt ? "✓" : "✗") : ""}
                  </span>
                  <span className="font-sans font-medium">{renderMathText(opt)}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation during active check? No, requirements specify:
              "Feedback langsung: tidak ada hint. Tampilkan tombol berikutnya."
              Wait! We want to show the next button only after they choose. Let's do that.
          */}
          {selected !== null && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                <span>{qIndex < questions.length - 1 ? "Pertanyaan Berikutnya" : "Lihat Hasil"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* --- RESULTS PAGE --- */
        <div className="bg-white p-8 rounded-3xl border border-slate-150 shadow-md text-center space-y-6 animate-fadeIn">
          {passed ? (
            // PASSED RESULT SCREEN
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-350 text-emerald-600 animate-bounce shadow-3xs">
                <Trophy size={42} className="fill-current" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-250 px-3 py-1 rounded-full uppercase tracking-wider">
                  Bab Selesai • Lulus
                </span>
                <h3 className="text-xl md:text-2xl font-sans font-black text-slate-800 pt-2">
                  {topicTitle} Berhasil Dikuasai!
                </h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Selamat! Pemahaman konsep dan logika matematikamu pada topik {topicTitle} telah teruji dengan sangat baik. Kamu siap untuk melangkah ke tantangan berikutnya.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl max-w-xs mx-auto space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">Skor Ujian Akhir</span>
                <p className="text-xl font-mono font-black text-slate-850">{score}%</p>
                <p className="text-3xs text-emerald-700 font-sans font-bold mt-1">({correctCount} dari 5 soal dijawab dengan benar)</p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => navigate("/student/learning-map")}
                  className="inline-flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
                >
                  <span>Lihat Peta Belajar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            // FAILED RESULT SCREEN
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 border-2 border-rose-350 text-rose-600 animate-pulse shadow-3xs">
                <XCircle size={42} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 border border-rose-250 px-3 py-1 rounded-full uppercase tracking-wider">
                  Hasil Belum Mencapai Target
                </span>
                <h3 className="text-xl md:text-2xl font-sans font-black text-slate-800 pt-2">
                  Masih Ada Bagian {topicTitle} yang Perlu Diperkuat
                </h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Skormu ({score}%) belum mencapai batas kelulusan 80%. Jangan berkecil hati! Latihan mandiri adalah cara terbaik untuk melatih insting matematikamu.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl max-w-xs mx-auto space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">Skor Ujian Akhir</span>
                <p className="text-xl font-mono font-black text-slate-850">{score}%</p>
                <p className="text-3xs text-rose-700 font-sans font-bold mt-1">({correctCount} dari 5 soal dijawab dengan benar)</p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => navigate(`/student/drill/${topicId}`)}
                  className="inline-flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
                >
                  <span>Kembali ke Latihan (Drill)</span>
                  <RotateCcw size={14} className="scale-x-[-1]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Chevron icon fallback
function ChevronRight(props: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// Rotate icon fallback
function RotateCcw(props: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
