import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "./components/layout/StudentLayout";
import LandingPage from "./pages/LandingPage";
import DiagnosticCatalogPage from "./pages/DiagnosticCatalogPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import VisualizationCatalogPage from "./pages/VisualizationCatalogPage";
import IntegerVisualizationPage from "./pages/IntegerVisualizationPage";
import FractionVisualizationPage from "./pages/FractionVisualizationPage";
import FractionAreaModelPage from "./pages/visualizations/fractions/FractionAreaModelPage";
import EquivalentFractionsPage from "./pages/visualizations/fractions/EquivalentFractionsPage";
import SimplifyFractionPage from "./pages/visualizations/fractions/SimplifyFractionPage";
import CompareFractionsPage from "./pages/visualizations/fractions/CompareFractionsPage";
import AddSameDenominatorPage from "./pages/visualizations/fractions/AddSameDenominatorPage";
import AddDiffDenominatorPage from "./pages/visualizations/fractions/AddDiffDenominatorPage";
import Grid100Page from "./pages/visualizations/percent/Grid100Page";
import FractionToPercentPage from "./pages/visualizations/percent/FractionToPercentPage";
import DiscountSimulatorPage from "./pages/visualizations/percent/DiscountSimulatorPage";
import PercentVisualizationPage from "./pages/PercentVisualizationPage";
import AlgebraVisualizationPage from "./pages/AlgebraVisualizationPage";
import TermCardsPage from "./pages/visualizations/algebra/TermCardsPage";
import SignBelongsToTermPage from "./pages/visualizations/algebra/SignBelongsToTermPage";
import LikeTermSorterPage from "./pages/visualizations/algebra/LikeTermSorterPage";
import GroupLikeTermsPage from "./pages/visualizations/algebra/GroupLikeTermsPage";
import LikeTermOperationsPage from "./pages/visualizations/algebra/LikeTermOperationsPage";
import ExpandBracketsPage from "./pages/visualizations/algebra/ExpandBracketsPage";
import SubstitutionMachinePage from "./pages/visualizations/algebra/SubstitutionMachinePage";
import WordToExpressionPage from "./pages/visualizations/algebra/WordToExpressionPage";
import ZeroPairVisualizationPage from "./pages/ZeroPairVisualizationPage";
import NumberLineVisualizationPage from "./pages/NumberLineVisualizationPage";
import PlaceholderVisualizationPage from "./pages/PlaceholderVisualizationPage";
import MixedOperationsVisualizationPage from "./pages/MixedOperationsVisualizationPage";
import PlsvVisualizationPage from "./pages/PlsvVisualizationPage";
import CrossGridMultiplierPage from "./pages/visualizations/fractions/CrossGridMultiplierPage";
import OrderOfOperationsPage from "./pages/visualizations/algebra/OrderOfOperationsPage";
import PlsvBalancePage from "./pages/visualizations/algebra/PlsvBalancePage";
import DiagnosticFoundationPage from "./pages/DiagnosticFoundationPage";
import LearningMapPage from "./pages/LearningMapPage";
import BridgePage from "./pages/BridgePage";
import DrillPage from "./pages/DrillPage";
import MasteryCheckPage from "./pages/MasteryCheckPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import TeacherLayout from "./components/layout/TeacherLayout";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page — rendered with its own layout (navbar + footer built-in) */}
        <Route path="/" element={<LandingPage />} />

        {/* Student application routes wrapped in StudentLayout */}
        <Route path="/student" element={<StudentLayout />}>
          
          {/* Student index redirects to dashboard */}
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="dashboard" element={<StudentDashboardPage />} />
          
          {/* Diagnostic Flow */}
          <Route path="diagnostic" element={<DiagnosticCatalogPage />} />
          <Route path="diagnostic/:topicId" element={<DiagnosticPage />} />
          <Route path="diagnostic-foundation" element={<DiagnosticFoundationPage />} />
          <Route path="learning-map" element={<LearningMapPage />} />
          <Route path="bridge/:topicId/:misconceptionCode" element={<BridgePage />} />
          <Route path="drill/:topicId" element={<DrillPage />} />
          <Route path="mastery/:topicId" element={<MasteryCheckPage />} />
          
          {/* Visualizations Flow */}
          <Route path="visualizations" element={<VisualizationCatalogPage />} />
          <Route path="visualizations/integer" element={<IntegerVisualizationPage />} />
          <Route path="visualizations/integer/zero-pair" element={<ZeroPairVisualizationPage />} />
          <Route path="visualizations/integer/number-line" element={<NumberLineVisualizationPage />} />
          <Route path="visualizations/fractions" element={<FractionVisualizationPage />} />
          <Route path="visualizations/fractions/area-model" element={<FractionAreaModelPage />} />
          <Route path="visualizations/fractions/equivalent-fractions" element={<EquivalentFractionsPage />} />
          <Route path="visualizations/fractions/simplify" element={<SimplifyFractionPage />} />
          <Route path="visualizations/fractions/compare-order" element={<CompareFractionsPage />} />
          <Route path="visualizations/fractions/same-denominator" element={<AddSameDenominatorPage />} />
          <Route path="visualizations/fractions/different-denominator" element={<AddDiffDenominatorPage />} />
          <Route path="visualizations/fractions/cross-grid-multiplier" element={<CrossGridMultiplierPage />} />
          <Route path="visualizations/percent" element={<PercentVisualizationPage />} />
          <Route path="visualizations/percent/grid-100" element={<Grid100Page />} />
          <Route path="visualizations/percent/fraction-to-percent" element={<FractionToPercentPage />} />
          <Route path="visualizations/percent/discount-simulator" element={<DiscountSimulatorPage />} />
          <Route path="visualizations/algebra" element={<AlgebraVisualizationPage />} />
          <Route path="visualizations/algebra/term-cards" element={<TermCardsPage />} />
          <Route path="visualizations/algebra/sign-belongs-to-term" element={<SignBelongsToTermPage />} />
          <Route path="visualizations/algebra/like-term-sorter" element={<LikeTermSorterPage />} />
          <Route path="visualizations/algebra/group-like-terms" element={<GroupLikeTermsPage />} />
          <Route path="visualizations/algebra/like-term-operations" element={<LikeTermOperationsPage />} />
          <Route path="visualizations/algebra/expand-brackets" element={<ExpandBracketsPage />} />
          <Route path="visualizations/algebra/substitution-machine" element={<SubstitutionMachinePage />} />
          <Route path="visualizations/algebra/word-to-expression" element={<WordToExpressionPage />} />
          <Route path="visualizations/algebra/order-of-operations" element={<OrderOfOperationsPage />} />
          <Route path="visualizations/algebra/plsv-balance" element={<PlsvBalancePage />} />
          <Route path="visualizations/operasi-campuran" element={<MixedOperationsVisualizationPage />} />
          <Route path="visualizations/plsv" element={<PlsvVisualizationPage />} />
          <Route path="visualizations/*" element={<PlaceholderVisualizationPage />} />

        </Route>

        {/* Teacher application routes wrapped in TeacherLayout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
        </Route>

        {/* Fallback route - could be a 404 page */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center p-12 text-center min-h-screen bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-slate-500 mb-6">Modul yang Anda cari mungkin belum tersedia.</p>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}
