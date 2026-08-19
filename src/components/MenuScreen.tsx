import React, { useState } from 'react';
import {
  Search,
  Sliders,
  MapPin,
  Bell,
  Plus,
  Heart,
  ShieldCheck,
  FileText,
  Home,
  Bookmark,
  User,
  Database,
  ShieldAlert,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SocialPlatform, DiscoveredEntity, EnclaveNode, FilterState } from '../types';
import { DISCOVERED_ENTITIES } from '../data/auraTraceData';

interface MenuScreenProps {
  onSelectEntity: (entity: DiscoveredEntity) => void;
  onQuickAdd: (entity: DiscoveredEntity) => void;
  dossierCount: number;
  onOpenDossier: () => void;
  selectedNode: EnclaveNode;
  onOpenNodeModal: () => void;
  onOpenFilterModal: () => void;
  onOpenLedgerModal: () => void;
  onOpenOptOutModal: () => void;
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
  activeTab: 'feed' | 'favorites' | 'ledger' | 'profile';
  onChangeTab: (tab: 'feed' | 'favorites' | 'ledger' | 'profile') => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onOpenOnboarding: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onSelectEntity,
  onQuickAdd,
  dossierCount,
  onOpenDossier,
  selectedNode,
  onOpenNodeModal,
  onOpenFilterModal,
  onOpenLedgerModal,
  onOpenOptOutModal,
  filters,
  onUpdateFilters,
  activeTab,
  onChangeTab,
  favoriteIds,
  onToggleFavorite,
  onOpenOnboarding,
}) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const PLATFORMS: SocialPlatform[] = [
    'All Platforms',
    'LinkedIn',
    'X / Twitter',
    'Instagram',
    'GitHub',
    'ResearchGate',
    'Web Citations',
  ];

  const featuredEntities = DISCOVERED_ENTITIES.filter((item) => item.isFeatured || item.confidenceScore >= 96.0);
  const currentFeatured = featuredEntities[featuredIndex] || featuredEntities[0];

  // Filter entities
  const filteredEntities = DISCOVERED_ENTITIES.filter((item) => {
    if (filters.platform !== 'All Platforms' && item.platform !== filters.platform) return false;
    if (
      filters.searchQuery &&
      !item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !item.handle.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !item.bio.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !item.tags.some((t) => t.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    ) {
      return false;
    }
    if (item.confidenceScore < filters.minConfidence) return false;
    if (filters.verifiedOnly && !item.verified) return false;

    return true;
  });

  return (
    <div className="relative w-full h-full min-h-[720px] max-h-[880px] rounded-[36px] overflow-hidden bg-[#0c0e11] text-white flex flex-col justify-between shadow-2xl border border-white/10 select-none">
      {/* Top Section Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-20 space-y-4 no-scrollbar">
        {/* Top Navigation Bar: Avatar, Enclave Node Pill, Notification Bell, Dossier Pill */}
        <div className="flex items-center justify-between pt-1">
          {/* User Avatar */}
          <button
            id="btn-analyst-profile"
            onClick={() => onChangeTab('profile')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="rchmwnn"
                className="h-9 w-9 rounded-full object-cover border border-white/20 group-hover:border-emerald-500 transition-colors"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0c0e11]" />
            </div>
          </button>

          {/* Node Selector Pill 📍 London Node (GDPR EEA) */}
          <button
            id="btn-enclave-node-selector"
            onClick={onOpenNodeModal}
            className="px-3 py-1.5 rounded-full bg-[#181b1f] hover:bg-[#20242a] border border-white/10 text-xs font-medium text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            <span className="font-semibold text-white truncate max-w-[130px]">{selectedNode.city} Node</span>
          </button>

          {/* Notification Bell & Dossier Quick Pill */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                id="btn-ledger-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-9 w-9 rounded-full bg-[#181b1f] hover:bg-[#20242a] border border-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
              </button>

              {/* Quick Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-11 w-64 bg-[#14171a] border border-white/15 rounded-2xl p-3 shadow-2xl z-30 space-y-2 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="font-bold text-white">Enclave Live Ledger</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
                      🔒 <strong>ZK Attestation:</strong> 68-pt landmark mesh verified with London Enclave.
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-stone-300">
                      🛡️ Exclusion bloom filter refreshed across 4 sovereign nodes.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dossier Icon */}
            <button
              id="btn-open-dossier"
              onClick={onOpenDossier}
              className="relative h-9 w-9 rounded-full bg-[#007A4D]/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 hover:bg-[#007A4D]/50 transition-colors cursor-pointer"
              title="Investigation Dossier"
            >
              <FileText className="h-4 w-4" />
              {dossierCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-md">
                  {dossierCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Personalized Header: Good Morning rchmwnn */}
        <div className="space-y-0.5 pt-1">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Good Morning <span className="text-white">rchmwnn</span>
          </h1>
          <p className="text-xs text-stone-400">1.4B Indexed Vectors • Zero Raw Image Storage</p>
        </div>

        {/* Search & Filter Row */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              id="input-find-entity"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Find By Facial Vector or Handle"
              className="w-full bg-[#181b1f] border border-white/10 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500/80 transition-colors font-sans shadow-inner"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onUpdateFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            id="btn-open-filter-modal"
            onClick={onOpenFilterModal}
            className="h-10 w-10 rounded-2xl bg-[#181b1f] hover:bg-[#20242a] border border-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Filter by similarity threshold & platforms"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>

        {/* Featured Hero Card: Recommended / High-Confidence Match */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              Recomended High-Confidence Match
            </span>
            <span className="text-[10px] font-mono text-emerald-400">99.4% Biometric Congruence</span>
          </div>

          {/* Featured Card */}
          <div
            onClick={() => onSelectEntity(currentFeatured)}
            className="relative bg-[#181b1f] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 transition-all cursor-pointer overflow-hidden shadow-lg group"
          >
            <div className="flex items-center gap-3.5">
              {/* Entity Thumbnail */}
              <div className="relative h-18 w-18 rounded-2xl overflow-hidden bg-stone-900 border border-emerald-500/30 shrink-0 shadow-md">
                <img
                  src={currentFeatured.imageUrl}
                  alt={currentFeatured.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                </div>
              </div>

              {/* Details & Similarity Score */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">{currentFeatured.name}</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {currentFeatured.platform}
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 truncate">{currentFeatured.role}</p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-stone-500 line-through text-[11px] font-mono">
                      {currentFeatured.baselineScore}% Base
                    </span>
                    <span className="text-white font-bold text-sm font-mono text-emerald-400">
                      {currentFeatured.confidenceScore}% Vector Match
                    </span>
                  </div>

                  <button
                    id="btn-inspect-featured-node"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEntity(currentFeatured);
                    }}
                    className="py-1 px-3 rounded-full bg-[#007A4D] hover:bg-[#008f5a] text-white text-[11px] font-semibold tracking-wide shadow-sm transition-all transform active:scale-95 cursor-pointer"
                  >
                    Inspect Node
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            {featuredEntities.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                className={`h-1 rounded-full transition-all cursor-pointer ${
                  featuredIndex === idx ? 'w-4 bg-emerald-500' : 'w-1 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Featured entity ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Category Selector (Network Platform Chips) */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {PLATFORMS.map((plat) => {
              const isActive = filters.platform === plat;
              return (
                <button
                  key={plat}
                  id={`plat-chip-${plat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onUpdateFilters({ ...filters, platform: plat })}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'bg-[#007A4D] text-white shadow-md font-semibold'
                      : 'bg-transparent text-stone-400 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Identity Profile Grid */}
        <div className="space-y-2 pt-1">
          {filteredEntities.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              No matching profiles found for "{filters.searchQuery}". Try adjusting your similarity filters!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredEntities.map((entity) => {
                const isFav = favoriteIds.includes(entity.id);
                return (
                  <div
                    key={entity.id}
                    id={`entity-card-${entity.id}`}
                    onClick={() => onSelectEntity(entity)}
                    className="bg-[#17191c] border border-white/5 hover:border-white/15 rounded-3xl p-3 space-y-2.5 transition-all flex flex-col justify-between cursor-pointer group shadow-md"
                  >
                    {/* Top Portrait Thumbnail */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-white/5">
                      <img
                        src={entity.imageUrl}
                        alt={entity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top-Right Favorite Heart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(entity.id);
                        }}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      </button>

                      {/* Bottom Platform Tag */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                        {entity.platform}
                      </div>
                    </div>

                    {/* Title & Role */}
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white text-xs tracking-tight truncate flex items-center gap-1">
                        <span>{entity.name}</span>
                        {entity.verified && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-stone-400 truncate">{entity.role}</p>
                    </div>

                    {/* Similarity Score & Green '+' Add to Dossier Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono font-bold text-emerald-400 text-xs tracking-tight">
                        {entity.confidenceScore}% Match
                      </span>

                      <button
                        id={`btn-quick-add-dossier-${entity.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(entity);
                        }}
                        className="h-7 w-7 rounded-lg bg-[#007A4D] hover:bg-[#008f5a] text-white flex items-center justify-center transition-all transform active:scale-90 cursor-pointer shadow-sm border border-emerald-500/20"
                        title="Add to investigation dossier"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar: Discovery Feed, Transparency Ledger, Opt-Out Portal, Profile */}
      <div className="absolute bottom-4 left-6 right-6 z-20">
        <div className="bg-[#121417]/95 backdrop-blur-md border border-white/15 rounded-full px-6 py-2.5 shadow-2xl flex items-center justify-around">
          <button
            id="tab-btn-feed"
            onClick={() => onChangeTab('feed')}
            className={`p-1.5 transition-colors cursor-pointer ${
              activeTab === 'feed' ? 'text-emerald-400' : 'text-stone-500 hover:text-stone-300'
            }`}
            title="Discovery Feed"
          >
            <Home className="h-5 w-5" />
          </button>

          <button
            id="tab-btn-favorites"
            onClick={() => onChangeTab('favorites')}
            className={`p-1.5 transition-colors cursor-pointer relative ${
              activeTab === 'favorites' ? 'text-emerald-400' : 'text-stone-500 hover:text-stone-300'
            }`}
            title="Bookmarked Entities"
          >
            <Bookmark className="h-5 w-5" />
            {favoriteIds.length > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            id="tab-btn-ledger"
            onClick={onOpenLedgerModal}
            className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
            title="Transparency Ledger"
          >
            <Database className="h-5 w-5" />
          </button>

          <button
            id="tab-btn-profile"
            onClick={() => onChangeTab('profile')}
            className={`p-1.5 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-emerald-400' : 'text-stone-500 hover:text-stone-300'
            }`}
            title="Analyst Profile & Session"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
