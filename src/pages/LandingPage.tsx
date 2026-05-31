import { Link } from "react-router-dom";
import { Sparkles, Trophy, Database, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-12 animate-fadeIn py-6 md:py-10">
      {/* Hero Branding */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full text-2xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
          <Sparkles size={12} className="animate-spin-slow" /> Akalmatika Interactive Learning
        </div>
        <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight leading-tight text-slate-900">
          Temukan Miskonsepsi, Bangun Pemahaman
        </h2>
        <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto font-sans">
          Akalmatika membantu siswa menemukan bagian yang belum kokoh, lalu memperkuatnya lewat diagnosis, visualisasi, dan latihan bertahap.
        </p>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
        
        {/* Card 1: Diagnosis */}
        <Link 
          to="/student/diagnostic"
          className="bg-white border border-slate-100 hover:border-indigo-250 hover:shadow-xl rounded-3xl p-6 md:p-8 transition-all duration-300 group flex flex-col justify-between space-y-6 shadow-2xs"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-sky-50 border border-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-sans font-black text-slate-900 text-lg md:text-xl">Diagnosis Konsep</h3>
              <p className="text-xs text-slate-500 font-sans mt-1.5 leading-relaxed">
                Cari tahu bagian mana yang belum kokoh sebelum lanjut belajar.
              </p>
            </div>
            {/* Preview Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Bilangan Bulat", "Pecahan", "Persen", "Aljabar Dasar"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors pt-2">
            <span>Mulai Diagnosis</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Visualisasi */}
        <Link 
          to="/student/visualizations"
          className="bg-white border border-slate-100 hover:border-emerald-250 hover:shadow-xl rounded-3xl p-6 md:p-8 transition-all duration-300 group flex flex-col justify-between space-y-6 shadow-2xs"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-sans font-black text-slate-900 text-lg md:text-xl">Galeri Visualisasi</h3>
              <p className="text-xs text-slate-500 font-sans mt-1.5 leading-relaxed">
                Buka alat visual untuk melihat konsep matematika bekerja secara konkret.
              </p>
            </div>
            {/* Preview Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Bilangan Bulat", "Pecahan", "Persen", "Aljabar Dasar"].map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-800 transition-colors pt-2">
            <span>Buka Visualisasi</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-400 italic">Belum tahu kelemahanmu? Mulailah dari <span className="font-semibold">Diagnosis</span>.</p>
      </div>

    </div>
  );
}
