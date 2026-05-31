import { useState } from "react";
import { Link } from "react-router-dom";
import { integerVisualizations } from "../data/visualizationCatalog";
import { Box, Play, ChevronDown } from "lucide-react";
import { VisualizationItem } from "../types/visualization";

function IntegerCard({ item }: { item: VisualizationItem }) {
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
            <Box size={14} className="text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-600 tracking-wide uppercase">{item.materialTopic}</span>
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
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-sky-50/50" />
            
            {/* Dynamic Preview Graphic based on ID */}
            {item.id === "int-zero-pair" ? (
              <div className="relative z-10 flex gap-2 items-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-orange-600 font-black shadow-sm">+1</div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-12 h-12 rounded-full bg-cyan-100 border-2 border-cyan-400 flex items-center justify-center text-cyan-600 font-black shadow-sm">-1</div>
                <span className="text-slate-400 font-bold">=</span>
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold">0</div>
              </div>
            ) : (
              <div className="relative z-10 w-full max-w-[250px]">
                <div className="h-1 w-full bg-slate-300 relative rounded-full">
                  {[-3,-2,-1,0,1,2,3].map((num) => (
                    <div key={num} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${((num + 3) / 6) * 100}%` }}>
                      <div className="w-1 h-3 bg-slate-400 rounded-full mb-1"></div>
                      <span className="text-[10px] font-bold text-slate-500">{num}</span>
                    </div>
                  ))}
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-md z-20"></div>
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-6 flex-1">
              <p className="text-[10px] font-bold text-slate-400 mb-1">MENGUATKAN KONSEP:</p>
              <p className="text-xs text-slate-700 font-medium">{item.strengthens}</p>
            </div>

            <Link
              to={item.href}
              className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-md mt-auto"
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


export default function IntegerVisualizationPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-slate-100 text-slate-500 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
            Kategori
          </span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bilangan Bulat</h3>
        </div>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Visualisasi Bilangan Bulat
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Pahami positif-negatif, pasangan nol, arah gerak, dan pengurangan sebagai menambahkan lawan. 
          Pilih representasi visual yang paling sesuai dengan kebutuhan pemahaman Anda.
        </p>
      </div>

      {/* Visualizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {integerVisualizations.map((item) => (
          <IntegerCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
