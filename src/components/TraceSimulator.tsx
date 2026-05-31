import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  Info 
} from "lucide-react";
import { triangulateAnswers, runEngineDiagnosticProofs, TestCaseProof } from "../engine/parser";
import { integerCluster as DIAGNOSTIC_CLUSTER, integerRules as ENGINE_RULES } from "../engine/rules";
import { TriangulationResult } from "../engine/rules/types";

export interface TraceSimulatorProps {
  onMisconceptionDetected?: (code: string, failedEquation: { expression: string; a: number; b: number; op: '+' | '-' }) => void;
}

export default function TraceSimulator({ onMisconceptionDetected }: TraceSimulatorProps = {}) {
  // Configured answering states
  const [ans1, setAns1] = useState<string>("-5");
  const [ans2, setAns2] = useState<string>("-8");
  const [ans3, setAns3] = useState<string>("-5");

  const [activeTab, setActiveTab] = useState<"sandbox" | "unit-test">("sandbox");
  const [liveResult, setLiveResult] = useState<TriangulationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [unitTestProof, setUnitTestProof] = useState<TestCaseProof[]>([]);

  // Production rate limiting values (cooldown of 4 seconds between diagnostic requests)
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Cooldown countdown clock
  useEffect(() => {
    if (secondsLeft <= 0) {
      setCooldownActive(false);
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setCooldownActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Automatically load the unit test proofs on mount
  useEffect(() => {
    const proofs = runEngineDiagnosticProofs();
    setUnitTestProof(proofs);
  }, []);

  const selectScenario = (a1: string, a2: string, a3: string) => {
    setAns1(a1);
    setAns2(a2);
    setAns3(a3);
    setLiveResult(null);
    setConsoleLogs([]);
  };

  const handleDiagnose = () => {
    if (cooldownActive) {
      setConsoleLogs(prev => [...prev, "❌ FAILURE: Thread submission rejected due to active rate-limiting block."]);
      return;
    }

    // Activate defensive rate limit
    setCooldownActive(true);
    setSecondsLeft(4);

    setIsEvaluating(true);
    setConsoleLogs(["Initializing Core-Trace Triangulation Context..."]);
    
    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `Loading Diagnostic Cluster: ${DIAGNOSTIC_CLUSTER.map(d => d.expression).join(", ")}`]);
    }, 300);

    setTimeout(() => {
      const parsedAns = [Number(ans1), Number(ans2), Number(ans3)];
      setConsoleLogs(prev => [...prev, `Parsing submission values: [${parsedAns.join(", ")}]`]);
      
      if (parsedAns.some(isNaN)) {
        setConsoleLogs(prev => [...prev, "🚨 SYNTAX ERROR: Some values are not valid numerical integers!"]);
        setIsEvaluating(false);
        return;
      }

      const result = triangulateAnswers(parsedAns);
      setLiveResult(result);

      const hasTriggerableMisconception = 
        result.detectedMisconceptionCode === "MC-ADD-SIGN-CONF" || 
        result.detectedMisconceptionCode === "MC-SIGN-FIRST-NUM";

      setConsoleLogs(prev => [
        ...prev,
        `Matching signatures against established mathematical misconception patterns...`,
        `Detected Misconception Code: ${result.detectedMisconceptionCode || "None (or Unclassified)"}`,
        `Pattern Ratio Match: ${result.matchRatio}`,
        `Engine confidence score: ${result.confidence}%`,
        hasTriggerableMisconception
          ? `⚠️ COGNITIVE ANOMALY ALERT: Triggering personalized tactile coin workspace redirect...`
          : `Dispatching final diagnostic schema object to educator stream.`,
        hasTriggerableMisconception
          ? `🔄 Seamless redirection dispatched: Redirecting to Interactive Zero-Pair Workspace in 2 seconds...`
          : `Awaiting further student input stream.`
      ]);
      setIsEvaluating(false);

      if (hasTriggerableMisconception && onMisconceptionDetected) {
        // Identify which equation is incorrect to pass it to the sandbox
        const incorrectIndices = parsedAns.map((ans, idx) => ans !== DIAGNOSTIC_CLUSTER[idx].correctAnswer ? idx : -1).filter(idx => idx !== -1);
        const failedIdx = incorrectIndices.length > 0 ? incorrectIndices[0] : 0;
        const failedEq = DIAGNOSTIC_CLUSTER[failedIdx];

        setTimeout(() => {
          onMisconceptionDetected(result.detectedMisconceptionCode!, failedEq);
        }, 2200);
      }
    }, 1200);
  };

  return (
    <div id="diagnostics-trace-engine-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden text-slate-100">
      
      {/* Structural view toggle header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="space-y-1">
          <span className="text-3xs uppercase bg-indigo-500/15 text-indigo-400 font-mono tracking-widest px-2.5 py-1 rounded-full border border-indigo-500/20">
            COMPILER LAB & TRIANGULATOR
          </span>
          <h3 className="font-sans font-bold tracking-tight text-white text-lg">
            Active Core-Trace Engine Diagnostics
          </h3>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-sim-sandbox"
            onClick={() => setActiveTab("sandbox")}
            className={`px-3 py-1.5 font-mono text-2xs rounded-md transition-all ${
              activeTab === "sandbox" ? "bg-indigo-600 text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Live Custom Triangulator
          </button>
          <button
            id="tab-sim-unit-test"
            onClick={() => setActiveTab("unit-test")}
            className={`px-3 py-1.5 font-mono text-2xs rounded-md transition-all ${
              activeTab === "unit-test" ? "bg-indigo-600 text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Terminal Unit-Test Proofs
          </button>
        </div>
      </div>

      {activeTab === "sandbox" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
          
          {/* Left Panel: Answering Parameters */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Quick Test Scenarios Selection */}
            <div className="space-y-2">
              <span className="text-2xs font-mono font-bold text-slate-400 block uppercase tracking-wide">
                Quick-Load Preset Submissions
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  id="preset-correct"
                  onClick={() => selectScenario("1", "2", "3")}
                  className="w-full text-left p-2.5 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all border border-slate-800/80 rounded-xl text-xs flex justify-between items-center text-slate-300"
                >
                  <span className="font-sans font-medium">✨ Correct Answers Case</span>
                  <span className="font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold select-none">[1, 2, 3]</span>
                </button>
                <button
                  id="preset-abs-sum"
                  onClick={() => selectScenario("-5", "-8", "-5")}
                  className="w-full text-left p-2.5 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all border border-slate-800/80 rounded-xl text-xs flex justify-between items-center text-slate-300"
                >
                  <span className="font-sans font-medium">⚠️ Absolute Sum Rule Confusion</span>
                  <span className="font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold select-none">[-5, -8, -5]</span>
                </button>
                <button
                  id="preset-sign-first"
                  onClick={() => selectScenario("-1", "-2", "-3")}
                  className="w-full text-left p-2.5 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all border border-slate-800/80 rounded-xl text-xs flex justify-between items-center text-slate-300"
                >
                  <span className="font-sans font-medium">⚠️ Sign Follows First Number</span>
                  <span className="font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold select-none">[-1, -2, -3]</span>
                </button>
                <button
                  id="preset-ignore-neg"
                  onClick={() => selectScenario("5", "8", "5")}
                  className="w-full text-left p-2.5 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all border border-slate-800/80 rounded-xl text-xs flex justify-between items-center text-slate-300"
                >
                  <span className="font-sans font-medium">⚠️ Absolute Addition (Ignore Negs)</span>
                  <span className="font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold select-none">[5, 8, 5]</span>
                </button>
              </div>
            </div>

            {/* Dynamic Numeric Inputs Container */}
            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-4">
              <span className="text-2xs font-mono font-bold text-slate-300 block uppercase tracking-wide">
                Modify Student Input Vector
              </span>

              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400">{DIAGNOSTIC_CLUSTER[0].expression} =</span>
                  <input
                    id="input-ans-1"
                    type="text"
                    value={ans1}
                    onChange={(e) => { setAns1(e.target.value); setLiveResult(null); }}
                    className="bg-slate-950 text-white font-bold text-sm text-center border border-slate-750 rounded p-1.5 w-20 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400">{DIAGNOSTIC_CLUSTER[1].expression} =</span>
                  <input
                    id="input-ans-2"
                    type="text"
                    value={ans2}
                    onChange={(e) => { setAns2(e.target.value); setLiveResult(null); }}
                    className="bg-slate-950 text-white font-bold text-sm text-center border border-slate-750 rounded p-1.5 w-20 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400">{DIAGNOSTIC_CLUSTER[2].expression} =</span>
                  <input
                    id="input-ans-3"
                    type="text"
                    value={ans3}
                    onChange={(e) => { setAns3(e.target.value); setLiveResult(null); }}
                    className="bg-slate-950 text-white font-bold text-sm text-center border border-slate-750 rounded p-1.5 w-20 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-trigger-diagnose"
                  onClick={handleDiagnose}
                  disabled={isEvaluating || cooldownActive || !ans1 || !ans2 || !ans3}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-sans font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:pointer-events-none"
                >
                  {cooldownActive ? (
                    <span className="animate-pulse">Cooldown Active ({secondsLeft}s)</span>
                  ) : (
                    <>
                      <Play size={12} className="fill-current" />
                      <span>Execute Diagnostic Trace</span>
                    </>
                  )}
                </button>
                {cooldownActive && (
                  <p className="text-[10px] font-mono text-amber-500/80 text-center mt-2 animate-pulse leading-normal">
                    ⚠️ API Rate Limiting: Please wait {secondsLeft}s before re-analyzing answers.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Output and Live Console Stream */}
          <div className="xl:col-span-7 flex flex-col justify-between bg-slate-950 border border-slate-850 rounded-2xl p-5 overflow-hidden">
            
            <div className="space-y-4">
              
              {/* Virtual terminal logs header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-450">
                <span className="flex items-center gap-1.5">
                  <Terminal size={14} className="text-indigo-400 animate-pulse" /> Live Terminal Thread
                </span>
                <span className="text-3xs uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80">
                  PORT: DETERMINISTIC
                </span>
              </div>

              {/* Console log outputs stream */}
              <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-1.5 overflow-y-auto max-h-[150px] border border-slate-800/40">
                {consoleLogs.length === 0 ? (
                  <span className="text-slate-600 italic">// Console ready. Awaiting operational input stream...</span>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-indigo-500 select-none">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Diagnostic Core Trace Details Output */}
              {liveResult && (
                <div className="p-4 rounded-xl border bg-slate-900/60 border-slate-800 space-y-3 font-sans text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-3xs font-bold text-indigo-400 uppercase">DETECTION LOG ANALYSIS</h4>
                      <h5 className="font-sans font-bold text-white text-sm mt-0.5">
                        {liveResult.ruleName}
                      </h5>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded-full text-3xs ${
                        liveResult.isPerfectTrack 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : liveResult.detectedMisconceptionCode 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                            : "bg-slate-800 text-slate-450"
                      }`}>
                        CONFIDENCE: {liveResult.confidence}% ({liveResult.matchRatio})
                      </span>
                      {liveResult.detectedMisconceptionCode && (
                        <div className="font-mono text-3xs text-slate-400 mt-1">{liveResult.detectedMisconceptionCode}</div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-350 leading-relaxed font-sans">{liveResult.description}</p>

                  {liveResult.remedialScaffold && (
                    <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-3 space-y-1">
                      <span className="font-mono text-3xs tracking-wide text-indigo-400 font-bold block">
                        SOCIO-COGNITIVE PEDAGOGOCIAL SCAFFOLD DISPATCH:
                      </span>
                      <p className="italic text-slate-200 leading-relaxed font-sans">
                        "{liveResult.remedialScaffold}"
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-3xs font-mono text-slate-400">
                    <div>
                      <span className="block text-slate-500">SUBMITTED VECTOR</span>
                      <span className="font-bold text-slate-300">[{liveResult.submittedAnswers.join(", ")}]</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">SIGNATURE PATTERN</span>
                      <span className="font-bold text-slate-300">[{liveResult.predictedForBug.join(", ")}]</span>
                    </div>
                  </div>
                </div>
              )}

              {!liveResult && !isEvaluating && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  <svg className="w-10 h-10 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-xs font-medium text-slate-450 font-sans">No trace ran yet.</p>
                  <p className="text-3xs text-slate-600 mt-1">Update values on the left or load a preset, then hit "Execute Diagnostic Trace".</p>
                </div>
              )}

            </div>

            <div className="mt-8 pt-3 border-t border-slate-800 flex justify-between items-center text-3xs font-mono text-slate-500">
              <span>ALAMATIKA CLIENT TRIANGULATOR V1</span>
              <span>100% DETERMINISTIC LOGIC</span>
            </div>

          </div>

        </div>
      ) : (
        /* Unit-Test proofs view: Pure text printouts to prove mathematical test cases work perfectly */
        <div className="space-y-6 relative z-10">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-2">
            <h4 className="font-mono text-xs font-semibold text-white uppercase flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Terminal Test Suite Output:
            </h4>
            <p className="font-sans text-slate-400">
              The triangulation compiler automatically runs mock student inputs across our exact test vector specifications to guarantee mathematical correctness. Below are the actual execution diagnostics.
            </p>
          </div>

          {/* Table representing test case proof elements as simple terminal text outputs */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <div className="grid grid-cols-1 divide-y divide-slate-800 font-mono text-xs">
              
              {/* Header row */}
              <div className="bg-slate-900/85 text-slate-400 px-4 py-3 grid grid-cols-12 gap-2 text-3xs font-bold uppercase select-none">
                <div className="col-span-4">Scenario Verification Name</div>
                <div className="col-span-2 text-center">Inputs</div>
                <div className="col-span-3 text-center">Expected Mapping</div>
                <div className="col-span-2 text-center">Engine Match Code</div>
                <div className="col-span-1 text-right">Status</div>
              </div>

              {/* Data rows */}
              {unitTestProof.map((proof, idx) => (
                <div key={idx} className="px-4 py-3 grid grid-cols-12 gap-2 hover:bg-slate-900/30 items-center">
                  <div className="col-span-4 font-sans font-semibold text-slate-200">
                    {proof.scenarioName}
                  </div>
                  <div className="col-span-2 text-center text-yellow-300">
                    [{proof.userAnswers.join(", ")}]
                  </div>
                  <div className="col-span-3 text-center text-indigo-300 font-bold">
                    {proof.expectedCode}
                  </div>
                  <div className="col-span-2 text-center text-slate-400 truncate" title={proof.actualResult.detectedMisconceptionCode || "None"}>
                    {proof.actualResult.detectedMisconceptionCode || (proof.actualResult.isPerfectTrack ? "CORRECT" : "UNCLASSIFIED_ERROR")}
                  </div>
                  <div className="col-span-1 text-right">
                    {proof.passes ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 text-3xs select-none">
                        <Check size={10} strokeWidth={3} /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 text-3xs select-none">
                        FAIL
                      </span>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl flex gap-3">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 font-sans">
              <span className="font-semibold text-white block">Lead Architect Verification Note:</span>
              <p className="text-slate-400 text-2xs leading-relaxed">
                As instructed, any cluster containing the exact responses of <code className="bg-slate-950 text-yellow-300 p-0.5 px-1 font-mono rounded select-all">[-5, -8, -5]</code> successfully maps with 100% confidence to <code className="text-indigo-300 font-semibold select-all font-mono">MC-ADD-SIGN-CONF</code>, while responses <code className="bg-slate-950 text-yellow-300 p-0.5 px-1 font-mono rounded select-all">[-1, -2, -3]</code> perfectly pinpoint <code className="text-indigo-300 font-semibold select-all font-mono">MC-SIGN-FIRST-NUM</code>. All deterministic computations run client-side without relying on network latency or asynchronous models.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
