// src/pages/LearningMapPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  CheckCircle, 
  Play, 
  HelpCircle,
  AlertCircle,
  MapPin,
  TrendingUp,
  X
} from "lucide-react";
import { learningMapNodes, LearningMapNode } from "../data/learningMap";
import { progressStorage } from "../services/progressStorage";

type NodeStatus = 'mastered' | 'in-progress' | 'available' | 'locked';

export default function LearningMapPage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close toast helper
  const closeToast = () => setToastMessage(null);

  const getNodeStatus = (node: LearningMapNode): NodeStatus => {
    const isMastered = progressStorage.isTopicMastered(node.id);
    if (isMastered) return 'mastered';

    const isUnlocked = progressStorage.isTopicUnlocked(node.id);
    if (!isUnlocked) return 'locked';
    
    const progress = progressStorage.getTopicProgress(node.id);
    if (progress.diagnosticResults.length > 0) {
      return 'in-progress';
    }
    
    return 'available';
  };

  const handleNodeClick = (node: LearningMapNode) => {
    const status = getNodeStatus(node);
    
    if (status === 'locked') {
      // Find missing prerequisites names
      const missingPrereqsNames = node.prerequisites
        .filter(prereqId => !progressStorage.isTopicMastered(prereqId))
        .map(prereqId => {
          const match = learningMapNodes.find(n => n.id === prereqId);
          return match ? match.title : prereqId;
        });

      setToastMessage(`Selesaikan prasyarat: ${missingPrereqsNames.join(", ")} terlebih dahulu.`);
      return;
    }

    navigate(node.diagnosticRoute);
  };

  const getStatusConfig = (status: NodeStatus) => {
    switch (status) {
      case 'mastered':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-250',
          icon: <CheckCircle className="text-emerald-600 shrink-0" size={20} />,
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeText: 'Selesai ✓'
        };
      case 'in-progress':
        return {
          bg: 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-150',
          icon: <TrendingUp className="text-indigo-650 shrink-0" size={20} />,
          badge: 'bg-indigo-100 text-indigo-850 border-indigo-200',
          badgeText: 'Sedang Dipelajari ⏳'
        };
      case 'available':
        return {
          bg: 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs',
          icon: <Play className="text-indigo-600 shrink-0 fill-current" size={18} />,
          badge: 'bg-slate-100 text-slate-700 border-slate-250',
          badgeText: 'Mulai Ujian 🎯'
        };
      case 'locked':
        return {
          bg: 'bg-slate-100/70 border-slate-200 opacity-70 cursor-not-allowed',
          icon: <Lock className="text-slate-400 shrink-0" size={18} />,
          badge: 'bg-slate-200 text-slate-500 border-slate-300',
          badgeText: 'Terkunci 🔒'
        };
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-[calc(100vh-80px)] w-full max-w-2xl mx-auto space-y-8 animate-fadeIn relative">
      
      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-55 w-80 max-w-sm bg-rose-900 text-rose-100 p-4 rounded-xl shadow-lg border border-rose-800 flex items-start gap-3 animate-slideIn">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1 text-xs md:text-sm font-sans">
            {toastMessage}
          </div>
          <button 
            onClick={closeToast}
            className="text-rose-300 hover:text-white shrink-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-sans font-black text-slate-900 text-2xl md:text-3xl tracking-tight flex items-center gap-2">
          <MapPin className="text-indigo-600" size={28} /> Peta Belajar Akalmatika
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg leading-relaxed">
          Ikuti alur perjalanan belajarmu secara bertahap. Topik berikutnya akan terbuka jika prasyarat konsep sebelumnya sudah berhasil dikuasai.
        </p>
      </div>

      {/* Learning Path Container */}
      <div className="relative pl-6 sm:pl-10 space-y-8">
        
        {/* Continuous Connecting Line */}
        <div className="absolute left-[17px] sm:left-[27px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200 -z-10" />

        {learningMapNodes.map((node, index) => {
          const status = getNodeStatus(node);
          const config = getStatusConfig(status);

          // Get prerequisite titles
          const prereqNodes = node.prerequisites.map(prereqId => {
            const match = learningMapNodes.find(n => n.id === prereqId);
            return match ? match.title : prereqId;
          });

          return (
            <div 
              key={node.id}
              className="relative flex items-start group"
            >
              
              {/* Vertical path bullet dot indicator */}
              <div 
                onClick={() => handleNodeClick(node)}
                className={`absolute -left-[30px] sm:-left-[43px] w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer select-none font-mono text-xs font-black shadow-xs z-10 ${
                  status === 'mastered'
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : status === 'in-progress'
                      ? 'bg-indigo-600 border-indigo-700 text-white'
                      : status === 'available'
                        ? 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                        : 'bg-slate-200 border-slate-300 text-slate-400'
                }`}
              >
                {status === 'mastered' ? '✓' : index + 1}
              </div>

              {/* Node Card Box */}
              <div 
                onClick={() => handleNodeClick(node)}
                className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${config.bg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-400">
                      Tingkat {node.level}
                    </span>
                    <h3 className="font-sans font-black text-slate-850 text-base sm:text-lg">
                      {node.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 sm:py-1 rounded-md border text-[10px] sm:text-xs font-mono font-bold tracking-wide self-start sm:self-center shrink-0 ${config.badge}`}>
                    {config.badgeText}
                  </span>
                </div>

                {/* Prerequisite label helper */}
                {prereqNodes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100/80 text-[10px] sm:text-xs font-sans text-slate-500 leading-relaxed space-y-1">
                    <span className="font-semibold text-slate-650">Prasyarat:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {node.prerequisites.map(prereqId => {
                        const match = learningMapNodes.find(n => n.id === prereqId);
                        const isPrereqMastered = progressStorage.isTopicMastered(prereqId);
                        return (
                          <span 
                            key={prereqId} 
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                              isPrereqMastered
                                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                                : 'bg-slate-50 border-slate-150 text-slate-500'
                            }`}
                          >
                            {isPrereqMastered ? '✅' : '🔒'} {match ? match.title : prereqId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
