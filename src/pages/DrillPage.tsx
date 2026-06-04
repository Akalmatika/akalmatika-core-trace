// src/pages/DrillPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  RotateCcw,
  Compass,
  FileText
} from "lucide-react";
import { InlineMath } from "react-katex";
import { drillQuestions, DrillQuestion } from "../data/drillSets";
import { progressStorage } from "../services/progressStorage";
import { learningMapNodes } from "../data/learningMap";

export default function DrillPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topicNode = topicId ? learningMapNodes.find(n => n.id === topicId) : undefined;
  const topicTitle = topicNode ? topicNode.title : "Topik Ini";

  // MVP supports fractions, percent, integer, algebra, and plsv
  if (topicId !== "fractions" && topicId !== "percent" && topicId !== "integer" && topicId !== "algebra" && topicId !== "plsv") {
    return (
      <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center space-y-4">
        <Compass size={48} className="text-slate-400 animate-pulse" />
        <h3 className="text-xl font-sans font-black text-slate-800">
          Latihan Belum Tersedia
        </h3>
        <p className="text-sm text-slate-500 max-w-sm font-sans">
          Latihan untuk topik ini belum tersedia pada versi demo saat ini. Silakan coba topik Pecahan.
        </p>
        <Link
          to="/student/learning-map"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Kembali ke Peta Belajar
        </Link>
      </div>
    );
  }

  // Load questions by topicId and phase
  const phase1Questions = drillQuestions.filter(q => q.topicId === topicId && q.phase === 1);
  const phase2Questions = drillQuestions.filter(q => q.topicId === topicId && q.phase === 2);
  const phase3Questions = drillQuestions.filter(q => q.topicId === topicId && q.phase === 3);

  // Read saved progress
  const savedProgress = topicId ? progressStorage.getDrillProgress(topicId) : null;
  const initialPhase = savedProgress ? savedProgress.currentPhase : 1;

  // State Variables
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(initialPhase);

  // Phase 1 State
  const [p1Index, setP1Index] = useState(0);

  // Phase 2 State
  const [p2Index, setP2Index] = useState(0);
  const [p2Selected, setP2Selected] = useState<string | null>(null);
  const [p2WrongCount, setP2WrongCount] = useState(0);
  const [p2HintsCount, setP2HintsCount] = useState(0);
  const [p2IsCorrect, setP2IsCorrect] = useState(false);
  const [p2FirstTryCorrect, setP2FirstTryCorrect] = useState(0);
  const [p2HasFailedCurrent, setP2HasFailedCurrent] = useState(false);

  // Phase 3 State
  const [p3Index, setP3Index] = useState(0);
  const [p3Selected, setP3Selected] = useState<string | null>(null);
  const [p3IsCorrect, setP3IsCorrect] = useState<boolean | null>(null);
  const [p3CorrectCount, setP3CorrectCount] = useState(0);
  const [p3IsFinished, setP3IsFinished] = useState(false);

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

  // Phase 1 navigation
  const handleP1Next = () => {
    if (p1Index < phase1Questions.length - 1) {
      setP1Index(p1Index + 1);
    } else {
      // Save progress and go to Phase 2
      progressStorage.saveDrillProgress({
        topicId: topicId as "fractions" | "percent" | "integer" | "algebra" | "plsv",
        currentPhase: 2,
        phase1Completed: true,
        phase2Accuracy: savedProgress?.phase2Accuracy || 0,
        phase3Accuracy: savedProgress?.phase3Accuracy || 0,
        totalAttempts: (savedProgress?.totalAttempts || 0) + 1,
        lastAttemptDate: new Date().toISOString()
      });
      setCurrentPhase(2);
    }
  };

  // Phase 2 Hint click
  const handleP2ShowHint = (maxHints: number) => {
    if (p2HintsCount < maxHints) {
      setP2HintsCount(p2HintsCount + 1);
    }
  };

  // Phase 2 Submit
  const handleP2Submit = (option: string, correctAns: string) => {
    if (p2IsCorrect) return; // already solved

    setP2Selected(option);

    if (option === correctAns) {
      setP2IsCorrect(true);
      if (!p2HasFailedCurrent) {
        setP2FirstTryCorrect(p2FirstTryCorrect + 1);
      }
    } else {
      setP2WrongCount(p2WrongCount + 1);
      setP2HasFailedCurrent(true);
    }
  };

  // Phase 2 Next question
  const handleP2Next = () => {
    if (p2Index < phase2Questions.length - 1) {
      setP2Index(p2Index + 1);
      setP2Selected(null);
      setP2WrongCount(0);
      setP2HintsCount(0);
      setP2IsCorrect(false);
      setP2HasFailedCurrent(false);
    } else {
      // Save Phase 2 accuracy and transition to Phase 3
      const accuracy = Math.round((p2FirstTryCorrect / phase2Questions.length) * 100);
      progressStorage.saveDrillProgress({
        topicId: topicId as "fractions" | "percent" | "integer" | "algebra" | "plsv",
        currentPhase: 3,
        phase1Completed: true,
        phase2Accuracy: accuracy,
        phase3Accuracy: savedProgress?.phase3Accuracy || 0,
        totalAttempts: (savedProgress?.totalAttempts || 0) + 1,
        lastAttemptDate: new Date().toISOString()
      });
      setCurrentPhase(3);
    }
  };

  // Phase 3 Submit
  const handleP3Submit = (option: string, correctAns: string) => {
    if (p3Selected !== null) return; // already answered

    setP3Selected(option);
    const isCorrect = option === correctAns;
    setP3IsCorrect(isCorrect);

    if (isCorrect) {
      setP3CorrectCount(p3CorrectCount + 1);
    }
  };

  // Phase 3 Next question
  const handleP3Next = () => {
    if (p3Index < phase3Questions.length - 1) {
      setP3Index(p3Index + 1);
      setP3Selected(null);
      setP3IsCorrect(null);
    } else {
      // Save Phase 3 accuracy and complete Phase 3
      const accuracy = Math.round((p3CorrectCount / phase3Questions.length) * 100);
      const activeProgress = topicId ? progressStorage.getDrillProgress(topicId) : null;
      progressStorage.saveDrillProgress({
        topicId: topicId as "fractions" | "percent" | "integer" | "algebra" | "plsv",
        currentPhase: 3,
        phase1Completed: true,
        phase2Accuracy: activeProgress?.phase2Accuracy || 0,
        phase3Accuracy: accuracy,
        totalAttempts: (activeProgress?.totalAttempts || 0) + 1,
        lastAttemptDate: new Date().toISOString()
      });
      setP3IsFinished(true);
    }
  };

  // Phase 3 Fail Retry
  const handleRetryToPhase2 = () => {
    // Reset states for phase 2 and 3
    setP2Index(0);
    setP2Selected(null);
    setP2WrongCount(0);
    setP2HintsCount(0);
    setP2IsCorrect(false);
    setP2FirstTryCorrect(0);
    setP2HasFailedCurrent(false);

    setP3Index(0);
    setP3Selected(null);
    setP3IsCorrect(null);
    setP3CorrectCount(0);
    setP3IsFinished(false);

    setCurrentPhase(2);
  };

  // Active question getters
  const activeP1 = phase1Questions[p1Index];
  const activeP2 = phase2Questions[p2Index];
  const activeP3 = phase3Questions[p3Index];

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-3xl mx-auto space-y-8 animate-fadeIn font-sans">
      
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
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Latihan Bertahap: {topicTitle}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-2">
          Pahami konsep secara mendalam mulai dari contoh detail, contoh terbimbing, lalu latihan mandiri.
        </p>
      </div>

      {/* Stepper Progress Tracks */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { num: 1, name: "Contoh Detail", shortName: "Contoh", active: currentPhase === 1, done: currentPhase > 1 },
          { num: 2, name: "Contoh Terbimbing", shortName: "Bimbingan", active: currentPhase === 2, done: currentPhase > 2 },
          { num: 3, name: "Latihan Mandiri", shortName: "Mandiri", active: currentPhase === 3, done: false }
        ].map((ph) => (
          <button
            key={ph.num}
            disabled={!ph.done && currentPhase !== ph.num}
            onClick={() => {
              if (ph.done || ph.num === currentPhase) {
                setCurrentPhase(ph.num as 1 | 2 | 3);
                // If switching back, reset index
                if (ph.num === 1) setP1Index(0);
                if (ph.num === 2) {
                  setP2Index(0);
                  setP2Selected(null);
                  setP2IsCorrect(false);
                }
                if (ph.num === 3) {
                  setP3Index(0);
                  setP3Selected(null);
                  setP3IsCorrect(null);
                  setP3IsFinished(false);
                }
              }
            }}
            className={`flex flex-col items-center sm:items-start p-3 rounded-xl border transition-all text-left ${
              ph.active 
                ? "bg-indigo-50 border-indigo-250 text-indigo-900 shadow-3xs" 
                : ph.done 
                  ? "bg-emerald-50/40 border-emerald-150 text-emerald-800 cursor-pointer" 
                  : "bg-slate-50/50 border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                ph.active 
                  ? "bg-indigo-650 text-white" 
                  : ph.done 
                    ? "bg-emerald-500 text-white" 
                    : "bg-slate-250 text-slate-500"
              }`}>
                {ph.done ? "✓" : ph.num}
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wide uppercase hidden sm:inline">Fase {ph.num}</span>
            </div>
            <span className="text-3xs sm:text-xs font-bold font-sans mt-1.5 tracking-tight w-full"><span className="sm:hidden">{ph.shortName}</span><span className="hidden sm:inline">{ph.name}</span></span>
          </button>
        ))}
      </div>

      {/* --- FASE 1: Contoh Detail --- */}
      {currentPhase === 1 && activeP1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-600" /> Contoh Detail {p1Index + 1} dari {phase1Questions.length}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest">Pertanyaan</h4>
            <div className="p-5 bg-slate-55 border border-slate-150 rounded-2xl font-sans text-base md:text-lg font-black text-slate-800 leading-relaxed shadow-3xs">
              {renderMathText(activeP1.question)}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest">Langkah Penyelesaian</h4>
            <div className="space-y-3">
              {activeP1.workedExampleSteps?.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 bg-indigo-50/20 rounded-2xl border border-indigo-50/50 hover:border-indigo-100 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans font-medium">
                    {renderMathText(step)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleP1Next}
              className="inline-flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <span>{p1Index < phase1Questions.length - 1 ? "Contoh Berikutnya" : "Saya Paham, Lanjut ke Contoh Terbimbing"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* --- FASE 2: Contoh Terbimbing --- */}
      {currentPhase === 2 && activeP2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600 animate-pulse" /> Contoh Terbimbing {p2Index + 1} dari {phase2Questions.length}
            </span>
            <span className="text-3xs font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Benar di Percobaan 1: {p2FirstTryCorrect} / {phase2Questions.length}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest">Pertanyaan</h4>
            <div className="p-5 bg-slate-55 border border-slate-150 rounded-2xl font-sans text-base md:text-lg font-black text-slate-800 leading-relaxed shadow-3xs">
              {renderMathText(activeP2.question)}
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeP2.options?.map((opt) => {
              const isSelected = p2Selected === opt;
              const isCorrectOpt = opt === activeP2.correctAnswer;
              
              let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
              let icon = null;

              if (p2Selected !== null) {
                if (isCorrectOpt) {
                  btnClass = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                  icon = <CheckCircle2 className="text-emerald-600 shrink-0" size={16} />;
                } else if (isSelected) {
                  btnClass = "bg-rose-50 border-rose-300 text-rose-800 font-bold";
                  icon = <XCircle className="text-rose-600 shrink-0" size={16} />;
                } else {
                  btnClass = "bg-white border-slate-200 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={p2IsCorrect}
                  onClick={() => handleP2Submit(opt, activeP2.correctAnswer)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm text-left flex justify-between items-center transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="font-mono">{renderMathText(`$${opt}$`)}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Feedback alerts */}
          {p2Selected !== null && !p2IsCorrect && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs md:text-sm font-sans flex items-start gap-2 animate-fadeIn font-semibold">
              <XCircle className="shrink-0 mt-0.5" size={16} />
              <div>
                Jawaban kurang tepat. Coba perhatikan lagi pecahan tersebut atau gunakan petunjuk di bawah!
              </div>
            </div>
          )}

          {/* Hint system */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest">Bantuan & Petunjuk</h4>
              {!p2IsCorrect && activeP2.hints && p2HintsCount < activeP2.hints.length && (
                <button
                  onClick={() => handleP2ShowHint(activeP2.hints!.length)}
                  className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-250 font-sans font-bold px-3 py-1.5 rounded-lg text-[10px] sm:text-xs transition-colors cursor-pointer"
                >
                  <HelpCircle size={12} />
                  <span>Butuh Petunjuk ({p2HintsCount} / {activeP2.hints.length})</span>
                </button>
              )}
            </div>

            {/* Display active hints */}
            {p2HintsCount > 0 && activeP2.hints && (
              <div className="space-y-2">
                {activeP2.hints.slice(0, p2HintsCount).map((hint, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/30 border border-amber-100/60 rounded-xl text-xs text-slate-650 leading-relaxed font-sans">
                    <span className="font-bold text-amber-800">Petunjuk {idx + 1}:</span> {renderMathText(hint)}
                  </div>
                ))}
              </div>
            )}

            {/* Display initial solution step if failed twice */}
            {p2WrongCount >= 2 && !p2IsCorrect && (
              <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl text-xs text-slate-700 leading-relaxed font-sans space-y-2">
                <span className="font-bold text-indigo-900 block border-b border-indigo-100 pb-1">Langkah Penyelesaian Terbimbing:</span>
                {activeP2.guidedSolutionSteps && activeP2.guidedSolutionSteps.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeP2.guidedSolutionSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="font-bold text-indigo-850 shrink-0">{idx + 1}.</span>
                        <p>{renderMathText(step)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Coba samakan penyebut terlebih dahulu, lalu ubah pecahan menjadi pecahan senilai.</p>
                )}
              </div>
            )}

            {/* Display full explanation if solved */}
            {p2IsCorrect && (
              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-xs md:text-sm text-emerald-950 font-sans space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 size={16} />
                  <span>Penjelasan Lengkap</span>
                </div>
                <p className="leading-relaxed">
                  {renderMathText(activeP2.explanation)}
                </p>
              </div>
            )}
          </div>

          {/* Navigation action */}
          {p2IsCorrect && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleP2Next}
                className="inline-flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                <span>{p2Index < phase2Questions.length - 1 ? "Pertanyaan Berikutnya" : "Lanjut ke Latihan Mandiri"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- FASE 3: Latihan Mandiri --- */}
      {currentPhase === 3 && activeP3 && !p3IsFinished && (
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
              <FileText size={14} className="text-indigo-600" /> Latihan Mandiri {p3Index + 1} dari {phase3Questions.length}
            </span>
            <span className="text-3xs font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Benar: {p3CorrectCount} / {phase3Questions.length}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest">Pertanyaan</h4>
            <div className="p-5 bg-slate-55 border border-slate-150 rounded-2xl font-sans text-base md:text-lg font-black text-slate-800 leading-relaxed shadow-3xs">
              {renderMathText(activeP3.question)}
            </div>
          </div>

          {/* Options list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeP3.options?.map((opt) => {
              const isSelected = p3Selected === opt;
              const isCorrectOpt = opt === activeP3.correctAnswer;
              
              let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
              let icon = null;

              if (p3Selected !== null) {
                if (isCorrectOpt) {
                  btnClass = "bg-emerald-50 border-emerald-350 text-emerald-800 font-bold";
                  icon = <span className="text-emerald-700 text-xs font-bold font-mono">Benar ✓</span>;
                } else if (isSelected) {
                  btnClass = "bg-rose-50 border-rose-350 text-rose-850 font-bold";
                  icon = <span className="text-rose-700 text-xs font-bold font-mono">Belum tepat ✗</span>;
                } else {
                  btnClass = "bg-white border-slate-200 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={p3Selected !== null}
                  onClick={() => handleP3Submit(opt, activeP3.correctAnswer)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm text-left flex justify-between items-center transition-all ${
                    p3Selected === null ? "cursor-pointer" : "cursor-default"
                  } ${btnClass}`}
                >
                  <span className="font-mono">{renderMathText(`$${opt}$`)}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Navigation action */}
          {p3Selected !== null && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleP3Next}
                className="inline-flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                <span>{p3Index < phase3Questions.length - 1 ? "Pertanyaan Berikutnya" : "Lihat Hasil Latihan"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- FASE 3: Hasil Akhir --- */}
      {currentPhase === 3 && p3IsFinished && (
        <div className="bg-white p-8 rounded-3xl border border-slate-150 shadow-md text-center space-y-6 animate-fadeIn">
          
          {/* Check score logic */}
          {Math.round((p3CorrectCount / phase3Questions.length) * 100) >= 80 ? (
            // PASS SCREEN
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 border border-emerald-250 text-emerald-600 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-sans font-black text-slate-800">
                  Luar Biasa! Latihan Selesai
                </h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Kamu berhasil menyelesaikan seluruh fase latihan {topicTitle.toLowerCase()} dengan hasil memuaskan. Sekarang, uji kemampuanmu di Mastery Check untuk membuka materi selanjutnya!
                </p>
              </div>

              {/* Score displays */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">Akurasi Fase 2</span>
                  <p className="text-base font-mono font-bold text-slate-800">
                    {(topicId ? progressStorage.getDrillProgress(topicId) : null)?.phase2Accuracy || 0}%
                  </p>
                </div>
                <div className="space-y-0.5 border-l border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">Akurasi Fase 3</span>
                  <p className="text-base font-mono font-bold text-slate-800">
                    {(topicId ? progressStorage.getDrillProgress(topicId) : null)?.phase3Accuracy || 0}%
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <button
                  onClick={() => navigate(`/student/mastery/${topicId}`)}
                  className="inline-flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
                >
                  <span>Lanjut ke Mastery Check</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={handleRetryToPhase2}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans font-bold px-6 py-3.5 rounded-2xl text-xs border border-slate-200 transition-all cursor-pointer text-center"
                >
                  <RotateCcw size={14} />
                  <span>Ulangi Latihan</span>
                </button>
              </div>
            </div>
          ) : (
            // FAIL SCREEN
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border border-amber-250 text-amber-600 animate-pulse">
                <RotateCcw size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-sans font-black text-slate-800">
                  Ayo Perkuat Kembali Konsepmu
                </h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Akurasi latihan mandirimu ({Math.round((p3CorrectCount / phase3Questions.length) * 100)}%) belum mencapai batas minimum kelulusan (70%).
                  Jangan berkecil hati, mari ulangi bersama bimbingan interaktif di Contoh Terbimbing.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleRetryToPhase2}
                  className="inline-flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-550 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Kembali ke Contoh Terbimbing (Fase 2)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
