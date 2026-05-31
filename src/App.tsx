import { useState, useEffect } from "react";
import { 
  Compass, 
  Cpu, 
  FolderGit2, 
  Database, 
  Terminal, 
  BookOpen, 
  Sparkles, 
  Check, 
  Users, 
  Coins,
  ChevronLeft,
  Activity,
  Trophy,
  ArrowRight,
  LogOut
} from "lucide-react";
import StackSection from "./components/StackSection";
import FolderStructure from "./components/FolderStructure";
import DatabaseSchema from "./components/DatabaseSchema";
import TraceSimulator from "./components/TraceSimulator";
import CoinSandbox from "./components/CoinSandbox";
import StudentPortal from "./components/StudentPortal";
import TeacherPortal from "./components/TeacherPortal";
import { MISCONCONCEPTION_CATALOG } from "./blueprints";

type RoleID = "landing" | "siswa" | "guru" | "developer";
type TabID = "overview" | "sandbox" | "simulation" | "schema" | "stack" | "directory";

export default function App() {
  const [activeRole, setActiveRole] = useState<RoleID>("landing");
  const [activeTab, setActiveTab] = useState<TabID>("overview");
  const [selectedEquation, setSelectedEquation] = useState<{ expression: string; a: number; b: number; op: '+' | '-'; detectedMisconceptionCode?: string | null } | undefined>(undefined);

  const navigateToRole = (role: RoleID) => {
    const url = new URL(window.location.href);
    if (role === "landing") {
      url.searchParams.delete("role");
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("role", role);
    }
    window.history.pushState({}, '', url);
    setActiveRole(role);
  };

  // History/Routing for deep linking and back button
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role") as RoleID | null;
      const tab = params.get("tab") as TabID | null;
      
      if (role) setActiveRole(role);
      else setActiveRole("landing");

      if (tab) setActiveTab(tab);
      else setActiveTab("overview");
    };

    // Initial load
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
      
      {/* Top Navigation Bar */}
      <header id="app-header" className="bg-white border-b border-slate-150 relative sm:sticky top-0 z-50 px-4 py-2 md:px-6 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 md:gap-4">
          <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => navigateToRole("landing")}
          title="Kembali ke Halaman Utama"
        >
          <img src="/Akalmatika_LogoUtama_Horizontal_Terang.png" alt="Akalmatika Logo Utama" className="h-10 md:h-12 object-contain transition-transform group-hover:scale-105 drop-shadow-xs" />
        </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            {activeRole !== "landing" && (
              <button
                id="btn-return-landing"
                onClick={() => navigateToRole("landing")}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-sans shadow-2xs border border-slate-200"
              >
                <LogOut size={12} />
                <span>Ganti Portal</span>
              </button>
            )}
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Bilingual Edition
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 pb-24 md:pb-8 flex-1 flex flex-col justify-center">
        
        {/* 1. LANDING PORTAL SELECTOR SCREEN */}
        {activeRole === "landing" && (
          <div id="landing-selection-portal" className="space-y-12 animate-fadeIn py-6 md:py-10">
            {/* Hero Branding */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full text-2xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
                <Sparkles size={12} className="animate-spin-slow" /> Cognitive Mathematics Telemetry
              </div>
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight leading-tight text-slate-900">
                Pecahkan Kesalahpahaman Matematika Secara Instan
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto font-sans">
                Akalmatika mendeteksi kesalahan pola kognitif siswa secara deterministik, menyajikan visualisasi koin zero-pair, serta menyediakan peta analitik pembelajaran untuk para pendidik.
              </p>
            </div>

            {/* Premium Role Selection Cards Grid */}
            <div className="grid grid-cols-1 max-w-md mx-auto pt-4">
              
              {/* Card 1: Siswa Portal */}
              <div 
                id="portal-card-siswa"
                onClick={() => navigateToRole("siswa")}
                className="bg-white border border-slate-100 hover:border-indigo-250 hover:shadow-xl rounded-3xl p-6 md:p-8 transition-all duration-300 group cursor-pointer flex flex-col justify-between space-y-6 shadow-2xs"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-sky-50 border border-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-slate-900 text-lg md:text-xl">Portal Siswa</h3>
                    <p className="text-xs text-slate-500 font-sans mt-1.5 leading-relaxed">
                      Mulai petualangan interaktif memecahkan kuis bilangan bulat negatif dengan bantuan visualisasi papan koin zero-pair yang menyenangkan.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  <span>Mulai Petualangan</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 2 & 3 Hidden as requested */}

            </div>
          </div>
        )}

        {/* 2. ACTIVE STUDENT MODE PORTAL */}
        {activeRole === "siswa" && (
          <div id="active-student-portal-wrapper" className="w-full py-4 animate-fadeIn">
            <div className="mb-4">
              <button
                id="btn-siswa-back"
                onClick={() => navigateToRole("landing")}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali ke Pilihan Beranda</span>
              </button>
            </div>
            <StudentPortal />
          </div>
        )}

        {/* 3. ACTIVE TEACHER MODE PORTAL */}
        {activeRole === "guru" && (
          <div id="active-teacher-portal-wrapper" className="w-full py-4 animate-fadeIn">
            <div className="mb-4">
              <button
                id="btn-guru-back"
                onClick={() => navigateToRole("landing")}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Kembali ke Pilihan Beranda</span>
              </button>
            </div>
            <TeacherPortal />
          </div>
        )}

        {/* 4. ACTIVE DEVELOPER LAB PORTAL (ORIGINAL Blueprints) */}
        {activeRole === "developer" && (
          <div id="active-developer-portal-wrapper" className="space-y-8 animate-fadeIn py-4">
            
            {/* Header control */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-5">
              <div>
                <button
                  id="btn-developer-back"
                  onClick={() => navigateToRole("landing")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mb-2"
                >
                  <ChevronLeft size={16} />
                  <span>Kembali ke Pilihan Beranda</span>
                </button>
                <h3 className="font-sans font-black text-slate-900 text-xl tracking-tight">
                  Lead Developer Inspection Lab
                </h3>
              </div>

              {/* Tab Navigation Controls */}
              <nav id="nav-tabs" className="bg-slate-200/60 p-1 rounded-xl flex overflow-x-auto flex-nowrap md:flex-wrap gap-1 max-w-full hide-scrollbar">
                {[
                  { id: "overview", label: "Executive Summary", icon: <BookOpen size={14} /> },
                  { id: "sandbox", label: "Manipulative Zero-Coins", icon: <Coins size={14} /> },
                  { id: "simulation", label: "Core-Trace Sim Laboratory", icon: <Terminal size={14} /> },
                  { id: "schema", label: "Database Schemas", icon: <Database size={14} /> },
                  { id: "stack", label: "Stack Configurations", icon: <Cpu size={14} /> },
                  { id: "directory", label: "Repository Tree", icon: <FolderGit2 size={14} /> },
                ].map((tab) => (
                  <button
                    id={`tab-main-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabID)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink ${
                      activeTab === tab.id
                        ? "bg-white text-indigo-705 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main simulator screen content */}
            <section id="tab-visual-body" className="transition-all duration-300">
              
              {activeTab === "overview" && (
                <div id="overview-tab-view" className="space-y-8 animate-fadeIn">
                  
                  {/* Executive banner */}
                  <section id="hero-banner" className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-radial-to-t from-transparent to-slate-950/40 pointer-events-none" />
                    
                    <div className="relative z-10 max-w-4xl space-y-4">
                      <div className="inline-flex items-center gap-1 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-mono text-indigo-200">
                        <Compass size={14} /> Cognitive Linter for Student Mathematics
                      </div>
                      <h2 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight leading-tight">
                        Tracing Student Misconceptions in Integer Operations
                      </h2>
                      <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
                        Akalmatika Core-Trace replaces uniform grading sheets with <strong>step-by-step cognitive traces</strong>. Underpinned by deterministic algebra pipelines, a Postgres telemetry layer, and socio-pedagogical AI scaffold engines, it detects and cures mental calculation bugs in real time.
                      </p>
                      
                      <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-indigo-300">
                        <span className="flex items-center gap-1.5">
                          <Check size={14} className="text-emerald-400" /> High Precision Rule Matrix
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Check size={14} className="text-emerald-400" /> Empathy-First Scaffold Prompts
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Check size={14} className="text-emerald-400" /> Real-time Interactive Diagrams
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Context Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-605">
                        <Compass size={20} />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-slate-900 tracking-tight text-base md:text-lg">
                          The Integer Misconception Problem
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans mt-2">
                          When students evaluate expressions like <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono text-purple-650">-5 - (-3)</code>, they rarely guess at random. Instead, their mistakes stem from coherent <strong>"buggy rules"</strong> (e.g. visualizing a subtraction symbol alongside a negative symbol as a single merged minus, arriving at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-red-600">-8</code> instead of <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-sky-600">-2</code>).
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-slate-900 tracking-tight text-base md:text-lg">
                          Socio-Cognitive Scaffold Remedy
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans mt-2">
                          Simply highlighting an answer as "incorrect" causes learning fatigue. Akalmatika Core-Trace diagnoses the specific underlying cognitive rule, triggers an interactive visualization model (like a vector thermometer or double-flip number line), and scaffolds learning using targeted prompt hooks instead of supplying numerical keys.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Core Misconception Catalog Details */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="mb-4">
                      <h3 className="font-sans font-semibold text-slate-900 text-base md:text-lg tracking-tight">
                        Primary Misconception Catalog Targets
                      </h3>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        Catalog of deterministic, systematic mathematical misconceptions our stack is configured to trace.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MISCONCONCEPTION_CATALOG.map((rule, idx) => (
                        <div id={`idx-rule-${rule.code}`} key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-3xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                                {rule.code}
                              </span>
                              <span className="font-mono text-3xs font-bold text-slate-400">
                                PROBLEM TYPE: {rule.exampleProblem}
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-xs text-slate-800 mb-1">{rule.name}</h4>
                            <p className="text-2xs text-slate-500 leading-relaxed">{rule.underlyingBug}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/60 text-3xs font-mono space-y-1">
                            <div>
                              <strong className="text-slate-400">REMEDIAL PROMPT SIGNAL HOOK:</strong>
                              <p className="text-indigo-605 italic mt-0.5">"{rule.remedialSocioCognitiveHook}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "sandbox" && (
                <div id="sandbox-tab-view" className="space-y-6 animate-fadeIn">
                  {selectedEquation && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          🎯 Targeted Scaffold Intervention Mode
                        </span>
                        <h4 className="font-sans font-bold text-slate-900 text-sm mt-1">
                          Modeling Math Deficit for equation: <code className="bg-white px-2 py-0.5 rounded border border-amber-200 font-mono font-black text-amber-800">{selectedEquation.expression}</code>
                        </h4>
                        <p className="text-xs text-slate-650 leading-relaxed">
                          The core engine diagnosed misconception <strong className="font-mono text-[11px] text-indigo-750 font-bold">{selectedEquation.detectedMisconceptionCode}</strong> on this task. We've populated the workspace with representative counters to let you explore neutralizing zero-pairs.
                        </p>
                      </div>
                      <button
                        id="btn-quit-remedial"
                        onClick={() => setSelectedEquation(undefined)}
                        className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-xs transition-all cursor-pointer font-sans shadow-2xs"
                      >
                        Exit Remedial Practice
                      </button>
                    </div>
                  )}

                  {!selectedEquation && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs animate-fadeIn">
                      <h3 className="font-sans font-semibold text-slate-900 tracking-tight text-lg mb-1">
                        Concrete Coin Zero-Pair Workspace
                      </h3>
                      <p className="text-xs text-slate-500 font-sans">
                        Apply interactive manipulatives to model signed operations. Drag positive tokens (+1) onto negative tokens (-1) to cancel them into zero charges.
                      </p>
                    </div>
                  )}

                  <CoinSandbox 
                    initialEquation={selectedEquation} 
                    onBackToDiagnostic={() => setActiveTab("simulation")} 
                  />
                </div>
              )}

              {activeTab === "stack" && (
                <div id="stack-tab-view" className="space-y-6 animate-fadeIn">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
                    <h3 className="font-sans font-semibold text-slate-900 tracking-tight text-lg mb-1">
                      Full-Stack Architecture & Systems Design
                    </h3>
                    <p className="text-xs text-slate-505 font-sans">
                      The technologies supporting Akalmatika Core-Trace are chosen to minimize cold-starts, guarantee student isolation boundaries via PostgreSQL, and ensure lightweight cost overheads.
                    </p>
                  </div>
                  <StackSection />
                </div>
              )}

              {activeTab === "directory" && (
                <div id="directory-tab-view" className="animate-fadeIn">
                  <FolderStructure />
                </div>
              )}

              {activeTab === "schema" && (
                <div id="schema-tab-view" className="animate-fadeIn">
                  <DatabaseSchema />
                </div>
              )}

              {activeTab === "simulation" && (
                <div id="simulation-tab-view" className="space-y-6 animate-fadeIn">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
                    <h3 className="font-sans font-semibold text-slate-900 tracking-tight text-lg mb-1">
                      Trace Pipeline Experimentation Sandbox
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Test and observe how inputs, database parameters, and generative AI prompt matrices collaborate during active student sessions inside this interactive Lead-Architect laboratory.
                    </p>
                  </div>
                  <TraceSimulator 
                    onMisconceptionDetected={(code, failedEq) => {
                      setSelectedEquation({
                        expression: failedEq.expression,
                        a: failedEq.a,
                        b: failedEq.b,
                        op: failedEq.op,
                        detectedMisconceptionCode: code
                      });
                      setActiveTab("sandbox");
                    }}
                  />
                </div>
              )}

            </section>
            
          </div>
        )}

      </main>

      {/* Footer System Blueprint Credits */}
      <footer id="app-footer" className="bg-slate-900 border-t border-slate-800 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <img src="/Akalmatika_LogoSekunder_White.png" alt="Akalmatika Logo Sekunder" className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <span className="hidden md:inline-block border-l border-slate-700 pl-4">AKALMATIKA CORE-TRACE • DUAL PORTAL EDISI PREMIUM</span>
          </div>
          <div className="flex gap-4">
            <span>SUPABASE SECURITY LEVEL: STRICT</span>
            <span>HOSTING ENVIRONMENT: VERCEL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
