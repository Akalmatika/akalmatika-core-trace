import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Box, Info } from "lucide-react";

export default function AddSameDenominatorPage() {
  const [step, setStep] = useState<0 | 1>(0); // 0 = split, 1 = merged

  const n1 = 2;
  const n2 = 1;
  const den = 5;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Operasi Pecahan Penyebut Sama</h2>
          <p className="text-slate-500 text-sm mt-1">
            Lihat mengapa pembilang dijumlahkan, sementara penyebut tetap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center relative overflow-hidden">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col items-center text-3xl font-black font-mono text-indigo-600">
              <div>{n1}</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>{den}</div>
            </div>
            <div className="text-2xl font-bold text-slate-400">+</div>
            <div className="flex flex-col items-center text-3xl font-black font-mono text-sky-500">
              <div>{n2}</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>{den}</div>
            </div>
            <div className={`transition-all duration-[1500ms] ease-in-out flex items-center gap-4 ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="text-2xl font-bold text-slate-400">=</div>
              <div className="flex flex-col items-center text-4xl font-black font-mono text-emerald-600">
                <div>{n1 + n2}</div>
                <div className="w-full h-1.5 bg-slate-800 my-1.5 rounded-full"></div>
                <div>{den}</div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="w-full flex flex-col items-center gap-6 relative z-10 max-w-lg mt-4">
             
             {/* Box 1 */}
             <div className="w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner">
                {Array.from({ length: den }).map((_, idx) => {
                  let bgColor = 'bg-transparent';
                  if (idx < n1) bgColor = 'bg-indigo-400';
                  else if (step === 1 && idx < n1 + n2) bgColor = 'bg-sky-400';

                  return (
                    <div 
                      key={idx}
                      className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-[1500ms] ease-in-out ${bgColor}`}
                    />
                  );
                })}
             </div>

             {/* Box 2 (Only visible in step 0) */}
             <div className={`w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner transition-all duration-[1500ms] ease-in-out transform origin-top ${step === 1 ? 'opacity-0 scale-y-0 h-0 border-0' : 'opacity-100 scale-y-100'}`}>
                {Array.from({ length: den }).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-[1500ms] ease-in-out ${idx < n2 ? 'bg-sky-400' : 'bg-transparent'}`}
                  />
                ))}
             </div>

          </div>

          <div className={`mt-12 text-center text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-xl border border-slate-100 shadow-sm transition-all duration-[1500ms] ease-in-out ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
            Ukuran wadah potongan <strong>(Penyebut: {den})</strong> tetap sama, hanya isinya <strong>(Pembilang)</strong> yang digabung.
          </div>

        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
              Lakukan Penjumlahan
            </h3>
            
            <button
              onClick={() => setStep(step === 0 ? 1 : 0)}
              className="w-full py-3 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              {step === 0 ? 'Gabungkan Blok' : 'Ulangi'}
            </button>
            
          </div>

          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800 leading-relaxed">
                <strong>Miskonsepsi:</strong> Siswa sering kali menjumlahkan penyebut menjadi {den + den}. 
                Visualisasi ini membuktikan bahwa menggabungkan {n1}/{den} dan {n2}/{den} tidak mengubah ukuran wadah pemotongannya.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
