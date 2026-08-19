import React from 'react';
import { Sliders, Globe, ShieldAlert, Cpu, Check, AlertCircle } from 'lucide-react';
import { SearchFilterState, SocialPlatform } from '../types';

interface SearchParametersProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onExecuteScan: () => void;
  isScanning: boolean;
  canExecute: boolean;
}

const PLATFORM_CONFIG: { key: SocialPlatform; label: string; badge: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', badge: 'Professional' },
  { key: 'twitter', label: 'X (Twitter)', badge: 'Social / News' },
  { key: 'instagram', label: 'Instagram', badge: 'Visual Media' },
  { key: 'facebook', label: 'Facebook', badge: 'Public Pages' },
  { key: 'github', label: 'GitHub', badge: 'Developer' },
  { key: 'researchgate', label: 'ResearchGate', badge: 'Academic' },
  { key: 'web', label: 'Public Web/News', badge: 'Global Index' },
];

export const SearchParameters: React.FC<SearchParametersProps> = ({
  filters,
  onFilterChange,
  onExecuteScan,
  isScanning,
  canExecute,
}) => {
  const togglePlatform = (platform: SocialPlatform) => {
    const updated = {
      ...filters.targetPlatforms,
      [platform]: !filters.targetPlatforms[platform],
    };
    onFilterChange({ ...filters, targetPlatforms: updated });
  };

  const handleSelectAllPlatforms = (enable: boolean) => {
    const updated: Record<SocialPlatform, boolean> = {
      linkedin: enable,
      twitter: enable,
      instagram: enable,
      facebook: enable,
      github: enable,
      youtube: enable,
      tiktok: enable,
      researchgate: enable,
      web: enable,
    };
    onFilterChange({ ...filters, targetPlatforms: updated });
  };

  return (
    <div className="bg-slate-900/95 rounded-xl border border-slate-800 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-900/40 border border-blue-700/50 text-blue-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Discovery Parameters & Index Scope</h2>
            <p className="text-xs text-slate-400">Configure target vector databases and compliance bounds</p>
          </div>
        </div>
      </div>

      {/* Target Networks Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Target Public Networks:</span>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              id="btn-select-all-platforms"
              onClick={() => handleSelectAllPlatforms(true)}
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              All
            </button>
            <span className="text-slate-600">|</span>
            <button
              id="btn-clear-platforms"
              onClick={() => handleSelectAllPlatforms(false)}
              className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              None
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORM_CONFIG.map(({ key, label, badge }) => {
            const isChecked = !!filters.targetPlatforms[key];
            return (
              <button
                key={key}
                id={`btn-target-platform-${key}`}
                onClick={() => togglePlatform(key)}
                className={`p-2 rounded-lg border text-left transition-all flex items-start justify-between cursor-pointer ${
                  isChecked
                    ? 'border-blue-700/80 bg-blue-950/40 text-slate-100'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{badge}</div>
                </div>
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center ${
                    isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vector Similarity Threshold Slider */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="similarity-slider" className="font-medium text-slate-300 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            Cosine Similarity Threshold:
          </label>
          <span className="font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-[11px]">
            {filters.similarityThreshold}%{' '}
            <span className="text-[10px] text-slate-400 font-normal">
              ({filters.similarityThreshold >= 95 ? 'Strict Match' : filters.similarityThreshold >= 85 ? 'Standard' : 'Broad'})
            </span>
          </span>
        </div>

        <input
          id="similarity-slider"
          type="range"
          min="75"
          max="99"
          step="1"
          value={filters.similarityThreshold}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              similarityThreshold: Number(e.target.value),
            })
          }
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>75% (Broad Discovery)</span>
          <span>88% (Recommended)</span>
          <span>99% (Exact Biometric Match)</span>
        </div>
      </div>

      {/* Region Filter & Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label htmlFor="select-region" className="block text-slate-400 mb-1 text-[11px] font-medium">
            Jurisdictional Node Routing:
          </label>
          <div className="relative">
            <select
              id="select-region"
              value={filters.regionFilter}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  regionFilter: e.target.value as SearchFilterState['regionFilter'],
                })
              }
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 text-xs appearance-none font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="global">Global Distributed Index (All Nodes)</option>
              <option value="europe">Europe / EEA (GDPR Enforced Nodes)</option>
              <option value="north_america">North America (US/CA Fast Edge)</option>
              <option value="asia_pacific">Asia Pacific (Tokyo / Singapore)</option>
            </select>
            <Globe className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="select-purpose" className="block text-slate-400 mb-1 text-[11px] font-medium">
            Declared Verification Basis (Mandatory):
          </label>
          <select
            id="select-purpose"
            value={filters.legalPurpose}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                legalPurpose: e.target.value as SearchFilterState['legalPurpose'],
              })
            }
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 text-xs appearance-none font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="self_audit">Personal Footprint & Impersonation Audit</option>
            <option value="osint_investigation">OSINT Intelligence & Verification</option>
            <option value="copyright_protection">Copyright / Visual Asset Protection</option>
            <option value="academic_research">Academic & Cyber Policy Research</option>
          </select>
        </div>
      </div>

      {/* Mandatory Ethical Consent Declaration */}
      <div className="bg-blue-950/30 border border-blue-900/60 rounded-lg p-3 space-y-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            id="checkbox-consent-agreement"
            type="checkbox"
            checked={filters.consentAgreed}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                consentAgreed: e.target.checked,
              })
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-white font-medium">Verifiable Compliance Attestation:</strong> I confirm this query
            is conducted in strict accordance with public record privacy frameworks (ISO/IEC 27701 & GDPR Art. 6) and will
            generate a signed tamper-evident ledger receipt.
          </span>
        </label>

        {!filters.consentAgreed && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Compliance attestation must be checked before search dispatch.</span>
          </div>
        )}
      </div>

      {/* Main Execution Button */}
      <button
        id="btn-execute-discovery"
        onClick={onExecuteScan}
        disabled={!canExecute || isScanning}
        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
          canExecute && !isScanning
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 ring-1 ring-blue-400/30'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        {isScanning ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></div>
            <span>Executing Cryptographic Vector Search...</span>
          </>
        ) : (
          <>
            <ShieldAlert className="h-4 w-4 text-blue-300" />
            <span>Dispatch Secure Visual Discovery Scan</span>
          </>
        )}
      </button>
    </div>
  );
};
