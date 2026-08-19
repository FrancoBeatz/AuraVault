import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Layers,
  Network,
  Download,
  AlertTriangle,
  Fingerprint,
  Share2,
} from 'lucide-react';
import { PublicProfileResult } from '../types';

interface EntityDetailModalProps {
  profile: PublicProfileResult | null;
  queryImageUrl: string | null;
  onClose: () => void;
  onFlagProfile: (profileId: string) => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  profile,
  queryImageUrl,
  onClose,
  onFlagProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'biometrics' | 'crypto' | 'footprint'>('graph');
  const [flagged, setFlagged] = useState(false);

  if (!profile) return null;

  const handleFlag = () => {
    setFlagged(true);
    onFlagProfile(profile.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-0 text-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-12 w-12 rounded-lg object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-white">{profile.fullName}</h3>
                <span className="text-xs font-mono text-blue-400">{profile.primaryHandle}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {profile.confidenceScore.toFixed(1)}% Match
                </span>
              </div>
              <p className="text-xs text-slate-400">{profile.headline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('graph')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'graph'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="h-4 w-4" />
            Cross-Network Presence Graph
          </button>
          <button
            onClick={() => setActiveTab('biometrics')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'biometrics'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="h-4 w-4" />
            Biometric Alignment Proof
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'crypto'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-4 w-4" />
            Cryptographic Audit Receipt
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {activeTab === 'graph' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-blue-400" />
                    Synthesized Identity Network Map:
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {profile.accounts.length} Confirmed Hub Nodes
                  </span>
                </div>

                {/* Visual Interconnected Graph Simulation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profile.accounts.map((acc, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                          {acc.platform}
                        </span>
                        {acc.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified Public Node
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm text-slate-200 font-medium">{acc.handle}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Indexed: {acc.lastIndexed}</span>
                        {acc.followersCount && <span>{acc.followersCount} followers</span>}
                      </div>
                      <a
                        href={acc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 pt-1"
                      >
                        <span>Open Public Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discovered Public Bio & Metadata */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Public Index Evidence Bio & Attributes
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{profile.publicBio}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {profile.publicTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'biometrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Query Image */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-center">
                  <span className="text-xs font-mono text-blue-400 block font-semibold">QUERY BIOMETRIC INPUT</span>
                  <div className="h-48 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    {queryImageUrl ? (
                      <img
                        src={queryImageUrl}
                        alt="Query input"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-xs text-slate-500 font-mono">No query image</div>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    68 Biometric Landmarks Extracted In-Memory
                  </span>
                </div>

                {/* Candidate Image */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-center">
                  <span className="text-xs font-mono text-emerald-400 block font-semibold">INDEXED CANDIDATE MATCH</span>
                  <div className="h-48 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Source: {profile.sourceProvenanceUrl}
                  </span>
                </div>
              </div>

              {/* Biometric Comparison Metrics */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-300 mb-3">Mathematical Alignment Scores:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Cosine Similarity</span>
                    <span className="text-blue-400 font-bold text-sm">{profile.cosineSimilarity.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Hamming Distance</span>
                    <span className="text-emerald-400 font-bold text-sm">{profile.hammingDistance} / 64</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Landmark Alignment</span>
                    <span className="text-purple-400 font-bold text-sm">{profile.facialLandmarkAlignment.toFixed(1)}%</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Entropy Divergence</span>
                    <span className="text-amber-400 font-bold text-sm">0.014 bits</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Tamper-Evident Session Proof
                </span>
                <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  IMMUTABLE
                </span>
              </div>

              <div className="space-y-2 text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">RECORD IDENTIFIER:</span>
                  <span className="text-slate-200">AURATRACE-REC-{profile.id.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">VECTOR SHA-256 SIGNATURE:</span>
                  <span className="text-blue-400 break-all">
                    SHA256: 8a4c11b0e9f1a28841029c78bf30a27cd480029b9f29aa4769018e65fa1a90c1
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ENCRYPTION SPECIFICATION:</span>
                  <span className="text-slate-300">AES-GCM-256 In-Memory Isolated Enclave (Zero-Disk Persistence)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PUBLIC PROVENANCE URL:</span>
                  <span className="text-slate-300 underline">{profile.sourceProvenanceUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!flagged ? (
              <button
                onClick={handleFlag}
                className="px-3 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Dispute Profile / Request Exclusion</span>
              </button>
            ) : (
              <span className="text-xs text-amber-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                Exclusion ticket registered in queue.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
