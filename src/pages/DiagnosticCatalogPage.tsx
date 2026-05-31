import { Link } from "react-router-dom";
import { diagnosticCatalog } from "../data/diagnosticCatalog";
import { Activity, ArrowRight } from "lucide-react";

export default function DiagnosticCatalogPage() {
  return (
    <div className="space-y-8 animate-fadeIn py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Diagnosis Konsep
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Pilih materi yang ingin Anda diagnosis. Sistem akan membantu menemukan letak miskonsepsi atau kelemahan konsep dasar Anda secara akurat.
        </p>
      </div>

      {/* Grid of Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagnosticCatalog.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                  <Activity size={20} />
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  {item.targetConcept}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            
            <div className="pt-6 mt-auto">
              <Link
                to={item.href}
                className="w-full inline-flex justify-center items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                <span>Mulai Diagnosis</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
