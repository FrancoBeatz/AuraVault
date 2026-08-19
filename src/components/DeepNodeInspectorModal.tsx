import React from 'react';
import { X, ShieldCheck, ExternalLink, Hash, CheckCircle2, Lock, Plus, Heart } from 'lucide-react';
import { DiscoveredEntity } from '../types';

interface DeepNodeInspectorModalProps {
  entity: DiscoveredEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToDossier: (entity: DiscoveredEntity) => void;
  isInDossier: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DeepNodeInspectorModal: React.FC<DeepNodeInspectorModalProps> = ({
  entity,
  isOpen,
  onClose,
  onAddToDossier,
  isInDossier,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121417] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image with Floating Action Buttons */}
        <div className="relative h-48 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${entity.imageUrl})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-black/40 to-black/70" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(entity.id)}
                className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>
          </div>

          {/* Bottom Title & Confidence Tag */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-bold">
                <ShieldCheck className="h-3 w-3" />
                {entity.confidenceScore}% Vector Match
              </span>
              <span className="text-[11px] font-mono text-stone-300">
                {entity.platform} • {entity.location}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1 tracking-tight flex items-center gap-1.5">
              <span>{entity.name}</span>
              {entity.verified && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </h3>
            <p className="text-xs text-stone-300 font-mono">{entity.handle}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Bio Description */}
          <div className="bg-[#181b1f] border border-white/5 rounded-2xl p-3.5 space-y-1">
            <span className="font-semibold text-stone-300 text-xs block">Public Presence Biography</span>
            <p className="text-xs text-stone-400 leading-relaxed">{entity.bio}</p>
          </div>

          {/* Biometric Landmark Alignment Diagnostics */}
          <div className="bg-[#181b1f] border border-white/5 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-300 flex items-center gap-1.5 font-mono">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                Landmark Congruence:
              </span>
              <span className="text-emerald-400 font-mono font-bold">{entity.alignmentScore}% 68-pt Mesh Match</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${entity.alignmentScore}%` }}
              />
            </div>

            {/* Cryptographic pHash & Vector Signature */}
            <div className="pt-1 text-[10px] font-mono text-stone-400 space-y-1">
              <div className="flex justify-between">
                <span>Perceptual Hash (pHash):</span>
                <span className="text-stone-300">{entity.pHash}</span>
              </div>
              <div className="flex justify-between truncate">
                <span>Zero-Knowledge Digest:</span>
                <span className="text-stone-300 truncate max-w-[200px]">{entity.vectorDigest}</span>
              </div>
            </div>
          </div>

          {/* Discovered Public Outbound Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-300 block text-xs">Public Social Profiles Found</span>
              <span className="text-[10px] text-emerald-400 font-mono">💡 Tip: Tap to visit link</span>
            </div>
            <div className="space-y-1.5">
              {entity.publicLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors text-xs text-stone-300 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {link.platform}
                    </span>
                    <span className="truncate max-w-[210px]">{link.label}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-stone-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {entity.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-stone-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-[#0d0f12] border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-400 block font-mono">ENCLAVE VERIFICATION</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">Zero-Knowledge Attested</span>
          </div>

          <button
            onClick={() => {
              onAddToDossier(entity);
              onClose();
            }}
            className={`py-3 px-6 rounded-full font-semibold text-xs tracking-wide shadow-lg transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer ${
              isInDossier
                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                : 'bg-[#007A4D] hover:bg-[#008f5a] text-white border border-emerald-500/30'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isInDossier ? 'In Active Dossier' : 'Add to Investigation Dossier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
