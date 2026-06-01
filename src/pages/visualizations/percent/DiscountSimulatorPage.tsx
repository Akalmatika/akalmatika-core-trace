import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath } from "react-katex";
import { 
  ArrowLeft, Info, ShoppingBag, Percent, 
  ArrowRight, ShieldAlert, BadgePercent, Coins, Trash2, Plus
} from "lucide-react";
import { QuizContainer } from "../../../components/visualizations/QuizContainer";


interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function DiscountSimulatorPage() {
  const availableItems = [
    { name: "Buku Matematika Interaktif", price: 80000 },
    { name: "Sepatu Sekolah Akalmatika", price: 250000 },
    { name: "Tas Ransel Belajar", price: 150000 },
    { name: "Kotak Pensil Pintar", price: 40000 }
  ];

  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "Buku Matematika Interaktif", price: 80000, qty: 1 },
    { id: "2", name: "Tas Ransel Belajar", price: 150000, qty: 1 }
  ]);

  const [discount1, setDiscount1] = useState<number>(50);
  const [discount2, setDiscount2] = useState<number>(20);
  const [taxRate, setTaxRate] = useState<number>(11); // PPN 11%
  const [showMisconception, setShowMisconception] = useState<boolean>(true);

  // Local Quiz State
  const [quizEval, setQuizEval] = useState<'none' | 'correct' | 'wrong'>('none');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  function handleEvaluateQuiz(isCorrect: boolean) {
    if (quizEval !== 'none') return;
    setQuizEval(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setQuizScore(1);
    }
  }

  function handleNextQuiz() {
    setQuizFinished(true);
  }

  function handleRetryQuiz() {
    setQuizEval('none');
    setQuizScore(0);
    setQuizFinished(false);
  }

  // Cart operations
  function addToCart(name: string, price: number) {
    setCart(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item => item.name === name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: Date.now().toString(), name, price, qty: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.qty + delta;
        return nextQty > 0 ? { ...item, qty: nextQty } : item;
      }
      return item;
    }));
  }

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Multi-stage discount step-by-step
  const disc1Amount = subtotal * (discount1 / 100);
  const priceAfterDisc1 = subtotal - disc1Amount;

  const disc2Amount = priceAfterDisc1 * (discount2 / 100);
  const priceAfterDisc2 = priceAfterDisc1 - disc2Amount;

  const totalDiscount = disc1Amount + disc2Amount;
  const taxAmount = priceAfterDisc2 * (taxRate / 100);
  const grandTotal = priceAfterDisc2 + taxAmount;

  // Additive calculation (Misconception: 50% + 20% = 70%)
  const additiveDiscountRate = discount1 + discount2;
  const additiveDiscountAmount = subtotal * (Math.min(additiveDiscountRate, 100) / 100);
  const additivePriceAfterDisc = subtotal - additiveDiscountAmount;
  const additiveTaxAmount = additivePriceAfterDisc * (taxRate / 100);
  const additiveGrandTotal = additivePriceAfterDisc + additiveTaxAmount;
  
  const priceDifference = grandTotal - additiveGrandTotal;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Navigation & Header */}
      <div className="border-b border-slate-200 pb-5">
        <Link to="/student/visualizations/percent" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs mb-3 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Galeri
        </Link>
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight">
          Simulasi Diskon & Pajak (Keranjang Belanja)
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Visualisasikan bagaimana diskon bertingkat (seperti 50% + 20%) dihitung langkah demi langkah pada basis harga baru, dan buktikan mengapa nilainya berbeda dengan diskon tunggal langsung!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Keranjang Belanja & Barang */}
        <div className="space-y-6">
          {/* Pilih Barang */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShoppingBag size={14} className="text-emerald-600" />
              TAMBAH BARANG BELANJAAN
            </h3>
            
            <div className="space-y-3">
              {availableItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-250 hover:bg-slate-100/50 transition-colors">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rp {item.price.toLocaleString("id-ID")}</span>
                  </div>
                  <button
                    onClick={() => addToCart(item.name, item.price)}
                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-100 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Isi Keranjang */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
              KERANJANG BELANJA
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Keranjang kosong. Tambahkan barang di atas.</div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-[11px] text-slate-850 truncate">{item.name}</h4>
                      <span className="text-[9px] font-mono text-slate-450 block">Rp {item.price.toLocaleString("id-ID")} × {item.qty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs">
                        <button onClick={() => updateQty(item.id, -1)} className="px-1.5 py-0.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-650 cursor-pointer">-</button>
                        <span className="px-2 text-[10px] font-bold font-mono text-slate-700">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-1.5 py-0.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-650 cursor-pointer">+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-100 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Tengah: Visualisasi Perhitungan Bertingkat */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

            <h3 className="relative z-10 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-4 mb-6">
              <BadgePercent size={16} className="text-indigo-600" />
              SIMULASI PERSENTASE & STRUK BELANJA
            </h3>

            {/* Interactive Sliders */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-slate-50 border border-slate-200/50 p-5 rounded-2xl shadow-3xs">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase flex justify-between">
                  <span>Diskon Tahap 1:</span>
                  <span className="text-indigo-600 font-mono font-black">{discount1}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={discount1}
                  onChange={(e) => setDiscount1(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase flex justify-between">
                  <span>Diskon Tahap 2:</span>
                  <span className="text-indigo-600 font-mono font-black">{discount2}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={discount2}
                  onChange={(e) => setDiscount2(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase flex justify-between">
                  <span>PPN Pajak:</span>
                  <span className="text-emerald-600 font-mono font-black">{taxRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* Price Step Reduction visualizer bar */}
            <div className="relative z-10 space-y-6 mb-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visualisasi Penyusutan Nilai (Flow):</span>
              
              {subtotal === 0 ? (
                <div className="text-center py-10 bg-slate-100/50 border border-dashed border-slate-250 rounded-2xl text-xs text-slate-500">
                  Keranjang belanja kosong. Tambahkan barang di kolom kiri untuk memulai visualisasi.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Subtotal */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Harga Awal (Subtotal):</span>
                      <span className="font-mono">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 shadow-3xs">
                      <div className="h-full bg-slate-450 text-[10px] font-bold font-mono text-white flex items-center pl-3" style={{ width: "100%" }}>
                        100%
                      </div>
                    </div>
                  </div>

                  {/* Step 2: After Disc 1 */}
                  {discount1 > 0 && (
                    <div className="space-y-1 animate-fadeIn">
                      <div className="flex justify-between text-[11px] font-bold text-indigo-700">
                        <span>Setelah Diskon 1 (-{discount1}%):</span>
                        <span className="font-mono">Rp {priceAfterDisc1.toLocaleString("id-ID")} <span className="text-[9px] text-slate-400 font-normal">(Potongan Rp {disc1Amount.toLocaleString("id-ID")})</span></span>
                      </div>
                      <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 shadow-3xs flex">
                        <div className="h-full bg-indigo-600 text-[10px] font-bold font-mono text-white flex items-center pl-3 transition-all duration-300" style={{ width: `${100 - discount1}%` }}>
                          {100 - discount1}%
                        </div>
                        <div className="h-full bg-slate-200/80 text-[10px] font-bold font-mono text-slate-400 flex items-center justify-center transition-all duration-300" style={{ width: `${discount1}%` }}>
                          -{discount1}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: After Disc 2 */}
                  {discount2 > 0 && (
                    <div className="space-y-1 animate-fadeIn">
                      <div className="flex justify-between text-[11px] font-bold text-indigo-700">
                        <span>Setelah Diskon 2 (-{discount2}% dari nilai sisa):</span>
                        <span className="font-mono">Rp {priceAfterDisc2.toLocaleString("id-ID")} <span className="text-[9px] text-slate-400 font-normal">(Potongan Rp {disc2Amount.toLocaleString("id-ID")})</span></span>
                      </div>
                      <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 shadow-3xs flex">
                        <div className="h-full bg-indigo-800 text-[10px] font-bold font-mono text-white flex items-center pl-3 transition-all duration-300" style={{ width: `${((100 - discount1) * (100 - discount2)) / 100}%` }}>
                          {(((100 - discount1) * (100 - discount2)) / 100).toFixed(1)}% dari Awal
                        </div>
                        <div className="h-full bg-indigo-100/70 text-[9px] font-bold font-mono text-indigo-700 flex items-center justify-center transition-all duration-300" style={{ width: `${((100 - discount1) * discount2) / 100}%` }}>
                          -{discount2}% sisa
                        </div>
                        <div className="h-full bg-slate-200/80 text-[9px] font-bold font-mono text-slate-400 flex items-center justify-center transition-all duration-300" style={{ width: `${discount1}%` }}>
                          -{discount1}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: After Tax */}
                  {taxRate > 0 && (
                    <div className="space-y-1 animate-fadeIn">
                      <div className="flex justify-between text-[11px] font-bold text-emerald-700">
                        <span>Harga Akhir + PPN (+{taxRate}%):</span>
                        <span className="font-mono">Rp {grandTotal.toLocaleString("id-ID")} <span className="text-[9px] text-slate-400 font-normal">(Pajak Rp {taxAmount.toLocaleString("id-ID")})</span></span>
                      </div>
                      <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 shadow-3xs flex">
                        <div className="h-full bg-emerald-600 text-[10px] font-bold font-mono text-white flex items-center pl-3 transition-all duration-300" style={{ width: "85%" }}>
                          Harga Setelah Diskon
                        </div>
                        <div className="h-full bg-amber-500 text-[10px] font-bold font-mono text-white flex items-center justify-center transition-all duration-300" style={{ width: "15%" }}>
                          +{taxRate}% PPN
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Breakdown Checkout Receipt */}
            <div className="relative z-10 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 font-mono text-xs text-slate-700 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <span className="font-bold border-b border-dashed border-slate-250 pb-2.5 block text-[10px] text-slate-400 uppercase tracking-widest text-center">Receipt Akalmatika Mart</span>
              
              <div className="flex justify-between">
                <span>Subtotal Belanja:</span>
                <span className="font-bold text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {discount1 > 0 && (
                <div className="flex justify-between text-indigo-600">
                  <span>Diskon Tahap 1 ({discount1}%):</span>
                  <span>-Rp {disc1Amount.toLocaleString("id-ID")}</span>
                </div>
              )}

              {discount2 > 0 && (
                <div className="flex justify-between text-indigo-500">
                  <span>Diskon Tahap 2 ({discount2}%):</span>
                  <span>-Rp {disc2Amount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between">
                <span>Total Diskon (Akumulasi):</span>
                <span className="font-bold text-indigo-750">-Rp {totalDiscount.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>PPN Pajak ({taxRate}%):</span>
                <span>+Rp {taxAmount.toLocaleString("id-ID")}</span>
              </div>

              <div className="border-t-2 border-slate-300 pt-3 flex justify-between text-sm font-black text-slate-900">
                <span>TOTAL AKHIR:</span>
                <span className="font-mono text-emerald-650 bg-emerald-50/60 px-3 py-1 rounded-xl border border-emerald-200/50">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Misconception Alert Block */}
            {subtotal > 0 && showMisconception && (
              <div className="relative z-10 bg-rose-50/40 backdrop-blur-md border border-rose-100/60 rounded-3xl p-6 mt-8 space-y-5 animate-scaleUp">
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-rose-500" />
                    MISKONSEPSI: DISKON ADITIF ({discount1}% + {discount2}% ≠ {additiveDiscountRate}%)
                  </h4>
                  <button
                    onClick={() => setShowMisconception(false)}
                    className="text-[9px] font-bold text-slate-400 hover:text-rose-600 underline cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>

                <p className="text-xs text-slate-650 leading-relaxed">
                  Miskonsepsi umum siswa adalah menjumlahkan diskon bertingkat secara langsung (<span className="font-bold">{discount1}% + {discount2}% = {additiveDiscountRate}%</span>). 
                  Berikut pembuktian visual 100 sel mengapa keduanya berbeda secara matematis:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grid 1: Diskon Bertingkat Real */}
                  <div className="bg-white border border-slate-200/70 p-4 rounded-2xl flex flex-col items-center space-y-3">
                    <span className="font-bold text-slate-800 text-[10px] uppercase text-center block">
                      ✅ Diskon Bertingkat ({discount1}% + {discount2}%)
                    </span>
                    
                    {/* 10x10 Grid representation */}
                    <div className="grid grid-cols-10 gap-0.5 p-1 bg-slate-50 border border-slate-200/50 rounded-lg w-full max-w-[140px]">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const isDisc1 = i < discount1;
                        const isDisc2 = !isDisc1 && i < (discount1 + (100 - discount1) * (discount2 / 100));
                        return (
                          <div
                            key={i}
                            className={`aspect-square rounded-[1.5px] transition-all duration-500 ${
                              isDisc1
                                ? "bg-indigo-500"
                                : isDisc2
                                ? "bg-indigo-300"
                                : "bg-slate-350"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-1 w-full font-mono">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-[2px]" />
                        <span>Diskon 1: {discount1}% (Blue)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-indigo-300 rounded-[2px]" />
                        <span>Diskon 2: {(((100 - discount1) * discount2) / 100).toFixed(0)}% sisa (Light Blue)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-slate-350 rounded-[2px]" />
                        <span className="font-bold text-slate-700">Kamu Bayar: {((100 - discount1) * (100 - discount2) / 100).toFixed(0)}% (Gray)</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Diskon Aditif Salah */}
                  <div className="bg-white border border-rose-100 p-4 rounded-2xl flex flex-col items-center space-y-3">
                    <span className="font-bold text-rose-600 text-[10px] uppercase text-center block">
                      🚨 Diskon Aditif Salah ({additiveDiscountRate}%)
                    </span>

                    {/* 10x10 Grid representation */}
                    <div className="grid grid-cols-10 gap-0.5 p-1 bg-slate-50 border border-slate-200/50 rounded-lg w-full max-w-[140px]">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const isDisc = i < Math.min(100, additiveDiscountRate);
                        return (
                          <div
                            key={i}
                            className={`aspect-square rounded-[1.5px] transition-all duration-500 ${
                              isDisc ? "bg-rose-450" : "bg-slate-350"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-1 w-full font-mono">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-rose-450 rounded-[2px]" />
                        <span>Asumsi Diskon: {additiveDiscountRate}% (Red)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-slate-350 rounded-[2px]" />
                        <span className="font-bold text-slate-700">Asumsi Bayar: {Math.max(0, 100 - additiveDiscountRate)}% (Gray)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center font-mono text-[11px]">
                  <span className="text-slate-500">Selisih yang harus kamu bayar di kasir: </span>
                  <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    Rp {priceDifference.toLocaleString("id-ID")} lebih mahal secara bertingkat
                  </span>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl text-[10px] text-indigo-900 leading-relaxed">
                  <span className="font-black block mb-0.5">💡 Mengapa Berbeda?</span>
                  Sebab diskon kedua ({discount2}%) **tidak dihitung dari harga awal**, melainkan dihitung dari sisa setelah dipotong diskon pertama yaitu **Rp {priceAfterDisc1.toLocaleString("id-ID")}**. Ini berarti nilai rupiah dari potongan kedua menyusut!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz to lock in concept */}
      <QuizContainer 
        title="Evaluasi Konsep"
        questionText={
          <span>
            Jika sebuah tas seharga Rp 200.000 diskon 50% kemudian diskon lagi 10% (50% + 10%), berapakah harga yang harus kamu bayar di kasir? <br />
            <span className="font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded"><InlineMath math="Rp 200.000 \times (50\% + 10\%)" /></span>
          </span>
        }
        evalResult={quizEval}
        onNext={handleNextQuiz}
        isLastQuestion={true}
        nextPath="/student/visualizations"
        nextLabel="Selesai: Kembali ke Galeri"
        isFinished={quizFinished}
        score={quizScore}
        totalQuestions={1}
        onRetry={handleRetryQuiz}
      >
        <div className="flex flex-col gap-3 w-full max-w-xl">
          {[
            { text: "Rp 80.000 (diskon langsung 60%)", correct: false },
            { text: "Rp 90.000 (diskon 50% lalu 10% dari sisa)", correct: true },
            { text: "Rp 100.000 (hanya diskon pertama yang dihitung)", correct: false },
            { text: "Rp 120.000 (diskon dihitung secara berbalik)", correct: false }
          ].map((opt, idx) => (
            <button
              key={idx}
              disabled={quizEval !== 'none'}
              onClick={() => handleEvaluateQuiz(opt.correct)}
              className={`w-full py-3 px-4 rounded-xl border-2 text-left text-xs transition-all hover:scale-[1.01] ${
                quizEval !== 'none' ? 'pointer-events-none' : 'cursor-pointer'
              } ${
                quizEval === 'correct' && opt.correct
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                  : quizEval === 'wrong' && !opt.correct
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </QuizContainer>
    </div>
  );
}
