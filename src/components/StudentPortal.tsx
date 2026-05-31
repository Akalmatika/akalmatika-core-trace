import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Coins, 
  RotateCcw,
  BookOpen,
  Compass,
  Zap,
  Flame,
  ArrowUpRight,
  RefreshCw,
  MessageCircle,
  HelpCircle as QuestionIcon,
  ArrowDown,
  XCircle
} from "lucide-react";
import { triangulateAnswers, TriangulationResult } from "../engine/parser";
import { DIAGNOSTIC_CLUSTER, ENGINE_RULES } from "../engine/rules";
import CoinSandbox from "./CoinSandbox";
import InteractiveNumberLine from "./InteractiveNumberLine";
import AITutorChat from "./AITutorChat";

interface DrillQuestion {
  expression: string;
  a: number;
  b: number;
  op: '+' | '-';
  correctAnswer: number;
}

export default function StudentPortal() {
  const [activeSubTab, setActiveSubTab] = useState<"quest" | "drilling">("quest");
  const [currentStep, setCurrentStep] = useState<"welcome" | "quiz" | "result" | "remedial" | "sandbox">("welcome");
  
  // Quest States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(DIAGNOSTIC_CLUSTER.length).fill(""));
  const [inputError, setInputError] = useState<string>("");
  const [diagnosticResult, setDiagnosticResult] = useState<TriangulationResult | null>(null);
  const [failedEquation, setFailedEquation] = useState<{ expression: string; a: number; b: number; op: '+' | '-'; detectedMisconceptionCode?: string | null } | null>(null);
  const [currentExplorationEquation, setCurrentExplorationEquation] = useState<{ expression: string; a: number; b: number; op: '+' | '-'; detectedMisconceptionCode?: string | null } | null>(null);

  // Drilling Mode States
  const [drillQuestion, setDrillQuestion] = useState<DrillQuestion | null>(null);
  const [drillAnswer, setDrillAnswer] = useState<string>("");
  const [drillStreak, setDrillStreak] = useState<number>(0);
  const [drillBestStreak, setDrillBestStreak] = useState<number>(0);
  const [drillFeedback, setDrillFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [drillVisualizationActive, setDrillVisualizationActive] = useState<boolean>(false);
  const [drillError, setDrillError] = useState<string>("");

  // Visualization Panel selection
  const [visualizerMode, setVisualizerMode] = useState<"coins" | "numberline">("coins");

  const activeQuestion = DIAGNOSTIC_CLUSTER[currentQuestionIdx];

  // Initialize drilling question on tab mount
  useEffect(() => {
    if (activeSubTab === "drilling" && !drillQuestion) {
      generateNewDrillQuestion();
    }
  }, [activeSubTab]);

  // Generate dynamic signed integer questions for Drilling Mode
  const generateNewDrillQuestion = () => {
    try {
      let types = ["ADD-NEG", "SUB-NEG", "ADD-OPP", "SUB-OPP"];
      if (drillStreak < 2) {
        types = ["ADD-POS", "SUB-POS-EASY"];
      } else if (drillStreak >= 3) {
        types = ["ADD-NEG", "SUB-NEG", "SUB-NEG", "SUB-NEG", "ADD-OPP", "SUB-OPP"]; // SUB-NEG has higher probability
      }
      
      const type = types[Math.floor(Math.random() * types.length)];
      
      let a = 0;
      let b = 0;
      let expression = "";
      
      // Random values from -8 to 8 (avoiding 0 for clear signed conceptual tracking)
      const getRandomNonZero = () => {
        const val = Math.floor(Math.random() * 8) + 1;
        return Math.random() > 0.5 ? val : -val;
      };

      if (type === "ADD-POS") {
        a = Math.abs(getRandomNonZero());
        b = Math.abs(getRandomNonZero());
        expression = `${a} + ${b}`;
      } else if (type === "SUB-POS-EASY") {
        a = Math.abs(getRandomNonZero());
        b = Math.abs(getRandomNonZero());
        if (b > a) {
          const temp = a;
          a = b;
          b = temp;
        }
        expression = `${a} - ${b}`;
      } else if (type === "ADD-NEG") {
        a = -Math.abs(getRandomNonZero());
        b = -Math.abs(getRandomNonZero());
        expression = `${a} + (${b})`;
      } else if (type === "SUB-NEG") {
        a = getRandomNonZero();
        b = -Math.abs(getRandomNonZero());
        expression = `${a} - (${b})`;
      } else if (type === "ADD-OPP") {
        a = -Math.abs(getRandomNonZero());
        b = Math.abs(getRandomNonZero());
        expression = `${a} + ${b}`;
      } else {
        a = getRandomNonZero();
        b = Math.abs(getRandomNonZero());
        expression = `${a} - ${b}`;
      }

      // Compute correct answer securely
      let correctAnswer = 0;
      let op: '+' | '-' = '+';
      if (expression.includes(" + ")) {
        correctAnswer = a + b;
        op = '+';
      } else {
        correctAnswer = a - b;
        op = '-';
      }

      setDrillQuestion({ expression, a, b, op, correctAnswer });
      setDrillAnswer("");
      setDrillFeedback(null);
      setDrillVisualizationActive(false);
      setDrillError("");
    } catch (err) {
      setDrillError("Gagal merangkai soal latihan baru.");
    }
  };

  const handleStartQuiz = () => {
    setAnswers(Array(DIAGNOSTIC_CLUSTER.length).fill(""));
    setCurrentQuestionIdx(0);
    setInputError("");
    setCurrentStep("quiz");
  };

  const handleProceedToDrill = () => {
    setActiveSubTab("drilling");
    setCurrentStep("welcome");
  };

  const handleNextQuestion = () => {
    const currentVal = answers[currentQuestionIdx].trim();
    if (!currentVal) {
      setInputError("Harap isi jawabanmu terlebih dahulu ya!");
      return;
    }
    if (isNaN(Number(currentVal))) {
      setInputError("Jawaban harus berupa angka bulat (contoh: 2 atau -5)!");
      return;
    }
    
    setInputError("");
    if (currentQuestionIdx < DIAGNOSTIC_CLUSTER.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      const parsedAns = answers.map(ans => Number(ans));
      const result = triangulateAnswers(parsedAns);
      setDiagnosticResult(result);
      
      if (result.isPerfectTrack) {
        setCurrentStep("result");
      } else {
        const incorrectIndices = parsedAns
          .map((ans, idx) => ans !== DIAGNOSTIC_CLUSTER[idx].correctAnswer ? idx : -1)
          .filter(idx => idx !== -1);
        
        const failedIdx = incorrectIndices.length > 0 ? incorrectIndices[0] : 0;
        const failedEq = DIAGNOSTIC_CLUSTER[failedIdx];

        const equationData = {
          expression: failedEq.expression,
          a: failedEq.a,
          b: failedEq.b,
          op: failedEq.op,
          detectedMisconceptionCode: result.detectedMisconceptionCode
        };

        setFailedEquation(equationData);
        setCurrentStep("result");
      }
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

  // Submit Drilling Answer
  const handleDrillSubmit = () => {
    if (!drillQuestion) return;
    const ansTrim = drillAnswer.trim();
    if (!ansTrim) {
      setDrillError("Harap masukkan jawaban terlebih dahulu!");
      return;
    }
    if (isNaN(Number(ansTrim))) {
      setDrillError("Jawaban harus berupa bilangan bulat!");
      return;
    }

    setDrillError("");
    const submittedVal = Number(ansTrim);
    const isCorrect = submittedVal === drillQuestion.correctAnswer;

    if (isCorrect) {
      const nextStreak = drillStreak + 1;
      setDrillStreak(nextStreak);
      if (nextStreak > drillBestStreak) {
        setDrillBestStreak(nextStreak);
      }
      setDrillFeedback({
        isCorrect: true,
        message: `Luar biasa hebat! Jawaban ${submittedVal} benar-benar tepat! 🔥`
      });
    } else {
      setDrillStreak(0);
      
      // Detect Misconception for Drill Mode
      let detectedCode = "DRILL-MISTAKE";
      for (const rule of ENGINE_RULES) {
        const predicted = rule.predictAnswers([{
          expression: drillQuestion.expression,
          a: drillQuestion.a,
          b: drillQuestion.b,
          op: drillQuestion.op,
          correctAnswer: drillQuestion.correctAnswer
        }]);
        if (predicted[0] !== null && predicted[0] === submittedVal) {
          detectedCode = rule.code;
          break;
        }
      }

      // Save to localStorage for Teacher Dashboard
      if (detectedCode !== "DRILL-MISTAKE") {
        const stored = localStorage.getItem('akalmatika_misconceptions') || '[]';
        try {
          const arr = JSON.parse(stored);
          arr.push(detectedCode);
          localStorage.setItem('akalmatika_misconceptions', JSON.stringify(arr));
        } catch(e) {}
      }

      let feedbackText = `Sepertinya ada sedikit keliru dalam perhitunganmu. Mari peragakan dengan elemen di bawah!`;
      if (detectedCode === "MC-ADD-SIGN-CONF") {
        feedbackText = "Perhatikan tanda negatif! Es dan Api akan saling menetralkan, bukan sekadar dijumlahkan nominalnya.";
      } else if (detectedCode === "MC-SUB-NEG-ADD") {
        feedbackText = "Awas! Mengurangkan bilangan negatif itu seperti menghapus utang, yang artinya justru membuat nilai naik. Mari buktikan!";
      } else if (detectedCode === "MC-SIGN-FIRST-NUM") {
        feedbackText = "Tanda hasil akhir ditentukan oleh elemen mana (positif/negatif) yang paling banyak sisanya, bukan selalu ikut bilangan pertama.";
      } else if (detectedCode !== "DRILL-MISTAKE") {
        feedbackText = "Miskonsepsi terdeteksi! Jawabanmu menunjukkan pola kesalahan konsep. Mari lihat pembuktian visualnya!";
      }

      setDrillFeedback({
        isCorrect: false,
        message: feedbackText
      });
      // Automatically trigger visualizer guidance
      setDrillVisualizationActive(true);
    }
  };

  const getIndonesianScaffold = (code: string | null) => {
    switch (code) {
      case "MC-ADD-SIGN-CONF":
        return "Kamu merasa bahwa jika utang (-) bertemu dengan uang tunai (+), utangmu justru bertambah banyak? Ingat, jika kamu punya utang 2 elemen negatif, lalu dibayar dengan 3 elemen positif, utangmu terbayar lunas dan kamu masih punya sisa 1 elemen positif! Mari kita coba buktikan secara visual menggunakan elemen di bawah.";
      case "MC-SIGN-FIRST-NUM":
        return "Apakah kamu bingung menentukan tanda minus atau plus hasil akhir? Tips sederhana: manakah yang jumlahnya lebih banyak, utangmu (Api) atau uangmu (Es)? Karena uang tunaimu lebih banyak, hasil akhirnya pasti positif! Coba buktikan dengan menyeimbangkan elemen.";
      case "MC-ADD-ABS-SUM":
        return "Tanda minus (-) dan plus (+) di depan angka memiliki peran yang sangat penting, bukan hiasan. Minus melambangkan utang (Api (merah)) dan plus melambangkan uang (Es (biru)). Mari kita kelompokkan dan netralkan elemennya agar kamu bisa melihat hasilnya secara nyata.";
      case "MC-SUB-IGNORE-NEG":
        return "Saat mengurangkan bilangan negatif, bayangkan seseorang mencoret utangmu. Jika utang dihapus, posisimu di garis bilangan justru maju ke arah positif!";
      default:
        return "Ada sedikit kekeliruan dalam perhitunganmu. Jangan khawatir, itu hal yang wajar! Mari kita gunakan papan manipulatif zero-pair di bawah ini untuk melihat bagaimana bilangan negatif dan positif saling menetralkan.";
    }
  };

  const getMisconceptionTitle = (code: string | null) => {
    switch (code) {
      case "MC-ADD-SIGN-CONF":
        return "Tantangan Konsep: Akumulasi Utang";
      case "MC-SIGN-FIRST-NUM":
        return "Tantangan Konsep: Penentuan Tanda Akhir";
      case "MC-ADD-ABS-SUM":
        return "Tantangan Konsep: Mengabaikan Lambang Bilangan";
      case "MC-SUB-IGNORE-NEG":
        return "Tantangan Konsep: Pengurangan Bilangan Negatif";
      default:
        return "Latihan Pemahaman Konsep";
    }
  };

  return (
    <div id="student-portal-root" className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tab Switcher: Quest vs Drilling */}
      {currentStep !== "quiz" && currentStep !== "remedial" && (
        <div className="flex flex-col sm:flex-row bg-slate-200/60 p-1 rounded-xl w-full sm:w-fit gap-1 select-none">
          <button
            id="btn-subtab-quest"
            onClick={() => setActiveSubTab("quest")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "quest" 
                ? "bg-white text-indigo-700 shadow-2xs" 
                : "text-slate-650 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Compass size={14} />
            <span>Misi Utama (Diagnostik)</span>
          </button>
          <button
            id="btn-subtab-drilling"
            onClick={() => {
              setActiveSubTab("drilling");
              setCurrentStep("welcome"); // resets quest if drilling selected
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "drilling" 
                ? "bg-white text-indigo-700 shadow-2xs" 
                : "text-slate-650 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Zap size={14} className="fill-amber-500 text-amber-500 animate-pulse" />
            <span>Latihan Mandiri (Drilling Mode)</span>
          </button>
        </div>
      )}

      {activeSubTab === "quest" ? (
        // A. QUEST DIAGNOSTIC WORKFLOW RENDER
        <div id="student-quest-view" className="space-y-6">
          
          {currentStep === "welcome" && (
            <div id="student-welcome-card" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xs text-center space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-slate-900">
                  Petualangan Detektif Matematika
                </h2>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
                  Selamat datang, Detektif! Mari uji ketajaman analisismu dalam memecahkan misi bilangan bulat negatif dan positif. Siap untuk petualangan ini?
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 text-left max-w-sm mx-auto space-y-2 text-xs text-slate-500">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 font-mono uppercase tracking-wider text-[10px]">
                  <BookOpen size={12} className="text-indigo-500" /> Aturan Misi:
                </div>
                <p>1. Kamu akan diberikan 3 soal matematika sederhana.</p>
                <p>2. Jawablah sesuai pemahamanmu sendiri (jangan takut salah!).</p>
                <p>3. Jika ada konsep yang membingungkan, asisten AI Akalmatika siap membantumu.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="btn-start-quest"
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md cursor-pointer animate-bounce"
                >
                  <Compass size={16} />
                  <span>Mulai Tes Diagnosis</span>
                </button>
                <button
                  id="btn-start-sandbox"
                  onClick={() => setCurrentStep("sandbox")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 active:translate-y-0.5 font-sans font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Flame size={16} className="text-rose-500" />
                  <span>Visualisasi Bebas</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === "quiz" && (
            <div id="student-quiz-card" className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                  Soal {currentQuestionIdx + 1} dari {DIAGNOSTIC_CLUSTER.length}
                </span>
                <div className="flex gap-1">
                  {DIAGNOSTIC_CLUSTER.map((_, idx) => (
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

              {/* Correctly aligned gradient display box */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-8 rounded-2xl text-center border border-indigo-950 relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
                <span className="text-[10px] tracking-widest font-mono text-indigo-400 uppercase font-bold block mb-1">Misi Kognitif</span>
                <h3 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-white select-none">
                  {activeQuestion.expression}
                </h3>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Berapakah hasil akhir perhitungan di atas?
                </label>
                <div className="relative">
                  <input
                    id="student-answer-input"
                    type="text"
                    value={answers[currentQuestionIdx]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Ketik jawabanmu di sini..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 rounded-2xl px-4 py-3.5 text-base font-mono font-bold text-slate-800 transition-all shadow-2xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNextQuestion();
                    }}
                  />
                </div>
                {inputError && (
                  <div className="flex items-center gap-1.5 text-rose-650 text-xs font-semibold animate-fadeIn">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{inputError}</span>
                  </div>
                )}
              </div>

              <button
                id="btn-quiz-next"
                onClick={handleNextQuestion}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-600 active:translate-y-0.5 text-white font-sans font-bold px-5 py-3.5 rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>{currentQuestionIdx === DIAGNOSTIC_CLUSTER.length - 1 ? "Kirim Hasil Analisis" : "Soal Berikutnya"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {currentStep === "result" && diagnosticResult && (
            <div id="student-result-card" className="bg-white p-8 rounded-3xl border border-slate-105 shadow-sm max-w-2xl mx-auto space-y-6 animate-fadeIn">
              
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
                      Semua jawabanmu 100% benar! Kamu memiliki pemahaman konsep bilangan negatif yang sangat solid dan luar biasa hebat. Pertahankan prestasimu ya!
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 max-w-xs mx-auto text-xs text-slate-650 font-mono space-y-1">
                    <span className="font-bold text-emerald-700">AKURASI DETEKSI: {DIAGNOSTIC_CLUSTER.length}/{DIAGNOSTIC_CLUSTER.length} BENAR</span>
                    <p className="text-slate-500">Konsep teruji: Penjumlahan & Pengurangan Bilangan Bulat.</p>
                  </div>

                  <button
                    id="btn-restart-success"
                    onClick={handleStartQuiz}
                    className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Coba Lagi</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Result Title */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl">
                      <Coins size={22} className="animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="font-sans font-black text-slate-900 text-lg md:text-xl">
                        {getMisconceptionTitle(diagnosticResult.detectedMisconceptionCode)}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        ASISTEN KOGNITIF AKALMATIKA
                      </span>
                    </div>
                  </div>

                  {/* Standard details */}
                  <div className="space-y-3 font-sans text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800">Hi Detektif, ada pola menarik yang asisten temukan pada analisismu:</p>
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-650 leading-relaxed font-sans italic">
                      "{getIndonesianScaffold(diagnosticResult.detectedMisconceptionCode)}"
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 gap-3 border-t border-slate-100">
                    <button
                      id="btn-quiz-retry"
                      onClick={handleStartQuiz}
                      className="inline-flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Ulangi Misi</span>
                    </button>
                    <button
                      id="btn-start-remedial"
                      onClick={() => setCurrentStep("remedial")}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <span>Buka Media Visualisasi</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {currentStep === "sandbox" && (
            <div id="student-free-sandbox-card" className="space-y-6 animate-fadeIn">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    🎮 MODE VISUALISASI BEBAS
                  </span>
                  <h4 className="font-sans font-black text-slate-900 text-sm md:text-base mt-1.5">
                    Eksplorasi Konsep Bilangan Bulat
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                    Di mode ini kamu bisa bereksperimen menggunakan elemen (es/api) dan garis bilangan secara bebas tanpa batasan misi.
                  </p>
                </div>
                
                <button
                  onClick={() => setCurrentStep("welcome")}
                  className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-xs transition-all cursor-pointer font-sans shadow-2xs"
                >
                  Kembali ke Menu Utama
                </button>
              </div>

              {/* Visualizer Mode Toggle Tabs */}
              <div className="flex flex-col md:flex-row border-b border-slate-200 w-full gap-2 md:gap-4 overflow-x-auto max-w-full">
                <button
                  onClick={() => setVisualizerMode("coins")}
                  className={`py-3 font-sans text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    visualizerMode === "coins"
                      ? "border-emerald-600 text-emerald-700 font-black"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Coins size={16} />
                  <span>Visualisasi 1: Elemen (Zero-Pair)</span>
                </button>
                <button
                  onClick={() => setVisualizerMode("numberline")}
                  className={`py-3 font-sans text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    visualizerMode === "numberline"
                      ? "border-emerald-600 text-emerald-700 font-black"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Visualisasi 2: Garis Bilangan Vektor</span>
                </button>
              </div>

              {/* Render Selected Visualization Portal Component */}
              <div className="transition-all duration-300">
                {visualizerMode === "coins" ? (
                  <CoinSandbox 
                    studentMode={true} 
                    onProceedToDrill={handleProceedToDrill}
                    onEquationChange={setCurrentExplorationEquation}
                  />
                ) : (
                  <InteractiveNumberLine 
                    initialEquation={{ expression: "0 + 0", a: 0, b: 0, op: '+' }}
                  />
                )}
              </div>
            </div>
          )}

          {currentStep === "remedial" && failedEquation && (
            <div id="student-remedial-card" className="space-y-6 animate-fadeIn">
              
              {/* Top intervention explainer */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    🎯 LATIHAN DETEKTIF KONSEPTUAL
                  </span>
                  <h4 className="font-sans font-black text-slate-900 text-sm md:text-base mt-1.5">
                    Mari Visualisasikan Operasi: <code className="bg-white px-2 py-0.5 rounded border border-amber-200 font-mono font-black text-amber-800">{failedEquation.expression}</code>
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                    {getIndonesianScaffold(failedEquation.detectedMisconceptionCode)}
                  </p>
                </div>
                
                <button
                  id="btn-quit-student-remedial"
                  onClick={() => {
                    setCurrentStep("welcome");
                    setFailedEquation(null);
                    setDiagnosticResult(null);
                  }}
                  className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-xs transition-all cursor-pointer font-sans shadow-2xs"
                >
                  Kembali ke Menu Utama
                </button>
              </div>

              {/* Visualizer Mode Toggle Tabs */}
              <div className="flex flex-col md:flex-row border-b border-slate-200 w-full gap-2 md:gap-4 overflow-x-auto max-w-full">
                <button
                  id="btn-viz-coins"
                  onClick={() => setVisualizerMode("coins")}
                  className={`py-3 font-sans text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    visualizerMode === "coins"
                      ? "border-indigo-600 text-indigo-700 font-black"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Coins size={16} />
                  <span>Visualisasi 1: Elemen Es & Api (Zero-Pair)</span>
                </button>
                <button
                  id="btn-viz-numberline"
                  onClick={() => setVisualizerMode("numberline")}
                  className={`py-3 font-sans text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    visualizerMode === "numberline"
                      ? "border-indigo-600 text-indigo-700 font-black"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Visualisasi 2: Papan Garis Bilangan Vektor</span>
                </button>
              </div>

              {/* Render Selected Visualization Portal Component */}
              <div className="transition-all duration-300">
                {visualizerMode === "coins" ? (
                  <CoinSandbox 
                    studentMode={true}
                    initialEquation={failedEquation} 
                    onBackToDiagnostic={() => setCurrentStep("result")} 
                    onProceedToDrill={handleProceedToDrill}
                    onEquationChange={setCurrentExplorationEquation}
                  />
                ) : (
                  <InteractiveNumberLine 
                    initialEquation={failedEquation} 
                    onProceedToDrill={handleProceedToDrill}
                  />
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        <div id="student-drilling-view" className="space-y-8">
          
          {/* Top Section: Scoring, Streak and Drill Question Box */}
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
              
              {/* THE BIG CURTAIN: Hides the stats and the entire question card */}
              <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden flex flex-col gap-6 ${drillVisualizationActive ? 'max-h-0 opacity-0 scale-y-95 m-0' : 'max-h-[5000px] opacity-100 scale-y-100'}`}>

              {/* Dynamic Drill Stats Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-3xs font-mono font-bold text-slate-400 block uppercase">SKOR BERUNTUN SEKARANG</span>
                  <div className="flex items-center gap-2">
                    <Flame size={24} className="text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="font-mono text-2xl font-black text-slate-900">{drillStreak} Soal</span>
                  </div>
                </div>
                <div className="text-right space-y-1 border-l border-slate-100 pl-5">
                  <span className="text-3xs font-mono font-bold text-slate-400 block uppercase">STREAK TERBAIK</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Trophy size={18} className="text-amber-500" />
                    <span className="font-mono text-xl font-bold text-slate-850">{drillBestStreak}</span>
                  </div>
                </div>
              </div>

              {/* Drill Question Card Container */}
              {drillQuestion && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-3xs font-mono bg-amber-50 text-amber-700 border border-amber-150 font-bold uppercase">
                      <Zap size={11} className="fill-amber-500 text-amber-500" /> Mode Latihan Drilling
                    </div>
                    <span className="text-3xs text-slate-450 font-mono">100% ACAK</span>
                  </div>

                  {/* Drilling Question Gradient Display */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-7 rounded-2xl text-center border border-indigo-950/20 relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
                    <span className="text-3xs tracking-wider font-mono text-indigo-400 uppercase font-bold block mb-1">Misi Mandiri</span>
                    <h3 className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-white select-none">
                      {drillQuestion.expression}
                    </h3>
                  </div>

                    {/* Answer Input */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Masukkan jawabanmu di bawah:
                    </label>
                    <input
                      id="drill-answer-input"
                      type="text"
                      value={drillAnswer}
                      onChange={(e) => {
                        setDrillAnswer(e.target.value);
                        setDrillError("");
                      }}
                      placeholder="Contoh: -5, 3, atau 0"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-800 transition-all shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleDrillSubmit();
                      }}
                      disabled={drillFeedback?.isCorrect === true}
                      autoComplete="off"
                    />
                    {drillError && (
                      <div className="flex items-center gap-1 text-rose-650 text-xs font-semibold animate-fadeIn">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{drillError}</span>
                      </div>
                    )}
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex gap-2 pt-2">
                    {drillFeedback?.isCorrect ? (
                      <button
                        id="btn-drill-next-quest"
                        onClick={generateNewDrillQuestion}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white font-sans font-bold px-4 py-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                      >
                        <span>Soal Berikutnya</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <>
                        <button
                          id="btn-drill-submit"
                          onClick={handleDrillSubmit}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-600 active:translate-y-0.5 text-white font-sans font-bold px-4 py-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer font-sans"
                        >
                          <span>Kirim Jawaban</span>
                          <ArrowUpRight size={14} />
                        </button>
                        <button
                          id="btn-drill-skip"
                          onClick={generateNewDrillQuestion}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-500 px-4 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                          title="Lewati Soal"
                        >
                          Lewati
                        </button>
                      </>
                    )}
                  </div>

                  {/* Drill feedback messages */}
                  {drillFeedback && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                      drillFeedback.isCorrect
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}>
                      <div className="flex items-start gap-2">
                        {drillFeedback.isCorrect ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <p>{drillFeedback.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Toggle Visualization Button (Inside Drill Area) */}
                  {!drillVisualizationActive && (
                    <button 
                      onClick={() => setDrillVisualizationActive(true)}
                      className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-sans font-bold px-4 py-4 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex justify-center items-center gap-2"
                    >
                      <BookOpen size={18} />
                      Butuh Bantuan? Buka Visualisasi
                    </button>
                  )}
                  
                </div>
              )}

              </div> {/* End of BIG Curtain */}

              {/* Tutup Visualisasi Button (Visible when curtain is closed) */}
              {drillVisualizationActive && (
                <button 
                  onClick={() => {
                    setDrillVisualizationActive(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-black px-4 py-4 rounded-2xl text-sm transition-all shadow-md cursor-pointer flex justify-center items-center gap-2"
                >
                  <XCircle size={18} />
                  Tutup Papan Visualisasi & Lanjut Menjawab
                </button>
              )}

            </div>

            {/* Bottom Section: Visualizer Remedial & AI Advice on mistake */}
            <div className={`transition-all duration-700 ease-in-out origin-top overflow-hidden w-full max-w-5xl mx-auto ${drillVisualizationActive ? 'max-h-[5000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}>
              
              {drillQuestion && (
                <div id="drill-remedial-visual-canvas" className="space-y-6">
                
                {/* Adaptive Gemini AI Helper Box on Drill Mistake */}


                  {/* Drilling Visualizer Select Tabs */}
                  <div className="flex flex-col md:flex-row border-b border-slate-200 w-full gap-2 md:gap-4">
                    <button
                      id="btn-drill-viz-coins"
                      onClick={() => setVisualizerMode("coins")}
                      className={`py-3 font-sans text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        visualizerMode === "coins"
                          ? "border-indigo-600 text-indigo-700 font-black"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Coins size={14} />
                      <span>Visualisasi Elemen Es & Api (Zero-Pair)</span>
                    </button>
                    <button
                      id="btn-drill-viz-numberline"
                      onClick={() => setVisualizerMode("numberline")}
                      className={`py-3 font-sans text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        visualizerMode === "numberline"
                          ? "border-indigo-600 text-indigo-700 font-black"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <BookOpen size={14} />
                      <span>Garis Bilangan Vektor SVG</span>
                    </button>
                  </div>

                  <div className="transition-all duration-300">
                    {visualizerMode === "coins" ? (
                      <CoinSandbox 
                        studentMode={true}
                        initialEquation={{
                          expression: drillQuestion.expression,
                          a: drillQuestion.a,
                          b: drillQuestion.b,
                          op: drillQuestion.op
                        }}
                        onProceedToDrill={() => {
                          setDrillVisualizationActive(false);
                          setDrillAnswer("");
                        }}
                        onEquationChange={setCurrentExplorationEquation}
                      />
                    ) : (
                      <InteractiveNumberLine 
                        initialEquation={{
                          expression: drillQuestion.expression,
                          a: drillQuestion.a,
                          b: drillQuestion.b,
                          op: drillQuestion.op
                        }}
                        onNextQuestion={generateNewDrillQuestion}
                        onProceedToDrill={() => {
                          setDrillVisualizationActive(false);
                          setDrillAnswer("");
                        }}
                      />
                    )}
                  </div>

                </div>
              )}

            </div>
        </div>
      )}

      {/* Render AI Tutor Chat dynamically if in a remedial context */}
      {currentStep === "result" && failedEquation && (
        <AITutorChat 
          expression={failedEquation.expression}
          studentAns={diagnosticResult?.submittedAnswers[DIAGNOSTIC_CLUSTER.findIndex(q => q.expression === failedEquation.expression)] || 0}
          correctAns={failedEquation.op === '-' ? failedEquation.a - failedEquation.b : failedEquation.a + failedEquation.b}
          bugCode={failedEquation.detectedMisconceptionCode || null}
        />
      )}
      {(currentStep === "remedial" || currentStep === "sandbox") && (currentExplorationEquation || failedEquation) && (
        <AITutorChat 
          expression={currentExplorationEquation?.expression || failedEquation?.expression || ""}
          studentAns={0}
          correctAns={currentExplorationEquation 
            ? (currentExplorationEquation.op === '-' ? currentExplorationEquation.a - currentExplorationEquation.b : currentExplorationEquation.a + currentExplorationEquation.b)
            : (failedEquation?.op === '-' ? failedEquation.a - failedEquation.b : (failedEquation?.a || 0) + (failedEquation?.b || 0))}
          bugCode={currentExplorationEquation?.detectedMisconceptionCode || failedEquation?.detectedMisconceptionCode || null}
        />
      )}
      {activeSubTab === "drilling" && drillVisualizationActive && (currentExplorationEquation || drillQuestion) && (
        <AITutorChat 
          expression={currentExplorationEquation?.expression || drillQuestion?.expression || ""}
          studentAns={Number(drillAnswer) || 0}
          correctAns={currentExplorationEquation
            ? (currentExplorationEquation.op === '-' ? currentExplorationEquation.a - currentExplorationEquation.b : currentExplorationEquation.a + currentExplorationEquation.b)
            : (drillQuestion?.correctAnswer || 0)}
          bugCode={drillFeedback?.isCorrect === false ? "DRILL-MISTAKE" : null}
          onClose={() => setDrillVisualizationActive(false)}
        />
      )}

    </div>
  );
}
