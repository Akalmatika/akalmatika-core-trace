/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Minus, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Coins, 
  Info,
  Trash2,
  Terminal,
  CheckCircle2,
  RefreshCw,
  PlayCircle,
  ArrowRight,
  Wand2
} from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface Coin {
  id: string;
  value: 1 | -1; // +1 (blue) or -1 (red)
  x: number; // percentage of workspace width (0 to 100)
  y: number; // percentage of workspace height (0 to 100)
  isNeutralizing: boolean;
  opacity: number;
  isDropping?: boolean;
  hp?: number;
  isShooting?: boolean;
}

type PresentationState = 'IDLE' | 'STEP_A' | 'STEP_OP' | 'STEP_B' | 'DONE';

interface NeutralEffect {
  id: string;
  x: number; // percentage
  y: number; // percentage
  createdAt: number;
}

const IceSvg = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8L12 4L20 8L12 12L4 8Z" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 8V16L12 20V12" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20 8V16L12 20V12" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Highlights */}
    <path d="M12 4.5L19 8" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
    <path d="M5 8.5V15.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
  </svg>
);

const FireSvg = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Logs */}
    <path d="M6 18L18 14" stroke="#78350f" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18L6 14" stroke="#451a03" strokeWidth="2" strokeLinecap="round"/>
    {/* Flames */}
    <path d="M12 20C12 20 6 16 6 10C6 6.5 9.5 4 12 2C12 2 12 6 14 7C14 7 18 8 18 12C18 16 12 20 12 20Z" fill="#f97316"/>
    <path d="M12 18C12 18 8 15 8 11C8 8.5 10.5 6 12 5C12 5 12 8 13.5 8.5C13.5 8.5 16 9 16 12C16 15 12 18 12 18Z" fill="#fde047"/>
  </svg>
);

export interface CoinSandboxProps {
  studentMode?: boolean;
  initialEquation?: {
    expression: string;
    a: number;
    b: number;
    op: '+' | '-';
    detectedMisconceptionCode?: string | null;
  };
  onBackToDiagnostic?: () => void;
  onProceedToDrill?: () => void;
  onEquationChange?: (eq: { expression: string; a: number; b: number; op: '+' | '-'; detectedMisconceptionCode?: string | null }) => void;
}

