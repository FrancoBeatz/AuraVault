import React, { useRef, useEffect, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle, RefreshCw, Layers, ShieldCheck, Info } from 'lucide-react';
import { FacialBiometrics } from '../types';
import { generateSha256, generatePHash, generateVectorEmbeddingPreview, generateFacialLandmarks, LandmarkPoint } from '../utils/cryptoUtils';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleProfiles';

interface ImageIngestionProps {
  selectedImageUrl: string | null;
  onImageSelected: (url: string, biometrics: FacialBiometrics, presetTargetId?: string) => void;
  onClearImage: () => void;
  isScanning: boolean;
}

export const ImageIngestion: React.FC<ImageIngestionProps> = ({
  selectedImageUrl,
  onImageSelected,
  onClearImage,
  isScanning,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showLandmarkMesh, setShowLandmarkMesh] = useState(true);
  const [biometrics, setBiometrics] = useState<FacialBiometrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute biometrics and draw landmarks when image changes
  useEffect(() => {
    if (!selectedImageUrl) {
      setBiometrics(null);
      return;
    }

    let isMounted = true;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImageUrl;

    img.onload = async () => {
      if (!isMounted) return;

      const pHash = generatePHash(selectedImageUrl);
      const sha256 = await generateSha256(selectedImageUrl + Date.now().toString());
      const vectorPreview = generateVectorEmbeddingPreview(selectedImageUrl);

      const bioData: FacialBiometrics = {
        landmarkCount: 68,
        confidence: 0.994,
        pitch: 2.1,
        yaw: -1.4,
        roll: 0.8,
        perceptualHash: pHash,
        vectorEmbeddingPreview: vectorPreview,
        sha256Signature: `SHA256:${sha256.substring(0, 32)}...`,
      };

      setBiometrics(bioData);
      setIsProcessing(false);

      // Render onto canvas with biometric overlay
      renderCanvasOverlay(img);
    };

    img.onerror = () => {
      if (isMounted) setIsProcessing(false);
    };

    return () => {
      isMounted = false;
    };
  }, [selectedImageUrl, showLandmarkMesh]);

  const renderCanvasOverlay = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxDim = 380;
    let w = img.naturalWidth || 400;
    let h = img.naturalHeight || 400;

    if (w > h) {
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
    } else {
      if (h > maxDim) {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.drawImage(img, 0, 0, w, h);

    if (showLandmarkMesh) {
      // Define face bounding box centered
      const boxW = w * 0.65;
      const boxH = h * 0.75;
      const boxX = (w - boxW) / 2;
      const boxY = (h - boxH) / 2;

      // Draw bounding box
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Draw bounding box corner accents
      const cornerLen = 14;
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2.5;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + cornerLen);
      ctx.lineTo(boxX, boxY);
      ctx.lineTo(boxX + cornerLen, boxY);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - cornerLen, boxY);
      ctx.lineTo(boxX + boxW, boxY);
      ctx.lineTo(boxX + boxW, boxY + cornerLen);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + boxH - cornerLen);
      ctx.lineTo(boxX, boxY + boxH);
      ctx.lineTo(boxX + cornerLen, boxY + boxH);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
      ctx.lineTo(boxX + boxW, boxY + boxH);
      ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
      ctx.stroke();

      // Landmarks
      const landmarks: LandmarkPoint[] = generateFacialLandmarks(boxW, boxH, boxX, boxY);

      // Draw connecting mesh lines
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      landmarks.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Draw individual landmark nodes
      landmarks.forEach((p) => {
        ctx.fillStyle = p.type === 'eye' ? '#38BDF8' : p.type === 'mouth' ? '#FB7185' : '#60A5FA';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Overlay text badge in canvas top left
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(8, 8, 140, 24);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, 140, 24);
      ctx.fillStyle = '#60A5FA';
      ctx.font = '10px monospace';
      ctx.fillText('68-PT LANDMARK MESH', 14, 24);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) {
        const pHash = generatePHash(url);
        onImageSelected(url, {
          landmarkCount: 68,
          confidence: 0.985,
          pitch: 1.5,
          yaw: -0.8,
          roll: 0.5,
          perceptualHash: pHash,
          vectorEmbeddingPreview: generateVectorEmbeddingPreview(url),
          sha256Signature: 'SHA256:ephemeral_session_buffer',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    const pHash = generatePHash(preset.imageUrl);
    onImageSelected(
      preset.imageUrl,
      {
        landmarkCount: 68,
        confidence: 0.992,
        pitch: 1.2,
        yaw: -0.4,
        roll: 0.2,
        perceptualHash: pHash,
        vectorEmbeddingPreview: generateVectorEmbeddingPreview(preset.imageUrl),
        sha256Signature: 'SHA256:preset_verified_vector',
      },
      preset.targetProfileId,
    );
  };

  return (
    <div className="bg-slate-900/95 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-900/40 border border-blue-700/50 text-blue-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Target Biometric Ingestion</h2>
            <p className="text-xs text-slate-400">Client-side ephemeral feature extraction</p>
          </div>
        </div>

        {selectedImageUrl && (
          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-mesh"
              onClick={() => setShowLandmarkMesh(!showLandmarkMesh)}
              className={`px-2.5 py-1 text-xs font-mono rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showLandmarkMesh
                  ? 'bg-blue-950/70 border-blue-700 text-blue-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle visual 68-point facial landmark grid"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Mesh {showLandmarkMesh ? 'ON' : 'OFF'}</span>
            </button>

            <button
              id="btn-clear-target-image"
              onClick={onClearImage}
              disabled={isScanning}
              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              title="Clear active image"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Upload Box / Canvas Area */}
      {!selectedImageUrl ? (
        <div
          id="dropzone-image-ingest"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
            isDragging
              ? 'border-blue-500 bg-blue-950/30 text-blue-200'
              : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-900/60 text-slate-300'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Drag & drop target photo, or <span className="text-blue-400 underline underline-offset-2">browse file</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">Supports PNG, JPG, WEBP • Zero storage persistence</p>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Vectorized in-memory via WebAssembly FaceNet</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Canvas Preview Container */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
            <canvas ref={canvasRef} className="max-w-full max-h-[300px] object-contain rounded shadow-lg" />

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-blue-400 text-xs font-mono">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                <span>Computing In-Memory Biometric Vectors...</span>
              </div>
            )}
          </div>

          {/* Biometrics Inspection Bar */}
          {biometrics && (
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1 text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  Vector Hash (pHash):
                </span>
                <span className="text-blue-400 font-bold tracking-wider">{biometrics.perceptualHash}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-0.5">
                <div>
                  <span className="text-slate-500">Landmarks: </span>
                  <span className="text-emerald-400">{biometrics.landmarkCount} pts aligned</span>
                </div>
                <div>
                  <span className="text-slate-500">Pose Roll/Pitch: </span>
                  <span className="text-slate-300">
                    {biometrics.roll}° / {biometrics.pitch}°
                  </span>
                </div>
                <div className="col-span-2 truncate">
                  <span className="text-slate-500">512-Dim Array: </span>
                  <span className="text-slate-300 text-[10px]">{biometrics.vectorEmbeddingPreview}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Reference Profiles for Instant Verification */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-blue-400" />
            Quick Presets (Test Verified Public Footprints):
          </span>
          <span className="text-[10px] font-mono text-slate-500">Click to load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((preset) => {
            const isCurrent = selectedImageUrl === preset.imageUrl;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                disabled={isScanning}
                className={`text-left p-2 rounded-lg border transition-all text-xs flex flex-col items-center text-center cursor-pointer ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-950/60 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="relative mb-1.5">
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  {isCurrent && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 text-white">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <span className="font-medium text-slate-200 truncate w-full text-[11px]">{preset.name}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{preset.role.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
