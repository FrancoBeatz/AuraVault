import React, { useState, useRef } from 'react';
import { ArrowRight, ShieldCheck, Upload, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { DISCOVERED_ENTITIES } from '../data/auraTraceData';
import { DiscoveredEntity } from '../types';

interface OnboardingScreenProps {
  onInitializeScan: (selectedPreset: DiscoveredEntity) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onInitializeScan }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [showLandmarkMesh, setShowLandmarkMesh] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPreset = DISCOVERED_ENTITIES[activePresetIndex] || DISCOVERED_ENTITIES[0];

  const slides = [
    {
      title: 'Discover Your Presence',
      subtitle: 'Zero-knowledge visual vector matching across public social ecosystems',
    },
    {
      title: 'Cryptographic Privacy',
      subtitle: 'Ephemeral RAM vectorization with irreversible AES-GCM-256 hashing',
    },
    {
      title: 'Sovereign Control',
      subtitle: 'Instant Right-to-be-Forgotten exclusion token generation under GDPR',
    },
  ];

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const customUrl = URL.createObjectURL(file);
      const customEntity: DiscoveredEntity = {
        ...currentPreset,
        id: `custom-${Date.now()}`,
        name: 'Uploaded Biometric Subject',
        imageUrl: customUrl,
        handle: '@subject_detected',
      };
      onInitializeScan(customEntity);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[720px] max-h-[880px] rounded-[36px] overflow-hidden bg-[#0a0c0b] text-white flex flex-col justify-between p-6 shadow-2xl border border-white/10 select-none">
      {/* Background with Dark Botanical/Cyber Foliage & Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080a09]/90 via-black/50 to-[#070908] z-0" />

      {/* Top Header Wordmark */}
      <div className="relative z-10 pt-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase drop-shadow-md font-sans">
          AURATRACE
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-emerald-400 mt-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Zero-Knowledge Discovery</span>
          <span>•</span>
          <span>London Enclave</span>
        </div>
      </div>

      {/* Hero Visual: Circular Platter with Facial Vector Mesh & Biometric Scanner */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-b from-stone-800/60 via-stone-900/90 to-black shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-stone-700/40 flex items-center justify-center overflow-hidden">
          {/* Wood / Obsidian Platter Texture Background */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-full opacity-60 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80')`,
            }}
          />

          {/* Central Portrait Container */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full p-1 bg-stone-900/90 shadow-2xl border border-emerald-500/40 flex items-center justify-center overflow-hidden">
            <img
              src={currentPreset.imageUrl}
              alt={currentPreset.name}
              className="w-full h-full object-cover rounded-full filter contrast-105"
            />

            {/* 68-Point Biometric Facial Landmark Mesh Overlay (MOROJIWO Emerald Glow) */}
            {showLandmarkMesh && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none p-4" viewBox="0 0 100 100">
                {/* Facial Boundary Contour */}
                <ellipse cx="50" cy="50" rx="36" ry="44" fill="none" stroke="#10B981" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.8" />
                
                {/* Eyebrow & Eyes Grid Points */}
                <circle cx="36" cy="38" r="1.5" fill="#34D399" />
                <circle cx="43" cy="37" r="1.2" fill="#34D399" />
                <circle cx="57" cy="37" r="1.2" fill="#34D399" />
                <circle cx="64" cy="38" r="1.5" fill="#34D399" />
                <line x1="36" y1="38" x2="43" y2="37" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />
                <line x1="57" y1="37" x2="64" y2="38" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />

                {/* Nose Bridge and Tip */}
                <circle cx="50" cy="45" r="1.2" fill="#34D399" />
                <circle cx="50" cy="54" r="1.5" fill="#34D399" />
                <circle cx="45" cy="56" r="1.2" fill="#34D399" />
                <circle cx="55" cy="56" r="1.2" fill="#34D399" />
                <line x1="50" y1="45" x2="50" y2="54" stroke="#10B981" strokeWidth="0.6" opacity="0.7" />

                {/* Mouth & Jaw Arc */}
                <circle cx="40" cy="67" r="1.2" fill="#34D399" />
                <circle cx="50" cy="66" r="1.5" fill="#34D399" />
                <circle cx="60" cy="67" r="1.2" fill="#34D399" />
                <circle cx="50" cy="72" r="1.2" fill="#34D399" />
                <path d="M 40 67 Q 50 74 60 67" fill="none" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />
                <path d="M 40 67 Q 50 64 60 67" fill="none" stroke="#10B981" strokeWidth="0.6" opacity="0.8" />

                {/* Outer Landmark Triangulations */}
                <line x1="36" y1="38" x2="50" y2="54" stroke="#10B981" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.5" />
                <line x1="64" y1="38" x2="50" y2="54" stroke="#10B981" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.5" />
                <line x1="50" y1="54" x2="50" y2="66" stroke="#10B981" strokeWidth="0.4" strokeDasharray="1,1" opacity="0.6" />
              </svg>
            )}

            {/* Rotating Radar Vector Scanning Sweep */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-spin duration-3000 pointer-events-none" style={{ animationDuration: '6s' }} />

            {/* Mesh Visibility Toggle Button */}
            <button
              onClick={() => setShowLandmarkMesh(!showLandmarkMesh)}
              className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Biometric Landmark Mesh"
            >
              {showLandmarkMesh ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Subtle Ambient Steaming Emerald Glow */}
          <div className="absolute inset-0 bg-radial from-emerald-500/15 to-transparent pointer-events-none" />
        </div>

        {/* Quick Preset Subject Chips */}
        <div className="flex items-center gap-1.5 mt-3">
          {DISCOVERED_ENTITIES.slice(0, 4).map((ent, idx) => (
            <button
              key={ent.id}
              onClick={() => setActivePresetIndex(idx)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-emerald-800 text-white font-bold border border-emerald-400'
                  : 'bg-black/50 text-stone-400 hover:text-white border border-white/10'
              }`}
            >
              {ent.name.split(' ')[0]}
            </button>
          ))}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 cursor-pointer text-[10px]"
            title="Upload custom query image"
          >
            <Upload className="h-3 w-3 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* Bottom Content & Interactive CTA */}
      <div className="relative z-10 pb-4 space-y-4 text-center">
        <div className="space-y-1 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {slides[activeSlide].title}
          </h2>
          <p className="text-xs text-stone-300 font-normal leading-relaxed max-w-xs mx-auto">
            {slides[activeSlide].subtitle}
          </p>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 py-0.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Forest Green Pill Button "Initialize Scan" */}
        <button
          id="btn-onboarding-initialize-scan"
          onClick={() => onInitializeScan(currentPreset)}
          className="w-full py-3.5 px-6 rounded-full bg-[#007A4D] hover:bg-[#008f5a] text-white font-semibold text-base tracking-wide shadow-[0_8px_20px_rgba(0,122,77,0.35)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30 font-sans"
        >
          <span>Initialize Scan</span>
          <ArrowRight className="h-4 w-4 text-emerald-200" />
        </button>
      </div>
    </div>
  );
};
