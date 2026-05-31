import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, Info } from "lucide-react";

export default function SimplifyFractionPage() {
  const [baseNumerator, setBaseNumerator] = useState(6);
  const [baseDenominator, setBaseDenominator] = useState(12);
  const [divisor, setDivisor] = useState(1);

  const currentNumerator = baseNumerator / divisor;
  const currentDenominator = baseDenominator / divisor;
  
  const validDivisors = useMemo(() => {
    const divisors = [];
    const min = Math.min(baseNumerator, baseDenominator);
    for (let i = 1; i <= min; i++) {
      if (baseNumerator % i === 0 && baseDenominator % i === 0) {
        divisors.push(i);
      }
    }
    return divisors;
  }, [baseNumerator, baseDenominator]);

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mesin Menyederhanakan Pecahan</h2>
          <p className="text-slate-500 text-sm mt-1">
            Ubah pecahan menjadi bentuk lebih sederhana tanpa mengubah nilainya dengan membagi pembilang dan penyebut.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-6 md:gap-12 mb-12 relative z-10 w-full justify-center">
            {/* Original Fraction */}
            <div className="flex flex-col items-center text-3xl md:text-4xl font-black font-mono text-slate-400">
              <div>{baseNumerator}</div>
              <div className="w-full h-1 bg-slate-300 my-1 rounded-full"></div>
              <div>{baseDenominator}</div>
            </div>
            
            <div className="flex flex-col gap-1 items-center justify-center text-indigo-400 font-bold font-mono px-2 md:px-4">
               <div className={`transition-all duration-500 ${divisor > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>÷ {divisor}</div>
               <div className="text-3xl md:text-4xl font-bold">=</div>
               <div className={`transition-all duration-500 ${divisor > 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>÷ {divisor}</div>
            </div>

            {/* Simplified Fraction */}
            <div className="flex flex-col items-center text-5xl md:text-7xl font-black font-mono text-indigo-600 transition-all duration-300">
              <div className="flex items-center gap-2">{currentNumerator}</div>
              <div className="w-full h-1.5 md:h-2 bg-slate-800 my-2 rounded-full"></div>
              <div className="flex items-center gap-2">{currentDenominator}</div>
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
                {Array.from({ length: baseDenominator - 1 }).map((_, idx) => {
                  const isMajorBorder = (idx + 1) % divisor === 0;
                  return (
                    <div 
                      key={`v-${idx}`}
                      className={`h-full flex-1 border-r-2 transition-all duration-700 ${isMajorBorder ? 'border-slate-300/70' : 'border-transparent'}`}
                    />
                  );
                })}
                <div className="h-full flex-1"></div>
             </div>

          </div>

          <div className="mt-8 text-center text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-xl border border-slate-100 shadow-sm relative z-10">
            Menyederhanakan = <strong>Menggabungkan (Merge)</strong> potongan kecil menjadi potongan besar.
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-4">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">0</div>
              Tentukan Pecahan Dasar
            </h3>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat:</p>
              <div className="flex gap-2 flex-wrap">
                {[[6,12], [4,8], [9,12], [10,15], [8,16]].map(([n, d]) => (
                  <button
                    key={`${n}-${d}`}
                    onClick={() => { setBaseNumerator(n); setBaseDenominator(d); setDivisor(1); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold font-mono transition-colors"
                  >
                    <InlineMath math={`\\frac{${n}}{${d}}`} />
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
                       setDivisor(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-10 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="1" max="24" 
                     value={baseDenominator}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setBaseDenominator(Math.max(val, baseNumerator));
                       setDivisor(1);
                     }}
                     className="w-16 text-center border border-slate-200 rounded-md py-1 font-mono text-sm focus:outline-none focus:border-indigo-400"
                   />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
              Pilih Faktor Pembagi Sama
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {validDivisors.map(num => (
                <button
                  key={num}
                  onClick={() => setDivisor(num)}
                  className={`
                    py-3 rounded-xl font-bold font-mono transition-all active:scale-95
                    ${divisor === num ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  ÷ {num}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Membagi pembilang dan penyebut dengan faktor yang sama tidak mengubah nilai pecahan. <InlineMath math={`\\frac{${baseNumerator}}{${baseDenominator}}`} /> senilai dengan <InlineMath math={`\\frac{${currentNumerator}}{${currentDenominator}}`} />.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800 leading-relaxed">
                <strong>Bentuk Paling Sederhana</strong> tercapai jika pembilang dan penyebut tidak memiliki faktor pembagi persekutuan lagi selain 1 (Membagi dengan faktor terbesar: <strong>6</strong>).
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
