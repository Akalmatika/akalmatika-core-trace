import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from 'react-katex';
import { ArrowLeft, CheckCircle2, XCircle, Info } from "lucide-react";

const SCENARIOS = [
  { n1: 2, d1: 5, n2: 4, d2: 5, label: "Penyebut Sama", tip: "Jika penyebutnya sama (ukuran potongan sama), lihat saja pembilangnya (jumlah potongannya)." },
  { n1: 2, d1: 3, n2: 2, d2: 5, label: "Pembilang Sama", tip: "Jika pembilangnya sama (jumlah potongan sama), yang penyebutnya lebih KECIL nilainya lebih BESAR (potongannya lebih tebal)." },
  { n1: 1, d1: 2, n2: 2, d2: 5, label: "Berbeda Keduanya", tip: "Melihat dari panjang area arsirannya, mana yang lebih mendominasi?" },
];

export default function CompareFractionsPage() {
  const [n1, setN1] = useState(2);
  const [d1, setD1] = useState(5);
  const [n2, setN2] = useState(4);
  const [d2, setD2] = useState(5);

  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedOp, setSelectedOp] = useState<'<' | '>' | '=' | null>(null);
  const [isSameDenominator, setIsSameDenominator] = useState(false);

  const correct = (n1*d2 < n2*d1) ? '<' : (n1*d2 > n2*d1) ? '>' : '=';
  
  const matchingScenario = SCENARIOS.find(s => s.n1 === n1 && s.d1 === d1 && s.n2 === n2 && s.d2 === d2);
  const tip = matchingScenario ? matchingScenario.tip : "Bandingkan nilai kedua pecahan. Mengubah ke penyebut yang sama dapat membantumu melihatnya lebih jelas.";

  useEffect(() => {
    setEvalResult('none');
    setSelectedOp(null);
    setIsSameDenominator(false);
  }, [n1, d1, n2, d2]);

  const handleGuess = (op: '<' | '>' | '=') => {
    setSelectedOp(op);
    if (op === correct) {
      setEvalResult('correct');
    } else {
      setEvalResult('wrong');
      setTimeout(() => setEvalResult('none'), 2000);
    }
  };

  const renderFractionBar = (baseNum: number, baseDen: number, multiplier: number, color: string) => {
    const currentNum = baseNum * multiplier;
    const currentDen = baseDen * multiplier;

    return (
      <div className="flex items-center gap-4 w-full">
        <div className="flex flex-col items-center text-xl font-bold font-mono text-slate-700 w-12 transition-all">
          <div>{currentNum}</div>
          <div className="w-full h-0.5 bg-slate-800 my-0.5 rounded-full"></div>
          <div>{currentDen}</div>
        </div>
        <div className="flex-1 h-16 relative bg-slate-50 overflow-hidden shadow-inner border-2 border-slate-300 w-full">
          {/* Base Color Fill */}
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${color}`}
            style={{ width: `${(baseNum / baseDen) * 100}%` }}
          />
          
          {/* Base Partitions */}
          {Array.from({ length: baseDen }).map((_, baseIdx) => (
            <div key={`col-${baseIdx}`} className="absolute top-0 h-full pointer-events-none" style={{ left: `${(baseIdx / baseDen) * 100}%`, width: `${(1 / baseDen) * 100}%` }}>
              <div className="absolute top-0 right-0 w-0.5 h-full bg-slate-300 pointer-events-none z-10" />
              {/* Multiplier Partitions */}
              <div className={`transition-all duration-500 w-full h-full absolute top-0 left-0 ${multiplier > 1 ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}>
                {Array.from({ length: Math.max(0, multiplier - 1) }).map((_, idx) => (
                  <div 
                    key={`slice-${idx}`}
                    className="absolute top-0 w-0.5 h-full bg-slate-300/80 pointer-events-none"
                    style={{ 
                      left: `${((idx + 1) / multiplier) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/student/visualizations/fractions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Galeri Pecahan
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Pembanding Pecahan</h2>
          <p className="text-slate-500 text-sm mt-1">
            Bandingkan ukuran dua buah pecahan secara visual.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center relative overflow-hidden">
          
          {evalResult === 'correct' && (
            <div className="absolute top-6 right-6 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl flex items-center gap-3 animate-bounce shadow-sm border border-emerald-200">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={20} /> Benar!
              </div>
              <div className="w-px h-6 bg-emerald-300"></div>
              <div className="flex items-center gap-2 text-base font-bold text-emerald-800">
                <InlineMath math={`\\frac{${n1}}{${d1}}`} /> 
                <span className="font-mono mt-1">{selectedOp}</span> 
                <InlineMath math={`\\frac{${n2}}{${d2}}`} />
              </div>
            </div>
          )}
          {evalResult === 'wrong' && (
            <div className="absolute top-6 right-6 z-20 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-shake">
              <XCircle size={20} /> Coba perhatikan lagi!
            </div>
          )}

          <div className="w-full flex flex-col gap-6 mt-8 relative z-10 max-w-lg mx-auto">
            {renderFractionBar(n1, d1, isSameDenominator ? d2 : 1, 'bg-indigo-400')}
            
            <div className="flex justify-center my-2 gap-4">
               {['<', '=', '>'].map((op) => (
                 <button 
                    key={op}
                    onClick={() => handleGuess(op as '<'|'>'|'=')}
                    className={`
                      w-12 h-12 rounded-xl font-bold text-2xl font-mono shadow-sm transition-all active:scale-95
                      ${selectedOp === op 
                          ? (evalResult === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                          : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50'
                      }
                    `}
                 >
                   {op}
                 </button>
               ))}
            </div>

            {renderFractionBar(n2, d2, isSameDenominator ? d1 : 1, 'bg-sky-400')}
            
            {/* Action Buttons */}
            {d1 !== d2 && (
              <div className="mt-4 flex justify-center w-full">
                <button
                  onClick={() => setIsSameDenominator(!isSameDenominator)}
                  className={`py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isSameDenominator 
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-2 border-slate-300' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 border-2 border-indigo-600'
                  }`}
                >
                  {isSameDenominator ? 'Kembalikan Penyebut Awal' : 'Samakan Penyebut'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">0</div>
              Tentukan Pecahan
            </h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-xs font-bold text-slate-400">Pilihan Skenario:</p>
              {SCENARIOS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setN1(s.n1); setD1(s.d1); setN2(s.n2); setD2(s.d2); }}
                  className={`
                    py-2.5 px-4 rounded-xl text-sm font-bold text-left transition-all active:scale-95
                    ${matchingScenario?.label === s.label ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {s.label} (<InlineMath math={`\\frac{${s.n1}}{${s.d1}}`} /> vs <InlineMath math={`\\frac{${s.n2}}{${s.d2}}`} />)
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Buat Soal Sendiri:</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={d1} 
                     value={n1}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setN1(Math.min(val, d1));
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="1" max="20" 
                     value={d1}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setD1(Math.max(val, 1));
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                 </div>
                 
                 <div className="font-bold text-slate-400 text-sm">vs</div>

                 <div className="flex flex-col items-center gap-1.5">
                   <input 
                     type="number" min="1" max={d2} 
                     value={n2}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setN2(Math.min(val, d2));
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                   <div className="w-8 h-0.5 bg-slate-300 rounded-full"></div>
                   <input 
                     type="number" min="1" max="20" 
                     value={d2}
                     onChange={(e) => {
                       const val = parseInt(e.target.value) || 1;
                       setD2(Math.max(val, 1));
                     }}
                     className="w-12 text-center border border-slate-200 rounded-md py-1 font-mono text-xs focus:outline-none focus:border-indigo-400"
                   />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Tips:</strong> {tip}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
