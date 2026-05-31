import React, { useState, MouseEvent } from "react";
import { Folder, File, ChevronRight, ChevronDown, Info } from "lucide-react";
import { FOLDER_STRUCTURE, FolderNode } from "../blueprints";

interface TreeNodeProps {
  key?: any;
  node: FolderNode;
  level: number;
  onSelect: (node: FolderNode) => void;
  selectedNode: FolderNode | null;
}

function TreeNode({ node, level, onSelect, selectedNode }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedNode?.name === node.name;
  const isFolder = node.type === "folder";

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onSelect(node);
  };

  return (
    <div className="select-none">
      <div
        id={`tree-node-${node.name.replace(/\./g, "-")}`}
        onClick={() => onSelect(node)}
        className={`flex items-center py-1 px-2 rounded-lg cursor-pointer transition-colors max-w-full ${
          isSelected 
            ? "bg-slate-100 text-slate-900 font-medium" 
            : "hover:bg-slate-50 text-slate-600"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <span className="mr-1.5 flex items-center justify-center text-slate-400">
          {isFolder ? (
            <button 
              id={`toggle-${node.name.replace(/\./g, "-")}`}
              onClick={handleToggle} 
              className="p-0.5 hover:bg-slate-200 rounded transition-colors"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}
        </span>
        <span className="mr-2 text-slate-500">
          {isFolder ? (
            <Folder size={16} className="text-amber-500 fill-amber-100/30" />
          ) : (
            <File size={16} className="text-slate-400" />
          )}
        </span>
        <span className="font-mono text-sm truncate">{node.name}</span>
      </div>
      
      {isFolder && isOpen && node.children && (
        <div id={`children-of-${node.name.replace(/\./g, "-")}`}>
          {node.children.map((child, idx) => (
            <TreeNode
              key={idx}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedNode={selectedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderStructure() {
  const [selectedNode, setSelectedNode] = useState<FolderNode | null>(FOLDER_STRUCTURE);

  return (
    <div id="folder-structure-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="lg:col-span-5 border-r border-slate-100 pr-0 lg:pr-6 max-h-fit md:max-h-[500px] overflow-y-auto">
        <h3 className="font-sans font-semibold text-slate-900 tracking-tight text-lg mb-1">
          Source Repository Blueprint
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-mono">
          Interactive File Tree Directory Structure
        </p>
        <div className="space-y-1">
          <TreeNode
            node={FOLDER_STRUCTURE}
            level={0}
            onSelect={setSelectedNode}
            selectedNode={selectedNode}
          />
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 p-6 rounded-xl border border-slate-100 min-h-0 md:min-h-[300px]">
        {selectedNode ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              {selectedNode.type === "folder" ? (
                <Folder size={20} className="text-amber-500" />
              ) : (
                <File size={20} className="text-slate-400" />
              )}
              <h4 className="font-mono text-base font-bold text-slate-800">
                {selectedNode.name}
              </h4>
              <span className={`text-2xs uppercase px-2 py-0.5 rounded-full font-mono font-medium ${
                selectedNode.type === "folder" 
                  ? "bg-amber-50 text-amber-700 border border-amber-100" 
                  : "bg-slate-200 text-slate-700 border border-slate-300"
              }`}>
                {selectedNode.type}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-sans mb-4">
              {selectedNode.description}
            </p>

            <div className="mt-6 bg-white/75 border border-slate-200/50 rounded-lg p-4 font-mono text-xs text-slate-500 space-y-2">
              <div className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Info size={14} className="text-slate-400" /> Lead Architect Note:
              </div>
              {selectedNode.name === "alamatika-core-trace" && (
                <p>This layout segregates strict data rules (in /lib) from interactive state widgets (in /components) to ensure ease of testing across both student levels and automated CI tools.</p>
              )}
              {selectedNode.name === "supabase" && (
                <p>Designed for immediate schema creation. Keeps migrations self-documented to coordinate schema deployments without central synchronization meetings.</p>
              )}
              {selectedNode.name === "src" && (
                <p>Our source hub. Relies on aliased directories via Vite resolving (@/*) to avoid complex relative-level path nesting.</p>
              )}
              {selectedNode.name === "traceEngine.ts" && (
                <p>Executes deterministic cognitive bug rules using syntactic trace matrices, identifying subtraction inversions and multiplicative projections before LLMs intervene.</p>
              )}
              {selectedNode.name === "InteractiveNumberLine.tsx" && (
                <p>Renders a virtual responsive number line context. When drawing, student finger gestures create continuous vectors, mapped back to step integer bounds.</p>
              )}
              {!["alamatika-core-trace", "supabase", "src", "traceEngine.ts", "InteractiveNumberLine.tsx"].includes(selectedNode.name) && (
                <p>Essential node supporting physical routing, system-level compilation bounds, or responsive state encapsulation for students and mathematical educators.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 py-12">
            <Info size={24} className="mb-2 text-slate-300" />
            <p className="text-sm font-sans">Select a file or folder on the left to inspect its role inside the architecture.</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-200/50 flex justify-between items-center text-2xs font-mono text-slate-400">
          <span>PROJECT: alamatika-core-trace</span>
          <span>DEPLOYMENT TARGET: VERCEL EDGE</span>
        </div>
      </div>
    </div>
  );
}
