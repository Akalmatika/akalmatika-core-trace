import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Trophy, 
  Coins, 
  RotateCcw,
  BookOpen,
  Compass,
} from "lucide-react";
import { triangulateAnswers } from "../../engine/parser";
import { DiagnosticQuestion, MisconceptionRule, TriangulationResult } from "../../engine/rules";
import { getVisualizationRoute } from "../../engine/rules/mapper";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface Props {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  cluster: DiagnosticQuestion[];
  rules: MisconceptionRule[];
}

export default function DiagnosticTestEngine({ topicId, topicTitle, topicDescription, cluster, rules }: Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<"welcome" | "quiz" | "result">("welcome");
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(cluster.length).fill(""));
  const [inputError, setInputError] = useState<string>("");
  const [diagnosticResult, setDiagnosticResult] = useState<TriangulationResult | null>(null);

  const activeQuestion = cluster[currentQuestionIdx];

  const handleStartQuiz = () => {
    setAnswers(Array(cluster.length).fill(""));
    setCurrentQuestionIdx(0);
    setInputError("");
    setCurrentStep("quiz");
  };

  const handleBackQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleNextQuestion = (autoSubmitAnswer?: string | number) => {
    const answerToEvaluate = autoSubmitAnswer !== undefined ? String(autoSubmitAnswer) : answers[currentQuestionIdx];
    const currentVal = answerToEvaluate.trim();
    if (!currentVal) {
      setInputError("Harap isi jawabanmu terlebih dahulu ya!");
      return;
    }
    
    // Update state just in case if it's auto-submitted
    if (autoSubmitAnswer !== undefined) {
      handleAnswerChange(String(autoSubmitAnswer));
    }

    setInputError("");
    
    if (currentQuestionIdx < cluster.length - 1) {
      // Small timeout to allow UI to show button selection for a split second before navigating
      setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 50);
    } else {
      // Need to use the latest answers including the current one if it was just submitted
      const newAnswers = [...answers];
      if (autoSubmitAnswer !== undefined) {
        newAnswers[currentQuestionIdx] = String(autoSubmitAnswer);
      }
      
      const parsedAns = newAnswers.map(ans => {
        if (/^-?\d+$/.test(ans)) return Number(ans);
        return ans;
      });
      const result = triangulateAnswers(parsedAns, cluster, rules);
      setDiagnosticResult(result);
      setCurrentStep("result");
    }
  };

  const handleAnswerChange = (val: string) => {
    setInputError("");
    setAnswers(prev => {
      const next = [...prev];
      next[currentQuestionIdx] = val;
      return next;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {currentStep === "welcome" && (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-slate-900">
              Misi Detektif: {topicTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
              {topicDescription}
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 text-left max-w-sm mx-auto space-y-2 text-xs text-slate-500">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5 font-mono uppercase tracking-wider text-[10px]">
              <BookOpen size={12} className="text-indigo-500" /> Aturan Misi:
            </div>
            <p>1. Kamu akan diberikan {cluster.length} soal matematika khusus.</p>
            <p>2. Jawablah sesuai pemahamanmu sendiri secara jujur.</p>
            <p>3. Jika terdeteksi miskonsepsi, asisten AI akan mengarahkanmu ke media visualisasi yang tepat.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md cursor-pointer animate-bounce"
            >
              <Compass size={16} />
              <span>Mulai Analisis</span>
            </button>
            <button
              onClick={() => navigate('/student/diagnostic')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 active:translate-y-0.5 font-sans font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>Kembali ke Katalog</span>
            </button>
          </div>
        </div>
      )}

      {currentStep === "quiz" && (
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
              Soal {currentQuestionIdx + 1} dari {cluster.length}
            </span>
            <div className="flex gap-1">
              {cluster.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-3.5 h-1.5 rounded-full transition-all ${
                    idx === currentQuestionIdx 
                      ? "bg-indigo-600 w-6" 
                      : idx < currentQuestionIdx 
                        ? "bg-emerald-500" 
                        : "bg-slate-200"
                  }`} 
                />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-6 md:p-8 rounded-2xl text-center border border-indigo-950 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 uppercase font-bold block mb-2">Misi Kognitif</span>
            <div className="font-mono text-2xl md:text-3xl text-white select-none py-2">
              <BlockMath math={activeQuestion.expression} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-700 block text-center md:text-left">
              {activeQuestion.questionText || "Berapakah hasil akhir perhitungan di atas?"}
            </label>
            
            {activeQuestion.options && activeQuestion.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestionIdx] === String(opt);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNextQuestion(opt)}
                      className={`relative flex items-center justify-center p-4 rounded-xl border-2 font-mono text-lg transition-all active:scale-[0.98] cursor-pointer ${
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <InlineMath math={String(opt)} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={answers[currentQuestionIdx]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Ketik jawabanmu..."
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 rounded-2xl px-4 py-3.5 text-base font-mono font-bold text-slate-800 transition-all shadow-2xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNextQuestion();
                  }}
                />
              </div>
            )}
            
            {inputError && (
              <div className="flex items-center gap-1.5 text-rose-650 text-xs font-semibold animate-fadeIn justify-center md:justify-start">
                <AlertCircle size={14} className="shrink-0" />
                <span>{inputError}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {currentQuestionIdx > 0 && (
              <button
                onClick={handleBackQuestion}
                className="w-full sm:w-1/3 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-sans font-bold px-5 py-3.5 rounded-2xl text-sm transition-all shadow-2xs cursor-pointer"
              >
                <span>Kembali</span>
              </button>
            )}
            
            {(!activeQuestion.options || activeQuestion.options.length === 0) && (
              <button
                onClick={() => handleNextQuestion()}
                className={`w-full ${currentQuestionIdx > 0 ? 'sm:w-2/3' : 'sm:w-full'} inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-600 active:translate-y-0.5 text-white font-sans font-bold px-5 py-3.5 rounded-2xl text-sm transition-all shadow-xs cursor-pointer`}
              >
                <span>{currentQuestionIdx === cluster.length - 1 ? "Kirim Hasil Analisis" : "Soal Berikutnya"}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {currentStep === "result" && diagnosticResult && (
        <div className="bg-white p-8 rounded-3xl border border-slate-105 shadow-sm space-y-6 animate-fadeIn">
          
          {diagnosticResult.isPerfectTrack ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <Trophy size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-sans font-black text-slate-900">
                  Selamat, Detektif Hebat! 🎉
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  Semua jawabanmu 100% benar! Kamu memiliki pemahaman konsep yang sangat solid.
                </p>
              </div>
              
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 max-w-xs mx-auto text-xs text-slate-650 font-mono space-y-1">
                <span className="font-bold text-emerald-700">AKURASI DETEKSI: {cluster.length}/{cluster.length} BENAR</span>
                <p className="text-slate-500">Konsep teruji: {topicTitle}</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Coba Lagi</span>
                </button>
                <button
                  onClick={() => navigate('/student/diagnostic')}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Kembali ke Katalog
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl">
                  <Coins size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-lg md:text-xl">
                    Tantangan Konsep: {diagnosticResult.ruleName}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    ASISTEN KOGNITIF AKALMATIKA
                  </span>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800">Hi Detektif, ada pola menarik yang asisten temukan pada analisismu:</p>
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-sm text-slate-700 leading-relaxed font-sans italic">
                  "{diagnosticResult.remedialScaffold}"
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Keyakinan Deteksi: {diagnosticResult.confidence}% (Cocok dengan {diagnosticResult.matchRatio} pola)
                </p>
              </div>

              <div className="flex justify-end pt-4 gap-3 border-t border-slate-100">
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Ulangi Misi</span>
                </button>
                <button
                  onClick={() => navigate(getVisualizationRoute(topicId, diagnosticResult.detectedMisconceptionCode))}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  <span>Ke Media Visualisasi</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
