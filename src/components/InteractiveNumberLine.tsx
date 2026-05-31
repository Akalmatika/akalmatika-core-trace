import { useState, useEffect, useMemo } from "react";
import { HelpCircle, PlayCircle, RotateCcw, PauseCircle } from "lucide-react";

export interface NumberLineProps {
  initialEquation: {
    expression: string;
    a: number;
    b: number;
    op: '+' | '-';
    detectedMisconceptionCode?: string | null;
  };
  onNextQuestion?: () => void;
  onProceedToDrill?: () => void;
}

type NumberLineState = 
  | 'IDLE' 
  | 'HIGHLIGHT_A' 
  | 'MOVE_ZERO_TO_A' 
  | 'HIGHLIGHT_OPERATOR' 
  | 'EXPLAIN_OPERATOR' 
  | 'HIGHLIGHT_B' 
  | 'SHOW_OPPOSITE_OF_B' 
  | 'TRANSFORM_TO_ADDITION' 
  | 'MOVE_BY_B' 
  | 'SHOW_RESULT';

export default function InteractiveNumberLine({ initialEquation, onNextQuestion, onProceedToDrill }: NumberLineProps) {
  const [a, setA] = useState(initialEquation.a);
  const [b, setB] = useState(initialEquation.b);
  const [op, setOp] = useState<'+'|'-'>(initialEquation.op);

  const [inputA, setInputA] = useState(initialEquation.a.toString());
  const [inputB, setInputB] = useState(initialEquation.b.toString());
  const [inputOp, setInputOp] = useState<'+'|'-'>(initialEquation.op);

  const correctAnswer = op === '-' ? a - b : a + b;
  const movement = op === '-' ? -b : b;

  const [state, setState] = useState<NumberLineState>('IDLE');
  const [isPaused, setIsPaused] = useState(false);
  
  // Timing parameters (disesuaikan dengan panjang teks eksplanasi)
  const TIMING = {
    IDLE: 500,
    HIGHLIGHT_A: 1500,
    MOVE_ZERO_TO_A: 2000, 
    HIGHLIGHT_OPERATOR: 1500,
    EXPLAIN_OPERATOR: 4500, // ~75 karakter
    HIGHLIGHT_B: 2500, // ~35 karakter
    SHOW_OPPOSITE_OF_B: 3000, // ~25 karakter
    TRANSFORM_TO_ADDITION: 4000, // ~60 karakter
    MOVE_BY_B: 6000, // ~90 karakter + 2s durasi animasi panah
    SHOW_RESULT: 3000,
  };

  useEffect(() => {
    // Reset state when equation changes from props
    setA(initialEquation.a);
    setB(initialEquation.b);
    setOp(initialEquation.op);
    setInputA(initialEquation.a.toString());
    setInputB(initialEquation.b.toString());
    setInputOp(initialEquation.op);
    setState('IDLE');
    setIsPaused(false);
  }, [initialEquation.a, initialEquation.b, initialEquation.op]);

  useEffect(() => {
    if (isPaused) return;

    let timer: NodeJS.Timeout;
    
    switch(state) {
      case 'IDLE':
        timer = setTimeout(() => setState('HIGHLIGHT_A'), TIMING.IDLE);
        break;
      case 'HIGHLIGHT_A':
        timer = setTimeout(() => setState('MOVE_ZERO_TO_A'), TIMING.HIGHLIGHT_A);
        break;
      case 'MOVE_ZERO_TO_A':
        timer = setTimeout(() => setState('HIGHLIGHT_OPERATOR'), TIMING.MOVE_ZERO_TO_A);
        break;
      case 'HIGHLIGHT_OPERATOR':
        timer = setTimeout(() => setState('EXPLAIN_OPERATOR'), TIMING.HIGHLIGHT_OPERATOR);
        break;
      case 'EXPLAIN_OPERATOR':
        timer = setTimeout(() => setState('HIGHLIGHT_B'), TIMING.EXPLAIN_OPERATOR);
        break;
      case 'HIGHLIGHT_B':
        if (op === '-') {
          timer = setTimeout(() => setState('SHOW_OPPOSITE_OF_B'), TIMING.HIGHLIGHT_B);
        } else {
          timer = setTimeout(() => setState('MOVE_BY_B'), TIMING.HIGHLIGHT_B);
        }
        break;
      case 'SHOW_OPPOSITE_OF_B':
        timer = setTimeout(() => setState('TRANSFORM_TO_ADDITION'), TIMING.SHOW_OPPOSITE_OF_B);
        break;
      case 'TRANSFORM_TO_ADDITION':
        timer = setTimeout(() => setState('MOVE_BY_B'), TIMING.TRANSFORM_TO_ADDITION);
        break;
      case 'MOVE_BY_B':
        timer = setTimeout(() => setState('SHOW_RESULT'), TIMING.MOVE_BY_B);
        break;
      case 'SHOW_RESULT':
        // Done
        break;
    }

    return () => clearTimeout(timer);
  }, [state, op, isPaused]);

  const handleRestart = () => {
    setState('IDLE');
    setIsPaused(false);
  };

  const handleAnimateCustom = () => {
    const parsedA = parseInt(inputA);
    const parsedB = parseInt(inputB);
    if (!isNaN(parsedA) && !isNaN(parsedB)) {
      setA(parsedA);
      setB(parsedB);
      setOp(inputOp);
      setState('IDLE');
      setIsPaused(false);
    }
  };

  // Helpers for checking state progress
  const passed = (target: NumberLineState) => {
    const order: NumberLineState[] = [
      'IDLE', 'HIGHLIGHT_A', 'MOVE_ZERO_TO_A', 'HIGHLIGHT_OPERATOR', 'EXPLAIN_OPERATOR', 
      'HIGHLIGHT_B', 'SHOW_OPPOSITE_OF_B', 'TRANSFORM_TO_ADDITION', 
      'MOVE_BY_B', 'SHOW_RESULT'
    ];
    // If target is in the subtraction-only branch and we are adding, we skip those
    if (op === '+') {
       if (target === 'SHOW_OPPOSITE_OF_B' || target === 'TRANSFORM_TO_ADDITION') {
           return false;
       }
    }
    return order.indexOf(state) >= order.indexOf(target);
  };

  // SVG Coordinates setup
  const viewBoxWidth = 800;
  const viewBoxHeight = 240;
  const axisY = 160;
  const marginX = 50;
  const scaleWidth = viewBoxWidth - marginX * 2;
  
  const getX = (val: number) => {
    const clampedVal = Math.max(-10, Math.min(10, val));
    return marginX + ((clampedVal + 10) / 20) * scaleWidth;
  };

  const ticks = useMemo(() => {
    const arr = [];
    for (let i = -10; i <= 10; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  const startX = getX(a);
  const endX = getX(correctAnswer);
  
  // Arrow from 0 to A (Straight line at Y = axisY - 30)
  const arrow1Y = axisY - 30;
  const arrow1D = `M ${getX(0)} ${arrow1Y} L ${startX} ${arrow1Y}`;
  
  // Arrow from A to Result (Straight line at Y = axisY - 60)
  const arrow2Y = axisY - 60;
  const arrow2D = `M ${startX} ${arrow2Y} L ${endX} ${arrow2Y}`;

  const renderExplanation = () => {
    switch(state) {
      case 'HIGHLIGHT_A':
      case 'MOVE_ZERO_TO_A':
        return `Posisi awal kita adalah ${a}.`;
      case 'HIGHLIGHT_OPERATOR':
      case 'EXPLAIN_OPERATOR':
        return op === '+' 
          ? `Tanda + di sini adalah tanda operasi. Artinya: kita menambahkan bilangan berikutnya.`
          : `Mengurangkan bilangan sama artinya menambahkan lawan dari bilangan itu.`;
      case 'HIGHLIGHT_B':
        return op === '+'
          ? `Bilangan yang ditambahkan adalah ${b}.`
          : `Bilangan yang dikurangkan adalah ${b}.`;
      case 'SHOW_OPPOSITE_OF_B':
        return `Lawan dari ${b} adalah ${-b}.`;
      case 'TRANSFORM_TO_ADDITION':
        return `Sekarang pengurangan kita baca sebagai penjumlahan lawannya.`;
      case 'MOVE_BY_B':
        return `Karena sekarang kita menjumlahkan dengan ${movement}, artinya kita bergerak ${Math.abs(movement)} ke ${movement > 0 ? 'kanan' : 'kiri'}.`;
      case 'SHOW_RESULT':
        return `Selesai! Hasil akhirnya adalah ${correctAnswer}.`;
      default:
        return "Memulai visualisasi...";
    }
  };

  const isTransformed = (passed('TRANSFORM_TO_ADDITION') || passed('MOVE_BY_B') || passed('SHOW_RESULT')) && op === '-';

  return (
    <div id="interactive-number-line" className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-black text-slate-900 tracking-tight text-lg md:text-xl flex items-center gap-2">
            <HelpCircle size={22} className="text-indigo-600 animate-pulse" />
            Papan Garis Bilangan Vektor
          </h3>
          <p className="text-sm text-slate-500 font-sans mt-1">
            Membongkar makna perpindahan posisi dari setiap operasi matematis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="bg-slate-100 text-slate-650 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer font-sans font-bold shadow-sm"
            >
              Soal Berikutnya
            </button>
          )}
          {onProceedToDrill && (
            <button
              onClick={onProceedToDrill}
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer font-sans font-bold shadow-sm"
            >
              Lanjut Latihan
            </button>
          )}
        </div>
      </div>

      {/* Custom Equation Input */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Kustomisasi Soal:</span>
          <input 
            type="number" 
            value={inputA} 
            onChange={(e) => setInputA(e.target.value)}
            className="w-16 px-2 py-1 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
          />
          <select 
            value={inputOp} 
            onChange={(e) => setInputOp(e.target.value as '+'|'-')}
            className="w-12 px-1 py-1 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
          >
            <option value="+">+</option>
            <option value="-">-</option>
          </select>
          <input 
            type="number" 
            value={inputB} 
            onChange={(e) => setInputB(e.target.value)}
            className="w-16 px-2 py-1 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
          />
          <button 
            onClick={handleAnimateCustom}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlayCircle size={14} /> Animasikan
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Tantangan Cepat:</span>
          {[
            { a: 3, op: '+', b: -5, label: "3 + (-5)" },
            { a: -4, op: '+', b: -3, label: "-4 + (-3)" },
            { a: -2, op: '-', b: 3, label: "-2 - 3" },
            { a: 4, op: '-', b: 6, label: "4 - 6" },
            { a: 5, op: '-', b: -2, label: "5 - (-2)" },
            { a: -3, op: '-', b: -7, label: "-3 - (-7)" },
            { a: -8, op: '+', b: 5, label: "-8 + 5" },
            { a: 0, op: '-', b: -4, label: "0 - (-4)" },
          ].map((q, idx) => (
             <button 
               key={idx}
               onClick={() => {
                 setInputA(q.a.toString());
                 setInputOp(q.op as '+'|'-');
                 setInputB(q.b.toString());
                 setA(q.a);
                 setOp(q.op as '+'|'-');
                 setB(q.b);
                 setState('IDLE');
                 setIsPaused(false);
               }}
               className="px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer shadow-2xs"
             >
               {q.label}
             </button>
          ))}
        </div>
      </div>

      {/* Main Equation Display with Highlights */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl py-6 px-4 flex flex-col items-center justify-center space-y-4 relative">
        
        {/* Pause Button (Statis) */}
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center ${isPaused ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          title={isPaused ? "Lanjutkan Animasi" : "Jeda Animasi"}
        >
          {isPaused ? <PlayCircle size={22} /> : <PauseCircle size={22} />}
        </button>

        {/* Dynamic Text Explanation (Top) */}
        <div className="h-10 flex items-center justify-center px-4 w-full">
          <span className="text-sm md:text-base font-bold text-slate-700 tracking-wide animate-fadeIn font-sans bg-amber-100 text-amber-800 px-5 py-2 rounded-xl border border-amber-200 text-center shadow-xs">
            {renderExplanation()}
          </span>
        </div>

        {/* The Equation */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 max-w-full text-4xl md:text-6xl font-black font-mono tracking-tighter">
          
          {/* Term A */}
          <div className="relative min-w-0 md:min-w-[64px] h-16 flex items-center justify-center">
            <span className={`transition-all duration-300 absolute ${
              state === 'HIGHLIGHT_A' || state === 'MOVE_ZERO_TO_A'
                ? 'text-amber-500 scale-110' 
                : 'text-slate-700'
            }`}>
              {a < 0 ? `(${a})` : a}
            </span>
          </div>
          
          {/* Operator */}
          <div className="relative min-w-0 md:min-w-[48px] h-16 flex items-center justify-center">
             {/* NEW Operator */}
             {op === '-' && (
               <span className={`absolute font-black text-emerald-500 pointer-events-none ${isTransformed ? 'animate-fusion-in-center' : 'opacity-0'}`}>
                 +
               </span>
             )}
             
             {/* OLD Operator */}
             <span className={`absolute transition-all duration-300 ${
                isTransformed ? 'animate-fusion-out-right' : 
                state === 'HIGHLIGHT_OPERATOR' || state === 'EXPLAIN_OPERATOR'
                  ? 'text-amber-500 scale-110 opacity-100'
                  : 'text-slate-700 opacity-100 scale-100'
             }`}>
               {op}
             </span>
          </div>

          {/* Term B */}
          <div className="relative min-w-0 md:min-w-[80px] h-16 flex items-center justify-center">
             {/* NEW Term B */}
             {op === '-' && (
               <span className={`absolute font-black text-emerald-500 pointer-events-none ${isTransformed ? 'animate-fusion-in-center' : 'opacity-0'}`}>
                 {-b < 0 ? `(${-b})` : -b}
               </span>
             )}

             {/* OLD Term B */}
             <span className={`absolute transition-all duration-300 ${
                isTransformed ? 'animate-fusion-out-left' :
                state === 'HIGHLIGHT_B' || state === 'SHOW_OPPOSITE_OF_B'
                  ? 'text-amber-500 scale-110 opacity-100'
                  : 'text-slate-700 opacity-100 scale-100'
             }`}>
               {b < 0 ? `(${b})` : b}
             </span>
          </div>

          {/* Equals & Result */}
          {passed('SHOW_RESULT') && (
            <>
              <span className="text-slate-700 animate-fadeIn ml-2">=</span>
              <span tabIndex={0} className="text-emerald-600 animate-fadeIn drop-shadow-md scale-110 ml-4 flex items-center relative group outline-hidden">
                {correctAnswer > 0 ? (
                  <>
                    <span className="animate-fade-out-plus inline-block origin-right">+</span>
                    <span>{correctAnswer}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 text-center shadow-lg font-sans normal-case tracking-normal leading-tight">
                      Tanda plus pada bilangan positif tidak perlu ditulis.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </>
                ) : correctAnswer}
              </span>
            </>
          )}

        </div>

        {/* Kesimpulan Pop-up */}
        {passed('SHOW_RESULT') && op === '-' && (
          <div className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm md:text-base font-bold shadow-lg animate-bounce font-mono tracking-wide border border-indigo-500">
            Kesimpulan: {a} - {b < 0 ? `(${b})` : b} = {a} + {-b < 0 ? `(${-b})` : -b} = {correctAnswer}
          </div>
        )}
      </div>

      {/* SVG Number Line Canvas */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 relative overflow-hidden select-none shadow-2xl mt-4">
        
        {/* Floating Ulangi Animasi Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleRestart}
            className="bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer font-sans font-bold shadow-md border border-slate-700 backdrop-blur-sm"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Ulangi Animasi</span>
          </button>
        </div>

        <svg 
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Axis Line */}
          <line x1={marginX - 20} y1={axisY} x2={viewBoxWidth - marginX + 20} y2={axisY} stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
          <path d={`M ${marginX - 30} ${axisY} L ${marginX - 15} ${axisY - 8} L ${marginX - 15} ${axisY + 8} Z`} fill="#475569" />
          <path d={`M ${viewBoxWidth - marginX + 30} ${axisY} L ${viewBoxWidth - marginX + 15} ${axisY - 8} L ${viewBoxWidth - marginX + 15} ${axisY + 8} Z`} fill="#475569" />

          {/* Ticks */}
          {ticks.map((val) => {
            const tx = getX(val);
            const isZero = val === 0;
            const isA = passed('MOVE_ZERO_TO_A') && val === a;
            const isRes = passed('SHOW_RESULT') && val === correctAnswer;
            return (
              <g key={`tick-${val}`} className="transition-all duration-500">
                <line x1={tx} y1={axisY - 6} x2={tx} y2={axisY + 6} stroke={isZero ? "#cbd5e1" : "#64748b"} strokeWidth={isZero ? "3" : "2"} />
                <text 
                  x={tx} y={axisY + 30} 
                  textAnchor="middle" 
                  fill={isZero ? "#f8fafc" : isA ? "#fcd34d" : isRes ? "#34d399" : "#94a3b8"} 
                  fontSize={isA || isRes ? "18" : "14"} 
                  fontFamily="monospace"
                  fontWeight={isZero || isA || isRes ? "bold" : "normal"}
                  className="select-none"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* First Arrow: 0 to A */}
          {passed('MOVE_ZERO_TO_A') && a !== 0 && (
            <g className="animate-dash">
              <path 
                d={arrow1D} 
                fill="none" 
                stroke={a > 0 ? "#38bdf8" : "#fb7185"} 
                strokeWidth="4" 
                strokeDasharray="1000"
                strokeDashoffset="0"
                className="path-draw-anim"
                markerEnd="url(#arrowheadA)"
              />
              <text 
                x={(getX(0) + startX) / 2} 
                y={arrow1Y - 8} 
                textAnchor="middle" 
                fill={a > 0 ? "#38bdf8" : "#fb7185"} 
                fontSize="16" 
                fontFamily="monospace"
                fontWeight="bold"
                className="animate-fadeIn select-none drop-shadow-md"
              >
                {a > 0 ? `+${a}` : a}
              </text>
            </g>
          )}

          {/* Second Arrow: A to Result */}
          {passed('MOVE_BY_B') && movement !== 0 && (
            <g className="animate-dash">
              <path 
                d={arrow2D} 
                fill="none" 
                stroke={movement > 0 ? "#38bdf8" : "#fb7185"} 
                strokeWidth="5" 
                strokeDasharray="1000"
                strokeDashoffset="0"
                className="path-draw-anim-slow"
                markerEnd="url(#arrowheadRes)"
              />
              <text 
                x={(startX + endX) / 2} 
                y={arrow2Y - 8} 
                textAnchor="middle" 
                fill={movement > 0 ? "#38bdf8" : "#fb7185"} 
                fontSize="18" 
                fontFamily="monospace"
                fontWeight="bold"
                className="animate-fadeIn select-none drop-shadow-md"
              >
                {movement > 0 ? `+${movement}` : movement}
              </text>
            </g>
          )}

          {/* Start Point Marker (A) */}
          {(passed('MOVE_ZERO_TO_A') && !passed('SHOW_RESULT')) && (
            <>
              <line x1={startX} y1={axisY} x2={startX} y2={arrow1Y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
              <circle cx={startX} cy={axisY} r="6" fill="#fcd34d" className="animate-ping-slow origin-center" />
            </>
          )}

          {/* End Point Marker (Result) */}
          {passed('SHOW_RESULT') && (
            <>
              <line x1={endX} y1={axisY} x2={endX} y2={arrow2Y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
              <circle cx={endX} cy={axisY} r="8" fill="#34d399" className="animate-ping-slow origin-center" />
            </>
          )}

          {/* SVG Definitions for Arrowheads */}
          <defs>
            <marker id="arrowheadA" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" fill={a > 0 ? "#38bdf8" : "#fb7185"} />
            </marker>
            <marker id="arrowheadRes" markerWidth="4" markerHeight="3" refX="3.5" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" fill={movement > 0 ? "#38bdf8" : "#fb7185"} />
            </marker>
            <style>
              {`
                .path-draw-anim {
                  animation: drawPath 1.5s ease-out forwards;
                }
                .path-draw-anim-slow {
                  animation: drawPath 2s ease-out forwards;
                }
                @keyframes drawPath {
                  from { stroke-dashoffset: 1000; }
                  to { stroke-dashoffset: 0; }
                }
                
                /* Fusion Animation */
                @keyframes fusionOutRight {
                  0% { transform: scale(1.1) translateX(0); opacity: 1; filter: blur(0px); }
                  100% { transform: scale(0.8) translateX(25px) rotate(45deg); opacity: 0; filter: blur(4px); }
                }
                @keyframes fusionOutLeft {
                  0% { transform: scale(1.1) translateX(0); opacity: 1; filter: blur(0px); }
                  100% { transform: scale(0.8) translateX(-25px) rotate(-45deg); opacity: 0; filter: blur(4px); }
                }
                @keyframes fusionInCenter {
                  0% { transform: scale(1.8) translateY(-10px); opacity: 0; filter: blur(10px); text-shadow: 0 0 20px #10b981; }
                  50% { transform: scale(1.2) translateY(5px); opacity: 1; filter: blur(0px); text-shadow: 0 0 10px #10b981; }
                  100% { transform: scale(1.1) translateY(0); opacity: 1; filter: blur(0px); text-shadow: 0 0 0px transparent; }
                }
                .animate-fusion-out-right { animation: fusionOutRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .animate-fusion-out-left { animation: fusionOutLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .animate-fusion-in-center { animation: fusionInCenter 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                
                /* Fade Out Plus Sign */
                @keyframes fadeOutPlus {
                  0% { opacity: 1; transform: scale(1) translateX(0); width: auto; margin-right: 0px; }
                  60% { opacity: 1; transform: scale(1) translateX(0); width: auto; margin-right: 0px; }
                  100% { opacity: 0; transform: scale(0.5) translateX(10px); width: 0; margin-right: -15px; }
                }
                .animate-fade-out-plus {
                  animation: fadeOutPlus 2.5s ease-in-out forwards;
                  display: inline-block;
                  overflow: hidden;
                }
              `}
            </style>
          </defs>

        </svg>
      </div>

      {/* Keterangan Arah Perpindahan */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold font-sans pt-2">
        <div className="bg-sky-50 text-sky-700 px-4 py-2.5 rounded-xl border border-sky-100 flex items-center gap-2 shadow-xs w-full sm:w-auto">
          <span className="text-sky-500 text-lg leading-none font-black">+</span>
          <span>Menjumlahkan Positif = Bergerak ke <span className="font-black text-sky-600">KANAN</span></span>
        </div>
        <div className="bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl border border-rose-100 flex items-center gap-2 shadow-xs w-full sm:w-auto">
          <span className="text-rose-500 text-lg leading-none font-black">-</span>
          <span>Menjumlahkan Negatif = Bergerak ke <span className="font-black text-rose-600">KIRI</span></span>
        </div>
      </div>

    </div>
  );
}
