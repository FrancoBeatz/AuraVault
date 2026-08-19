import React from 'react';
import { X, ShieldCheck, Check, Globe, Cpu } from 'lucide-react';
import { EnclaveNode } from '../types';
import { ENCLAVE_NODES } from '../data/auraTraceData';

interface EnclaveNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: EnclaveNode;
  onSelectNode: (node: EnclaveNode) => void;
}

export const EnclaveNodeModal: React.FC<EnclaveNodeModalProps> = ({
  isOpen,
  onClose,
  selectedNode,
  onSelectNode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121417] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl text-white overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Sovereign Enclave Node</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {ENCLAVE_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  onSelectNode(node);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-[#007A4D]/20 text-white ring-1 ring-emerald-500'
                    : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{node.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{node.complianceStandard}</p>
                  <div className="flex items-center gap-3 text-[10px] text-emerald-400 font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> {node.latency}
                    </span>
                    <span>{node.totalIndexed}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
