import React from 'react';
import { X, Sliders, RotateCcw } from 'lucide-react';
import { FilterState, SocialPlatform } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
}) => {
  if (!isOpen) return null;

  const PLATFORMS: SocialPlatform[] = [
    'All Platforms',
    'LinkedIn',
    'X / Twitter',
    'Instagram',
    'GitHub',
    'ResearchGate',
    'Web Citations',
  ];

  const handleReset = () => {
    onUpdateFilters({
      searchQuery: '',
      platform: 'All Platforms',
      minConfidence: 75,
      regionEnclave: 'All',
      verifiedOnly: false,
      exposureFilter: 'All',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121417] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl text-white overflow-hidden p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Discovery Parameters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Platform Scope */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300 block">Target Ecosystem</label>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((plat) => {
              const isSelected = filters.platform === plat;
              return (
                <button
                  key={plat}
                  onClick={() => onUpdateFilters({ ...filters, platform: plat })}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#007A4D] text-white font-semibold'
                      : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cosine Similarity Minimum Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-300">Min Vector Confidence:</span>
            <span className="text-emerald-400 font-mono font-bold">{filters.minConfidence}% Cosine Distance</span>
          </div>
          <input
            type="range"
            min="75"
            max="98"
            step="1"
            value={filters.minConfidence}
            onChange={(e) => onUpdateFilters({ ...filters, minConfidence: Number(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>75% (Broad Recall)</span>
            <span>98% (Strict Biometric Match)</span>
          </div>
        </div>

        {/* Verified Accounts Only Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#17191d] border border-white/5">
          <span className="text-xs font-medium text-stone-300">Verified Profiles Only</span>
          <button
            onClick={() => onUpdateFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              filters.verifiedOnly ? 'bg-[#007A4D] justify-end' : 'bg-white/10 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#007A4D] hover:bg-[#008f5a] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
