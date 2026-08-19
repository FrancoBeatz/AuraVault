import React from 'react';
import { X, ShieldCheck, Database, CheckCircle2, Lock, Terminal } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface TransparencyLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const TransparencyLedgerModal: React.FC<TransparencyLedgerModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121417] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl text-white overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base text-white">Cryptographic Transparency Ledger</h3>
              <p className="text-[11px] text-stone-400 font-mono">Immutable Zero-Knowledge Audit Trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-[#17191d] border border-white/5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">{log.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {log.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-stone-400 font-mono">
                <div className="flex justify-between">
                  <span>Action:</span>
                  <span className="text-stone-200">{log.action}</span>
                </div>
                <div className="flex justify-between">
                  <span>Node:</span>
                  <span className="text-stone-300 truncate max-w-[180px]">{log.nodeRouted}</span>
                </div>
                <div className="flex justify-between truncate">
                  <span>Target Digest:</span>
                  <span className="text-emerald-400 truncate max-w-[180px]">{log.targetHash}</span>
                </div>
                <div className="flex justify-between">
                  <span>ZK Proof:</span>
                  <span className="text-stone-400">{log.zeroKnowledgeProof}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-1 border-t border-white/5">
                  <span>Timestamp</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-400" />
            SHA-256 Merkle Root Verified
          </span>
          <span className="text-emerald-400">Sync: 100%</span>
        </div>
      </div>
    </div>
  );
};
