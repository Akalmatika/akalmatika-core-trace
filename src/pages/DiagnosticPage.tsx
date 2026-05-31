import { useParams, Navigate } from "react-router-dom";
import DiagnosticTestEngine from "../components/diagnostic/DiagnosticTestEngine";
import StudentPortal from "../components/StudentPortal";

import { integerCluster, integerRules } from "../engine/rules/integer";
import { fractionsCluster, fractionsRules } from "../engine/rules/fractions";
import { percentCluster, percentRules } from "../engine/rules/percent";
import { algebraCluster, algebraRules } from "../engine/rules/algebra";
import { mixedOperationsCluster, mixedOperationsRules } from "../engine/rules/mixed-operations";
import { plsvCluster, plsvRules } from "../engine/rules/plsv";
import { DiagnosticQuestion, MisconceptionRule } from "../engine/rules/types";

// Map topic ID to data
const DIAGNOSTIC_DATA: Record<string, {
  title: string;
  description: string;
  cluster: DiagnosticQuestion[];
  rules: MisconceptionRule[];
}> = {
  "integer": {
    title: "Bilangan Bulat",
    description: "Mari uji ketajaman analisismu dalam memecahkan misi bilangan bulat negatif dan positif.",
    cluster: integerCluster,
    rules: integerRules
  },
  "fractions": {
    title: "Pecahan",
    description: "Buktikan kemampuanmu memotong dan menyatukan berbagai ukuran pecahan.",
    cluster: fractionsCluster,
    rules: fractionsRules
  },
  "percent": {
    title: "Persen",
    description: "Tes pemahamanmu tentang perbandingan dan nilai dari seratus bagian.",
    cluster: percentCluster,
    rules: percentRules
  },
  "algebra": {
    title: "Aljabar",
    description: "Pecahkan sandi variabel dan temukan pola bilangan tak kasat mata.",
    cluster: algebraCluster,
    rules: algebraRules
  },
  "mixed-operations": {
    title: "Operasi Campuran",
    description: "Tantang dirimu menentukan operasi mana yang harus didahulukan dalam perhitungan kompleks.",
    cluster: mixedOperationsCluster,
    rules: mixedOperationsRules
  },
  "plsv": {
    title: "Persamaan Linear (PLSV)",
    description: "Seimbangkan kedua ruas timbangan persamaan untuk menemukan nilai misterius.",
    cluster: plsvCluster,
    rules: plsvRules
  }
};

export default function DiagnosticPage() {
  const { topicId } = useParams<{ topicId: string }>();

  if (!topicId || !DIAGNOSTIC_DATA[topicId]) {
    // If not found, redirect to catalog
    return <Navigate to="/student/diagnostic" replace />;
  }

  // Backward compatibility: If integer, we can route to the full original StudentPortal that has Sandbox and Drilling.
  // Wait, the user asked to "pastikan semuanya seragam secara visual, tone, dll".
  // If we just use DiagnosticTestEngine, it will be strictly uniform. But StudentPortal has Drilling.
  // Let's use the full StudentPortal for integer, since it's the flagship, OR we migrate to DiagnosticTestEngine entirely.
  // Let's just use DiagnosticTestEngine for all of them so they are strictly uniform!
  // Wait, if I replace `StudentPortal`, what happens to `Drilling` mode?
  // Let's stick to using DiagnosticTestEngine for EVERYTHING right now to achieve 100% uniformity.
  
  const data = DIAGNOSTIC_DATA[topicId];

  if (topicId === "integer") {
    // We render StudentPortal for integer to preserve Drilling & embedded Sandbox
    return (
      <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)]">
        <StudentPortal />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)]">
      <DiagnosticTestEngine 
        topicId={topicId}
        topicTitle={data.title}
        topicDescription={data.description}
        cluster={data.cluster}
        rules={data.rules}
      />
    </div>
  );
}
