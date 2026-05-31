import { useState } from "react";
import { Link } from "react-router-dom";
import { percentVisualizations } from "../data/visualizationCatalog";
import { Box, Play, AlertCircle, Eye, Settings2, ChevronDown } from "lucide-react";
import { VisualizationItem } from "../types/visualization";

function PercentCard({ item }: { item: VisualizationItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
      
      {/* Clickable Header */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Box size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">{item.materialTopic}</span>
          </div>
          <h3 className="font-black text-slate-900 text-lg md:text-xl leading-tight pr-4">{item.title}</h3>
        </div>
        <div className={`p-2 rounded-full bg-slate-100 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
           <ChevronDown size={18} className="text-slate-500" />
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="animate-fadeIn border-t border-slate-100 flex flex-col flex-1">
          {/* Visual Preview Area (Mock) */}
          <div className="h-40 bg-slate-50 border-b border-slate-100 relative overflow-hidden flex items-center justify-center p-4 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
            <div className="relative z-10 w-24 h-24 grid grid-cols-5 grid-rows-5 gap-0.5 p-1 bg-white border border-slate-200 rounded-md shadow-sm">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-full h-full rounded-[1px] ${i < 12 ? 'bg-emerald-400' : 'bg-slate-100'}`}></div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
              <p className="text-[10px] font-bold text-emerald-600 mb-1 flex items-center gap-1">
                <Eye size={12} /> MENGUATKAN KONSEP:
              </p>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.strengthens}</p>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4">
              <p className="text-[10px] font-bold text-rose-600 mb-1 flex items-center gap-1">
                <AlertCircle size={12} /> MISKONSEPSI TARGET:
              </p>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.misconceptionTarget}</p>
            </div>

            <div className="mb-6 flex-1">
              <p className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                <Settings2 size={12} /> MODE TERSEDIA:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.modes.map(mode => (
                  <span key={mode} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                    {mode}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to={item.href}
              className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-md mt-auto"
            >
              <Play size={16} className="fill-white" />
              <span>Buka Visualisasi</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PercentVisualizationPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
            Kategori
          </span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Persen</h3>
        </div>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Visualisasi Persen
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Pahami persen sebagai per seratus dan hubungannya dengan pecahan.
        </p>
      </div>

      {/* Visualizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {percentVisualizations.map((item) => (
          <PercentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
