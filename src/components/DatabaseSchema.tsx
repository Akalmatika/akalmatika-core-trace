import { useState } from "react";
import { Database, ShieldCheck, Key, RefreshCw, Layers } from "lucide-react";
import { DATABASE_SCHEMA } from "../blueprints";

export default function DatabaseSchema() {
  const [activeTableIdx, setActiveTableIdx] = useState(0);
  const activeTable = DATABASE_SCHEMA[activeTableIdx];

  return (
    <div id="database-schema-section" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 tracking-tight text-lg flex items-center gap-2">
            <Database size={20} className="text-indigo-600" />
            Supabase Relational Database Schema
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            PostgreSQL definitions with strict Row-Level Security (RLS) to manage student-teacher isolation bounds.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
          {DATABASE_SCHEMA.map((table, idx) => (
            <button
              id={`tab-table-${table.name}`}
              key={idx}
              onClick={() => setActiveTableIdx(idx)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeTableIdx === idx
                  ? "bg-white text-indigo-700 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {table.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-indigo-900 uppercase">
                Table Structure: {activeTable.name}
              </span>
              <span className="text-3xs text-slate-400 font-mono">SUPABASE DB SCHEMA</span>
            </div>
            
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 font-sans">
                <thead className="bg-slate-50/50 text-slate-400 font-medium text-3xs tracking-wider uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left">Column</th>
                    <th scope="col" className="px-4 py-2.5 text-left">Type</th>
                    <th scope="col" className="px-4 py-2.5 text-left">Descriptor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {activeTable.columns.map((col, idx) => (
                    <tr id={`col-row-${activeTable.name}-${col.name}`} key={idx} className="hover:bg-slate-50/40">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 flex items-center gap-1.5">
                        {col.isPrimary && <span title="Primary Key" className="shrink-0 flex"><Key size={12} className="text-amber-500" /></span>}
                        {col.isForeign && <span title="Foreign Key" className="shrink-0 flex"><Layers size={12} className="text-indigo-400" /></span>}
                        {col.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-purple-600">{col.type}</td>
                      <td className="px-4 py-3 text-slate-500 leading-relaxed max-w-xs">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-slate-50/50 border border-slate-250 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-700 font-sans mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" /> PostgreSQL Row-Level Security Rules (RLS)
            </h4>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-3xs text-slate-300 leading-relaxed overflow-x-auto space-y-1.5 select-all border border-slate-800">
              {activeTable.rlsRules.map((rule, idx) => (
                <div key={idx} className="block whitespace-pre">{rule}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex p-2 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600 mb-3">
                <Database size={18} />
              </div>
              <h4 className="font-sans font-semibold text-slate-900 tracking-tight text-base mb-2">
                Table Architectural Purpose
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-sans mb-4">
                {activeTable.description}
              </p>
              
              <div className="space-y-2 font-sans text-xs text-slate-500">
                <div className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>Encapsulates fine-grained data fields to optimize network payload sizes on Vercel Edge compute layers.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>Configured index structures on primary keys and foreign indicators prevent table-scan sluggishness on complex analytics queries.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/40 flex items-center justify-between">
              <span className="text-3xs font-mono text-indigo-400">Postgres Module Rationale</span>
              <span className="text-3xs text-slate-400 font-mono">SUPABASE CLIENT V1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
