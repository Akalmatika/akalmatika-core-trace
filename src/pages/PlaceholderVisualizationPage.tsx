import { Link } from "react-router-dom";
import { Hammer, ArrowLeft } from "lucide-react";

export default function PlaceholderVisualizationPage() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fadeIn bg-white border border-slate-200 rounded-3xl shadow-sm my-8">
      <div className="w-16 h-16 bg-amber-50 text-amber-500 flex items-center justify-center rounded-2xl mb-4 border border-amber-100">
        <Hammer size={32} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Visualisasi Sedang Dibangun</h2>
      <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm leading-relaxed">
        Modul interaktif untuk bagian ini masih dalam tahap pengembangan. Kami sedang mempersiapkan pengalaman visual terbaik untuk pemahaman konsep ini.
      </p>
      <Link 
        to="/student/visualizations"
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
      >
        <ArrowLeft size={16} />
        Kembali ke Galeri
      </Link>
    </div>
  );
}
