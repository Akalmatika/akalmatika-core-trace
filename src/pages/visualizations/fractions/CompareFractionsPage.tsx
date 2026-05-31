import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Info } from "lucide-react";

type Scenario = {
  n1: number; d1: number; n2: number; d2: number; correct: '<' | '>' | '=';
  label: string; tip: string;
};

const SCENARIOS: Scenario[] = [
  { n1: 2, d1: 5, n2: 4, d2: 5, correct: '<', label: "Penyebut Sama", tip: "Jika penyebutnya sama (ukuran potongan sama), lihat saja pembilangnya (jumlah potongannya)." },
  { n1: 2, d1: 3, n2: 2, d2: 5, correct: '>', label: "Pembilang Sama", tip: "Jika pembilangnya sama (jumlah potongan sama), yang penyebutnya lebih KECIL nilainya lebih BESAR (potongannya lebih tebal)." },
  { n1: 1, d1: 2, n2: 2, d2: 5, correct: '>', label: "Berbeda Keduanya", tip: "Melihat dari panjang area arsirannya, mana yang lebih mendominasi?" },
];

export default function CompareFractionsPage() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [evalResult, setEvalResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [selectedOp, setSelectedOp] = useState<'<' | '>' | '=' | null>(null);

  const sc = SCENARIOS[scenarioIdx];

  useEffect(() => {
    setEvalResult('none');
    setSelectedOp(null);
  }, [scenarioIdx]);

  const handleGuess = (op: '<' | '>' | '=') => {
    setSelectedOp(op);
    if (op === sc.correct) {
      setEvalResult('correct');
    } else {
      setEvalResult('wrong');
      setTimeout(() => setEvalResult('none'), 2000);
    }
  };

  const renderFractionBar = (num: number, den: number, color: string) => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex flex-col items-center text-xl font-bold font-mono text-slate-700 w-12">
        <div>{num}</div>
        <div className="w-full h-0.5 bg-slate-800 my-0.5"></div>
        <div>{den}</div>
      </div>
      <div className="flex-1 h-16 flex border-2 border-slate-300 relative bg-slate-50 overflow-hidden shadow-inner w-full">
        {Array.from({ length: den }).map((_, idx) => (
          <div 
            key={idx}
            className={`
              h-full flex-1 border-r-2 border-slate-300/50 last:border-r-0 transition-all duration-500
              ${idx < num ? color : 'bg-transparent'}
            `}
          />
        ))}
      </div>
    </div>
  );

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
            <div className="absolute top-6 right-6 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={20} /> Benar!
            </div>
          )}
          {evalResult === 'wrong' && (
            <div className="absolute top-6 right-6 z-20 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-shake">
              <XCircle size={20} /> Coba perhatikan lagi!
            </div>
          )}

          <div className="w-full flex flex-col gap-6 mt-8 relative z-10 max-w-lg mx-auto">
            {renderFractionBar(sc.n1, sc.d1, 'bg-indigo-400')}
            
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

            {renderFractionBar(sc.n2, sc.d2, 'bg-sky-400')}
          </div>

        </div>

        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</div>
              Pilih Skenario Kasus
            </h3>
            
            <div className="flex flex-col gap-3 mb-4">
              {SCENARIOS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setScenarioIdx(idx)}
                  className={`
                    py-3 px-4 rounded-xl text-sm font-bold text-left transition-all active:scale-95
                    ${scenarioIdx === idx ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mt-4">
            <div className="flex items-start gap-3">
              <Info className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Tips:</strong> {sc.tip}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