export default function CoinSandbox({ studentMode = false, initialEquation, onBackToDiagnostic, onProceedToDrill, onEquationChange }: CoinSandboxProps = {}) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<{ id: string; timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeEquation, setActiveEquation] = useState(initialEquation);
  const [presentationState, setPresentationState] = useState<PresentationState>('DONE');
  const [isTransformed, setIsTransformed] = useState(false);
  const [isGathering, setIsGathering] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const isAutoSolvingRef = useRef(false);
  const [hasNeutralized, setHasNeutralized] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * 2));
  const [customA, setCustomA] = useState('');
  const [customB, setCustomB] = useState('');
  const [customOp, setCustomOp] = useState<'+' | '-'>('+');
  const [customError, setCustomError] = useState<string | null>(null);
  const [isAutoSolvePending, setIsAutoSolvePending] = useState(false);

  const handleLockFreeplayEquation = () => {
    if (positiveCount === 0 && negativeCount === 0) return;
    
    let a = 0; let b = 0; let op: '+'|'-' = '+';
    if (positiveCount > 0 && negativeCount > 0) {
      a = positiveCount; b = -negativeCount;
    } else if (positiveCount > 0) {
      a = positiveCount; b = 0;
    } else if (negativeCount > 0) {
      a = -negativeCount; b = 0;
    }
    
    const expr = `${a} + ${b < 0 ? `(${b})` : b}`;
    
    setIsAutoSolvePending(true); 
    setActiveEquation({ expression: expr, a, b, op, detectedMisconceptionCode: null });
    setIsTransformed(false);
    setCoins([]); // Clear manually spawned coins so presentation can spawn them properly
    setPresentationState('IDLE');
  };

  useEffect(() => {
    if (presentationState === 'DONE' && isAutoSolvePending) {
      setIsAutoSolvePending(false);
      setTimeout(() => {
        handleAutoSolve();
      }, 800);
    }
  }, [presentationState, isAutoSolvePending]);

  const handleAutoSolve = async () => {
    if (isAutoSolvingRef.current || presentationState !== 'DONE' || isCompleted || hasNoZeroPairs) return;
    
    setIsAutoSolving(true);
    isAutoSolvingRef.current = true;
    addLog('INFO', 'Initiated Minion Battle sequence for neutralization.');

    const currentPos = coins.filter(c => c.value === 1 && !c.isNeutralizing);
    const currentNeg = coins.filter(c => c.value === -1 && !c.isNeutralizing);
    const pairsCount = Math.min(currentPos.length, currentNeg.length);
    
    if (pairsCount === 0) {
      setIsAutoSolving(false);
      isAutoSolvingRef.current = false;
      return;
    }



    await new Promise(r => setTimeout(r, 200));
    if (!isAutoSolvingRef.current) return;
    
    // 1. Line up for battle (Firing Squad Formation)
    const spacingY = Math.min(15, 60 / pairsCount);
    const startY = 50 - ((pairsCount - 1) * spacingY) / 2;

    // Determine which side should be on the left/right based on current average X
    const posAvgX = currentPos.reduce((sum, c) => sum + c.x, 0) / (currentPos.length || 1);
    const negAvgX = currentNeg.reduce((sum, c) => sum + c.x, 0) / (currentNeg.length || 1);
    const posIsLeft = posAvgX <= negAvgX;

    const surplusPosCount = currentPos.length - pairsCount;
    const surplusPosSpacingY = surplusPosCount > 0 ? Math.min(15, 60 / surplusPosCount) : 0;
    const surplusPosStartY = 50 - ((surplusPosCount - 1) * surplusPosSpacingY) / 2;

    const surplusNegCount = currentNeg.length - pairsCount;
    const surplusNegSpacingY = surplusNegCount > 0 ? Math.min(15, 60 / surplusNegCount) : 0;
    const surplusNegStartY = 50 - ((surplusNegCount - 1) * surplusNegSpacingY) / 2;

    setCoins(prev => prev.map(c => {
       const pIdx = currentPos.findIndex(p => p.id === c.id);
       const nIdx = currentNeg.findIndex(n => n.id === c.id);
       
       if (pIdx !== -1) {
           if (pIdx < pairsCount) return { ...c, x: posIsLeft ? 30 : 70, y: startY + pIdx * spacingY };
           else return { ...c, x: posIsLeft ? 15 : 85, y: surplusPosStartY + (pIdx - pairsCount) * surplusPosSpacingY };
       }
       if (nIdx !== -1) {
           if (nIdx < pairsCount) return { ...c, x: posIsLeft ? 70 : 30, y: startY + nIdx * spacingY };
           else return { ...c, x: posIsLeft ? 85 : 15, y: surplusNegStartY + (nIdx - pairsCount) * surplusNegSpacingY };
       }
       return c;
    }));
    
    await new Promise(r => setTimeout(r, 800));
    if (!isAutoSolvingRef.current) return;

    // 2. Throw Sequence (Ice thrown into Fire)
    setCoins(prev => prev.map(c => {
       const pIdx = currentPos.findIndex(p => p.id === c.id);
       if (pIdx !== -1 && pIdx < pairsCount) {
           // Positive is Ice, it moves to the Negative (Fire) position
           return { ...c, x: posIsLeft ? 70 : 30 };
       }
       return c;
    }));
    
    await new Promise(r => setTimeout(r, 600));
    if (!isAutoSolvingRef.current) return;

    // 3. Neutralizing / Steam effect
    setCoins(prev => prev.map(c => {
       const pIdx = currentPos.findIndex(p => p.id === c.id);
       const nIdx = currentNeg.findIndex(n => n.id === c.id);
       if ((pIdx !== -1 && pIdx < pairsCount) || (nIdx !== -1 && nIdx < pairsCount)) {
           return { ...c, isNeutralizing: true };
       }
       return c;
    }));
    
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    
    setEffects(prev => [...prev, ...Array.from({length: pairsCount}).map((_, i) => ({
        id: `eff-auto-${Date.now()}-${i}-1`,
        x: posIsLeft ? 70 : 30, // Steam effect at the Fire's location
        y: startY + i * spacingY,
        createdAt: Date.now()
    }))]);
    
    await new Promise(r => setTimeout(r, 600));
    if (!isAutoSolvingRef.current) return;
    
    // Remove destroyed minions
    setCoins(prev => prev.filter(c => {
       const pIdx = currentPos.findIndex(p => p.id === c.id);
       const nIdx = currentNeg.findIndex(n => n.id === c.id);
       return !((pIdx !== -1 && pIdx < pairsCount) || (nIdx !== -1 && nIdx < pairsCount));
    }));
    
    setHasNeutralized(true);
    setIsAutoSolving(false);
    isAutoSolvingRef.current = false;
  };

  useEffect(() => {
    setActiveEquation(prev => {
      if (prev?.expression === initialEquation?.expression && prev?.a === initialEquation?.a && prev?.b === initialEquation?.b && prev?.op === initialEquation?.op) {
        return prev;
      }
      return initialEquation;
    });
  }, [initialEquation?.expression, initialEquation?.a, initialEquation?.b, initialEquation?.op]);

  useEffect(() => {
    if (activeEquation && onEquationChange) {
      onEquationChange(activeEquation);
    }
  }, [activeEquation?.expression]);

  const handleRandomizeEquation = () => {
    const types = ["ADD-NEG", "SUB-NEG", "ADD-OPP", "SUB-OPP"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let a = 0;
    let b = 0;
    let op: '+' | '-' = "+";
    let expression = "";
    
    const getRandomNonZero = () => {
      const val = Math.floor(Math.random() * 8) + 1;
      return Math.random() > 0.5 ? val : -val;
    };

    if (type === "ADD-NEG") {
      a = -Math.abs(getRandomNonZero());
      b = -Math.abs(getRandomNonZero());
      op = "+";
      expression = `${a} + (${b})`;
    } else if (type === "SUB-NEG") {
      a = getRandomNonZero();
      b = -Math.abs(getRandomNonZero());
      op = "-";
      expression = `${a} - (${b})`;
    } else if (type === "ADD-OPP") {
      a = -Math.abs(getRandomNonZero());
      b = Math.abs(getRandomNonZero());
      op = "+";
      expression = `${a} + ${b}`;
    } else {
      a = getRandomNonZero();
      b = Math.abs(getRandomNonZero());
      op = "-";
      expression = `${a} - ${b}`;
    }

    setActiveEquation({ expression, a, b, op, detectedMisconceptionCode: null });
  };

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR', message: string) => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [
      { id: Math.random().toString(), timestamp: time, level, message },
      ...prev.slice(0, 11) // Keep the last 12 log ticks
    ]);
  };

  // Monitor and set dynamic coin spawn configurations of failed equation
  useEffect(() => {
    try {
      if (activeEquation) {
        addLog('INFO', `Custom scaffolding initialized for: ${activeEquation.expression}`);
        setCoins([]);
        setIsCompleted(false);
        setIsGathering(false);
        setPresentationState('IDLE');
        setIsTransformed(false);
        setIsAutoSolving(false);
        isAutoSolvingRef.current = false;
        setHasNeutralized(false);
      }
    } catch (err: any) {
      addLog('ERROR', `Scaffold Setup Exception: ${err.message || 'Unknown render trigger fault'}`);
    }
    setEffects([]);
  }, [activeEquation]);

  const getInitialCoinPos = (index: number, totalCount: number, side: 'left' | 'right') => {
    const rowsPerCol = 7;
    const cols = Math.ceil(totalCount / rowsPerCol);
    const centerX = side === 'left' ? 22 : 78;
    
    const col = Math.floor(index / rowsPerCol);
    const rowInCol = index % rowsPerCol;
    const coinsInThisCol = col === cols - 1 ? (totalCount % rowsPerCol || rowsPerCol) : rowsPerCol;
    
    // Spread horizontally strictly (18% spacing)
    const startX = centerX - ((cols - 1) * 18) / 2;
    const x = startX + col * 18 + (Math.random() * 1.5 - 0.75);
    
    // Spread vertically strictly (max 16% spacing)
    const spacingY = Math.min(60 / Math.max(1, coinsInThisCol - 1), 16);
    const totalHeight = (coinsInThisCol - 1) * spacingY;
    const startY = 50 - totalHeight / 2;
    const y = startY + rowInCol * spacingY + (Math.random() * 2 - 1);
    
    return { x, y };
  };

  // Sequencer Engine for Presentation Mode
  useEffect(() => {
    if (!activeEquation) return;

    if (presentationState === 'STEP_A') {
      const timer = setTimeout(() => {
        const initialCoins: Coin[] = [];
        let spawnA = activeEquation.a;
        let posCount = spawnA > 0 ? spawnA : 0;
        let negCount = spawnA < 0 ? Math.abs(spawnA) : 0;
        
        for (let i = 0; i < posCount; i++) {
          const { x, y } = getInitialCoinPos(i, posCount, 'left');
          initialCoins.push({
            id: `init-pos-a-${i}-${Math.random().toString(36).substring(2, 7)}`,
            value: 1,
            x,
            y,
            isNeutralizing: false,
            opacity: 1
          });
        }
        for (let i = 0; i < negCount; i++) {
          const { x, y } = getInitialCoinPos(i, negCount, 'left');
          initialCoins.push({
            id: `init-neg-a-${i}-${Math.random().toString(36).substring(2, 7)}`,
            value: -1,
            x,
            y,
            isNeutralizing: false,
            opacity: 1
          });
        }
        setCoins(initialCoins);
        setTimeout(() => setPresentationState('STEP_OP'), 1500);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (presentationState === 'STEP_OP') {
      // Give more reading time for subtraction (long text) vs addition (short text)
      const waitTime = activeEquation.op === '-' ? 3500 : 2000;
      const timer = setTimeout(() => {
        setPresentationState('STEP_B');
      }, waitTime);
      return () => clearTimeout(timer);
    }

    if (presentationState === 'STEP_B') {
      const spawnBCoins = () => {
        const bCoins: Coin[] = [];
        let spawnB = activeEquation.op === '-' ? -activeEquation.b : activeEquation.b;
        let posCount = spawnB > 0 ? spawnB : 0;
        let negCount = spawnB < 0 ? Math.abs(spawnB) : 0;

        for (let i = 0; i < posCount; i++) {
          const { x, y } = getInitialCoinPos(i, posCount, 'right');
          bCoins.push({
            id: `init-pos-b-${i}-${Math.random().toString(36).substring(2, 7)}`,
            value: 1,
            x,
            y,
            isNeutralizing: false,
            opacity: 1,
            isDropping: true
          });
        }
        for (let i = 0; i < negCount; i++) {
          const { x, y } = getInitialCoinPos(i, negCount, 'right');
          bCoins.push({
            id: `init-neg-b-${i}-${Math.random().toString(36).substring(2, 7)}`,
            value: -1,
            x,
            y,
            isNeutralizing: false,
            opacity: 1,
            isDropping: true
          });
        }
        setCoins(prev => [...prev, ...bCoins]);
        setTimeout(() => {
          setCoins(prev => prev.map(c => ({ ...c, isDropping: false })));
          setPresentationState('DONE');
        }, 100);
      };

      if (activeEquation.op === '-') {
        let t2: NodeJS.Timeout;
        // Wait 1.5s on the initial B state, then transform
        const t1 = setTimeout(() => {
          setIsTransformed(true);
          // Wait 3.5s for the user to read "Lawan dari X adalah Y"
          t2 = setTimeout(() => {
            spawnBCoins();
          }, 3500);
        }, 1500);
        return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
      } else {
        // Shorter wait for addition since there is no transformation
        const timer = setTimeout(() => {
          spawnBCoins();
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [presentationState, activeEquation]);

  const [effects, setEffects] = useState<NeutralEffect[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Calculate Net Value of current active non-neutralized coins
  const netValue = coins
    .filter(c => !c.isNeutralizing)
    .reduce((sum, c) => sum + c.value, 0);

  // Counters
  const positiveCount = coins.filter(c => !c.isNeutralizing && c.value === 1).length;
  const negativeCount = coins.filter(c => !c.isNeutralizing && c.value === -1).length;

  // Add random coins securely
  const spawnCoin = (value: 1 | -1) => {
    if (value === 1 && positiveCount >= 20) {
      addLog('WARN', 'Maksimal 20 koin positif tercapai');
      return;
    }
    if (value === -1 && negativeCount >= 20) {
      addLog('WARN', 'Maksimal 20 koin negatif tercapai');
      return;
    }
    const id = `coin-${Math.random().toString(36).substring(2, 11)}`;
    const newCoin: Coin = {
      id,
      value,
      x: value === 1 ? 15 + Math.random() * 20 : 65 + Math.random() * 20,
      y: 20 + Math.random() * 55,
      isNeutralizing: false,
      opacity: 1
    };
    setCoins(prev => [...prev, newCoin]);
    setIsCompleted(false);
    setIsGathering(false);
    setActiveEquation(null);
    setHasNeutralized(false);
  };

  // Reset sandbox completely
  const handleReset = () => {
    setIsAutoSolving(false);
    isAutoSolvingRef.current = false;
    setActiveEquation(initialEquation);
    setCoins([]);
    setIsCompleted(false);
    setIsGathering(false);
    setIsTransformed(false);
    setEffects([]);
    setPresentationState('IDLE');
    setHasNeutralized(false);
  };

  const handleSelectEquivalent = (a: number, b: number, op: '+' | '-') => {
    const expression = `${a} ${op} ${b < 0 ? `(${b})` : b}`;
    const newEq = { expression, a, b, op };
    setActiveEquation(newEq);
    if (onEquationChange) onEquationChange(newEq);
    addLog('INFO', `Selected equivalent equation: ${expression}`);
  };

  // Clear all coins
  const handleClear = () => {
    setIsAutoSolving(false);
    isAutoSolvingRef.current = false;
    setCoins([]);
    setIsCompleted(false);
    setIsGathering(false);
    setIsTransformed(false);
    setEffects([]);
    setPresentationState('DONE');
    setActiveEquation(null);
    setHasNeutralized(false);
  };

  // Drag Handlers
  const handleStartDrag = (id: string, clientX: number, clientY: number) => {
    if (presentationState !== 'DONE' || isCompleted || isGathering || isAutoSolving) return;
    const coin = coins.find(c => c.id === id);
    if (!coin || coin.isNeutralizing || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const currentXpx = (coin.x / 100) * rect.width;
    const currentYpx = (coin.y / 100) * rect.height;

    // Relative offset of the touch click inside the workspace
    dragOffsetRef.current = {
      x: clientX - rect.left - currentXpx,
      y: clientY - rect.top - currentYpx
    };
    setActiveDragId(id);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!activeDragId || !workspaceRef.current) return;

    try {
      const rect = workspaceRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        throw new Error("Invalid responsive canvas footprint dimension (0px width or height detected)");
      }

      const cursorX = clientX - rect.left - dragOffsetRef.current.x;
      const cursorY = clientY - rect.top - dragOffsetRef.current.y;

      if (isNaN(cursorX) || isNaN(cursorY)) {
        throw new Error("Pointer interaction coordinate computation resolved to NaN.");
      }

      // Convert back lock-in coordinates to sandbox percentages
      let newX = (cursorX / rect.width) * 100;
      let newY = (cursorY / rect.height) * 100;

      // Enforce canvas margins boundary safety
      newX = Math.max(4, Math.min(96, newX));
      newY = Math.max(5, Math.min(95, newY));

      // Update coordinates immediately
      setCoins(prev =>
        prev.map(c => (c.id === activeDragId ? { ...c, x: newX, y: newY } : c))
      );
    } catch (err: any) {
      addLog('ERROR', `Drag Physics Crash Caught: ${err.message || 'Coordinate exception'}`);
    }
  };

  const handleEndDrag = () => {
    if (!activeDragId) return;
    addLog('INFO', `Ended pointer drag session for node ID: ${activeDragId.slice(0, 10)}`);
    setActiveDragId(null);
  };

  // Monitor collision events in coordinates
  useEffect(() => {
    if (activeDragId === null) return;

    try {
      const draggingCoin = coins.find(c => c.id === activeDragId);
      if (!draggingCoin || draggingCoin.isNeutralizing) return;

      // Find overlapping opposite coin
      const collisionOverlapTarget = coins.find(other => {
        if (other.id === draggingCoin.id || other.isNeutralizing) return false;
        
        // Values must be opposite signs to collapse each other (+1 and -1)
        if (other.value === draggingCoin.value) return false;

        // Distance estimation using Euclidean bounding elements
        const dx = other.x - draggingCoin.x;
        const dy = other.y - draggingCoin.y;
        
        // Let's assume a coin radius takes up ~5% width/height coordinates.
        // A distance of less than 7 units indicates overlapping collision
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (isNaN(distance)) {
          throw new Error("Euclidean distance computation yielded NaN value.");
        }
        return distance < 8.2;
      });

      if (collisionOverlapTarget) {
        const effectX = (draggingCoin.x + collisionOverlapTarget.x) / 2;
        const effectY = (draggingCoin.y + collisionOverlapTarget.y) / 2;

        addLog('INFO', `Collision Detected! Neutralizing opposite charges: ${draggingCoin.value} and ${collisionOverlapTarget.value}`);

        // Trigger neutralization transitions on both coins immediately
        const id1 = draggingCoin.id;
        const id2 = collisionOverlapTarget.id;

        setActiveDragId(null); // break drag focus
        setHasNeutralized(true);

        setCoins(prev =>
          prev.map(c =>
            c.id === id1 || c.id === id2
              ? { ...c, isNeutralizing: true }
              : c
          )
        );

        // Create a nice localized explosion canvas indicator
        const newEffectId = `eff-${Date.now()}-${Math.random()}`;
        setEffects(prev => [...prev, { id: newEffectId, x: effectX, y: effectY, createdAt: Date.now() }]);

        // Visual Haptic Feedback - trigger screen shake
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);

        // Remove after animations fade out completely
        setTimeout(() => {
          setCoins(prev => prev.filter(c => c.id !== id1 && c.id !== id2));
        }, 700);
      }
    } catch (err: any) {
      addLog('ERROR', `Collision Algorithm Slip: ${err.message || 'Animation distance error'}`);
    }
  }, [coins, activeDragId]);

  // Clean obsolete effects
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setEffects(prev => prev.filter(e => now - e.createdAt < 1200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor for completion
  useEffect(() => {
    if (presentationState !== 'DONE') return;
    if (!isCompleted && !isGathering && !isAutoSolving) {
      if (activeEquation) {
        let spawnA = activeEquation.a;
        let spawnB = activeEquation.b;
        if (activeEquation.op === '-') spawnB = -spawnB;
        const initialPos = (spawnA > 0 ? spawnA : 0) + (spawnB > 0 ? spawnB : 0);
        const initialNeg = (spawnA < 0 ? Math.abs(spawnA) : 0) + (spawnB < 0 ? Math.abs(spawnB) : 0);
        
        const hasInitialZeroPairs = initialPos > 0 && initialNeg > 0;
        if (hasInitialZeroPairs) {
          if (positiveCount === 0 || negativeCount === 0) {
            const isNeutralizing = coins.some(c => c.isNeutralizing);
            if (!isNeutralizing) {
              const timer = setTimeout(() => setIsGathering(true), 800);
              return () => clearTimeout(timer);
            }
          }
        } else {
          const timer = setTimeout(() => setIsGathering(true), 3000);
          return () => clearTimeout(timer);
        }
      } else {
        // Freeplay Mode: Always gather when neutralizations are done and board is clean (monochrome)
        if ((positiveCount === 0 || negativeCount === 0) && coins.length > 0) {
          const isNeutralizing = coins.some(c => c.isNeutralizing);
          
          // Check if already gathered
          const total = coins.length;
          const maxCols = Math.min(total, 5);
          const spacingX = 12;
          const spacingY = 18;
          const startX = 50 - ((maxCols - 1) * spacingX) / 2;
          const startY = 45 - ((Math.ceil(total / maxCols) - 1) * spacingY) / 2;
          
          const isAlreadyGathered = coins.every((c, i) => {
            const row = Math.floor(i / maxCols);
            const col = i % maxCols;
            const targetX = startX + (col * spacingX);
            const targetY = startY + (row * spacingY);
            return Math.abs(c.x - targetX) < 0.1 && Math.abs(c.y - targetY) < 0.1;
          });
          
          if (!isNeutralizing && !isAlreadyGathered) {
            const timer = setTimeout(() => setIsGathering(true), 800);
            return () => clearTimeout(timer);
          }
        }
      }
    }
  }, [positiveCount, negativeCount, activeEquation, isCompleted, coins, presentationState, isGathering, isAutoSolving]);

  // Gathering Animation
  useEffect(() => {
    if (isGathering && !isCompleted) {
      if (coins.length > 0) {
        const total = coins.length;
        const maxCols = Math.min(total, 5);
        const spacingX = 12;
        const spacingY = 18;
        const startX = 50 - ((maxCols - 1) * spacingX) / 2;
        const startY = 45 - ((Math.ceil(total / maxCols) - 1) * spacingY) / 2;
        
        setCoins(prev => prev.map((c, i) => {
          const row = Math.floor(i / maxCols);
          const col = i % maxCols;
          return {
            ...c,
            x: startX + (col * spacingX),
            y: startY + (row * spacingY)
          };
        }));
      }
      
      const timer = setTimeout(() => {
        if (activeEquation || hasNeutralized) {
          setIsCompleted(true);
        } else {
          // Freeplay mode without neutralization: Finish gathering and allow continuous dragging
          setIsGathering(false);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isGathering, isCompleted, coins.length, activeEquation, hasNeutralized]);

  const hasNoZeroPairs = activeEquation && (() => {
    let spawnA = activeEquation.a;
    let spawnB = activeEquation.b;
    if (activeEquation.op === '-') spawnB = -spawnB;
    const initialPos = (spawnA > 0 ? spawnA : 0) + (spawnB > 0 ? spawnB : 0);
    const initialNeg = (spawnA < 0 ? Math.abs(spawnA) : 0) + (spawnB < 0 ? Math.abs(spawnB) : 0);
    return initialPos === 0 || initialNeg === 0;
  })();

  return (
    <div id="coin-sandbox" className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-6 bg-white p-1.5 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm h-full min-h-[350px] lg:min-h-[600px] items-stretch">
      
      {/* Sandbox control parameters (left col) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-1.5 sm:space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1.5 md:items-start text-center md:text-left z-20">
              <h2 className="text-xl font-sans font-black tracking-tight text-slate-800 drop-shadow-sm flex items-center justify-center md:justify-start gap-2">
                <Coins size={22} className="text-indigo-600 animate-pulse" /> 
                {activeEquation ? "Visualisasi Soal" : "Eksplorasi Bebas"}
              </h2>
              <p className="text-xs font-bold font-sans text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-slate-200/50 shadow-sm flex items-center gap-1">
                <Terminal size={12} strokeWidth={2.5} /> {activeEquation ? "Latihan Mandiri Interaktif" : "Papan Es & Api"}
              </p>
            </div>
              <div className="flex gap-2">
                {onBackToDiagnostic && (
                  <button
                    id="btn-back-to-diagnostics"
                    onClick={onBackToDiagnostic}
                    className="font-mono text-3xs font-bold text-slate-500 hover:text-slate-700 hover:underline flex items-center gap-0.5 transition-all cursor-pointer p-2 -m-2"
                  >
                    &larr; Kembali ke Hasil
                  </button>
                )}
                {onProceedToDrill && (
                  <button
                    onClick={onProceedToDrill}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-sans font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    Lanjut Latihan
                  </button>
                )}
              </div>
            </div>
            <h3 className="font-sans font-bold text-slate-900 text-sm sm:text-lg mt-1 sm:mt-2 tracking-tight">
              {activeEquation ? `Modeling: ${activeEquation.expression}` : "Zero-Pair Element Sandbox"}
            </h3>
            <div className="text-[10px] sm:text-xs text-slate-500 font-sans leading-relaxed space-y-0.5 sm:space-y-1 mt-0.5 sm:mt-1">
              {activeEquation ? (
                <span>
                  Mari ubah persamaan <strong className="text-indigo-600 font-mono font-bold select-all">{activeEquation.expression}</strong> ke bentuk es dan api!
                  {activeEquation.op === '-' && " Mengurangkan berarti sama dengan menambahkan bilangan berlawanan."}
                  {hasNoZeroPairs ? (
                    <p className="flex items-start gap-2 bg-amber-50 text-amber-700 p-2.5 rounded-lg border border-amber-100">
                      <Info size={16} className="mt-0.5 shrink-0" />
                      <span> Semua elemen bertanda sama, hitung totalnya dan klik <strong>Selesai</strong> jika sudah!</span>
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 bg-blue-50 text-blue-700 p-2.5 rounded-lg border border-blue-100">
                      <Wand2 size={16} className="mt-0.5 shrink-0" />
                      <span> Seret elemen berlawanan agar saling menetralisir!</span>
                    </p>
                  )}
                </span>
              ) : (
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  Seret Es (<strong className="text-sky-600">Biru +1</strong>) ke Api (<strong className="text-rose-600">Merah -1</strong>) untuk visualisasi netralisasi.
                </p>
              )}
            </div>
          </div>

          {/* Quick Spawn Controls */}
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 block uppercase">Spawn Manipulatives</span>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                id="btn-spawn-positive"
                onClick={() => spawnCoin(1)}
                className="flex items-center justify-center gap-1 sm:gap-1.5 bg-sky-50 border border-sky-200 hover:bg-sky-100/80 active:translate-y-0.5 text-sky-700 font-semibold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition-all cursor-pointer font-sans"
              >
                <Plus size={10} className="sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                <span className="text-[9px] sm:text-xs">Positive (+1)</span>
              </button>
              <button
                id="btn-spawn-negative"
                onClick={() => spawnCoin(-1)}
                className="flex items-center justify-center gap-1 sm:gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100/90 active:translate-y-0.5 text-rose-700 font-semibold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl transition-all cursor-pointer font-sans"
              >
                <Minus size={10} className="sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                <span className="text-[9px] sm:text-xs">Negative (-1)</span>
              </button>
            </div>
          </div>

          {/* Real-time Math Ledger Card */}
          <div className="bg-slate-50 border border-slate-150 p-1.5 sm:p-4 rounded-lg sm:rounded-xl space-y-1 sm:space-y-3">
            <div className="flex items-center justify-between pb-0.5 sm:pb-1 border-b border-slate-200/60 mb-0.5 sm:mb-2">
              <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-405 block uppercase tracking-wider">WORKSPACE MATH LEDGER</span>
              <button 
                onClick={handleClear} 
                className="text-[8px] sm:text-xs flex items-center gap-1 text-rose-600 hover:bg-rose-100/80 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded transition-colors font-semibold"
              >
                <RotateCcw size={10} /> Reset
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-0.5 sm:gap-2 text-center font-mono">
              <div className="bg-white p-0.5 sm:p-2 rounded-md sm:rounded-lg border border-slate-100">
                <span className="text-sky-600 font-bold text-xs sm:text-base block">{positiveCount}</span>
                <span className="text-[7px] sm:text-[9px] text-slate-400">ES (+1)</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white p-0.5 sm:p-2 rounded-md sm:rounded-lg border border-slate-100">
                <span className="text-rose-600 font-bold text-xs sm:text-base block">{negativeCount}</span>
                <span className="text-[7px] sm:text-[9px] text-slate-400">API (-1)</span>
              </div>
              <div className="bg-white p-0.5 sm:p-2 rounded-md sm:rounded-lg border border-slate-100">
                <span className={`font-extrabold text-xs sm:text-base block ${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-500"}`}>
                  {netValue > 0 ? `+${netValue}` : netValue}
                </span>
                <span className="text-[7px] sm:text-[9px] text-slate-400">NET VALUE</span>
              </div>
            </div>

            {/* Algebraic Representation Expression */}
            <div className="bg-white py-1 px-1.5 sm:p-3 rounded-md sm:rounded-xl border border-slate-100 text-center select-all">
              <span tabIndex={0} className="text-[7px] sm:text-[9px] font-mono text-slate-400 flex items-center justify-center gap-1 mb-0 sm:mb-0.5 relative group outline-hidden">
                ALGEBRAIC REPRESENTATION
                <HelpCircle size={8} className="cursor-help sm:w-2.5 sm:h-2.5" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 text-center shadow-lg font-sans normal-case">
                  Tahukah kamu? Bilangan positif seperti <span className="font-bold text-sky-300">+2</span> biasanya ditulis tanpa tanda plus menjadi <span className="font-bold text-sky-300">2</span> saja.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </span>
              <span className="font-mono text-[9px] sm:text-sm font-extrabold text-slate-800 leading-tight block truncate whitespace-normal">
                {positiveCount === 0 && negativeCount === 0 ? "0" : (
                  <>
                    {Array(positiveCount).fill("(+1)").join(" + ") || ""}
                    {positiveCount > 0 && negativeCount > 0 ? " + " : ""}
                    {Array(negativeCount).fill("(-1)").join(" + ") || ""}
                    <span className="text-slate-400 mx-1">=</span>
                    <span className={`${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-700"}`}>
                      {netValue}
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Kemungkinan Soal Representation */}
            <div className="bg-white py-1 px-1.5 sm:p-3 rounded-md sm:rounded-xl border border-slate-100 text-center">
              <span className="text-[7px] sm:text-[9px] font-mono text-slate-400 block mb-0.5 sm:mb-1">KEMUNGKINAN SOAL EKUIVALEN</span>
              <div className="font-mono text-[9px] sm:text-xs font-extrabold text-slate-700 flex flex-col gap-0 sm:gap-1 select-all">
                {positiveCount === 0 && negativeCount === 0 ? (
                  <span className="text-slate-400 italic font-normal text-[10px]">Belum ada elemen</span>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-4 group px-1 py-0 sm:py-1 rounded hover:bg-slate-50 transition-colors">
                      <span>{positiveCount} - {negativeCount} = <span className={`${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-700"}`}>{netValue > 0 ? `+${netValue}` : netValue}</span></span>
                      <button onClick={() => handleSelectEquivalent(positiveCount, negativeCount, '-')} className="text-[8px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1.5 bg-indigo-100 text-indigo-700 rounded transition-colors font-sans cursor-pointer hover:bg-indigo-200">Pilih</button>
                    </div>
                    <div className="flex items-center justify-center gap-4 group px-1 py-0 sm:py-1 rounded hover:bg-slate-50 transition-colors">
                      <span>{negativeCount === 0 ? 0 : `-${negativeCount}`} + {positiveCount} = <span className={`${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-700"}`}>{netValue > 0 ? `+${netValue}` : netValue}</span></span>
                      <button onClick={() => handleSelectEquivalent(negativeCount === 0 ? 0 : -negativeCount, positiveCount, '+')} className="text-[8px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1.5 bg-indigo-100 text-indigo-700 rounded transition-colors font-sans cursor-pointer hover:bg-indigo-200">Pilih</button>
                    </div>
                    <div className="flex items-center justify-center gap-4 group px-1 py-0 sm:py-1 rounded hover:bg-slate-50 transition-colors">
                      <span>{positiveCount} + {negativeCount === 0 ? 0 : `(-${negativeCount})`} = <span className={`${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-700"}`}>{netValue > 0 ? `+${netValue}` : netValue}</span></span>
                      <button onClick={() => handleSelectEquivalent(positiveCount, negativeCount === 0 ? 0 : -negativeCount, '+')} className="text-[8px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1.5 bg-indigo-100 text-indigo-700 rounded transition-colors font-sans cursor-pointer hover:bg-indigo-200">Pilih</button>
                    </div>
                    <div className="flex items-center justify-center gap-4 group px-1 py-0 sm:py-1 rounded hover:bg-slate-50 transition-colors">
                      <span>{negativeCount === 0 ? 0 : `-${negativeCount}`} - {positiveCount === 0 ? 0 : `(-${positiveCount})`} = <span className={`${netValue > 0 ? "text-sky-600" : netValue < 0 ? "text-rose-600" : "text-slate-700"}`}>{netValue > 0 ? `+${netValue}` : netValue}</span></span>
                      <button onClick={() => handleSelectEquivalent(negativeCount === 0 ? 0 : -negativeCount, positiveCount === 0 ? 0 : -positiveCount, '-')} className="text-[8px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1.5 bg-indigo-100 text-indigo-700 rounded transition-colors font-sans cursor-pointer hover:bg-indigo-200">Pilih</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Tracking Terminal Logs to monitor drag performance and catch NaN crashes */}
          {!studentMode && (
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-2.5 font-mono text-[10px] text-slate-300">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 select-none">
                <span className="flex items-center gap-1.5 font-bold text-slate-400">
                  <Terminal size={12} className="text-indigo-400 animate-pulse" /> Sandbox Diagnostics
                </span>
                <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-1 py-0.5 rounded">
                  TELEMETRY
                </span>
              </div>
              <div className="max-h-[90px] overflow-y-auto space-y-1 scrollbar-thin pr-1 text-[9.5px]">
                {telemetryLogs.length === 0 ? (
                  <div className="text-slate-600 italic">// Interactive session trace empty. Drag coins to log metrics...</div>
                ) : (
                  telemetryLogs.map((log) => (
                    <div key={log.id} className="flex gap-1.5 leading-normal">
                      <span className="text-slate-500 font-normal">[{log.timestamp}]</span>
                      <span className={`font-bold shrink-0 text-[9px] px-1 rounded uppercase ${
                        log.level === 'ERROR' 
                          ? 'bg-rose-950 border border-rose-900/40 text-rose-400' 
                          : log.level === 'WARN' 
                            ? 'bg-amber-950 border border-amber-900/40 text-amber-400' 
                            : 'bg-emerald-990 border border-emerald-900/40 text-emerald-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-300 font-sans tracking-wide">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Workspace Utility Control Row */}
        {!studentMode && (
          <div className="flex gap-2">
            <button
              id="btn-reset-sandbox"
              onClick={handleReset}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-650 px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <RotateCcw size={12} />
              <span>Restore Defaults</span>
            </button>
            <button
              id="btn-clear-sandbox"
              onClick={handleClear}
              className="border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Delete All Coins"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {/* Custom Equation Input */}
        {!studentMode && (
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Kustomisasi Soal:</span>
            <div className="flex gap-2 w-full justify-center">
              <input 
                type="number" 
                value={customA} 
                onChange={(e) => { setCustomA(e.target.value); setCustomError(null); }}
                min="-20"
                max="20"
                className="w-16 px-2 py-1.5 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <select 
                value={customOp} 
                onChange={(e) => setCustomOp(e.target.value as '+'|'-')}
                className="w-12 px-1 py-1.5 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
              <input 
                type="number" 
                value={customB} 
                onChange={(e) => { setCustomB(e.target.value); setCustomError(null); }}
                min="-20"
                max="20"
                className="w-16 px-2 py-1.5 text-center font-mono font-bold text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={() => {
                  let valA = parseInt(customA);
                  let valB = parseInt(customB);
                  if (!isNaN(valA) && !isNaN(valB)) {
                    if (valA < -20 || valA > 20 || valB < -20 || valB > 20) {
                      setCustomError("Maksimal koin adalah 20 atau -20");
                      return;
                    }
                    setCustomError(null);
                    setActiveEquation({
                      expression: `${valA} ${customOp} ${valB < 0 ? `(${valB})` : valB}`,
                      a: valA,
                      b: valB,
                      op: customOp,
                      detectedMisconceptionCode: null
                    });
                  }
                }}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                Coba
              </button>
            </div>
            {customError && (
              <div className="w-full text-center mt-1">
                <span className="text-xs font-bold text-rose-500">{customError}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Interactive Drag Canvas (right col) */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        
        {/* Post-Presentation Instructions */}
        <div className="min-h-[28px] sm:min-h-[48px] flex flex-row items-center justify-center mb-1 sm:mb-2 gap-1.5 sm:gap-4">
          {presentationState === 'DONE' && !isGathering && !isCompleted && (
            <div className="bg-indigo-950/80 backdrop-blur-md border border-indigo-500/50 text-indigo-100 px-2 py-1 sm:px-6 sm:py-2.5 rounded-md sm:rounded-full text-[8.5px] sm:text-sm font-sans shadow-lg flex items-center gap-1 sm:gap-3 animate-fadeIn">
              <Sparkles size={12} className="text-amber-400 animate-pulse shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="font-medium sm:font-semibold tracking-wide text-center leading-tight">
                {hasNoZeroPairs 
                  ? "Semua elemen memiliki warna sama. Elemen-elemen ini tidak bisa dinetralkan!" 
                  : "Seret dan benturkan Es biru (+) ke Api merah (-) untuk menetralkannya (pasangan nol)!"}
              </span>
            </div>
          )}
          {presentationState === 'DONE' && onProceedToDrill && (
            <button
              id="btn-proceed-to-drill-from-sandbox"
              onClick={onProceedToDrill}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-full text-[10px] sm:text-sm font-sans font-bold shadow-lg flex items-center gap-1 sm:gap-2 animate-fadeIn transition-colors cursor-pointer border border-indigo-500 shrink-0"
            >
              <span className="whitespace-nowrap">Lanjut Latihan</span>
              <ArrowRight size={12} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Workspace Canvas Board */}
        <div 
          id="coincidence-canvas-board"
          ref={workspaceRef}
          onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
          onMouseUp={handleEndDrag}
          onMouseLeave={handleEndDrag}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handleEndDrag}
          className={`lg:col-span-8 relative w-full h-full min-h-[300px] md:min-h-[500px] lg:min-h-[600px] bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden shadow-inner select-none cursor-grab active:cursor-grabbing touch-none ${isShaking ? 'animate-shake' : ''}`}
        >

          {/* Floating Legend */}
          <div className="absolute top-1 sm:top-4 left-1 sm:left-4 z-40 flex flex-col md:flex-row items-start md:items-center gap-0.5 sm:gap-2 md:gap-4 bg-slate-800/80 backdrop-blur-sm px-1.5 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-2xl border border-slate-700 shadow-lg scale-50 sm:scale-100 origin-top-left">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-md flex items-center justify-center">
                <IceSvg />
              </div>
              <span className="text-slate-200 font-mono text-[9px] sm:text-xs font-bold">+1 (Es)</span>
            </div>
            <div className="w-px h-3 sm:h-5 bg-slate-600"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-md flex items-center justify-center">
                <FireSvg />
              </div>
              <span className="text-slate-200 font-mono text-[9px] sm:text-xs font-bold">-1 (Api)</span>
            </div>
          </div>

          {/* Floating Ulangi Animasi Button */}
          {activeEquation && (
            <div className="absolute top-1 sm:top-4 right-1 sm:right-4 z-50 scale-65 sm:scale-100 origin-top-right">
              <button
                onClick={() => { setPresentationState('IDLE'); setCoins([]); setIsCompleted(false); setIsGathering(false); setIsTransformed(false); setIsAutoSolving(false); isAutoSolvingRef.current = false; setIsAutoSolvePending(false); }}
                className="bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 p-2 md:px-4 md:py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer font-sans font-bold shadow-md border border-slate-700 backdrop-blur-sm"
              >
                <PlayCircle size={14} className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline">Ulangi Animasi</span>
              </button>
            </div>
          )}

          {/* Lock Equation Button (Freeplay Mode Only) */}
          {!activeEquation && coins.length > 0 && presentationState === 'DONE' && !isCompleted && !isGathering && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-40 scale-75 sm:scale-100 origin-top-right">
              <button
                onClick={handleLockFreeplayEquation}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1.5 sm:gap-2 animate-bounce cursor-pointer border border-emerald-400 transition-all hover:scale-105 text-xs sm:text-base"
              >
                <Sparkles size={16} />
                <span>Kunci Soal & Selesaikan</span>
              </button>
            </div>
          )}

          {/* Floating Lakukan Otomatis Button */}
          {presentationState === 'DONE' && !isCompleted && !isGathering && !isAutoSolving && positiveCount > 0 && negativeCount > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
              <button
                onClick={handleAutoSolve}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center gap-1.5 sm:gap-2 animate-bounce cursor-pointer border-2 border-indigo-400 transition-all hover:scale-105 text-xs sm:text-base"
              >
                <Wand2 size={14} className="sm:w-[18px] sm:h-[18px]" />
                <span>Lakukan Otomatis</span>
              </button>
            </div>
          )}

          {/* Overlay for Presentation Animation */}
          {presentationState !== 'DONE' && activeEquation && (
            <>
              <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md pointer-events-auto transition-opacity duration-500"></div>
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500">
                <div className="text-center pointer-events-auto">
                {(() => {
                  const displayOp = isTransformed && activeEquation.op === '-' ? '+' : activeEquation.op;
                  return (
                    <>
                      <div className="flex items-center justify-center gap-1.5 md:gap-4 text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black font-mono tracking-tighter drop-shadow-lg">
                      <div className={`transition-all duration-700 ${presentationState === 'STEP_A' ? (activeEquation.a < 0 ? 'scale-110 md:scale-125 text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]' : 'scale-110 md:scale-125 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]') : 'text-slate-400 opacity-60'}`}>
                        <InlineMath math={activeEquation.a < 0 ? `(${activeEquation.a})` : `${activeEquation.a}`} />
                      </div>
                      <div className={`flex flex-col items-center justify-center transition-all duration-700 ${presentationState === 'STEP_OP' || isTransformed ? 'scale-110 md:scale-125 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'text-slate-500 opacity-60'}`}>
                        <div className="relative w-8 h-12 md:w-12 md:h-16 flex items-center justify-center">
                          <span className={`transition-all duration-500 absolute ${isTransformed ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                            <InlineMath math={activeEquation.op} />
                          </span>
                          <span className={`transition-all duration-500 absolute ${isTransformed ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                            <InlineMath math={activeEquation.op === '-' ? '+' : activeEquation.op} />
                          </span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-center justify-center transition-all duration-700 ${presentationState === 'STEP_B' ? (activeEquation.b < 0 ? 'scale-110 md:scale-125 text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]' : 'scale-110 md:scale-125 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]') : 'text-slate-400 opacity-60'}`}>
                        <div className="relative w-20 md:w-28 h-12 md:h-16 flex items-center justify-center">
                          <span className={`transition-all duration-500 absolute ${isTransformed ? 'opacity-0 scale-50 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                            <InlineMath math={activeEquation.b < 0 ? `(${activeEquation.b})` : `${activeEquation.b}`} />
                          </span>
                          <span className={`transition-all duration-500 absolute ${isTransformed ? `opacity-100 scale-100 blur-0 ${(-activeEquation.b) < 0 ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]' : 'text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]'}` : 'opacity-0 scale-150 blur-sm'}`}>
                            <InlineMath math={`${-activeEquation.b}`} />
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Independent Explanation Text Container Below Equation */}
                    <div className="mt-4 md:mt-8 min-h-[48px] flex flex-col items-center justify-center relative w-full z-50 px-4">
                      {presentationState === 'STEP_OP' && activeEquation.op === '-' && (
                        <span className="relative block text-xs sm:text-sm md:text-base font-sans tracking-wide text-amber-300 font-bold text-center w-full max-w-sm leading-snug animate-fadeIn p-3 md:px-6 md:py-3 bg-slate-900/95 rounded-2xl md:rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md">
                          Kurang sama artinya menambahkan lawannya
                        </span>
                      )}
                      {presentationState === 'STEP_B' && activeEquation.op === '-' && (
                        <span className={`relative block text-xs sm:text-sm md:text-base font-sans tracking-wide font-bold text-center w-full max-w-sm leading-snug animate-fadeIn p-3 md:px-6 md:py-3 bg-slate-900/95 rounded-2xl md:rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md ${(-activeEquation.b) < 0 ? 'text-rose-300' : 'text-sky-300'}`}>
                          Lawan dari {activeEquation.b < 0 ? `(${activeEquation.b})` : activeEquation.b} adalah {-activeEquation.b}
                        </span>
                      )}
                      {(presentationState === 'STEP_OP' || presentationState === 'STEP_B') && activeEquation.op === '+' && (
                        <span className="relative block text-xs sm:text-sm md:text-base font-sans tracking-wide text-amber-300 font-bold text-center w-full max-w-sm leading-snug animate-fadeIn p-3 md:px-6 md:py-3 bg-slate-900/95 rounded-2xl md:rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md">
                          Tambahkan / Masukkan
                        </span>
                      )}
                    </div>
                    </>
                  );
                })()}
              </div>
              {presentationState === 'IDLE' && (
                <button
                  onClick={() => setPresentationState('STEP_A')}
                  className="mt-4 md:mt-8 w-[90%] mx-auto md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold font-sans px-4 py-2.5 md:px-8 md:py-4 rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex justify-center items-center gap-2 md:gap-3 text-sm md:text-lg animate-pulse cursor-pointer pointer-events-auto"
                >
                  <PlayCircle size={20} className="md:w-6 md:h-6" />
                  Tampilkan Visualisasi
                </button>
              )}
              </div>
            </>
          )}
          
          {/* Result Overlay Modal */}
          {isCompleted && (
            <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center space-y-6 transform hover:scale-105 transition-all">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h4 className="font-sans font-black text-slate-900 text-2xl">Penyelesaian Berhasil!</h4>
                  <p className="text-slate-500 text-xs mt-1">Sisa elemen di papan adalah hasil akhirnya:</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-slate-800 text-2xl tracking-wide flex flex-col items-center justify-center gap-3 shadow-inner">
                  <InlineMath math={activeEquation?.expression || ''} />
                  {activeEquation?.op === '-' && (
                     <div className="text-slate-500 text-lg">
                       <InlineMath math={`= ${activeEquation.a} + ${activeEquation.b < 0 ? Math.abs(activeEquation.b) : `(-${activeEquation.b})`}`} />
                     </div>
                  )}
                  <div className="text-indigo-600 font-bold text-3xl mt-1">
                    <InlineMath math={`= ${netValue}`} />
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 w-full text-left space-y-5">
                  <div>
                    <p className="text-3xs font-bold text-slate-500 uppercase tracking-wide mb-2 text-center">Buat Soal Sendiri:</p>
                    <div className="flex gap-2 justify-center">
                      <input 
                        type="number" 
                        value={customA}
                        onChange={(e) => { setCustomA(e.target.value); setCustomError(null); }}
                        min="-20"
                        max="20"
                        className="w-16 text-center border-2 border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-1 text-sm font-mono font-bold outline-none transition-colors"
                        placeholder="A"
                      />
                      <select 
                        value={customOp}
                        onChange={(e) => setCustomOp(e.target.value as '+' | '-')}
                        className="w-14 text-center border-2 border-slate-200 focus:border-indigo-500 rounded-xl py-2 text-sm font-mono font-bold outline-none cursor-pointer bg-white transition-colors"
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                      </select>
                      <input 
                        type="number" 
                        value={customB}
                        onChange={(e) => { setCustomB(e.target.value); setCustomError(null); }}
                        min="-20"
                        max="20"
                        className="w-16 text-center border-2 border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-1 text-sm font-mono font-bold outline-none transition-colors"
                        placeholder="B"
                      />
                      <button 
                        onClick={() => {
                          let valA = parseInt(customA);
                          let valB = parseInt(customB);
                          if (!isNaN(valA) && !isNaN(valB)) {
                            if (valA < -20 || valA > 20 || valB < -20 || valB > 20) {
                              setCustomError("Maksimal koin adalah 20 atau -20");
                              return;
                            }
                            setCustomError(null);
                            setActiveEquation({
                              expression: `${valA} ${customOp} ${valB < 0 ? `(${valB})` : valB}`,
                              a: valA,
                              b: valB,
                              op: customOp,
                              detectedMisconceptionCode: null
                            });
                          }
                        }}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        Coba
                      </button>
                    </div>
                    {customError && (
                      <div className="w-full text-center mt-1">
                        <span className="text-xs font-bold text-rose-500">{customError}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-3xs font-bold text-slate-500 uppercase tracking-wide mb-2 text-center">Atau Coba Kasus Tersulit:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <button onClick={() => setActiveEquation({expression: "4 - (-3)", a: 4, b: -3, op: "-", detectedMisconceptionCode: null})} className="bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 py-3 px-3 rounded-xl border border-slate-200 shadow-sm transition-all text-center"><InlineMath math="4 - (-3)" /></button>
                      <button onClick={() => setActiveEquation({expression: "-3 - 5", a: -3, b: 5, op: "-", detectedMisconceptionCode: null})} className="bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 py-3 px-3 rounded-xl border border-slate-200 shadow-sm transition-all text-center"><InlineMath math="-3 - 5" /></button>
                      <button onClick={() => setActiveEquation({expression: "-6 - (-2)", a: -6, b: -2, op: "-", detectedMisconceptionCode: null})} className="bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 py-3 px-3 rounded-xl border border-slate-200 shadow-sm transition-all text-center"><InlineMath math="-6 - (-2)" /></button>
                      <button onClick={() => setActiveEquation({expression: "-2 + 7", a: -2, b: 7, op: "+", detectedMisconceptionCode: null})} className="bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 py-3 px-3 rounded-xl border border-slate-200 shadow-sm transition-all text-center"><InlineMath math="-2 + 7" /></button>
                      <button onClick={() => setActiveEquation({expression: "3 + (-8)", a: 3, b: -8, op: "+", detectedMisconceptionCode: null})} className="col-span-2 bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 py-3 px-3 rounded-xl border border-slate-200 shadow-sm transition-all text-center"><InlineMath math="3 + (-8)" /></button>
                    </div>
                  </div>
                  
                  {onProceedToDrill && (
                    <button 
                      onClick={onProceedToDrill}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                    >
                      Lanjut ke Latihan Mandiri <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* grid overlay decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
          
          {/* Zero Neutralizer Line boundary reference */}
          <div className="absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed border-slate-800/80 pointer-events-none flex items-center justify-center">
            <span className="transform -rotate-90 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-600 whitespace-nowrap select-none bg-slate-900 border border-slate-850 px-2 py-0.5 rounded -translate-x-1/2">
              AKALMATIKA ENGINE
            </span>
          </div>

          {/* Gathering Result Background Text */}
          {isGathering && (
            <div className="absolute inset-x-0 top-[72%] z-20 flex items-center justify-center pointer-events-none overflow-hidden">
               <span 
                 className={`font-mono font-black text-5xl leading-none select-none tracking-tighter drop-shadow-xl border bg-slate-900/80 px-8 py-3 rounded-2xl backdrop-blur-sm ${
                   netValue > 0 
                     ? 'text-sky-400 border-sky-500/30 shadow-[0_4px_20px_rgba(56,189,248,0.3)]' 
                     : netValue < 0 
                       ? 'text-rose-400 border-rose-500/30 shadow-[0_4px_20px_rgba(251,113,133,0.3)]' 
                       : 'text-emerald-400 border-emerald-500/30 shadow-[0_4px_20px_rgba(52,211,153,0.3)]'
                 }`}
                 style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 900ms both' }}
               >
                 = {netValue === 0 ? "0" : `${netValue}`}
               </span>
            </div>
          )}

          {/* Render Active Draggable Coins inside board */}
          {coins.map((coin) => {
            const isDragging = activeDragId === coin.id;
            const isPositive = coin.value === 1;

            return (
              <div
                id={`draggable-coin-${coin.id}`}
                key={coin.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleStartDrag(coin.id, e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    handleStartDrag(coin.id, e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                style={{
                  left: `${coin.x}%`,
                  top: coin.isDropping ? '-20%' : `${coin.y}%`,
                  transform: `translate(-50%, -50%) scale(${coin.isNeutralizing ? 1.5 : isDragging ? 1.12 : 1}) ${coin.isNeutralizing ? 'rotate(45deg)' : ''}`,
                  opacity: coin.opacity ?? (coin.isNeutralizing ? 0 : 1),
                  transition: isGathering 
                    ? "all 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : isAutoSolving
                      ? "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                      : coin.isDropping 
                        ? "top 800ms cubic-bezier(0.34, 1.56, 0.64, 1)" 
                        : coin.isNeutralizing 
                          ? "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)" 
                        : isDragging 
                          ? "none" 
                          : "transform 150ms ease-out",
                  zIndex: isGathering ? 45 : (isDragging ? 50 : (presentationState !== 'DONE' ? 40 : 10))
                }}
                className={`absolute w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-lg select-none cursor-grab active:cursor-grabbing touch-none ${coin.isNeutralizing ? 'animate-ping' : ''}`}
              >
                {/* Minion Icon */}
                <div className={`relative flex items-center justify-center w-full h-full drop-shadow-lg`}>
                   {isPositive ? <IceSvg /> : <FireSvg />}
                </div>
              </div>
            );
          })}

          {/* Render Neutralized Explosion Particles */}
          {effects.map((effect) => (
            <div
              key={effect.id}
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute pointer-events-none z-30 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-indigo-500/80 animate-ping absolute" />
              <div className="w-8 h-8 rounded-full border border-white/60 animate-pulse absolute" />
              <span className="font-mono text-3xs font-extrabold text-white bg-indigo-600 border border-indigo-400 rounded-md px-1.5 py-0.5 shadow-md flex items-center gap-1 scale-90 animate-fadeOut shrink-0">
                <Sparkles size={10} className="text-yellow-300" />
                Zero-Pair
              </span>
            </div>
          ))}

          {/* Core instruction help footer on canvas */}
          {coins.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center pointer-events-none">
              <Coins size={32} className="mb-2 text-slate-700 animate-bounce" />
              <p className="text-xs font-semibold text-slate-400">Zero-Pair Playground Clear.</p>
              <p className="text-3xs text-slate-600 mt-1">Spawn new (+1) or (-1) tokens using the controllers on the left.</p>
            </div>
          )}

        </div>

        {/* Small tips context */}
        <div className="mt-1.5 md:mt-4 bg-slate-50 border border-slate-150 p-2 md:p-4 rounded-lg md:rounded-xl flex items-start gap-1.5 sm:gap-2.5 text-slate-650 text-[9px] sm:text-xs">
          <Info size={12} className="text-slate-400 shrink-0 mt-0.5 sm:w-[14px] sm:h-[14px]" />
          <div className="flex-1 leading-tight sm:leading-relaxed">
            <strong>Panduan Kognitif:</strong> {
              tipIndex === 0 
                ? "Penjumlahan dua angka dengan tanda berlawanan dapat diselesaikan dengan memvisualisasikan pasangan (zero-pair) saling menetralisir. Sisa elemen adalah jawaban akhir. Pengurangan bilangan negatif sama dengan menjumlahkan bilangan positif (lawannya)."
                : "Tahukah kamu? Dalam matematika, konvensi penulisan bilangan positif seperti +3 biasanya disederhanakan dengan menuliskan 3 saja tanpa tanda plus di depannya. Namun untuk bilangan negatif seperti -3, tanda negatif tidak boleh dihilangkan!"
            }
          </div>
        </div>

      </div>

    </div>
  );
}
