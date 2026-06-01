import { useState } from "react";
import { Link } from "react-router-dom";
import { algebraVisualizations } from "../data/visualizationCatalog";
import { Box, Play, AlertCircle, Eye, Settings2, ChevronDown } from "lucide-react";
import { VisualizationItem } from "../types/visualization";

function AlgebraCard({ item }: { item: VisualizationItem }) {
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
            {item.icon ? <item.icon size={14} className="text-amber-500" /> : <Box size={14} className="text-amber-500" />}
            <span className="text-[10px] font-bold text-amber-600 tracking-wide uppercase">{item.materialTopic}</span>
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
          <div className="h-24 md:h-40 bg-slate-50 border-b border-slate-100 relative overflow-hidden flex items-center justify-center p-3 md:p-4 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50" />
            <div className="relative z-10 w-full flex items-center justify-center">
              
              {/* Dynamic Preview Graphic based on ID */}
              {item.id === "alg-term-cards" && (
                <div className="flex gap-1.5 md:gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] md:text-[8px] font-bold text-amber-500 uppercase mb-0.5">Koefisien</span>
                    <div className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-amber-100 text-amber-700 font-bold font-mono rounded border border-amber-300 text-[10px] md:text-xs shadow-sm">3</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] md:text-[8px] font-bold text-indigo-500 uppercase mb-0.5">Variabel</span>
                    <div className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-indigo-100 text-indigo-700 font-bold font-mono rounded border border-indigo-300 text-[10px] md:text-xs shadow-sm">x</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] md:text-[8px] font-bold text-rose-500 uppercase mb-0.5">Konstanta</span>
                    <div className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-rose-100 text-rose-700 font-bold font-mono rounded border border-rose-300 text-[10px] md:text-xs shadow-sm">-5</div>
                  </div>
                </div>
              )}

              {item.id === "alg-term-sign" && (
                <div className="flex gap-1 items-center bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl shadow-sm">
                  <span className="text-rose-600 font-black text-xs px-1 bg-rose-100 rounded">-</span>
                  <span className="font-mono text-xs font-bold text-slate-700">3y</span>
                </div>
              )}

              {item.id === "alg-like-term-sorter" && (
                <div className="flex gap-3 md:gap-4">
                  <div className="border border-dashed border-slate-300 rounded-lg p-1.5 flex flex-col items-center bg-white/50 shadow-inner">
                    <span className="text-[7px] md:text-[8px] font-bold text-slate-400 mb-0.5">Suku x</span>
                    <div className="flex gap-1">
                      <span className="px-1 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-mono font-bold">2x</span>
                      <span className="px-1 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-mono font-bold">-5x</span>
                    </div>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded-lg p-1.5 flex flex-col items-center bg-white/50 shadow-inner">
                    <span className="text-[7px] md:text-[8px] font-bold text-slate-400 mb-0.5">Suku y</span>
                    <div className="flex gap-1">
                      <span className="px-1 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-mono font-bold">3y</span>
                    </div>
                  </div>
                </div>
              )}

              {item.id === "alg-group-like-terms" && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-mono text-slate-500">3x + 2y - x + y</span>
                  <span className="text-[8px] font-black text-slate-300 leading-none">↓</span>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shadow-sm">(3x - x) + (2y + y)</span>
                </div>
              )}

              {item.id === "alg-like-term-operations" && (
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-white/65 px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <span>4x</span>
                  <span>+</span>
                  <span>3x</span>
                  <span className="text-slate-400 font-normal">=</span>
                  <span className="bg-amber-50 text-amber-700 px-1 py-0.5 rounded border border-amber-200 text-[9px]">(4 + 3)x</span>
                  <span className="text-slate-400 font-normal">=</span>
                  <span className="text-indigo-600">7x</span>
                </div>
              )}

              {item.id === "alg-expand-brackets" && (
                <div className="flex items-center gap-1 font-mono text-xs font-bold bg-white/65 px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-rose-500 font-black">-</span>
                  <span className="text-slate-500">(2x - 3)</span>
                  <span className="text-slate-400 font-normal">→</span>
                  <span className="text-slate-700">-2x + 3</span>
                </div>
              )}

              {item.id === "alg-substitution" && (
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-500">
                    <span>x = 4</span>
                    <span>→</span>
                    <span>2x + 3</span>
                  </div>
                  <div className="text-[9px] md:text-[10px] font-mono font-bold text-indigo-600 bg-white/70 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                    2(4) + 3 = <span className="bg-indigo-50 px-1 rounded text-indigo-700">11</span>
                  </div>
                </div>
              )}

              {item.id === "alg-word-to-expression" && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[8px] md:text-[9px] text-slate-500 italic font-medium">"Dua kali x ditambah 5"</span>
                  <span className="text-[8px] font-black text-slate-300 leading-none">↓</span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded shadow-sm">2x + 5</span>
                </div>
              )}

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
              className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-amber-500 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-md mt-auto"
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

export default function AlgebraVisualizationPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
            Kategori
          </span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aljabar Dasar</h3>
        </div>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Visualisasi Aljabar Dasar
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Pahami bahasa aljabar, tanda suku, suku sejenis, pengelompokan, dan transformasi bentuk aljabar.
        </p>
      </div>

      {/* Visualizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {algebraVisualizations.map((item) => (
          <AlgebraCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
