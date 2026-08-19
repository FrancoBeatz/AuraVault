import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Database, Network, CheckCircle2 } from 'lucide-react';
import { ScanStage } from '../types';

interface ScanProgressProps {
  stage: ScanStage;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({ stage }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (stage.step === 'vectorizing') {
      setLogs([
        '⚡ [0.04s] Extracted 68-point biometric landmark matrix',
        '🔒 [0.08s] Encrypted in-memory 512-D float array via AES-GCM-256',
        '🔑 [0.12s] Generated perceptual hash: pHash 0x811C9DC5',
      ]);
    } else if (stage.step === 'querying') {
      setLogs((prev) => [
        ...prev,
        '🌐 [0.24s] Dispatched zero-knowledge query to EU-FRA-01 & US-VA-04 clusters',
        '📊 [0.31s] Scanning 1,420,000,000 indexed vector embeddings with cosine metric',
      ]);
    } else if (stage.step === 'synthesizing') {
      setLogs((prev) => [
        ...prev,
        '🔗 [0.42s] Resolved cross-network public social graphs (LinkedIn, X, GitHub)',
        '📑 [0.49s] Generating immutable SHA-256 audit transaction receipt',
      ]);
    } else if (stage.step === 'completed') {
      setLogs((prev) => [
        ...prev,
        '✅ [0.55s] Discovery scan completed. Results ready with cryptographic proof.',
      ]);
    }
  }, [stage.step]);

  const STAGES = [
    { key: 'vectorizing', label: '1. Vectorizing & Biometrics', icon: Cpu },
    { key: 'querying', label: '2. Distributed Index Query', icon: Database },
    { key: 'synthesizing', label: '3. Public Graph Synthesis', icon: Network },
    { key: 'completed', label: '4. Cryptographic Receipt', icon: ShieldCheck },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-blue-900/60 p-5 shadow-lg space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></div>
          <h3 className="text-sm font-semibold text-white">Active Discovery Pipeline</h3>
        </div>
        <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
          Elapsed: {stage.elapsedMs}ms
        </span>
      </div>

      {/* Stage Steps Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STAGES.map((s, idx) => {
          const isDone =
            (stage.step === 'completed' && idx <= 3) ||
            (stage.step === 'synthesizing' && idx <= 1) ||
            (stage.step === 'querying' && idx <= 0);
          const isCurrent = stage.step === s.key;

          const IconComponent = s.icon;

          return (
            <div
              key={s.key}
              className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                isDone
                  ? 'border-emerald-800/80 bg-emerald-950/40 text-emerald-300'
                  : isCurrent
                  ? 'border-blue-500 bg-blue-950/70 text-blue-200 ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-950/40 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <IconComponent className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`} />
              )}
              <span className="truncate text-[11px]">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{stage.detail}</span>
          <span className="text-blue-400 font-bold">{stage.progress}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${stage.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Live Pipeline Terminal Output */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1 max-h-32 overflow-y-auto">
        {logs.map((log, idx) => (
          <div key={idx} className="leading-relaxed">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
