import React, { useState } from 'react';
import { X, Trash2, Shield, Download, Copy, Check, FileText, Lock, Sparkles, ExternalLink } from 'lucide-react';
import { InvestigationDossierItem, EnclaveNode } from '../types';

interface InvestigationDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InvestigationDossierItem[];
  onRemoveItem: (id: string) => void;
  onClearDossier: () => void;
  selectedNode: EnclaveNode;
}

export const InvestigationDossierDrawer: React.FC<InvestigationDossierDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearDossier,
  selectedNode,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const avgConfidence =
    items.length > 0
      ? (items.reduce((acc, it) => acc + it.entity.confidenceScore, 0) / items.length).toFixed(1)
      : '0.0';

  const exportPayload = {
    auraTraceDossierVersion: '2.4.0',
    exportSession: `EXP-${Date.now()}`,
    timestamp: new Date().toISOString(),
    enclaveNode: selectedNode.name,
    complianceJurisdiction: selectedNode.complianceStandard,
    totalEntitiesInvestigated: items.length,
    averageBiometricConfidence: `${avgConfidence}%`,
    zeroKnowledgeSignature: 'ZK-SNARK:0x88ff1122aabbccdd4455667788990011',
    entities: items.map((it) => ({
      name: it.entity.name,
      handle: it.entity.handle,
      platform: it.entity.platform,
      confidenceScore: `${it.entity.confidenceScore}%`,
      pHash: it.entity.pHash,
      vectorDigest: it.entity.vectorDigest,
      discoveredLinks: it.entity.publicLinks,
      analystPriority: it.priority,
      investigationNotes: it.notes,
    })),
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDossier = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AuraTrace_Audit_Dossier_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-[#101215] border-l border-white/10 w-full max-w-md h-full flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#14171a]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#007A4D]/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Investigation Dossier</h3>
              <p className="text-xs text-stone-400 font-mono">
                {items.length} {items.length === 1 ? 'entity' : 'entities'} compiled
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Node Routing Info */}
        <div className="px-5 py-3 bg-[#181b1f] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-stone-300 truncate max-w-[200px]">{selectedNode.name}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 text-[11px]">
            <Lock className="h-3.5 w-3.5" />
            <span>Avg Match: {avgConfidence}%</span>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-stone-500">
                <FileText className="h-8 w-8" />
              </div>
              <p className="font-semibold text-stone-300 text-sm">Dossier is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tap the green '+' button on any matched identity card to compile an exportable intelligence audit report!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-[#17191d] border border-white/10 rounded-2xl p-3.5 space-y-2.5 transition-all hover:border-white/20"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.entity.imageUrl}
                    alt={item.entity.name}
                    className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-xs truncate">{item.entity.name}</h4>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {item.entity.confidenceScore}%
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 font-mono truncate">{item.entity.handle}</p>

                    <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono text-stone-400">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {item.entity.platform}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5">{item.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                  <span className="text-[10px] text-stone-500 font-mono">pHash: {item.entity.pHash}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dossier Actions & Export */}
        {items.length > 0 && (
          <div className="p-5 bg-[#14171a] border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJSON}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied JSON' : 'Copy Signed JSON'}</span>
              </button>

              <button
                onClick={handleDownloadDossier}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#007A4D] hover:bg-[#008f5a] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-emerald-500/30"
              >
                {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                <span>{downloaded ? 'Downloaded' : 'Download Audit Dossier'}</span>
              </button>
            </div>

            <button
              onClick={onClearDossier}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-400 transition-colors py-1 cursor-pointer"
            >
              Clear Current Investigation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
