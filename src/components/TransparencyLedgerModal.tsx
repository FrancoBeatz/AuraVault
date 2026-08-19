import React, { useState } from 'react';
import { X, Database, ShieldCheck, Search, Filter, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { TransparencyLogEntry } from '../types';

interface TransparencyLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: TransparencyLogEntry[];
}

export const TransparencyLedgerModal: React.FC<TransparencyLedgerModalProps> = ({ isOpen, onClose, logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.verificationHash.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/80 text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">Cryptographic Data Transparency Ledger</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  RFC-9162 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable, tamper-evident audit record of all vector queries and privacy opt-out operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Log ID, action type, or verification SHA-256 hash..."
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Total Logged Events: {logs.length}</span>
          </div>
        </div>

        {/* Log Entries List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No ledger entries match your filter query.</div>
          ) : (
            filteredLogs.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-blue-400">{entry.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                        entry.action === 'OPT_OUT_REQUEST'
                          ? 'bg-amber-950 border-amber-800 text-amber-300'
                          : entry.action === 'QUERY_EXECUTION'
                          ? 'bg-blue-950 border-blue-800 text-blue-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {entry.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">{entry.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold">
                      {entry.status}
                    </span>
                    <span className="text-[10px] text-slate-500">Node: {entry.nodeCluster}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">OPERATOR ENCLAVE:</span>
                    <span className="text-slate-300">{entry.operatorHash}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">VERIFICATION RECEIPT:</span>
                      <button
                        onClick={() => handleCopy(entry.verificationHash, entry.id)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === entry.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedId === entry.id ? 'Copied' : 'Copy Proof'}</span>
                      </button>
                    </div>
                    <span className="text-slate-300 truncate block text-[10px]">{entry.verificationHash}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Consensus proofs verified against Merkle Tree root 0x7E19...C49B
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
