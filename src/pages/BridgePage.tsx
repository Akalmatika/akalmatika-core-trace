// src/pages/BridgePage.tsx

import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  AlertTriangle, 
  Compass, 
  Play, 
  Activity,
  Flame,
  ArrowLeft
} from "lucide-react";
import { getBridgeContent } from "../data/bridgeContent";
import { progressStorage } from "../services/progressStorage";

export default function BridgePage() {
  const { topicId, misconceptionCode } = useParams<{ topicId: string; misconceptionCode: string }>();
  const navigate = useNavigate();

  const content = topicId && misconceptionCode ? getBridgeContent(topicId, misconceptionCode) : null;

  useEffect(() => {
    if (content) {
      // Simpan kunjungan ke progressStorage ketika halaman dimuat
      progressStorage.saveBridgeVisit({
        topicId: content.topicId,
        misconceptionCode: content.misconceptionCode,
        visitedDate: new Date().toISOString(),
        completedVisualization: false,
        visualizationOpened: false
      });
    }
  }, [content]);

  if (!content) {
    return (
      <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle size={48} className="text-amber-500 animate-pulse" />
        <h3 className="text-xl font-sans font-black text-slate-800">
          Jembatan Berpikir Tidak Ditemukan
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Konten jembatan berpikir untuk kode miskonsepsi ini belum tersedia atau parameter tidak valid.
        </p>
        <button
          onClick={() => navigate('/student/diagnostic')}
          className="bg-indigo-650 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const handleGoToVisualization = () => {
    // Tandai visualisasi telah dibuka, lalu arahkan ke route visualisasi
    progressStorage.saveBridgeVisit({
      topicId: content.topicId,
      misconceptionCode: content.misconceptionCode,
      visitedDate: new Date().toISOString(),
      completedVisualization: false,
      visualizationOpened: true
    });
    navigate(content.visualizationRoute);
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-3xl mx-auto space-y-8 animate-fadeIn font-sans">
      
      {/* Back button */}
      <div>
        <Link 
          to="/student/learning-map" 
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <ArrowLeft size={12} /> Kembali ke Peta Belajar
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Jembatan Berpikir • {content.misconceptionCode}
        </span>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight mt-3">
          {content.misconceptionTitle}
        </h2>
      </div>

      {/* Part 1: Miskonsepsi yang terdeteksi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-3">
        <h3 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
          <Activity size={14} className="text-indigo-550 animate-pulse" /> 1. Pola Jawaban Terdeteksi
        </h3>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-700 font-bold leading-relaxed">
          {content.whatStudentDid}
        </div>
      </div>

      {/* Part 2: Kenapa jawaban itu menggoda */}
      <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-3xs space-y-3">
        <h3 className="text-xs font-mono font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" /> 2. Mengapa Ini Alami?
        </h3>
        <p className="text-xs md:text-sm text-slate-650 leading-relaxed">
          {content.whyTempting}
        </p>
      </div>

      {/* Part 3: Makna konsep */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
          <Lightbulb size={14} className="text-indigo-600" /> 3. Makna Konsep Sebenarnya
        </h3>
        <div className="space-y-3 text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
          {content.conceptMeaning.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Part 4: Contoh konkret */}
      <div className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100 shadow-3xs space-y-3">
        <h3 className="text-xs font-mono font-black text-indigo-750 uppercase tracking-widest flex items-center gap-1.5">
          <Flame size={14} className="text-indigo-550" /> 4. Ilustrasi Konkret
        </h3>
        <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans italic bg-white p-4 rounded-xl border border-indigo-50">
          "{content.concreteExample}"
        </p>
      </div>

      {/* Part 5: Pertanyaan pemandu */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
        <h3 className="text-xs font-mono font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle size={14} className="text-slate-450" /> 5. Renungkan Pertanyaan Ini
        </h3>
        <div className="space-y-3">
          {content.thinkingPrompts.map((prompt, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-slate-200 border border-slate-350 text-slate-600 font-mono text-3xs font-black flex items-center justify-center shrink-0 mt-0.5 select-none">
                {idx + 1}
              </span>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
                {prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons (Part 6 & 7) */}
      <div className="bg-slate-100/50 border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-3xs">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-sans font-black text-slate-800 text-sm md:text-base">
            Siap untuk Eksplorasi Interaktif?
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Gunakan papan visualisasi untuk memanipulasi konsep secara langsung.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Part 6: Lanjut ke visualisasi */}
          <button
            onClick={handleGoToVisualization}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-indigo-50/50 border border-indigo-200 text-indigo-700 font-sans font-bold px-6 py-3 rounded-2xl text-xs transition-all cursor-pointer text-center shadow-2xs"
          >
            <Play size={12} className="text-indigo-605" />
            <span>Ke Media Visualisasi</span>
          </button>

          {/* Part 7: Lanjut ke drill */}
          {content.topicId === "fractions" || content.topicId === "percent" || content.topicId === "integer" || content.topicId === "algebra" || content.topicId === "plsv" ? (
            <button
              onClick={() => navigate(`/student/drill/${content.topicId}`)}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer text-center"
            >
              <Compass size={12} />
              <span>Mulai Latihan (Drill)</span>
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 bg-slate-200 border border-slate-300 text-slate-400 font-sans font-bold px-6 py-3 rounded-2xl text-xs transition-all cursor-not-allowed text-center"
              title="Latihan Mandiri (Drill) belum tersedia untuk topik ini"
            >
              <Compass size={12} />
              <span>Mulai Latihan (Drill)</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
