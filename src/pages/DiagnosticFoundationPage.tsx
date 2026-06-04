// src/pages/DiagnosticFoundationPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  Trophy, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Map
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { foundationQuestions, FoundationQuestion } from "../data/foundationQuestions";
import { progressStorage } from "../services/progressStorage";

type AreaKey = 'integer' | 'fractions' | 'percent' | 'algebra' | 'plsv';

interface AreaSummary {
  topicId: AreaKey;
  title: string;
  correctCount: number;
  totalCount: number;
  status: 'Kuat' | 'Perlu Diperkuat' | 'Lemah';
  dominantMisconception: string | null;
}

export default function DiagnosticFoundationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summaries, setSummaries] = useState<AreaSummary[]>([]);
  const [recommendation, setRecommendation] = useState<{ topicId: AreaKey; title: string } | null>(null);

  const activeQuestion = foundationQuestions[currentIdx];

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setCurrentStep("quiz");
  };

  const handleSelectOption = (option: string) => {
    // Save answer
    const nextAnswers = { ...answers, [activeQuestion.id]: option };
    setAnswers(nextAnswers);

    // Proceed
    if (currentIdx < foundationQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate results and save to progress storage
      evaluateResults(nextAnswers);
    }
  };

  const evaluateResults = (finalAnswers: Record<string, string>) => {
    const areas: Record<AreaKey, { title: string; correct: number; total: number; misconceptions: string[]; answersList: string[] }> = {
      integer: { title: "Bilangan Bulat", correct: 0, total: 0, misconceptions: [], answersList: [] },
      fractions: { title: "Pecahan", correct: 0, total: 0, misconceptions: [], answersList: [] },
      percent: { title: "Persen", correct: 0, total: 0, misconceptions: [], answersList: [] },
      algebra: { title: "Aljabar Dasar", correct: 0, total: 0, misconceptions: [], answersList: [] },
      plsv: { title: "Makna Tanda Sama Dengan / PLSV", correct: 0, total: 0, misconceptions: [], answersList: [] }
    };

    // Aggregate scores and misconceptions
    foundationQuestions.forEach(q => {
      const area = areas[q.topicId];
      area.total += 1;
      const studentAns = finalAnswers[q.id] || "";
      area.answersList.push(studentAns);

      if (studentAns === q.correctAnswer) {
        area.correct += 1;
      } else {
        const mcCode = q.misconceptionMappings[studentAns];
        if (mcCode) {
          area.misconceptions.push(mcCode);
        }
      }
    });

    const areaSummaries: AreaSummary[] = [];

    // Save each area diagnostic result to progressStorage
    (Object.keys(areas) as AreaKey[]).forEach(topicId => {
      const area = areas[topicId];
      
      // Determine dominant misconception
      let dominantMC: string | null = null;
      if (area.misconceptions.length > 0) {
        const counts: Record<string, number> = {};
        let maxCount = 0;
        area.misconceptions.forEach(mc => {
          counts[mc] = (counts[mc] || 0) + 1;
          if (counts[mc] > maxCount) {
            maxCount = counts[mc];
            dominantMC = mc;
          }
        });
      }

      // Determine status
      let status: 'Kuat' | 'Perlu Diperkuat' | 'Lemah' = 'Lemah';
      if (area.correct === area.total) {
        status = 'Kuat';
      } else if (area.correct > 0) {
        status = 'Perlu Diperkuat';
      }

      areaSummaries.push({
        topicId,
        title: area.title,
        correctCount: area.correct,
        totalCount: area.total,
        status,
        dominantMisconception: dominantMC
      });

      // Save to progressStorage
      progressStorage.saveDiagnosticResult({
        topicId,
        date: new Date().toISOString(),
        isPerfectTrack: area.correct === area.total,
        detectedMisconceptionCode: dominantMC,
        confidence: area.correct === 0 ? 100 : area.correct === 1 ? 50 : 100,
        matchRatio: `${area.total - area.correct}/${area.total}`,
        answers: area.answersList
      });
    });

    setSummaries(areaSummaries);

    // Calculate recommended next topic (lowest score, tie-breaker = prerequisite order)
    const prerequisiteOrder: AreaKey[] = ['integer', 'fractions', 'percent', 'algebra', 'plsv'];
    let recommendedTopicId: AreaKey = 'integer';
    let minScore = 999;

    prerequisiteOrder.forEach(topicId => {
      const summary = areaSummaries.find(s => s.topicId === topicId);
      if (summary) {
        // We recommend topics where accuracy is not 100% (i.e. score < 2)
        // If everything is perfect, minScore stays high and default remains integer
        if (summary.correctCount < summary.totalCount && summary.correctCount < minScore) {
          minScore = summary.correctCount;
          recommendedTopicId = topicId;
        }
      }
    });

    const recommended = areaSummaries.find(s => s.topicId === recommendedTopicId);
    if (recommended) {
      setRecommendation({
        topicId: recommendedTopicId,
        title: recommended.title
      });
    }

    setCurrentStep("result");
  };

  const getStatusStyle = (status: 'Kuat' | 'Perlu Diperkuat' | 'Lemah') => {
    switch (status) {
      case 'Kuat':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Perlu Diperkuat':
        return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'Lemah':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getMisconceptionText = (code: string | null) => {
    if (!code) return "";
    switch (code) {
      case "MC-ADD-SIGN-CONF":
        return "Miskonsepsi penjumlahan berbeda tanda (bingung mengelompokkan negatif/positif).";
      case "MC-SIGN-FIRST-NUM":
        return "Mengikuti tanda bilangan pertama secara kaku tanpa melihat kuantitas.";
      case "MC-ADD-ABS-SUM":
        return "Mengabaikan tanda minus (-) dan menjumlahkan nilai mutlaknya saja.";
      case "MC-SUB-IGNORE-NEG":
        return "Mengabaikan tanda minus ganda saat pengurangan bilangan negatif.";
      case "MC-FRAC-ADD-NUM-DENOM":
        return "Menjumlahkan pembilang dengan pembilang, dan penyebut dengan penyebut secara langsung.";
      case "MC-FRAC-DIFF-DENOM-IGNORE":
        return "Mengabaikan perbedaan penyebut pecahan saat menjumlahkan.";
      case "MC-PERC-NO-100":
        return "Persen dianggap sebagai angka pembilang saja tanpa memedulikan per seratus.";
      case "MC-PERC-ADD-ZERO":
        return "Mengubah persen dengan sekadar menambahkan nol secara kaku.";
      case "MC-ALG-ADD-UNLIKE":
        return "Menjumlahkan koefisien suku yang tidak sejenis (apel + jeruk dikombinasikan).";
      case "MC-ALG-IGNORE-VAR":
        return "Mengabaikan koefisien implisit bernilai 1 pada variabel tunggal.";
      case "MC-PLSV-INV-OP-CONFUSION":
        return "Menggunakan operasi yang sama saat memindahkan ruas, bukan inversnya (lawannya).";
      default:
        return `Deteksi pola kesalahan konsep: ${code}`;
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-3xl mx-auto space-y-6">
      
      {currentStep === "welcome" && (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-sans font-black tracking-tight text-slate-900">
              Mulai Diagnosis Fondasi
            </h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
              Analisis menyeluruh yang cepat untuk mengukur ketangguhan konsep matematika dasarmu dari jenjang SD hingga SMP.
            </p>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 text-left max-w-md mx-auto space-y-3 text-xs md:text-sm text-slate-550 leading-relaxed">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5 font-mono uppercase tracking-wider text-[10px]">
              <TrendingUp size={14} className="text-indigo-500" /> Detail Ujian:
            </div>
            <p>1. Terdiri dari <strong>10 soal pilihan ganda</strong> yang merangkum 5 fondasi penting.</p>
            <p>2. Mencakup bilangan bulat, pecahan, persen, aljabar, dan persamaan linier dasar.</p>
            <p>3. Di akhir, kamu akan mendapatkan <strong>Peta Kelemahan Konsep</strong> serta rekomendasi belajar yang disesuaikan.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-md cursor-pointer animate-bounce"
            >
              <Compass size={16} />
              <span>Mulai Diagnosis</span>
            </button>
            <button
              onClick={() => navigate('/student/diagnostic')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 active:translate-y-0.5 font-sans font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>Batal</span>
            </button>
          </div>
        </div>
      )}

      {currentStep === "quiz" && activeQuestion && (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-fadeIn">
          {/* Header Progress */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-150/70 px-3 py-1 rounded-full uppercase">
              Soal {currentIdx + 1} dari {foundationQuestions.length}
            </span>
            <div className="flex gap-1.5">
              {foundationQuestions.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-3.5 h-1.5 rounded-full transition-all ${
                    idx === currentIdx 
                      ? "bg-indigo-600 w-6" 
                      : idx < currentIdx 
                        ? "bg-emerald-500" 
                        : "bg-slate-200"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Area Indikator */}
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="text-xs font-sans font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">
              Bidang: {activeQuestion.areaTitle}
            </span>
          </div>

          {/* Soal Matematika */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-6 md:p-8 rounded-2xl text-center border border-indigo-950 relative overflow-hidden shadow-inner select-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 uppercase font-bold block mb-2">Tantangan Fondasi</span>
            <div className="font-mono text-2xl md:text-3xl text-white py-2">
              <BlockMath math={activeQuestion.expression} />
            </div>
          </div>

          {/* Jawaban */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block text-center md:text-left">
              {activeQuestion.questionText}
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="relative flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-700 font-mono text-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <InlineMath math={opt} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === "result" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-105 shadow-sm space-y-8 animate-fadeIn">
          {/* Header Hasil */}
          <div className="text-center space-y-2 py-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Trophy size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-sans font-black text-slate-900">
              Peta Kelemahan Fondasimu
            </h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Berikut adalah laporan akurasi konsep dasarmu. Rekomendasi di bawah menunjukkan langkah awal terbaik untuk memperkuat pemahamanmu.
            </p>
          </div>

          {/* Summaries List */}
          <div className="space-y-4">
            {summaries.map((s, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white hover:shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-slate-900 text-sm md:text-base">
                      {s.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-450 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {s.correctCount}/{s.totalCount} benar
                    </span>
                  </div>
                  {s.dominantMisconception && (
                    <div className="text-xs text-slate-500 font-sans flex items-start gap-1">
                      <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{getMisconceptionText(s.dominantMisconception)}</span>
                    </div>
                  )}
                </div>

                <span className={`px-3 py-1 rounded-full border text-xs font-sans font-black tracking-wide ${getStatusStyle(s.status)}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation Card */}
          {recommendation && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
              <div className="flex gap-3">
                <Compass className="text-indigo-600 shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="font-sans font-black text-indigo-900 text-sm md:text-base">
                    Rekomendasi Rute Belajar
                  </h4>
                  <p className="text-xs md:text-sm text-indigo-700 leading-relaxed font-sans">
                    Berdasarkan skormu, bagian <strong>{recommendation.title}</strong> adalah prioritas teratas yang perlu kita perkuat terlebih dahulu. Mulailah dari topik ini untuk membangun pemahaman yang utuh!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => navigate('/student/learning-map')}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Map size={14} />
                  <span>Buka Peta Belajar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Ulangi Diagnosis</span>
            </button>
            <button
              onClick={() => navigate('/student/learning-map')}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
            >
              Ke Peta Belajar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
