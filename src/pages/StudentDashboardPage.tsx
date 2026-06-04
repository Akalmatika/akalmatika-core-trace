// src/pages/StudentDashboardPage.tsx

import { Link } from "react-router-dom";
import { 
  Trophy, 
  Map, 
  Play, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles
} from "lucide-react";
import { progressStorage, TopicProgress } from "../services/progressStorage";
import { learningMapNodes } from "../data/learningMap";

const MVP_TOPICS = ["integer", "fractions", "percent", "algebra", "plsv"];

const TOPIC_TITLES: Record<string, string> = {
  integer: "Bilangan Bulat",
  fractions: "Pecahan",
  percent: "Persen",
  algebra: "Aljabar Dasar",
  plsv: "Persamaan Linear (PLSV)"
};

interface ActivityItem {
  id: string;
  type: "diagnostic" | "bridge" | "drill" | "mastery";
  topicId: string;
  topicTitle: string;
  date: string;
  detail: string;
  route: string;
}

export default function StudentDashboardPage() {
  // Read all progress from progressStorage
  const allProgress = progressStorage.getAllProgress();
  const mvpProgress = allProgress.filter(p => MVP_TOPICS.includes(p.topicId));

  // Determine if there is any data at all
  const hasNoData = mvpProgress.every(
    p => p.diagnosticResults.length === 0 && 
         p.bridgeVisits.length === 0 && 
         p.drillProgress === null && 
         p.masteryResults.length === 0
  );

  // 1. Calculate Mastered Topics
  const masteredTopics = MVP_TOPICS.filter(id => progressStorage.isTopicMastered(id));
  const masteredCount = masteredTopics.length;
  const progressPercentage = Math.round((masteredCount / MVP_TOPICS.length) * 100);

  // Overall status text
  let overallStatus = "Baru mulai";
  if (masteredCount >= 1 && masteredCount <= 2) {
    overallStatus = "Sedang membangun fondasi";
  } else if (masteredCount >= 3 && masteredCount <= 4) {
    overallStatus = "Hampir selesai";
  } else if (masteredCount === 5) {
    overallStatus = "Rantai MVP selesai";
  }

  // 2. Next Step Recommendation Logic
  let recommendation = {
    title: "",
    topicName: "",
    reason: "",
    btnText: "",
    route: ""
  };

  const getMisconceptionName = (code: string | null): string => {
    if (!code) return "Pola pemahaman";
    switch (code) {
      case "MC-ADD-SIGN-CONF":
        return "Bingung Tanda Operasi";
      case "MC-FRAC-ADD-NUM-DENOM":
        return "Jumlah Pembilang & Penyebut";
      case "MC-PERC-NO-100":
        return "Persen Bukan Per Seratus";
      case "MC-ALG-ADD-UNLIKE":
        return "Jumlah Suku Tidak Sejenis";
      case "MC-PLSV-INV-OP-CONFUSION":
        return "Bingung Operasi Invers/Setara";
      default:
        return "Pola yang Perlu Diperkuat";
    }
  };

  if (hasNoData) {
    recommendation = {
      title: "Rekomendasi Langkah Berikutnya",
      topicName: "Diagnosis Fondasi",
      reason: "Mulai perjalanan belajarmu dengan mengukur pemahaman fondasi awal matematika.",
      btnText: "Mulai Diagnosis Fondasi",
      route: "/student/diagnostic-foundation"
    };
  } else {
    // Find first unlocked, unmastered topic in order
    const nextTopicId = MVP_TOPICS.find(
      id => progressStorage.isTopicUnlocked(id) && !progressStorage.isTopicMastered(id)
    );

    if (!nextTopicId) {
      recommendation = {
        title: "Selamat! Perjalanan Selesai 🎉",
        topicName: "Semua Topik Selesai",
        reason: "Rantai fondasi pertama sudah selesai. Kamu siap masuk materi berikutnya.",
        btnText: "Buka Peta Belajar",
        route: "/student/learning-map"
      };
    } else {
      const topicProgress = progressStorage.getTopicProgress(nextTopicId);
      const topicTitle = TOPIC_TITLES[nextTopicId] || nextTopicId;
      const masteryLevel = topicProgress.masteryLevel;

      if (masteryLevel === "not-started" || topicProgress.diagnosticResults.length === 0) {
        recommendation = {
          title: "Diagnosis Topik Baru",
          topicName: topicTitle,
          reason: `Kamu sudah membuka topik ${topicTitle}. Ambil diagnosis singkat untuk memetakan pemahamanmu.`,
          btnText: "Mulai Diagnosis",
          route: `/student/diagnostic/${nextTopicId}`
        };
      } else if (masteryLevel === "diagnosed" || masteryLevel === "bridging") {
        const latestDiag = progressStorage.getLatestDiagnostic(nextTopicId);
        const mcCode = latestDiag?.detectedMisconceptionCode;

        if (mcCode) {
          recommendation = {
            title: "Buka Jembatan Konsep",
            topicName: topicTitle,
            reason: `Diagnosis mendeteksi pola pemahaman yang perlu diperkuat (${getMisconceptionName(mcCode)}). Pelajari konsep lewat visualisasi sebelum latihan.`,
            btnText: "Buka Jembatan Konsep",
            route: `/student/bridge/${nextTopicId}/${mcCode}`
          };
        } else {
          recommendation = {
            title: "Mulai Latihan Mandiri",
            topicName: topicTitle,
            reason: `Pemahaman dasarmu siap dilatih. Buka latihan mandiri bertahap (Drill) sekarang.`,
            btnText: "Mulai Latihan (Drill)",
            route: `/student/drill/${nextTopicId}`
          };
        }
      } else if (masteryLevel === "drilling") {
        recommendation = {
          title: "Uji Penguasaan Konsep",
          topicName: topicTitle,
          reason: `Kamu sudah menyelesaikan latihan mandiri bertahap. Uji penguasaan konsepmu untuk lulus dari topik ini.`,
          btnText: "Mulai Mastery Check",
          route: `/student/mastery/${nextTopicId}`
        };
      }
    }
  }

  // 3. Collect and Sort Activities
  const activities: ActivityItem[] = [];
  mvpProgress.forEach(p => {
    const topicTitle = TOPIC_TITLES[p.topicId] || p.topicId;

    // Diagnosis activities
    p.diagnosticResults.forEach((r, idx) => {
      activities.push({
        id: `diag-${p.topicId}-${idx}`,
        type: "diagnostic",
        topicId: p.topicId,
        topicTitle,
        date: r.date,
        detail: r.isPerfectTrack 
          ? "Selesai diagnosis dengan pemahaman kuat." 
          : `Diagnosis mendeteksi: ${getMisconceptionName(r.detectedMisconceptionCode)}.`,
        route: `/student/diagnostic/${p.topicId}`
      });
    });

    // Bridge visits
    p.bridgeVisits.forEach((v, idx) => {
      activities.push({
        id: `bridge-${p.topicId}-${idx}`,
        type: "bridge",
        topicId: p.topicId,
        topicTitle,
        date: v.visitedDate,
        detail: v.visualizationOpened 
          ? "Membuka media visualisasi jembatan konsep." 
          : "Mengunjungi jembatan konsep.",
        route: `/student/bridge/${p.topicId}/${v.misconceptionCode}`
      });
    });

    // Drill progress
    if (p.drillProgress) {
      activities.push({
        id: `drill-${p.topicId}`,
        type: "drill",
        topicId: p.topicId,
        topicTitle,
        date: p.drillProgress.lastAttemptDate,
        detail: `Berlatih hingga Latihan Fase ${p.drillProgress.currentPhase} (Akurasi: ${p.drillProgress.phase3Accuracy || p.drillProgress.phase2Accuracy || 0}%).`,
        route: `/student/drill/${p.topicId}`
      });
    }

    // Mastery results
    p.masteryResults.forEach((r, idx) => {
      activities.push({
        id: `mastery-${p.topicId}-${idx}`,
        type: "mastery",
        topicId: p.topicId,
        topicTitle,
        date: r.attemptDate,
        detail: r.passed 
          ? `Lulus Ujian Penguasaan dengan skor ${r.score}%.` 
          : `Ujian Penguasaan selesai dengan skor ${r.score}% (perlu diperkuat).`,
        route: `/student/mastery/${p.topicId}`
      });
    });
  });

  // Sort activities by date descending
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="pt-20 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Header Section */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight flex items-center gap-2">
            <Trophy className="text-indigo-600" size={28} /> Dashboard Belajar
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-lg leading-relaxed">
            Lihat perjalananmu memahami matematika, dari fondasi sampai penguasaan.
          </p>
        </div>
        
        <Link
          to="/student/learning-map"
          className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer self-start md:self-center"
        >
          <Map size={16} />
          <span>Buka Peta Belajar</span>
        </Link>
      </div>

      {hasNoData ? (
        /* Empty State */
        <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 text-lg md:text-xl">
              Mulai Petualangan Matematikamu!
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Belum ada aktivitas. Ukur pemahaman matematika dasarmu terlebih dahulu melalui Diagnosis Fondasi.
            </p>
          </div>
          <Link
            to="/student/diagnostic-foundation"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
          >
            <Play size={16} className="fill-current" />
            Mulai Diagnosis Fondasi
          </Link>
        </div>
      ) : (
        /* Dashboard Content Active State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Progress Ringkasan */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Kemajuan Rantai Belajar
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  {masteredCount} / 5 Topik Dikuasai
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-black text-slate-800">
                    {overallStatus}
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-500">
                    {progressPercentage}%
                  </span>
                </div>
                
                {/* Progress bar container */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-150">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Rekomendasi Langkah Berikutnya */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-850 space-y-4 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 bg-indigo-800 border border-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={11} className="text-amber-400" />
                {recommendation.title}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">
                  {recommendation.topicName}
                </h3>
                <p className="text-xs md:text-sm text-indigo-200 leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={recommendation.route}
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-950 font-bold px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:bg-slate-50 text-xs md:text-sm"
                >
                  <span>{recommendation.btnText}</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* 4. Status Topik List */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase font-bold tracking-wider text-slate-400">
                Peta Kompetensi Topik
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MVP_TOPICS.map(topicId => {
                  const title = TOPIC_TITLES[topicId] || topicId;
                  const isMastered = progressStorage.isTopicMastered(topicId);
                  const isUnlocked = progressStorage.isTopicUnlocked(topicId);
                  const progress = progressStorage.getTopicProgress(topicId);
                  const latestDiag = progressStorage.getLatestDiagnostic(topicId);

                  let statusBadge = "Locked";
                  let badgeClass = "bg-slate-100 text-slate-500 border-slate-200";
                  let ctaText = "Mulai";
                  let ctaRoute = `/student/diagnostic/${topicId}`;
                  
                  if (isMastered) {
                    statusBadge = "Selesai ✓";
                    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    ctaText = "Review";
                    ctaRoute = `/student/learning-map`;
                  } else if (isUnlocked) {
                    if (progress.masteryLevel === "drilling") {
                      statusBadge = "Berlatih ⏳";
                      badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-150";
                      ctaText = "Lanjutkan";
                      ctaRoute = `/student/mastery/${topicId}`;
                    } else if (progress.masteryLevel === "diagnosed" || progress.masteryLevel === "bridging") {
                      statusBadge = "Diagnosed";
                      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                      ctaText = "Lanjutkan";
                      
                      const mcCode = latestDiag?.detectedMisconceptionCode;
                      ctaRoute = mcCode 
                        ? `/student/bridge/${topicId}/${mcCode}`
                        : `/student/drill/${topicId}`;
                    } else {
                      statusBadge = "Terbuka 🎯";
                      badgeClass = "bg-blue-50 text-blue-700 border-blue-150";
                      ctaText = "Mulai";
                      ctaRoute = `/student/diagnostic/${topicId}`;
                    }
                  } else {
                    statusBadge = "Terkunci 🔒";
                    badgeClass = "bg-slate-100 text-slate-400 border-slate-150";
                    ctaText = "Terkunci";
                  }

                  return (
                    <div 
                      key={topicId}
                      className={`bg-white border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-2xs ${
                        !isUnlocked ? "opacity-60 border-slate-200 bg-slate-50/50" : "border-slate-150 shadow-3xs"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-sans font-black text-slate-800 text-sm sm:text-base leading-snug">
                            {title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[9px] sm:text-xs font-mono font-bold tracking-wide border shrink-0 ${badgeClass}`}>
                            {statusBadge}
                          </span>
                        </div>

                        {/* Topic detail metrics if unlocked */}
                        {isUnlocked && (
                          <div className="text-[11px] text-slate-500 font-sans space-y-1.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                            <div>
                              <span className="font-semibold text-slate-600">Diagnosis:</span>{" "}
                              {progress.diagnosticResults.length > 0 
                                ? `${progress.diagnosticResults.length} kali diuji`
                                : "Belum ada"}
                            </div>
                            
                            {progress.drillProgress && (
                              <div>
                                <span className="font-semibold text-slate-600">Latihan Mandiri:</span>{" "}
                                Fase {progress.drillProgress.currentPhase}
                              </div>
                            )}

                            {progress.masteryResults.length > 0 && (
                              <div>
                                <span className="font-semibold text-slate-600">Mastery Check:</span>{" "}
                                Ujian terkhir: {progress.masteryResults[progress.masteryResults.length - 1].score}%
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Topic CTA button */}
                      {isUnlocked ? (
                        <Link
                          to={ctaRoute}
                          className={`w-full inline-flex items-center justify-center gap-1 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isMastered 
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                              : "bg-indigo-650 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          <span>{ctaText}</span>
                          <ChevronRight size={14} />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full inline-flex items-center justify-center gap-1 font-bold py-2 rounded-xl text-xs bg-slate-100 border border-slate-150 text-slate-400 cursor-not-allowed"
                        >
                          <span>🔒 Terkunci</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Sidebar Columns */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* 5. Aktivitas Terakhir */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Aktivitas Terakhir
              </h3>

              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 leading-relaxed py-4 text-center">
                  Belum ada riwayat aktivitas terbaru.
                </p>
              ) : (
                <div className="space-y-4 relative pl-3 border-l border-slate-150">
                  {recentActivities.map((act) => {
                    let iconBg = "bg-blue-50 border-blue-100 text-blue-500";
                    if (act.type === "bridge") iconBg = "bg-indigo-50 border-indigo-100 text-indigo-500";
                    if (act.type === "drill") iconBg = "bg-purple-50 border-purple-100 text-purple-500";
                    if (act.type === "mastery") iconBg = "bg-emerald-50 border-emerald-100 text-emerald-500";

                    return (
                      <div key={act.id} className="relative group space-y-1">
                        {/* Bullet point connector */}
                        <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-slate-350 border border-white group-hover:bg-indigo-500 transition-colors" />

                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>{act.topicTitle}</span>
                          <span>{new Date(act.date).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}</span>
                        </div>

                        <Link 
                          to={act.route}
                          className="block text-xs font-bold text-slate-700 group-hover:text-indigo-650 transition-colors leading-snug cursor-pointer"
                        >
                          {act.detail}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
