import { Outlet, Link, useLocation } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";

export default function StudentLayout() {
  const location = useLocation();

  // Basic Breadcrumb Logic
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    // e.g. ["student", "visualizations", "integer"]
    const crumbs = [];
    let currentPath = "";
    
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      // formatting the name
      let label = paths[i];
      if (label === "student" && i === 0) continue; // Skip first 'student'
      if (label === "diagnostic") label = "Diagnosis";
      if (label === "visualizations") label = "Visualisasi";
      if (label === "integer") label = "Bilangan Bulat";
      if (label === "fractions") label = "Pecahan";
      if (label === "percent") label = "Persen";
      if (label === "algebra") label = "Aljabar Dasar";
      
      crumbs.push({ label, path: currentPath });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-150 relative sm:sticky top-0 z-50 px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 md:gap-4">
          <Link 
            to="/"
            className="flex items-center cursor-pointer group" 
            title="Kembali ke Halaman Utama"
          >
            <img src="/Akalmatika_LogoUtama_Horizontal_Terang_fix_clean.png" alt="Akalmatika Logo Utama" className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            {location.pathname !== "/" && (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-sans shadow-2xs border border-slate-200"
              >
                <LogOut size={12} />
                <span>Beranda</span>
              </Link>
            )}
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Akalmatika Interactive
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 md:pb-8 flex-1 flex flex-col justify-start">
        
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-6 flex-wrap">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Beranda</Link>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.path} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-slate-400" />
                <Link 
                  to={crumb.path} 
                  className={`hover:text-indigo-600 transition-colors ${idx === breadcrumbs.length - 1 ? "text-slate-900 font-bold" : ""}`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>
        )}

        {/* Nested Routes render here */}
        <Outlet />

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <img src="/Akalmatika_LogoSekunder_Gelap_clean.png" alt="Akalmatika Logo Sekunder" className="h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <span className="hidden md:inline-block border-l border-slate-700 pl-4">AKALMATIKA INTERACTIVE LEARNING</span>
          </div>
          <div className="text-center md:text-right">
            <span>© 2026 Akalmatika • Media Belajar Matematika Interaktif</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
