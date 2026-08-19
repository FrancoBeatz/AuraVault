import React from 'react';
import { ShieldCheck, Lock, Activity, EyeOff, FileText, Database } from 'lucide-react';

interface HeaderProps {
  onOpenLedger: () => void;
  onOpenOptOut: () => void;
  onOpenArchitecture: () => void;
  onOpenAuditLogs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLedger,
  onOpenOptOut,
  onOpenArchitecture,
  onOpenAuditLogs,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner font-mono font-bold tracking-tight">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white">AuraTrace</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/80 font-medium">
                  ENTERPRISE v3.4
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifiable Visual Presence Discovery & Zero-Knowledge Footprint Intelligence
              </p>
            </div>
          </div>

          {/* Security Assurance Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700">
              <Lock className="h-3.5 w-3.5 text-blue-400" />
              <span>AES-256 Memory Sandboxed</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Zero-Log Ephemeral Ingestion</span>
            </div>
          </div>

          {/* Quick Nav Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-nav-transparency"
              onClick={onOpenLedger}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Inspect real-time cryptographic audit trail"
            >
              <Database className="h-3.5 w-3.5 text-blue-400" />
              <span>Transparency Ledger</span>
            </button>

            <button
              id="btn-nav-optout"
              onClick={onOpenOptOut}
              className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Claim biometric hash to exclude profiles permanently"
            >
              <EyeOff className="h-3.5 w-3.5 text-amber-400" />
              <span>Opt-Out Portal</span>
            </button>

            <button
              id="btn-nav-auditlogs"
              onClick={onOpenAuditLogs}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Review session verification receipts"
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Audit Receipts</span>
            </button>

            <button
              id="btn-nav-architecture"
              onClick={onOpenArchitecture}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer"
              title="View Security & Cryptographic Architecture"
            >
              <ShieldCheck className="h-4 w-4 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
