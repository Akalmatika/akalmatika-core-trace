import CoinSandbox from "../components/CoinSandbox";

export default function ZeroPairVisualizationPage() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-4">
        <h2 className="font-sans font-black text-slate-900 text-2xl tracking-tight">
          Es-Api / Zero-Pair
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Gunakan token positif (Api) dan negatif (Es) untuk memahami netralisasi dan operasi dasar bilangan bulat.
        </p>
      </div>
      <CoinSandbox />
    </div>
  );
}
