import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Info } from "lucide-react";

export default function AddDiffDenominatorPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0); 
  // 0 = beda penyebut, 1 = samakan penyebut, 2 = gabung
  const [errorMsg, setErrorMsg] = useState(false);

  const handleAdd = () => {
    if (step === 0) {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 3000);
    } else if (step === 1) {
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Operasi Pecahan Penyebut Beda</h2>
          <p className="text-slate-500 text-sm mt-1">
            Samakan ukuran potongan terlebih dahulu sebelum menggabungkannya.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[450px] flex flex-col items-center relative overflow-hidden">
          
          {errorMsg && (
            <div className="absolute top-6 right-6 z-20 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-shake">
              <XCircle size={20} /> Tidak bisa! Ukuran potongannya masih berbeda.
            </div>
          )}
          {step === 2 && (
            <div className="absolute top-6 right-6 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={20} /> Berhasil digabungkan!
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col items-center text-3xl font-black font-mono text-indigo-600 transition-all">
              <div>{step === 0 ? 1 : 2}</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>{step === 0 ? 2 : 4}</div>
            </div>
            <div className="text-2xl font-bold text-slate-400">+</div>
            <div className="flex flex-col items-center text-3xl font-black font-mono text-sky-500">
              <div>1</div>
              <div className="w-full h-1 bg-slate-800 my-1 rounded-full"></div>
              <div>4</div>
            </div>
            <div className={`transition-all duration-300 flex items-center gap-4 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="text-2xl font-bold text-slate-400">=</div>
              <div className="flex flex-col items-center text-4xl font-black font-mono text-emerald-600">
                <div>3</div>
                <div className="w-full h-1.5 bg-slate-800 my-1.5 rounded-full"></div>
                <div>4</div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="w-full flex flex-col items-center gap-6 relative z-10 max-w-lg mt-4">
             
             {/* Box 1: 1/2 or 2/4 */}
             <div className="w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner">
                {Array.from({ length: step === 0 ? 2 : 4 }).map((_, idx) => {
                  let bgColor = 'bg-transparent';
                  if (step === 0 && idx < 1) bgColor = 'bg-indigo-400';
                  else if (step >= 1 && idx < 2) bgColor = 'bg-indigo-400';
                  
                  // Fill the merged pieces
                  if (step === 2 && idx === 2) bgColor = 'bg-sky-400';

                  return (
                    <div 
                      key={idx}
                      className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-500 ${bgColor}`}
                    />
                  );
                })}
             </div>

             {/* Box 2: 1/4 (Only visible in step 0 or 1) */}
             <div className={`w-full h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner transition-all duration-500 transform origin-top ${step === 2 ? 'opacity-0 scale-y-0 h-0 border-0' : 'opacity-100 scale-y-100'}`}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-colors duration-500 ${idx < 1 ? 'bg-sky-400' : 'bg-transparent'}`}
                  />
                ))}
             </div>

          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={step !== 0}
                className="w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95"
              >
                1. Samakan Penyebut
              </button>
              
              <button
                onClick={handleAdd}
                disabled={step === 2}
                className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${step === 2 ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'}`}
              >
                2. Gabungkan Blok
              </button>

              {step === 2 && (
                <button onClick={() => setStep(0)} className="text-sm text-slate-500 font-bold hover:text-slate-800 mt-2">
                  Ulangi Simulasi
                </button>
              )}
            </div>
            
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed">
                Sebelum digabung, kita tidak tahu akan menamai potongannya apa (berbeda ukuran). Kita mengubah pecahan 1/2 menjadi bentuk <strong>Pecahan Senilai</strong> (2/4) agar ukurannya seragam.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
