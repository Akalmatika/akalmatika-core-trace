import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  AlertTriangle,
  Lightbulb,
  Eye,
  Target,
  CheckCircle2,
  BarChart3,
  Map,
  GraduationCap,
  Users,
  ArrowRight,
  Menu,
  X,
  BookOpen,
  Brain,
  Puzzle,
  Layers,
  Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Scroll-triggered fade-in hook
   ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ─────────────────────────────────────────────
   Section wrapper with fade-in animation
   ───────────────────────────────────────────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, isVisible } = useInView(0.1);
  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-mt-20 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
   ───────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Masalah", href: "#masalah" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Fitur", href: "#fitur" },
    { label: "Untuk Guru", href: "#untuk-siapa" },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-[Plus_Jakarta_Sans,sans-serif] antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* ══════════════════════════════════════
          NAVBAR
         ══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/Akalmatika_LogoUtama_Horizontal_Terang_fix_clean.png"
              alt="Akalmatika"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.replace("#", ""))}
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/student/visualizations"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Lihat Demo
            </Link>
            <Link
              to="/student/diagnostic-foundation"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Mulai Diagnosis
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.replace("#", ""))}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                to="/student/visualizations"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Lihat Demo
              </Link>
              <Link
                to="/student/diagnostic-foundation"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-colors"
              >
                Mulai Diagnosis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════ */}
      <section className="pt-20 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-10 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          {/* Subtle grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                <Sparkles size={13} className="text-blue-500" />
                <span className="text-xs font-semibold text-blue-700 tracking-wide">
                  Paham Dulu, Baru Rumus
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-slate-900">
                Matematika Tidak Harus Dihafal.{" "}
                <span className="text-blue-600">Ia Harus Masuk Akal.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg">
                Akalmatika membantu siswa menemukan bagian yang bolong,
                memahami konsep lewat jembatan berpikir, lalu berlatih sampai
                benar-benar menguasai.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  to="/student/diagnostic-foundation"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
                >
                  <Search size={16} />
                  Mulai Diagnosis Fondasi
                </Link>
                <Link
                  to="/student/learning-map"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
                >
                  Lihat Alur Belajar
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right: Interactive Flow Mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-4">
                  Alur Pemulihan Pemahaman
                </div>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Diagnosis",
                      desc: "Mengukur fondasi yang sudah dimiliki",
                      color: "bg-blue-500",
                      bgColor: "bg-blue-50",
                      borderColor: "border-blue-100",
                    },
                    {
                      step: "2",
                      title: "Miskonsepsi Terdeteksi",
                      desc: "Kesalahan dibaca sebagai sinyal, bukan hanya nilai rendah",
                      color: "bg-amber-500",
                      bgColor: "bg-amber-50",
                      borderColor: "border-amber-100",
                    },
                    {
                      step: "3",
                      title: "Jembatan Konsep",
                      desc: "Penjelasan dari makna, bukan langsung rumus",
                      color: "bg-indigo-500",
                      bgColor: "bg-indigo-50",
                      borderColor: "border-indigo-100",
                    },
                    {
                      step: "4",
                      title: "Visualisasi Interaktif",
                      desc: "Siswa melihat konsep bekerja secara konkret",
                      color: "bg-emerald-500",
                      bgColor: "bg-emerald-50",
                      borderColor: "border-emerald-100",
                    },
                    {
                      step: "5",
                      title: "Drilling Terstruktur",
                      desc: "Contoh lengkap → terbimbing → mandiri",
                      color: "bg-purple-500",
                      bgColor: "bg-purple-50",
                      borderColor: "border-purple-100",
                    },
                    {
                      step: "6",
                      title: "Mastery Check",
                      desc: "Lanjut hanya jika pemahaman cukup kuat",
                      color: "bg-teal-500",
                      bgColor: "bg-teal-50",
                      borderColor: "border-teal-100",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${item.bgColor} border ${item.borderColor} rounded-xl px-4 py-3 transition-all hover:shadow-sm`}
                    >
                      <div
                        className={`w-6 h-6 ${item.color} rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5`}
                      >
                        {item.step}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 leading-snug">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION: MASALAH YANG DISELESAIKAN
         ══════════════════════════════════════ */}
      <Section id="masalah" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Masalahnya Bukan Siswa Malas.{" "}
              <span className="text-blue-600">Sering Kali Fondasinya Bolong.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: <Brain size={20} />,
                title: "Hafal rumus, tapi bingung kapan dipakai",
                desc: "Siswa menghafal prosedur tanpa memahami kapan dan mengapa rumus itu berlaku.",
              },
              {
                icon: <Puzzle size={20} />,
                title: "Bisa contoh soal, tapi blank saat bentuk soal berubah",
                desc: "Jika soal diubah sedikit, siswa kehilangan pijakan karena mengandalkan pola, bukan pemahaman.",
              },
              {
                icon: <Layers size={20} />,
                title: "Salah di aljabar karena fondasi dasarnya lemah",
                desc: "Kesulitan di pecahan, bilangan negatif, atau tanda sama dengan menyebar ke materi berikutnya.",
              },
              {
                icon: <AlertTriangle size={20} />,
                title: "Latihan banyak, tapi tidak tahu miskonsepsinya di mana",
                desc: "Mengerjakan puluhan soal tanpa umpan balik yang tepat hanya memperkuat kesalahan yang sama.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-slate-150 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md hover:border-slate-200"
              >
                <div className="w-10 h-10 bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug mb-1.5">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          SECTION: CARA KERJA AKALMATIKA
         ══════════════════════════════════════ */}
      <Section id="cara-kerja" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Dari Salah Jawab{" "}
              <span className="text-blue-600">Menuju Paham Akar Masalah.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3">
              Akalmatika bukan sekadar menilai benar atau salah. Setiap kesalahan dibaca, dipetakan, lalu dipulihkan secara bertahap.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                {
                  icon: <Search size={22} />,
                  step: "01",
                  title: "Diagnosis Fondasi",
                  desc: "Mengukur prasyarat penting sebelum masuk materi baru.",
                  accent: "blue",
                },
                {
                  icon: <AlertTriangle size={22} />,
                  step: "02",
                  title: "Deteksi Miskonsepsi",
                  desc: "Kesalahan siswa dibaca sebagai sinyal, bukan sekadar nilai rendah.",
                  accent: "amber",
                },
                {
                  icon: <Lightbulb size={22} />,
                  step: "03",
                  title: "Jembatan Berpikir",
                  desc: "Konsep dijelaskan dari makna, bukan langsung rumus.",
                  accent: "indigo",
                },
                {
                  icon: <Eye size={22} />,
                  step: "04",
                  title: "Visualisasi Interaktif",
                  desc: "Siswa melihat konsep bekerja melalui model visual.",
                  accent: "emerald",
                },
                {
                  icon: <Target size={22} />,
                  step: "05",
                  title: "Drilling Terstruktur",
                  desc: "Dari contoh lengkap, terbimbing, lalu mandiri.",
                  accent: "purple",
                },
                {
                  icon: <CheckCircle2 size={22} />,
                  step: "06",
                  title: "Mastery Check",
                  desc: "Materi berikutnya terbuka setelah pemahaman cukup kuat.",
                  accent: "teal",
                },
              ].map((item, i) => {
                const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
                  blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", iconBg: "bg-blue-100" },
                  amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", iconBg: "bg-amber-100" },
                  indigo: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", iconBg: "bg-indigo-100" },
                  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", iconBg: "bg-emerald-100" },
                  purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600", iconBg: "bg-purple-100" },
                  teal: { bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-600", iconBg: "bg-teal-100" },
                };
                const c = colorMap[item.accent];
                return (
                  <div
                    key={i}
                    className={`relative ${c.bg} border ${c.border} rounded-2xl p-5 transition-all hover:shadow-md group`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 ${c.iconBg} ${c.text} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[10px] font-bold ${c.text} uppercase tracking-wider mb-1`}>
                          Langkah {item.step}
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          SECTION: PEMBEDA UTAMA
         ══════════════════════════════════════ */}
      <Section id="pembeda" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Bukan Sekadar Ujian.{" "}
              <span className="text-blue-600">Ini Sistem Pemulihan Pemahaman.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
            {/* Left: narrative */}
            <div className="lg:col-span-2 space-y-4">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Kebanyakan platform latihan hanya mengukur skor akhir. Siswa salah, dapat pembahasan, lanjut soal berikutnya.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Akalmatika bekerja berbeda. Setiap kesalahan dipetakan untuk menemukan <strong className="text-slate-800">akar miskonsepsi</strong>. Siswa tidak sekadar tahu jawaban yang benar — mereka memahami <strong className="text-slate-800">mengapa</strong> jawabannya demikian.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Materi tidak bisa dilewati sesuka hati. Setiap langkah dibangun di atas fondasi yang sudah dikuasai.
              </p>
            </div>

            {/* Right: comparison table */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
                {/* Table header */}
                <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
                  <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Aspek
                  </div>
                  <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    Platform Biasa
                  </div>
                  <div className="px-4 py-3 text-xs font-bold text-blue-600 uppercase tracking-wider text-center">
                    Akalmatika
                  </div>
                </div>
                {/* Table rows */}
                {[
                  { aspect: "Fokus utama", biasa: "Skor akhir", akal: "Akar miskonsepsi" },
                  { aspect: "Saat salah", biasa: "Hanya dianggap salah", akal: "Dibaca sebagai peta kelemahan" },
                  { aspect: "Penjelasan", biasa: "Langsung rumus", akal: "Dijembatani sampai masuk akal" },
                  { aspect: "Urutan materi", biasa: "Bisa dibuka bebas", akal: "Naik bertahap sesuai fondasi" },
                  { aspect: "Metode", biasa: "Soal dan pembahasan", akal: "Diagnosis → visualisasi → drilling → mastery" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-3 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    } ${i < 4 ? "border-b border-slate-100" : ""}`}
                  >
                    <div className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-700">
                      {row.aspect}
                    </div>
                    <div className="px-4 py-3 text-xs sm:text-sm text-slate-400 text-center">
                      {row.biasa}
                    </div>
                    <div className="px-4 py-3 text-xs sm:text-sm font-semibold text-blue-700 text-center">
                      {row.akal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          SECTION: FITUR INTI
         ══════════════════════════════════════ */}
      <Section id="fitur" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Fitur yang Dirancang untuk{" "}
              <span className="text-blue-600">Pemahaman Mendalam</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <Search size={20} />,
                title: "Diagnosis Miskonsepsi",
                desc: "Temukan bagian mana yang belum kokoh sebelum belajar lebih lanjut.",
                color: "blue",
              },
              {
                icon: <Map size={20} />,
                title: "Learning Map Bertahap",
                desc: "Peta belajar dari fondasi SD menuju SMP dan SMA, langkah demi langkah.",
                color: "indigo",
              },
              {
                icon: <Eye size={20} />,
                title: "Visualisasi Konsep",
                desc: "Lihat matematika bekerja lewat zero pair, garis bilangan, dan model visual.",
                color: "emerald",
              },
              {
                icon: <Target size={20} />,
                title: "Drilling Prasyarat",
                desc: "Latihan bertahap: contoh detail, terbimbing, lalu mandiri.",
                color: "purple",
              },
              {
                icon: <CheckCircle2 size={20} />,
                title: "Mastery Check",
                desc: "Materi berikutnya terbuka hanya jika fondasi sudah cukup kuat.",
                color: "teal",
              },
              {
                icon: <BarChart3 size={20} />,
                title: "Dashboard Guru",
                desc: "Guru melihat pola miskonsepsi kelas, bukan hanya daftar nilai.",
                color: "amber",
              },
            ].map((item, i) => {
              const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
                blue: { bg: "hover:bg-blue-50/50", border: "hover:border-blue-200", text: "text-blue-600", iconBg: "bg-blue-50 border-blue-100" },
                indigo: { bg: "hover:bg-indigo-50/50", border: "hover:border-indigo-200", text: "text-indigo-600", iconBg: "bg-indigo-50 border-indigo-100" },
                emerald: { bg: "hover:bg-emerald-50/50", border: "hover:border-emerald-200", text: "text-emerald-600", iconBg: "bg-emerald-50 border-emerald-100" },
                purple: { bg: "hover:bg-purple-50/50", border: "hover:border-purple-200", text: "text-purple-600", iconBg: "bg-purple-50 border-purple-100" },
                teal: { bg: "hover:bg-teal-50/50", border: "hover:border-teal-200", text: "text-teal-600", iconBg: "bg-teal-50 border-teal-100" },
                amber: { bg: "hover:bg-amber-50/50", border: "hover:border-amber-200", text: "text-amber-600", iconBg: "bg-amber-50 border-amber-100" },
              };
              const c = cm[item.color];
              return (
                <div
                  key={i}
                  className={`bg-white border border-slate-150 ${c.border} ${c.bg} rounded-2xl p-5 transition-all hover:shadow-md`}
                >
                  <div
                    className={`w-10 h-10 ${c.iconBg} border ${c.text} rounded-xl flex items-center justify-center mb-3`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          SECTION: UNTUK SISWA & GURU
         ══════════════════════════════════════ */}
      <Section id="untuk-siapa" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Untuk Siswa dan Guru
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {/* Siswa Card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 transition-all hover:shadow-md hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                Untuk Siswa
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Siswa tahu bagian mana yang belum kuat dan mendapat jalur belajar yang masuk akal. Tidak lagi menebak-nebak atau sekadar mengulang soal tanpa arah.
              </p>
              <div className="space-y-2">
                {["Tahu kelemahan fondasi", "Alur belajar yang jelas", "Latihan yang bermakna"].map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Guru Card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 transition-all hover:shadow-md hover:border-emerald-200">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                Untuk Guru
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Guru melihat pola miskonsepsi kelas, bukan hanya daftar nilai. Data yang langsung bisa ditindaklanjuti di kelas.
              </p>
              <div className="space-y-2">
                {["Peta miskonsepsi kelas", "Deteksi pola kesalahan", "Data untuk intervensi tepat"].map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link
                  to="/teacher/dashboard"
                  className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-2xs"
                >
                  Masuk Dashboard Guru
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          FINAL CTA
         ══════════════════════════════════════ */}
      <Section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Mulai dari Fondasi.{" "}
            <span className="text-blue-600">Bangun Pemahaman yang Tahan Lama.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Akalmatika dibangun untuk siswa yang ingin paham, bukan sekadar mengejar jawaban.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/student/diagnostic-foundation"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm w-full sm:w-auto"
            >
              <Search size={16} />
              Mulai Diagnosis Fondasi
            </Link>
            <Link
              to="/student/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-7 py-3.5 rounded-xl transition-all text-sm w-full sm:w-auto"
            >
              <BookOpen size={16} />
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          FOOTER
         ══════════════════════════════════════ */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/Akalmatika_LogoSekunder_Gelap_clean.png"
                alt="Akalmatika"
                className="h-10 sm:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="hidden sm:block border-l border-slate-700 pl-4">
                <div className="text-xs font-semibold text-slate-300">
                  Akalmatika
                </div>
                <div className="text-[10px] text-slate-500">
                  Menjadikan Matematika Masuk Akal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>© 2026 Akalmatika</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Media Belajar Matematika Interaktif</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
