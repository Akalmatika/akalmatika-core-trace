import CoinSandbox from "../components/CoinSandbox";

export default function ZeroPairVisualizationPage() {
  return (
    <div className="animate-fadeIn py-2 lg:py-4 px-3 sm:px-6">
      <div className="mb-3 lg:mb-4">
        <h2 className="font-sans font-black text-slate-900 text-xl lg:text-2xl tracking-tight">
          Es-Api / Zero-Pair
        </h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-0.5 lg:mt-1">
          Gunakan token positif (Es) dan negatif (Api) untuk memahami netralisasi dan operasi dasar bilangan bulat.
        </p>
      </div>
      <CoinSandbox />
    </div>
  );
}
