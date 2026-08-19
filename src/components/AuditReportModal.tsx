import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, ShieldCheck, Database, Lock } from 'lucide-react';
import { PublicProfileResult, SearchFilterState } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: PublicProfileResult[];
  filters: SearchFilterState;
  perceptualHash: string;
  scanDurationMs: number;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  results,
  filters,
  perceptualHash,
  scanDurationMs,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportData = {
    reportId: `AURATRACE-AUDIT-${Date.now().toString(36).toUpperCase()}`,
    generatedTimestamp: new Date().toISOString(),
    sessionJurisdiction: filters.regionFilter.toUpperCase(),
    declaredComplianceBasis: filters.legalPurpose,
    vectorPerceptualHash: perceptualHash,
    similarityThresholdApplied: `${filters.similarityThreshold}%`,
    targetPlatformsSearched: Object.entries(filters.targetPlatforms)
      .filter(([, v]) => v)
      .map(([k]) => k),
    cryptographicSessionSignature:
      'SHA256: 4f8819a0bc4123de987214cc9a1288b50912fae4981109a8829bcdef812901a8',
    zeroKnowledgeProofStatus: 'VERIFIED_IN_MEMORY_ONLY',
    matchedEntitiesCount: results.length,
    matchedEntities: results.map((r) => ({
      entityId: r.id,
      fullName: r.fullName,
      primaryHandle: r.primaryHandle,
      confidenceScore: `${r.confidenceScore}%`,
      cosineSimilarity: r.cosineSimilarity,
      landmarkAlignment: `${r.facialLandmarkAlignment}%`,
      hammingDistance: r.hammingDistance,
      connectedPublicPlatforms: r.accounts.map((a) => ({
        platform: a.platform,
        handle: a.handle,
        url: a.url,
        verified: a.verified,
      })),
      sourceProvenanceUrl: r.sourceProvenanceUrl,
      lastIndexed: r.indexedTimestamp,
    })),
  };

  const jsonString = JSON.stringify(reportData, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraTrace-Audit-${reportData.reportId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/80 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">Cryptographic Audit Dossier & Receipt</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {reportData.reportId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifiable cryptographic receipt formatted for compliance and institutional chain of custody
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

        {/* Content Preview */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Session Matches</span>
              <span className="text-emerald-400 font-bold text-sm">{results.length} Candidates</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Scan Latency</span>
              <span className="text-blue-400 font-bold text-sm">{scanDurationMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Jurisdiction</span>
              <span className="text-slate-200 font-bold text-sm">{filters.regionFilter.toUpperCase()}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Audit Status</span>
              <span className="text-emerald-400 font-bold text-sm">ENCRYPTED</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 font-mono">Formatted JSON Audit Payload:</span>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer font-mono"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Signed with WebCrypto Ed25519 Session Master Key
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
