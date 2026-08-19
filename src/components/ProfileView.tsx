import React from 'react';
import { ShieldCheck, Lock, Key, Award, Server, Database, Globe, ChevronRight } from 'lucide-react';
import { EnclaveNode, AuditLogEntry } from '../types';

interface ProfileViewProps {
  selectedNode: EnclaveNode;
  onOpenLedger: () => void;
  onOpenOptOut: () => void;
  onOpenNodeModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  selectedNode,
  onOpenLedger,
  onOpenOptOut,
  onOpenNodeModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Analyst Header */}
      <div className="bg-[#17191d] border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="rchmwnn"
            className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500/80 shadow-md"
          />
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#17191d]" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Analyst rchmwnn</h3>
          <p className="text-xs text-stone-400 font-mono">Zero-Knowledge Attested Session</p>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 inline-block mt-1">
            Level 4 Cleared • GDPR Enclave
          </span>
        </div>
      </div>

      {/* Cryptographic Session Passport */}
      <div className="bg-gradient-to-br from-[#1b221e] to-[#121614] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Lock className="h-4 w-4 text-emerald-400" />
            Active Zero-Knowledge Proof
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">256-Bit Ephemeral</span>
        </div>

        <p className="text-xs text-stone-300">
          All search queries execute in secure enclave RAM. No raw photos or facial vectors are committed to disk.
        </p>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[10px] text-stone-400 break-all space-y-1">
          <div className="text-emerald-400 font-bold">SHA-256 SESSION DIGEST:</div>
          <div>7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</div>
        </div>
      </div>

      {/* Quick Navigation Tools */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Privacy & Governance Actions</h4>

        <div
          onClick={onOpenLedger}
          className="bg-[#17191d] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Database className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="font-bold text-xs text-white">Transparency Audit Ledger</span>
              <p className="text-[11px] text-stone-400">View real-time immutable vector query proofs</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-stone-500" />
        </div>

        <div
          onClick={onOpenOptOut}
          className="bg-[#17191d] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="font-bold text-xs text-white">Right to be Forgotten Portal</span>
              <p className="text-[11px] text-stone-400">Register GDPR Art. 17 removal tokens</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-stone-500" />
        </div>

        <div
          onClick={onOpenNodeModal}
          className="bg-[#17191d] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="font-bold text-xs text-white">Sovereign Enclave Router</span>
              <p className="text-[11px] text-stone-400">Connected: {selectedNode.name}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-stone-500" />
        </div>
      </div>
    </div>
  );
};
