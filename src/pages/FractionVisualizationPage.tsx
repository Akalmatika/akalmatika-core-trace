import { Link } from "react-router-dom";
import { fractionVisualizations } from "../data/visualizationCatalog";
import { Box, Play } from "lucide-react";

export default function FractionVisualizationPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
            Kategori
          </span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pecahan</h3>
        </div>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Visualisasi Pecahan
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Pahami bagian dari keseluruhan, pecahan senilai, penyederhanaan, perbandingan, dan operasi pecahan dengan alat interaktif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fractionVisualizations.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
            
            <div className="h-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
              <div className="relative z-10 font-black text-slate-300 text-4xl">
                {item.id.includes("area") ? "▧▧□" : "½ = 2/4"}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Box size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">{item.materialTopic}</span>
              </div>
              
              <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex-1">
                <p className="text-[10px] font-bold text-slate-400 mb-1">MENGUATKAN KONSEP:</p>
                <p className="text-xs text-slate-700 font-medium">{item.strengthens}</p>
              </div>

              <Link
                to={item.href}
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm mt-auto"
              >
                <Play size={14} />
                <span>Buka</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
