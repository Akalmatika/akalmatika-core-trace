import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Box, Info } from "lucide-react";

export default function EquivalentFractionsPage() {
  const [baseNumerator, setBaseNumerator] = useState(1);
  const [baseDenominator, setBaseDenominator] = useState(2);
  const [multiplier, setMultiplier] = useState(1);

  const currentNumerator = baseNumerator * multiplier;
  const currentDenominator = baseDenominator * multiplier;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pecahan Senilai: Split & Merge</h2>
          <p className="text-slate-500 text-sm mt-1">
            Lihat bagaimana bentuk pecahan bisa berubah, tetapi nilainya (luas areanya) tetap sama.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-8 md:gap-16 mb-12 relative z-10 w-full justify-center">
            {/* Original Fraction */}
            <div className="flex flex-col items-center text-4xl md:text-5xl font-black font-mono text-slate-400">
              <div>{baseNumerator}</div>
              <div className="w-full h-1 bg-slate-300 my-1 rounded-full"></div>
              <div>{baseDenominator}</div>
            </div>

            <div className="flex flex-col gap-1 items-center justify-center text-indigo-400 font-bold font-mono px-2 md:px-4">
               <div className={`transition-all duration-500 ${multiplier > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>× {multiplier}</div>
               <div className="text-3xl md:text-4xl font-bold">=</div>
               <div className={`transition-all duration-500 ${multiplier > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>× {multiplier}</div>
            </div>

            {/* Equivalent Fraction */}
            <div className="flex flex-col items-center text-5xl md:text-7xl font-black font-mono text-indigo-600 transition-all duration-300 transform">
              <div className="flex items-center gap-2">
                {currentNumerator}
              </div>
              <div className="w-full h-1.5 md:h-2 bg-slate-800 my-2 rounded-full"></div>
              <div className="flex items-center gap-2">
                {currentDenominator}
              </div>
            </div>
          </div>

          {/* Area Model */}
          <div className="w-full max-w-lg h-32 md:h-40 relative z-10 bg-slate-50 border-2 border-slate-300 overflow-hidden shadow-inner">
             
             {/* The Colored Area */}
             <div className="absolute top-0 left-0 w-full h-full flex">
                {Array.from({ length: baseDenominator }).map((_, idx) => (
                  <div 
                    key={`color-${idx}`}
                    className={`h-full flex-1 transition-colors duration-700 ${idx < baseNumerator ? 'bg-indigo-400' : 'bg-transparent'}`}
                  />
                ))}
             </div>

             {/* Vertical Cuts (Base Denominator) */}
             <div className="absolute top-0 left-0 w-full h-full flex pointer-events-none">
                {Array.from({ length: baseDenominator }).map((_, idx) => (
                  <div 
                    key={`v-${idx}`}
                    className="h-full flex-1 border-r-2 border-slate-300/70 last:border-r-0 flex flex-col items-center justify-center"
                  >
                     <div className={`transition-all duration-500 delay-100 ${idx < baseNumerator ? 'opacity-40 scale-100' : 'opacity-0 scale-50'}`}>
                        <Box size={24} className="text-white drop-shadow-sm" />
                     </div>
                  </div>
                ))}
             </div>

             {/* Horizontal Cuts (Multiplier) */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {Array.from({ length: multiplier - 1 }).map((_, idx) => (
                  <div 
                    key={`h-${idx}`}
                    className="absolute left-0 w-full h-[2px] bg-slate-300/70 transition-all duration-700 ease-in-out"
                    style={{ 
                       top: `${((idx + 1) / multiplier) * 100}%`,
                       animation: 'fadeIn 0.5s ease-out'
                    }}
                  />
                ))}
             </div>
          </div>

          <div className="mt-8 text-center text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-xl border border-slate-100 shadow-sm relative z-10">
            Luas area yang diarsir <strong className="text-indigo-600">tidak berubah</strong>.
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-4">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
              Tentukan Pecahan Dasar
            </h3>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat:</p>
              <div className="flex gap-2 flex-wrap">
                {[[1,2], [1,3], [2,3], [3,4], [1,4]].map(([n, d]) => (
                  <button
                    key={`${n}-${d}`}
                    onClick={() => { setBaseNumerator(n); setBaseDenominator(d); setMultiplier(1); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold font-mono transition-colors"
                  >
                    {n}/{d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Buat Soal Sendiri:</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={baseDenominator} 
                     value={baseNumerator}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setBaseNumerator(Math.min(val, baseDenominator));
                       setMultiplier(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-10 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="1" max="10" 
                     value={baseDenominator}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setBaseDenominator(Math.max(val, baseNumerator));
                       setMultiplier(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</div>
              Ubah Potongan (Faktor Pengali)
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setMultiplier(num)}
                  className={`
                    py-3 rounded-xl font-bold font-mono transition-all active:scale-95
                    ${multiplier === num ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  x {num}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Mengalikan pembilang dan penyebut dengan bilangan yang sama identik dengan <strong>memotong ulang setiap blok</strong>, sehingga jumlahnya bertambah namun ukurannya mengecil.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed">
                Miskonsepsi umum adalah mengira {currentNumerator}/{currentDenominator} lebih besar dari {baseNumerator}/{baseDenominator} karena angkanya lebih besar. Padahal, keduanya melambangkan <strong>kuantitas yang persis sama</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
