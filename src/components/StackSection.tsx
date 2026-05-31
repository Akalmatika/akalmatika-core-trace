import { Cpu, Palette, Database, Terminal, CloudLightning, Sparkles } from "lucide-react";
import { STACK_CHOICES, StackItem } from "../blueprints";

export default function StackSection() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Cpu": return <Cpu size={18} />;
      case "Palette": return <Palette size={18} />;
      case "Database": return <Database size={18} />;
      case "Terminal": return <Terminal size={18} />;
      case "CloudLightning": return <CloudLightning size={18} />;
      case "Sparkles": return <Sparkles size={18} />;
      default: return <Cpu size={18} />;
    }
  };

  const getCategoryColor = (category: StackItem["category"]) => {
    switch (category) {
      case "frontend": return "bg-sky-50 text-sky-700 border-sky-100";
      case "database": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "backend": return "bg-purple-50 text-purple-700 border-purple-100";
      case "deployment": return "bg-amber-50 text-amber-700 border-amber-100";
      case "ai": return "bg-indigo-50 text-indigo-700 border-indigo-100";
    }
  };

  return (
    <div id="stack-section-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STACK_CHOICES.map((item, idx) => (
        <div
          id={`stack-card-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
          key={idx}
          className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-350 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className={`text-3xs uppercase font-mono px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className="font-mono text-3xs text-slate-400">{item.version}</span>
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
                {getIcon(item.iconName)}
              </div>
              <h4 className="font-sans font-bold text-slate-900 text-sm md:text-base tracking-tight">
                {item.name}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
              {item.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4 space-y-1.5">
            <span className="font-mono text-3xs font-bold uppercase text-slate-400 block">Lead Architect Rationale</span>
            <p className="text-2xs text-slate-500 italic leading-relaxed">
              "{item.rationale}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
