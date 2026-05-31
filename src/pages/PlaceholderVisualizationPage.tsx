import { Link, useLocation } from "react-router-dom";
import { Hammer, ArrowLeft, ExternalLink, ShieldCheck, AlertTriangle, Blocks, ListTree } from "lucide-react";
import { allVisualizations } from "../data/visualizationCatalog";

export default function PlaceholderVisualizationPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Cari data visualisasi berdasarkan href yang cocok dengan pathname
  const visualItem = allVisualizations.find(item => item.href === currentPath);

  if (!visualItem) {
    // Fallback jika ternyata benar-benar 404 (tidak ada di katalog)
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fadeIn bg-white border border-slate-200 rounded-3xl shadow-sm my-8">
        <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-2xl mb-4 border border-red-100">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
          Maaf, rute visualisasi yang Anda cari tidak terdaftar di dalam sistem.
        </p>
        <Link 
          to="/student/visualizations" 
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
        >
          <ArrowLeft size={16} /> Kembali ke Galeri
        </Link>
      </div>
    );
  }

  // Jika item ditemukan di katalog, tampilkan detail placeholder
  const categoryLink = `/student/visualizations/${visualItem.categoryId}`;

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fadeIn">
      <Link to={categoryLink} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Kategori
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Header Status */}
        <div className="bg-amber-50 border-b border-amber-100 p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 flex items-center justify-center rounded-2xl border border-amber-200 shrink-0 shadow-sm">
            <Hammer size={32} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Visualisasi Sedang Disiapkan
            </h2>
            <p className="text-amber-700 text-sm mt-1 font-medium">
              Modul interaktif <span className="font-bold">"{visualItem.title}"</span> masih dalam tahap pengembangan.
            </p>
          </div>
        </div>

        {/* Blueprint Details */}
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ExternalLink size={14} /> INFORMASI DESAIN
            </h3>
            <h4 className="text-lg font-black text-slate-900">{visualItem.title}</h4>
            <p className="text-slate-600 text-sm mt-1">{visualItem.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-2">
                <ShieldCheck size={18} /> Konsep yang Dikuatkan
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{visualItem.strengthens}</p>
            </div>

            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-2">
                <AlertTriangle size={18} /> Miskonsepsi Target
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{visualItem.misconceptionTarget}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-2">
                <Blocks size={18} /> Representasi Visual
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-mono bg-white px-3 py-2 rounded-lg border border-slate-200 inline-block shadow-xs">
                {visualItem.representation}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-3">
                <ListTree size={18} /> Mode Interaksi (Rencana)
              </div>
              <ul className="space-y-2">
                {visualItem.modes.map((mode, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    {mode}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
