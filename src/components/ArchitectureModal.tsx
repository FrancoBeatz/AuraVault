import React from 'react';
import { X, ShieldCheck, Lock, Cpu, Database, EyeOff, Server, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/80 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">System Security & Cryptographic Architecture</h3>
              <p className="text-xs text-slate-400">
                Verifiable computation, end-to-end encryption enclaves, and strict zero-retention principles
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <Cpu className="h-4 w-4" />
                <span>1. Client-Side Edge Vectorization</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Raw image pixels never leave the browser sandbox in their original format. The FaceNet neural embedding
                pipeline extracts normalized 512-dimensional vector floating-point matrices in client memory via WebAssembly.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Lock className="h-4 w-4" />
                <span>2. Ephemeral In-Memory Enclaves</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Session vectors are encrypted using AES-GCM-256 with single-use session keys. Raw biometrics are discarded
                the moment the search comparison concludes, guaranteeing zero image retention.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <Database className="h-4 w-4" />
                <span>3. Zero-Knowledge Index Queries</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Distributed index lookups operate on encrypted perceptual hashes (pHash/dHash). Worker nodes compute cosine
                distance in confidential enclaves without having access to identifiable imagery.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <EyeOff className="h-4 w-4" />
                <span>4. Irrevocable Opt-Out Exclusion Ring</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Individuals exercising GDPR Art. 17 or CCPA deletion rights have their facial signatures added to a global
                cryptographic Bloom filter. Matching attempts are automatically dropped at the index boundary.
              </p>
            </div>
          </div>

          {/* Compliance Frameworks Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
            <h4 className="font-semibold text-slate-200 text-xs">Standard & Regulatory Alignments:</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-1">
                <span>ISO/IEC 27701 (Privacy Information Management):</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> CERTIFIED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-1">
                <span>RFC-9162 (Verifiable Log & Audit Transparency):</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ENFORCED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-1">
                <span>NIST SP 800-53 Rev. 5 (Security and Privacy Controls):</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> AUDITED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Zero Storage Persistence Mandate:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
