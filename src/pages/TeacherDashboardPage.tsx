// src/pages/TeacherDashboardPage.tsx

import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ClipboardList
} from "lucide-react";
import { 
  mockClassSummary, 
  mockMisconceptionHeatmap, 
  mockStudentRows, 
  mockInterventionSuggestions 
} from "../data/teacherMockData";

export default function TeacherDashboardPage() {
  const getPriorityStyle = (priority: "Rendah" | "Sedang" | "Tinggi") => {
    switch (priority) {
      case "Tinggi":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Sedang":
        return "bg-amber-50 text-amber-700 border-amber-250";
      case "Rendah":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
    }
  };

  return (
    <div className="pt-20 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Header Section */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight flex items-center gap-2">
          <ClipboardList className="text-emerald-600" size={28} /> Dashboard Guru
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
          Lihat pola miskonsepsi kelas agar intervensi belajar lebih tepat. Temukan akar masalah pemahaman siswa secara kolektif.
        </p>
      </div>

      {/* 2. Ringkasan Kelas (Class Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Siswa */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Total Siswa
            </span>
            <h3 className="font-black text-slate-800 text-xl leading-snug">
              {mockClassSummary.studentCount} Siswa
            </h3>
          </div>
        </div>

        {/* Card 2: Rerata Mastery */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Rata-rata Mastery
            </span>
            <h3 className="font-black text-slate-800 text-xl leading-snug">
              {mockClassSummary.averageMasteryRate}%
            </h3>
          </div>
        </div>

        {/* Card 3: Topik Paling Lemah */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Topik Perlu Penguatan
            </span>
            <h3 className="font-black text-slate-800 text-base leading-snug truncate max-w-[160px]">
              {mockClassSummary.weakestTopic}
            </h3>
          </div>
        </div>

        {/* Card 4: Top Misconception */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Lightbulb size={22} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Miskonsepsi Utama
            </span>
            <h3 className="font-black text-slate-800 text-xs leading-snug max-w-[170px] line-clamp-2">
              {mockClassSummary.topMisconception}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid container for Map & Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Peta Miskonsepsi Kelas (Heatmap) */}
        <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4 overflow-hidden">
          <div>
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-1.5">
              <Sparkles size={18} className="text-emerald-600" />
              Peta Miskonsepsi Kelas
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribusi miskonsepsi yang terdeteksi pada rantai belajar matematika dasar siswa.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-4 py-3">Topik</th>
                  <th className="px-4 py-3 text-center">Terdampak</th>
                  <th className="px-4 py-3">Miskonsepsi Dominan</th>
                  <th className="px-4 py-3 text-center">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {mockMisconceptionHeatmap.map((item) => {
                  const badgeStyle = getPriorityStyle(item.priority);
                  return (
                    <tr key={item.topicId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-bold text-slate-800">
                        {item.title}
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-slate-600">
                        {item.affectedCount} siswa
                      </td>
                      <td className="px-4 py-4 text-slate-500 leading-relaxed max-w-[200px]">
                        <div className="font-semibold text-slate-700">{item.dominantMisconception}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.intervention}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${badgeStyle}`}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Rekomendasi Intervensi Guru */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-1.5">
              <Lightbulb size={18} className="text-emerald-600" />
              Intervensi Kelas Disarankan
            </h3>
            <p className="text-xs text-slate-500">
              Rekomendasi aktivitas konseptual terarah berdasarkan analisis data kelas.
            </p>
          </div>

          <div className="space-y-4">
            {mockInterventionSuggestions.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-2.5 transition-all hover:shadow-2xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-sans font-black text-slate-800 text-sm leading-snug">
                    {item.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold uppercase shrink-0">
                    {item.target}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Daftar Siswa Mock */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4 overflow-hidden">
        <div>
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-1.5">
            <Users size={18} className="text-emerald-600" />
            Pemantauan Progres Siswa
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Analisis kebutuhan penguatan belajar siswa secara individual berdasarkan aktivitas terakhir.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Topik Terakhir</th>
                <th className="px-4 py-3 text-center">Penguasaan Rantai</th>
                <th className="px-4 py-3">Pola yang Perlu Diperkuat</th>
                <th className="px-4 py-3">Tindakan Guru Direkomendasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {mockStudentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-800">
                    {row.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {row.lastActiveTopic}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-bold text-slate-700">{row.masteredCount} / 5</span>
                      {/* Mini progress bar */}
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-150">
                        <div 
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${(row.masteredCount / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 font-semibold max-w-[200px]">
                    {row.lastMisconception}
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs leading-relaxed max-w-[250px]">
                    {row.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
