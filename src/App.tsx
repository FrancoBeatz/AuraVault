import React, { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MenuScreen } from './components/MenuScreen';
import { DeepNodeInspectorModal } from './components/DeepNodeInspectorModal';
import { InvestigationDossierDrawer } from './components/InvestigationDossierDrawer';
import { OptOutModal } from './components/OptOutModal';
import { TransparencyLedgerModal } from './components/TransparencyLedgerModal';
import { FilterModal } from './components/FilterModal';
import { EnclaveNodeModal } from './components/EnclaveNodeModal';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import {
  DiscoveredEntity,
  InvestigationDossierItem,
  EnclaveNode,
  FilterState,
  AuditLogEntry,
} from './types';
import { DISCOVERED_ENTITIES, ENCLAVE_NODES, INITIAL_AUDIT_LOGS } from './data/auraTraceData';
import { ShieldCheck, Smartphone, Layers, FileText, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'showcase' | 'interactive'>('showcase');
  const [activeScreen, setActiveScreen] = useState<'onboarding' | 'feed'>('onboarding');
  const [activeTab, setActiveTab] = useState<'feed' | 'favorites' | 'ledger' | 'profile'>('feed');

  // Selected Entity for Inspector Modal
  const [selectedEntity, setSelectedEntity] = useState<DiscoveredEntity | null>(null);

  // Investigation Dossier Items
  const [dossierItems, setDossierItems] = useState<InvestigationDossierItem[]>([
    {
      id: 'dossier-elena-init',
      entity: DISCOVERED_ENTITIES[0],
      addedAt: '10:42 AM',
      notes: 'High-confidence facial match on Oxford Internet Institute database.',
      priority: 'High Review',
    },
  ]);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Sovereign Enclave Node State
  const [selectedNode, setSelectedNode] = useState<EnclaveNode>(ENCLAVE_NODES[0]);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);

  // Discovery Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    platform: 'All Platforms',
    minConfidence: 75,
    regionEnclave: 'All',
    verifiedOnly: false,
    exposureFilter: 'All',
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Transparency Audit Ledger
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  // Opt-Out Right to be Forgotten Modal
  const [isOptOutModalOpen, setIsOptOutModalOpen] = useState(false);

  // Bookmarked Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['ent-elena-rostova', 'ent-maya-lin']);

  // Handlers
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddToDossier = (entity: DiscoveredEntity) => {
    if (dossierItems.some((it) => it.entity.id === entity.id)) {
      setIsDossierOpen(true);
      return;
    }

    const newItem: InvestigationDossierItem = {
      id: `dossier-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entity,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: 'Added from live biometric discovery feed.',
      priority: 'High Review',
    };

    setDossierItems((prev) => [newItem, ...prev]);

    // Append to Transparency Audit Log
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      action: 'Dossier Export',
      targetHash: entity.pHash,
      zeroKnowledgeProof: `ZK-SNARK:0x${Math.random().toString(16).substring(2, 10)}`,
      nodeRouted: selectedNode.name,
      status: 'Committed',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setIsDossierOpen(true);
  };

  const handleRemoveDossierItem = (id: string) => {
    setDossierItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleInitializeScanFromOnboarding = (preset: DiscoveredEntity) => {
    setSelectedEntity(preset);
    setActiveScreen('feed');
    if (viewMode === 'interactive') {
      setActiveScreen('feed');
    }
  };

  const favoriteEntities = DISCOVERED_ENTITIES.filter((item) => favoriteIds.includes(item.id));

  return (
    <div className="min-h-screen bg-[#141619] text-stone-100 flex flex-col font-sans selection:bg-[#007A4D] selection:text-white">
      {/* Top Bar for Mode Switching & Branding */}
      <header className="bg-[#0e1012] border-b border-white/10 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#007A4D] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white uppercase">AURATRACE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  MOROJIWO MOBILE SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Zero-Knowledge Visual Identity & Public Presence Discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#181b1f] p-1 rounded-full border border-white/10 text-xs">
              <button
                id="btn-mode-showcase"
                onClick={() => setViewMode('showcase')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'showcase'
                    ? 'bg-[#007A4D] text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Design Showcase (Dual Screen)</span>
              </button>

              <button
                id="btn-mode-interactive"
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-[#007A4D] text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Single Mobile Simulator</span>
              </button>
            </div>

            {/* Quick Dossier Pill */}
            <button
              id="btn-top-dossier"
              onClick={() => setIsDossierOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dossier ({dossierItems.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Showcase / Simulator Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Ambient Emerald Circular Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#1b221e] blur-3xl opacity-30 pointer-events-none -z-10" />

        {viewMode === 'showcase' ? (
          /* Dual Screen Showcase View (Matching MOROJIWO Design Poster Style) */
          <div className="w-full max-w-5xl flex flex-col items-center space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                AURATRACE • MOROJIWO DESIGN ARCHITECTURE
              </span>
              <p className="text-xs text-stone-400">
                Zero-knowledge biometric landmark mesh, deep dark obsidian canvas, and 1-tap identity intelligence inspection
              </p>
            </div>

            {/* Dual Device Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl justify-items-center">
              {/* Screen 1: Ingestion & Biometric Landmark Mesh Screen */}
              <div className="w-full max-w-[360px] transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-center pb-2 text-xs font-mono text-stone-400 font-semibold">
                  SCREEN 1: BIOMETRIC ONBOARDING & SCANNER
                </div>
                <OnboardingScreen
                  onInitializeScan={(preset) => {
                    setViewMode('interactive');
                    setActiveScreen('feed');
                    setSelectedEntity(preset);
                  }}
                />
              </div>

              {/* Screen 2: Discovery Feed & Identity Intelligence Screen */}
              <div className="w-full max-w-[360px] transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-center pb-2 text-xs font-mono text-emerald-400 font-semibold">
                  SCREEN 2: IDENTITY DISCOVERY FEED
                </div>
                <MenuScreen
                  onSelectEntity={(entity) => setSelectedEntity(entity)}
                  onQuickAdd={handleAddToDossier}
                  dossierCount={dossierItems.length}
                  onOpenDossier={() => setIsDossierOpen(true)}
                  selectedNode={selectedNode}
                  onOpenNodeModal={() => setIsNodeModalOpen(true)}
                  onOpenFilterModal={() => setIsFilterModalOpen(true)}
                  onOpenLedgerModal={() => setIsLedgerModalOpen(true)}
                  onOpenOptOutModal={() => setIsOptOutModalOpen(true)}
                  filters={filters}
                  onUpdateFilters={setFilters}
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenOnboarding={() => setActiveScreen('onboarding')}
                />
              </div>
            </div>

            {/* Signature Tag matching the design asset */}
            <div className="text-center pt-2">
              <span className="text-sm font-bold text-stone-400 tracking-wider">@rchmwnn</span>
            </div>
          </div>
        ) : (
          /* Single Interactive Mobile Simulator */
          <div className="w-full max-w-[380px] flex flex-col items-center space-y-3">
            <div className="flex items-center justify-between w-full px-2 text-xs font-mono text-stone-400">
              <button
                onClick={() => setActiveScreen(activeScreen === 'onboarding' ? 'feed' : 'onboarding')}
                className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Switch to {activeScreen === 'onboarding' ? 'Discovery Feed' : 'Scanner'}</span>
              </button>
              <span className="text-emerald-400">iPhone 16 Pro View</span>
            </div>

            <div className="w-full shadow-2xl rounded-[38px] p-1 bg-gradient-to-b from-stone-700/40 via-stone-800/20 to-black">
              {activeScreen === 'onboarding' ? (
                <OnboardingScreen onInitializeScan={handleInitializeScanFromOnboarding} />
              ) : activeTab === 'favorites' ? (
                <div className="relative w-full h-full min-h-[720px] max-h-[880px] rounded-[36px] overflow-hidden bg-[#0c0e11] text-white flex flex-col justify-between shadow-2xl border border-white/10 p-5">
                  <FavoritesView
                    favoriteEntities={favoriteEntities}
                    onSelectEntity={(entity) => setSelectedEntity(entity)}
                    onQuickAdd={handleAddToDossier}
                  />

                  {/* Docked Nav Bar */}
                  <div className="pt-4">
                    <div className="bg-[#121417]/95 backdrop-blur-md border border-white/15 rounded-full px-6 py-2.5 shadow-2xl flex items-center justify-around">
                      <button onClick={() => setActiveTab('feed')} className="p-1.5 text-stone-500 hover:text-stone-300">
                        <Smartphone className="h-5 w-5" />
                      </button>
                      <button onClick={() => setActiveTab('favorites')} className="p-1.5 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                      </button>
                      <button onClick={() => setActiveTab('profile')} className="p-1.5 text-stone-500 hover:text-stone-300">
                        <Lock className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'profile' ? (
                <div className="relative w-full h-full min-h-[720px] max-h-[880px] rounded-[36px] overflow-hidden bg-[#0c0e11] text-white flex flex-col justify-between shadow-2xl border border-white/10 p-5">
                  <ProfileView
                    selectedNode={selectedNode}
                    onOpenLedger={() => setIsLedgerModalOpen(true)}
                    onOpenOptOut={() => setIsOptOutModalOpen(true)}
                    onOpenNodeModal={() => setIsNodeModalOpen(true)}
                  />

                  {/* Docked Nav Bar */}
                  <div className="pt-4">
                    <div className="bg-[#121417]/95 backdrop-blur-md border border-white/15 rounded-full px-6 py-2.5 shadow-2xl flex items-center justify-around">
                      <button onClick={() => setActiveTab('feed')} className="p-1.5 text-stone-500 hover:text-stone-300">
                        <Smartphone className="h-5 w-5" />
                      </button>
                      <button onClick={() => setActiveTab('favorites')} className="p-1.5 text-stone-500 hover:text-stone-300">
                        <ShieldCheck className="h-5 w-5" />
                      </button>
                      <button onClick={() => setActiveTab('profile')} className="p-1.5 text-emerald-400">
                        <Lock className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <MenuScreen
                  onSelectEntity={(entity) => setSelectedEntity(entity)}
                  onQuickAdd={handleAddToDossier}
                  dossierCount={dossierItems.length}
                  onOpenDossier={() => setIsDossierOpen(true)}
                  selectedNode={selectedNode}
                  onOpenNodeModal={() => setIsNodeModalOpen(true)}
                  onOpenFilterModal={() => setIsFilterModalOpen(true)}
                  onOpenLedgerModal={() => setIsLedgerModalOpen(true)}
                  onOpenOptOutModal={() => setIsOptOutModalOpen(true)}
                  filters={filters}
                  onUpdateFilters={setFilters}
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenOnboarding={() => setActiveScreen('onboarding')}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Deep Node Inspector Modal */}
      <DeepNodeInspectorModal
        entity={selectedEntity}
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onAddToDossier={handleAddToDossier}
        isInDossier={selectedEntity ? dossierItems.some((it) => it.entity.id === selectedEntity.id) : false}
        isFavorite={selectedEntity ? favoriteIds.includes(selectedEntity.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Investigation Dossier Drawer */}
      <InvestigationDossierDrawer
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        items={dossierItems}
        onRemoveItem={handleRemoveDossierItem}
        onClearDossier={() => setDossierItems([])}
        selectedNode={selectedNode}
      />

      {/* Opt-Out Right to be Forgotten Modal */}
      <OptOutModal
        isOpen={isOptOutModalOpen}
        onClose={() => setIsOptOutModalOpen(false)}
      />

      {/* Cryptographic Transparency Ledger Modal */}
      <TransparencyLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        logs={auditLogs}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
      />

      {/* Sovereign Enclave Node Modal */}
      <EnclaveNodeModal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
      />
    </div>
  );
}
