import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageIngestion } from './components/ImageIngestion';
import { SearchParameters } from './components/SearchParameters';
import { ScanProgress } from './components/ScanProgress';
import { ResultsFeed } from './components/ResultsFeed';
import { EntityDetailModal } from './components/EntityDetailModal';
import { OptOutModal } from './components/OptOutModal';
import { TransparencyLedgerModal } from './components/TransparencyLedgerModal';
import { AuditReportModal } from './components/AuditReportModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import {
  FacialBiometrics,
  PublicProfileResult,
  SearchFilterState,
  ScanStage,
  TransparencyLogEntry,
} from './types';
import { MOCK_DATABASE_PROFILES, INITIAL_TRANSPARENCY_LOGS } from './data/sampleProfiles';
import { generateSha256 } from './utils/cryptoUtils';

export default function App() {
  // Image & Biometrics state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [biometrics, setBiometrics] = useState<FacialBiometrics | null>(null);
  const [presetTargetId, setPresetTargetId] = useState<string | null>(null);

  // Search Filters & Compliance State
  const [filters, setFilters] = useState<SearchFilterState>({
    targetPlatforms: {
      linkedin: true,
      twitter: true,
      instagram: true,
      facebook: true,
      github: true,
      youtube: false,
      tiktok: false,
      researchgate: true,
      web: true,
    },
    similarityThreshold: 85,
    maxResults: 12,
    regionFilter: 'global',
    includeAcademicAndNews: true,
    requireHighConfidenceOnly: false,
    legalPurpose: 'self_audit',
    consentAgreed: true,
  });

  // Discovery Execution State
  const [scanStage, setScanStage] = useState<ScanStage>({
    step: 'idle',
    progress: 0,
    detail: 'Awaiting input...',
    elapsedMs: 0,
  });
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<PublicProfileResult[]>([]);
  const [scanDurationMs, setScanDurationMs] = useState(0);

  // Modals & Inspection State
  const [selectedProfileForModal, setSelectedProfileForModal] = useState<PublicProfileResult | null>(null);
  const [isOptOutOpen, setIsOptOutOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);

  // Transparency Ledger
  const [transparencyLogs, setTransparencyLogs] = useState<TransparencyLogEntry[]>(INITIAL_TRANSPARENCY_LOGS);

  // Image Selection Handler
  const handleImageSelected = (url: string, bioData: FacialBiometrics, targetId?: string) => {
    setSelectedImageUrl(url);
    setBiometrics(bioData);
    setPresetTargetId(targetId || null);
  };

  const handleClearImage = () => {
    setSelectedImageUrl(null);
    setBiometrics(null);
    setPresetTargetId(null);
    setHasScanned(false);
    setResults([]);
    setScanStage({ step: 'idle', progress: 0, detail: 'Awaiting input...', elapsedMs: 0 });
  };

  // Execute Cryptographic Discovery Scan
  const handleExecuteScan = async () => {
    if (!selectedImageUrl || !filters.consentAgreed) return;

    setHasScanned(false);
    const startTime = performance.now();

    // Stage 1: Vectorizing
    setScanStage({
      step: 'vectorizing',
      progress: 25,
      detail: 'Extracting 68-point landmarks & generating 512-dim embedding...',
      elapsedMs: 80,
    });

    await new Promise((r) => setTimeout(r, 450));

    // Stage 2: Querying Distributed Vector Index
    setScanStage({
      step: 'querying',
      progress: 60,
      detail: `Querying distributed cluster nodes with threshold ${filters.similarityThreshold}%...`,
      elapsedMs: 240,
    });

    await new Promise((r) => setTimeout(r, 550));

    // Stage 3: Synthesizing Graph Evidence
    setScanStage({
      step: 'synthesizing',
      progress: 88,
      detail: 'Resolving connected public profile handles & generating audit proof...',
      elapsedMs: 420,
    });

    await new Promise((r) => setTimeout(r, 400));

    // Finish
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    setScanDurationMs(duration);

    // Compute matched results
    let matched: PublicProfileResult[] = [];
    if (presetTargetId) {
      // If a preset was picked, ensure the primary match is first with top score
      const exactMatch = MOCK_DATABASE_PROFILES.find((p) => p.id === presetTargetId);
      const others = MOCK_DATABASE_PROFILES.filter((p) => p.id !== presetTargetId);
      matched = exactMatch ? [exactMatch, ...others] : MOCK_DATABASE_PROFILES;
    } else {
      matched = MOCK_DATABASE_PROFILES;
    }

    // Filter by similarity threshold
    const filteredMatches = matched.filter((p) => p.confidenceScore >= filters.similarityThreshold - 10);

    setResults(filteredMatches);
    setHasScanned(true);

    setScanStage({
      step: 'completed',
      progress: 100,
      detail: `Synthesized ${filteredMatches.length} verified public identity candidates.`,
      elapsedMs: duration,
    });

    // Add immutable entry to Transparency Ledger
    const verificationHash = await generateSha256(`QUERY:${Date.now()}:${biometrics?.perceptualHash}`);
    const newLog: TransparencyLogEntry = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}-Q`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action: 'QUERY_EXECUTION',
      operatorHash: '0x4E992A...B01F (Client Memory Node)',
      verificationHash: `SHA256: ${verificationHash}`,
      status: 'IMMUTABLE',
      nodeCluster: filters.regionFilter === 'europe' ? 'EU-FRA-01' : 'GLOBAL-RING-03',
    };

    setTransparencyLogs((prev) => [newLog, ...prev]);
  };

  // Register Opt-Out Exclusion
  const handleRegisteredOptOut = (name: string, email: string, hash: string, reason: string) => {
    const optLog: TransparencyLogEntry = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}-OPT`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action: 'OPT_OUT_REQUEST',
      operatorHash: '0x992B1C...3384 (GDPR Cryptographic Enforcement)',
      verificationHash: `SHA256: ${hash}`,
      status: 'VERIFIED',
      nodeCluster: 'GLOBAL-EXCLUSION-RING',
    };
    setTransparencyLogs((prev) => [optLog, ...prev]);
  };

  // Flag Profile for Takedown/Dispute
  const handleFlagProfile = (profileId: string) => {
    const flagLog: TransparencyLogEntry = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}-TAKEDOWN`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action: 'TAKEDOWN_PROCESSED',
      operatorHash: '0x10BC84...99FA (Trust & Safety Review)',
      verificationHash: `SHA256: dispute_ticket_${profileId}`,
      status: 'VERIFIED',
      nodeCluster: 'GLOBAL-EXCLUSION-RING',
    };
    setTransparencyLogs((prev) => [flagLog, ...prev]);
  };

  const isScanning = scanStage.step !== 'idle' && scanStage.step !== 'completed' && scanStage.step !== 'error';
  const canExecute = !!selectedImageUrl && filters.consentAgreed;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenOptOut={() => setIsOptOutOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAuditLogs={() => setIsAuditReportOpen(true)}
      />

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Ingestion & Search Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <ImageIngestion
              selectedImageUrl={selectedImageUrl}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              isScanning={isScanning}
            />

            <SearchParameters
              filters={filters}
              onFilterChange={setFilters}
              onExecuteScan={handleExecuteScan}
              isScanning={isScanning}
              canExecute={canExecute}
            />
          </div>

          {/* Right Column: Execution Progress & Results Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {isScanning && <ScanProgress stage={scanStage} />}

            <ResultsFeed
              results={results}
              hasScanned={hasScanned}
              onSelectProfile={(profile) => setSelectedProfileForModal(profile)}
              onExportAuditReport={() => setIsAuditReportOpen(true)}
              scanDurationMs={scanDurationMs}
              perceptualHash={biometrics?.perceptualHash || '0x811C9DC5'}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-slate-300 font-semibold">AuraTrace Platform</span> • ISO/IEC 27701 & RFC-9162 Zero-Knowledge Footprint Engine
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-blue-400 underline cursor-pointer"
            >
              Security Protocol
            </button>
            <button
              onClick={() => setIsOptOutOpen(true)}
              className="hover:text-amber-400 underline cursor-pointer"
            >
              Opt-Out Registry
            </button>
            <button
              onClick={() => setIsLedgerOpen(true)}
              className="hover:text-emerald-400 underline cursor-pointer"
            >
              Consensus Ledger
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <EntityDetailModal
        profile={selectedProfileForModal}
        queryImageUrl={selectedImageUrl}
        onClose={() => setSelectedProfileForModal(null)}
        onFlagProfile={handleFlagProfile}
      />

      <OptOutModal
        isOpen={isOptOutOpen}
        onClose={() => setIsOptOutOpen(false)}
        onRegisteredOptOut={handleRegisteredOptOut}
      />

      <TransparencyLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        logs={transparencyLogs}
      />

      <AuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        results={results}
        filters={filters}
        perceptualHash={biometrics?.perceptualHash || '0x811C9DC5'}
        scanDurationMs={scanDurationMs}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
