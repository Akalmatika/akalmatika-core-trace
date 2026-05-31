import { Link } from "react-router-dom";
import { visualizationCategories } from "../data/visualizationCategories";
import { Layers, ArrowRight } from "lucide-react";

export default function VisualizationCatalogPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Galeri Visualisasi
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Eksplorasi alat bantu visual yang dirancang khusus untuk membedah dan memperbaiki miskonsepsi matematika. Pilih kategori materi untuk melihat koleksi alatnya.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visualizationCategories.map((category) => (
          <div key={category.id} className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <category.icon size={24} />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold">
                  <Layers size={12} />
                  <span>{category.visualCount} Alat</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 text-xl">{category.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {category.previewTags.map(tag => (
                  <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-6 mt-auto">
              <Link
                to={category.href}
                className="w-full inline-flex justify-center items-center gap-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm border border-slate-200 hover:border-transparent"
              >
                <span>Lihat Visualisasi</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
