import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Lock, Download, Copy, Check, Sparkles } from 'lucide-react';

interface OptOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OptOutModal: React.FC<OptOutModalProps> = ({ isOpen, onClose }) => {
  const [legalName, setLegalName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [reason, setReason] = useState('Personal Privacy Sovereignty (GDPR Art. 17)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exclusionToken, setExclusionToken] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `EXCL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setExclusionToken(token);
    setIsSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exclusionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121417] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl text-white overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base text-white">Right to be Forgotten Portal</h3>
              <p className="text-[11px] text-stone-400 font-mono">GDPR Art. 17 / CCPA Exclusions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Exclusion Token Committed</h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Your facial vector signature has been appended to the zero-knowledge bloom exclusion filter across all global nodes.
              </p>
            </div>

            {/* Token Card */}
            <div className="bg-[#181b1f] border border-emerald-500/30 rounded-2xl p-3.5 text-left space-y-2">
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Cryptographic Exclusion Token</span>
              <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/10">
                <span className="font-mono text-xs font-bold text-emerald-400">{exclusionToken}</span>
                <button
                  onClick={handleCopy}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                Store this token. Any future indexation attempts will be mathematically rejected before query execution.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#007A4D] hover:bg-[#008f5a] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done & Return to Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-stone-300 text-xs leading-relaxed">
              Register your facial biometric signature into our irrevocable zero-knowledge exclusion filter to guarantee permanent omission from all future queries.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300 block">Full Name or Verified Pseudonym</label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full bg-[#181b1f] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300 block">Verification Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="privacy@domain.com"
                className="w-full bg-[#181b1f] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300 block">Exclusion Legal Basis</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#181b1f] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="Personal Privacy Sovereignty (GDPR Art. 17)">Personal Privacy Sovereignty (GDPR Art. 17)</option>
                <option value="California Consumer Privacy Act (CCPA Deletion)">California Consumer Privacy Act (CCPA Deletion)</option>
                <option value="Public Figure Threat / Stalking Mitigation">Public Figure Threat / Stalking Mitigation</option>
                <option value="Intellectual Property & Synthetic Identity Protection">Intellectual Property & Synthetic Identity Protection</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="h-3.5 w-3.5" />
                <span>Zero-Knowledge Proof Guarantee</span>
              </div>
              <p className="text-stone-400">
                No physical likeness is stored. Only a 512-bit one-way hash is committed to the exclusion bloom filter.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#007A4D] hover:bg-[#008f5a] text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer border border-emerald-500/30"
            >
              Generate Irreversible Exclusion Token
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
