import { Link } from "react-router-dom";
import { Sparkles, Trophy, Database, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn py-3 md:py-4">
      {/* Hero Branding */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-wider select-none">
          <Sparkles size={11} className="animate-spin-slow" /> Akalmatika Interactive Learning
        </div>
        <h2 className="text-2xl md:text-3.5xl lg:text-4xl font-sans font-black tracking-tight leading-tight text-slate-900">
          Temukan Miskonsepsi, Bangun Pemahaman
        </h2>
        <p className="text-xs md:text-sm text-slate-500 leading-normal max-w-md mx-auto font-sans">
          Akalmatika membantu siswa menemukan bagian yang belum kokoh, lalu memperkuatnya lewat diagnosis, visualisasi, dan latihan bertahap.
        </p>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
        
        {/* Card 1: Diagnosis */}
        <Link 
          to="/student/diagnostic"
          className="bg-white border border-slate-150 hover:border-indigo-300 hover:shadow-lg rounded-2xl p-4 transition-all duration-300 group flex items-start gap-4 shadow-3xs"
        >
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 shrink-0">
            <Trophy size={20} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2.5">
            <div>
              <h3 className="font-sans font-black text-slate-900 text-sm md:text-base leading-snug">Diagnosis Konsep</h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-normal">
                Cari tahu bagian mana yang belum kokoh sebelum lanjut belajar.
              </p>
            </div>
            
            {/* Preview Chips */}
            <div className="flex flex-wrap gap-1.5">
              {["Bilangan Bulat", "Pecahan", "Persen", "Aljabar"].map(tag => (
                <span key={tag} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-650 group-hover:text-indigo-850 transition-colors pt-1">
              <span>Mulai Diagnosis</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>

        {/* Card 2: Visualisasi */}
        <Link 
          to="/student/visualizations"
          className="bg-white border border-slate-150 hover:border-emerald-300 hover:shadow-lg rounded-2xl p-4 transition-all duration-300 group flex items-start gap-4 shadow-3xs"
        >
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-650 rounded-xl flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 shrink-0">
            <Database size={20} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2.5">
            <div>
              <h3 className="font-sans font-black text-slate-900 text-sm md:text-base leading-snug">Galeri Visualisasi</h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-normal">
                Buka alat visual untuk melihat konsep matematika bekerja secara konkret.
              </p>
            </div>
            
            {/* Preview Chips */}
            <div className="flex flex-wrap gap-1.5">
              {["Bilangan Bulat", "Pecahan", "Persen", "Aljabar"].map(tag => (
                <span key={tag} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-650 group-hover:text-emerald-850 transition-colors pt-1">
              <span>Buka Visualisasi</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>

      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 italic">Belum tahu kelemahanmu? Mulailah dari <span className="font-semibold text-slate-500">Diagnosis</span>.</p>
      </div>

    </div>
  );
}
