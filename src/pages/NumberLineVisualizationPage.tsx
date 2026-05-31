import InteractiveNumberLine from "../components/InteractiveNumberLine";

export default function NumberLineVisualizationPage() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-4">
        <h2 className="font-sans font-black text-slate-900 text-2xl tracking-tight">
          Garis Bilangan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pahami penjumlahan dan pengurangan bilangan bulat dengan model pergerakan di sepanjang garis bilangan.
        </p>
      </div>
      <InteractiveNumberLine 
        initialEquation={{
          expression: "3 + (-5)",
          a: 3,
          b: -5,
          op: "+"
        }} 
      />
    </div>
  );
}
