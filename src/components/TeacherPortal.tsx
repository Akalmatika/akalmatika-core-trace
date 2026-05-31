import { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  Search,
  Sparkles,
  Info
} from "lucide-react";
import { MISCONCONCEPTION_CATALOG } from "../blueprints";

interface MockStudent {
  name: string;
  status: "LULUS" | "REMEDIAL" | "SLIP";
  details: string;
  misconceptionCode: string | null;
  accuracy: string;
}

export default function TeacherPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRuleCode, setSelectedRuleCode] = useState<string | null>("MC-SUB-NEG-ADD");

  const mockStudents: MockStudent[] = [
    { name: "Budi Santoso", status: "REMEDIAL", details: "Absolute Sum Rule Confusion", misconceptionCode: "MC-ADD-SIGN-CONF", accuracy: "0/3" },
    { name: "Siti Aminah", status: "LULUS", details: "Paham Konsep Sempurna", misconceptionCode: null, accuracy: "3/3" },
    { name: "Aditya Pratama", status: "REMEDIAL", details: "Sign Follows First Number Error", misconceptionCode: "MC-SIGN-FIRST-NUM", accuracy: "1/3" },
    { name: "Dewi Lestari", status: "REMEDIAL", details: "Negative Addition Multiplicative Projection", misconceptionCode: "MC-MUL-SIGN-DOM", accuracy: "0/3" },
    { name: "Rian Hidayat", status: "LULUS", details: "Paham Konsep Sempurna", misconceptionCode: null, accuracy: "3/3" },
    { name: "Lani Wijaya", status: "SLIP", details: "Operational Slip (Unclassified)", misconceptionCode: null, accuracy: "2/3" },
    { name: "Farhan Hakim", status: "REMEDIAL", details: "Subtract Negative as Normal Addition", misconceptionCode: "MC-SUB-NEG-ADD", accuracy: "0/3" },
    { name: "Mega Utami", status: "LULUS", details: "Paham Konsep Sempurna", misconceptionCode: null, accuracy: "3/3" },
  ];

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalStudents = mockStudents.length;
  const passedStudents = mockStudents.filter(s => s.status === "LULUS").length;
  const passedRate = Math.round((passedStudents / totalStudents) * 100);

  // Read actual history from localStorage (Drill Mode analytics)
  const getLiveMisconceptions = () => {
    try {
      const stored = localStorage.getItem('akalmatika_misconceptions');
      return stored ? JSON.parse(stored) : [];
    } catch(e) {
      return [];
    }
  };
  
  const liveHistory = getLiveMisconceptions();
  const totalLiveDetected = liveHistory.length;
  const totalMisconceptionsDetected = totalLiveDetected > 0 ? totalLiveDetected : mockStudents.filter(s => s.misconceptionCode !== null).length;

  // Calculate average score (accuracy)
  const totalScore = mockStudents.reduce((acc, curr) => {
    const [correct, total] = curr.accuracy.split('/').map(Number);
    return acc + (correct / total) * 100;
  }, 0);
  const averageScore = Math.round(totalScore / totalStudents);

  const getMisconceptionDist = (code: string) => {
    if (totalLiveDetected > 0) {
      const count = liveHistory.filter((c: string) => c === code).length;
      const percentage = Math.round((count / totalLiveDetected) * 100);
      return { count, percentage };
    }
    // Fallback to mock data if no live history exists
    switch (code) {
      case "MC-SUB-NEG-ADD": return { count: 3, percentage: 38 };
      case "MC-ADD-SIGN-CONF": return { count: 2, percentage: 25 };
      case "MC-SIGN-FIRST-NUM": return { count: 2, percentage: 25 };
      case "MC-MUL-SIGN-DOM": return { count: 1, percentage: 12 };
      default: return { count: 0, percentage: 0 };
    }
  };

  const selectedRule = MISCONCONCEPTION_CATALOG.find(r => r.code === selectedRuleCode) || MISCONCONCEPTION_CATALOG[0];

  const getIndonesianStrategy = (code: string) => {
    switch (code) {
      case "MC-SUB-NEG-ADD":
        return "Fokuskan perhatian siswa pada fakta bahwa mengurangkan suatu nilai sama dengan menambahkan lawannya. Pengurangan elemen negatif ekuivalen dengan penambahan elemen positif.";
      case "MC-ADD-SIGN-CONF":
        return "Terapkan konsep Pasangan Nol (Zero-Pair). Tanyakan kepada siswa: 'Jika kamu memiliki 2 elemen negatif (merah), lalu ditambahkan 3 elemen positif (biru), apakah jumlah negatifnya bertambah?' Biarkan mereka membuktikan bahwa elemen yang berlawanan akan saling menetralkan.";
      case "MC-MUL-SIGN-DOM":
        return "Bantu siswa memisahkan logika perkalian dengan penjumlahan. Jelaskan: 'Aturan perkalian (minus kali minus = plus) tidak berlaku pada penjumlahan atau pengurangan dasar. Menjumlahkan dua kelompok elemen negatif hanya akan mengumpulkan lebih banyak elemen negatif!'";
      case "MC-SUB-ORDER-INV":
        return "Gunakan termometer merkuri digital di papan tulis. Tunjukkan bahwa jika suhu awal adalah 3 derajat, lalu diturunkan sebesar 8 derajat, posisi suhu harus menembus angka di bawah nol derajat (-5 derajat), bukan berputar balik ke angka 5 derajat.";
      default:
        return "Gunakan koin manipulatif digital di platform Alamatika secara intensif. Mintalah siswa melakukan drag-and-drop mandiri untuk menetralkan zero-pairs.";
    }
  };

  return (
    <div id="teacher-portal-root" className="space-y-8 animate-fadeIn font-sans">
      
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Kelas VII-B</span>
          </div>
          <div>
            <span className="text-3xs font-mono font-bold text-slate-400 block uppercase">AVERAGE SCORE</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{averageScore}%</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">Rata-rata nilai akurasi seluruh siswa kelas.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-605">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/50 border border-rose-100 px-2.5 py-0.5 rounded-full">Perlu Perhatian</span>
          </div>
          <div>
            <span className="text-3xs font-mono font-bold text-slate-400 block uppercase">TOTAL MISCONCEPTIONS DETECTED</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{totalMisconceptionsDetected} Deteksi</h3>
            <p className="text-xs text-slate-500 mt-1">Jumlah total miskonsepsi yang ditemukan pada siswa.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Partisipasi</span>
          </div>
          <div>
            <span className="text-3xs font-mono font-bold text-slate-400 block uppercase">TOTAL STUDENTS</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5 truncate">{totalStudents} Siswa</h3>
            <p className="text-xs text-slate-500 mt-1.5">Siswa aktif terdaftar yang mengisi tes diagnostik kognitif.</p>
          </div>
        </div>

      </div>

      {/* Misconception Catalog & Strategy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Sebaran Miskonsepsi */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div>
            <h3 className="font-sans font-bold text-slate-900 tracking-tight text-base md:text-lg">
              Peta Sebaran Miskonsepsi
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Sebaran tipe salah konsep matematis yang terdeteksi secara otomatis di kelas.
            </p>
          </div>

          <div className="space-y-3">
            {MISCONCONCEPTION_CATALOG.map((rule, idx) => {
              const dist = getMisconceptionDist(rule.code);
              const isSelected = selectedRuleCode === rule.code;

              return (
                <div 
                  id={`rule-dist-row-${rule.code}`}
                  key={idx}
                  onClick={() => setSelectedRuleCode(rule.code)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected 
                      ? "bg-indigo-50/40 border-indigo-200" 
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-205"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="max-w-[75%] space-y-1">
                      <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                        {rule.code}
                      </span>
                      <h4 className="font-sans font-bold text-xs text-slate-800 leading-snug">{rule.name}</h4>
                    </div>
                    <span className="font-mono text-xs font-black text-slate-700 shrink-0">{dist.percentage}% ({dist.count} Siswa)</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                      style={{ width: `${dist.percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detail & Pedagogical Strategy */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between h-full">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-mono text-3xs font-bold text-indigo-500 uppercase">PANDUAN INTERVENSI PEDAGOGIS</h4>
                <h3 className="font-sans font-black text-slate-900 text-base md:text-lg mt-0.5">
                  {selectedRule.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1.5">
                <span className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Deskripsi Pola Berpikir</span>
                <p className="text-slate-650 leading-relaxed font-sans">{selectedRule.underlyingBug}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-2xs">
                <div>
                  <span className="block text-slate-400 font-bold uppercase">POLA FORMULA SALAH</span>
                  <span className="font-bold text-rose-600 select-all">{selectedRule.pattern}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase">CONTOH KASUS</span>
                  <span className="font-bold text-slate-700 select-all">{selectedRule.exampleProblem} &rarr; Jawab: {selectedRule.studentAnswer} (Harusnya: {selectedRule.expectedAnswer})</span>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-600 animate-pulse shrink-0" />
                  <span className="font-mono text-3xs tracking-wider text-indigo-700 font-extrabold uppercase">
                    STRATEGI PEMBELAJARAN TATAP MUKA (GURU)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-sans text-xs italic">
                  "{getIndonesianStrategy(selectedRule.code)}"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-3xs font-mono text-slate-400">
            <span>ALAMATIKA CORE-TRACE PEDAGOGY ENGINE</span>
            <span>GOOGLE JUARAVIBECODE INDONESIA</span>
          </div>

        </div>

      </div>

      {/* Student List Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4 w-full max-w-full overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-bold text-slate-900 tracking-tight text-base md:text-lg">
              Daftar Diagnosis Pemahaman Siswa
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Daftar pelacakan status pemahaman kognitif siswa berdasarkan tes diagnostik terakhir.
            </p>
          </div>
          
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              id="student-search-bar"
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 rounded-xl pl-9 pr-4 py-2 text-xs font-sans transition-all"
            />
          </div>
        </div>

        <div className="w-full border border-slate-100 rounded-xl bg-white overflow-x-auto shadow-2xs">
          <table className="min-w-full divide-y divide-slate-100 text-left font-sans text-xs">
            <thead className="bg-slate-50 text-slate-400 font-medium text-3xs uppercase tracking-wider select-none">
              <tr>
                <th scope="col" className="px-5 py-3">Nama Lengkap Siswa</th>
                <th scope="col" className="px-5 py-3 text-center">Akurasi</th>
                <th scope="col" className="px-5 py-3">Status Pemahaman</th>
                <th scope="col" className="px-5 py-3">Analisis Miskonsepsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400 italic">
                    Tidak ada siswa yang cocok dengan kata pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr id={`row-student-${idx}`} key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-800">{student.name}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-semibold">{student.accuracy}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-mono font-bold border uppercase tracking-wider ${
                        student.status === "LULUS"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : student.status === "SLIP"
                            ? "bg-slate-100 text-slate-650 border-slate-200"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{student.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
