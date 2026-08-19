import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  Activity,
  Layers,
  Search,
  Filter,
  Check,
  Building2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PublicProfileResult, SocialPlatform } from '../types';

interface ResultsFeedProps {
  results: PublicProfileResult[];
  hasScanned: boolean;
  onSelectProfile: (profile: PublicProfileResult) => void;
  onExportAuditReport: () => void;
  scanDurationMs: number;
  perceptualHash: string;
}

const PLATFORM_ICONS: Record<SocialPlatform, { label: string; bg: string; text: string }> = {
  linkedin: { label: 'LinkedIn', bg: 'bg-blue-900/60 border-blue-700', text: 'text-blue-200' },
  twitter: { label: 'X (Twitter)', bg: 'bg-slate-800 border-slate-700', text: 'text-slate-200' },
  instagram: { label: 'Instagram', bg: 'bg-rose-950/60 border-rose-800', text: 'text-rose-200' },
  facebook: { label: 'Facebook', bg: 'bg-indigo-950/60 border-indigo-800', text: 'text-indigo-200' },
  github: { label: 'GitHub', bg: 'bg-slate-800 border-slate-600', text: 'text-slate-200' },
  youtube: { label: 'YouTube', bg: 'bg-red-950/60 border-red-800', text: 'text-red-200' },
  tiktok: { label: 'TikTok', bg: 'bg-cyan-950/60 border-cyan-800', text: 'text-cyan-200' },
  researchgate: { label: 'ResearchGate', bg: 'bg-emerald-950/60 border-emerald-800', text: 'text-emerald-200' },
  web: { label: 'Web Citations', bg: 'bg-slate-900 border-slate-700', text: 'text-slate-300' },
};

export const ResultsFeed: React.FC<ResultsFeedProps> = ({
  results,
  hasScanned,
  onSelectProfile,
  onExportAuditReport,
  scanDurationMs,
  perceptualHash,
}) => {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'recent' | 'accounts'>('confidence');

  const filteredResults = results
    .filter((profile) => {
      if (filterPlatform === 'all') return true;
      return profile.accounts.some((acc) => acc.platform === filterPlatform);
    })
    .sort((a, b) => {
      if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
      if (sortBy === 'recent') return new Date(b.indexedTimestamp).getTime() - new Date(a.indexedTimestamp).getTime();
      if (sortBy === 'accounts') return b.accounts.length - a.accounts.length;
      return 0;
    });

  if (!hasScanned) {
    return (
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
        <div className="h-16 w-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
          <Search className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-white">Visual Intelligence Feed Ready</h3>
        <p className="text-sm text-slate-400 max-w-md mt-1.5 leading-relaxed">
          Select or drop a target reference image on the left, confirm your compliance attestation, and dispatch the discovery scan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 w-full max-w-lg text-left">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-slate-200 block mb-1">1. Vectorize</span>
            <span className="text-slate-400">Extracts 512-dim facial landmarks client-side</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-slate-200 block mb-1">2. Zero-Knowledge</span>
            <span className="text-slate-400">Queries encrypted distributed vector index</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-slate-200 block mb-1">3. Synthesize</span>
            <span className="text-slate-400">Maps cross-network public footprints</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Intelligence Summary Banner */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Discovery Evidence Feed</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-mono">
                {filteredResults.length} Matched Profiles
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Query completed in <span className="text-slate-200 font-mono">{scanDurationMs}ms</span> • Vector pHash:{' '}
              <span className="text-blue-400 font-mono">{perceptualHash}</span>
            </p>
          </div>

          <button
            id="btn-export-audit-report"
            onClick={onExportAuditReport}
            className="px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-blue-400" />
            <span>Export Audit Dossier</span>
          </button>
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Platform:
            </span>
            <select
              id="select-feed-platform-filter"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Public Networks</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">X (Twitter)</option>
              <option value="instagram">Instagram</option>
              <option value="github">GitHub</option>
              <option value="researchgate">ResearchGate</option>
              <option value="web">Web Mentions</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort By:</span>
            <select
              id="select-feed-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'confidence' | 'recent' | 'accounts')}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="confidence">Highest Vector Similarity</option>
              <option value="recent">Most Recently Indexed</option>
              <option value="accounts">Most Connected Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Match Entity Cards */}
      {filteredResults.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center text-slate-400 text-sm">
          No matching public profiles met the selected filter threshold. Try lowering the similarity slider or selecting additional networks.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((profile) => {
            const isHighConfidence = profile.confidenceScore >= 95;
            return (
              <div
                key={profile.id}
                id={`card-profile-${profile.id}`}
                className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm hover:shadow-md space-y-4"
              >
                {/* Top Section: Avatar, Identity, Confidence */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="h-14 w-14 rounded-lg object-cover border border-slate-700 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono text-emerald-400 font-bold">
                        {profile.confidenceScore.toFixed(1)}%
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-base tracking-tight">{profile.fullName}</h3>
                        <span className="text-xs font-mono text-blue-400">{profile.primaryHandle}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                            profile.verificationBadge === 'GovID Verified'
                              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                              : profile.verificationBadge === 'Corporate Directory'
                              ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <ShieldCheck className="h-3 w-3 text-current" />
                          {profile.verificationBadge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{profile.headline}</p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 flex-wrap">
                        {profile.organization && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-slate-500" />
                            {profile.organization}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {profile.publicLocation}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-slate-500" />
                          Indexed: {new Date(profile.indexedTimestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Metric Box */}
                  <div className="shrink-0 flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-1">
                    <div
                      className={`px-3 py-1 rounded-md text-xs font-mono font-bold border flex items-center gap-1.5 ${
                        isHighConfidence
                          ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                          : 'bg-blue-950/80 border-blue-700/80 text-blue-300'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{profile.confidenceScore.toFixed(1)}% Match</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Landmark: {profile.facialLandmarkAlignment.toFixed(1)}% • Ham: {profile.hammingDistance}
                    </span>
                  </div>
                </div>

                {/* Discovered Connected Accounts Pills */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Discovered Public Profiles & Footprint ({profile.accounts.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.accounts.map((acc, idx) => {
                      const style = PLATFORM_ICONS[acc.platform] || PLATFORM_ICONS.web;
                      return (
                        <a
                          key={idx}
                          href={acc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors flex items-center gap-1.5 hover:opacity-90 ${style.bg} ${style.text}`}
                          title={`Open verified ${style.label} profile`}
                        >
                          {acc.verified && <Check className="h-3 w-3 text-emerald-400" />}
                          <span className="font-medium">{style.label}:</span>
                          <span className="text-slate-300">{acc.handle}</span>
                          {acc.followersCount && (
                            <span className="text-[10px] text-slate-400">({acc.followersCount})</span>
                          )}
                          <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Source: <span className="text-slate-400 underline">{profile.sourceProvenanceUrl}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-view-dossier-${profile.id}`}
                      onClick={() => onSelectProfile(profile)}
                      className="px-3 py-1.5 rounded-md bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Deep Graph & Cryptographic Proof</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
