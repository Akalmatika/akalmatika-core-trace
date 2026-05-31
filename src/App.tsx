import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "./components/layout/StudentLayout";
import LandingPage from "./pages/LandingPage";
import DiagnosticCatalogPage from "./pages/DiagnosticCatalogPage";
import VisualizationCatalogPage from "./pages/VisualizationCatalogPage";
import IntegerVisualizationPage from "./pages/IntegerVisualizationPage";
import FractionVisualizationPage from "./pages/FractionVisualizationPage";
import PercentVisualizationPage from "./pages/PercentVisualizationPage";
import AlgebraVisualizationPage from "./pages/AlgebraVisualizationPage";
import ZeroPairVisualizationPage from "./pages/ZeroPairVisualizationPage";
import PlaceholderVisualizationPage from "./pages/PlaceholderVisualizationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Routes wrapped in StudentLayout */}
        <Route path="/" element={<StudentLayout />}>
          
          {/* Landing Page */}
          <Route index element={<LandingPage />} />
          
          {/* Redirection for /student since / is our home */}
          <Route path="student" element={<Navigate to="/" replace />} />
          
          {/* Diagnostic Flow */}
          <Route path="student/diagnostic" element={<DiagnosticCatalogPage />} />
          <Route path="student/diagnostic/*" element={<PlaceholderVisualizationPage />} />
          
          {/* Visualizations Flow */}
          <Route path="student/visualizations" element={<VisualizationCatalogPage />} />
          <Route path="student/visualizations/integer" element={<IntegerVisualizationPage />} />
          <Route path="student/visualizations/integer/zero-pair" element={<ZeroPairVisualizationPage />} />
          <Route path="student/visualizations/fractions" element={<FractionVisualizationPage />} />
          <Route path="student/visualizations/percent" element={<PercentVisualizationPage />} />
          <Route path="student/visualizations/algebra" element={<AlgebraVisualizationPage />} />
          <Route path="student/visualizations/*" element={<PlaceholderVisualizationPage />} />
          
          {/* Fallback route - could be a 404 page */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
              <p className="text-slate-500 mb-6">Modul yang Anda cari mungkin belum tersedia.</p>
            </div>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
