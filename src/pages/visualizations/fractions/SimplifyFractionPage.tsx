import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Combine, Info } from "lucide-react";

export default function SimplifyFractionPage() {
  const [baseNumerator] = useState(6);
  const [baseDenominator] = useState(12);
  const [divisor, setDivisor] = useState(1);

  const currentNumerator = baseNumerator / divisor;
  const currentDenominator = baseDenominator / divisor;
  const validDivisors = [1, 2, 3, 6];

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
            
            {/* Operation visual */}
            <div className="flex flex-col gap-1 items-center justify-center text-indigo-400 font-bold font-mono">
               <div className={`transition-all ${divisor > 1 ? 'opacity-100' : 'opacity-0'}`}>÷ {divisor}</div>
               <div className="text-2xl">→</div>
               <div className={`transition-all ${divisor > 1 ? 'opacity-100' : 'opacity-0'}`}>÷ {divisor}</div>
            </div>

            {/* Simplified Fraction */}
            <div className="flex flex-col items-center text-5xl md:text-7xl font-black font-mono text-indigo-600 transition-all duration-300">
              <div>{currentNumerator}</div>
              <div className="w-full h-1.5 md:h-2 bg-slate-800 my-2 rounded-full"></div>
              <div>{currentDenominator}</div>
            </div>
          </div>

          {/* Area Model */}
          <div className="w-full max-w-lg h-32 md:h-40 flex border-2 border-slate-300 relative z-10 bg-slate-50 overflow-hidden shadow-inner transition-all duration-500">
             {Array.from({ length: currentDenominator }).map((_, idx) => (
                <div 
                  key={idx}
                  className={`
                    h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 
                    transition-all duration-500 ease-out flex items-center justify-center
                    ${idx < currentNumerator ? 'bg-indigo-400' : 'bg-transparent'}
                  `}
                >
                  <div className={`transition-all duration-500 ${idx < currentNumerator ? 'opacity-50 scale-100' : 'opacity-0 scale-50'}`}>
                    {divisor > 1 ? <Combine size={24} className="text-white" /> : <div className="w-4 h-4 bg-white rounded-sm" />}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 text-center text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-xl border border-slate-100 shadow-sm relative z-10">
            Menyederhanakan = <strong>Menggabungkan (Merge)</strong> potongan kecil menjadi potongan besar.
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
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
              Membagi pembilang dan penyebut dengan faktor yang sama tidak mengubah nilai pecahan. {baseNumerator}/{baseDenominator} senilai dengan {currentNumerator}/{currentDenominator}.
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
