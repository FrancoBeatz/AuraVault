import React, { useState, useRef } from 'react';
import { X, EyeOff, ShieldCheck, CheckCircle2, UploadCloud, FileCheck, ArrowRight, Lock } from 'lucide-react';
import { generateSha256, generatePHash } from '../utils/cryptoUtils';

interface OptOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredOptOut: (name: string, email: string, hash: string, reason: string) => void;
}

export const OptOutModal: React.FC<OptOutModalProps> = ({ isOpen, onClose, onRegisteredOptOut }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('personal_privacy');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    const pHash = uploadedImage ? generatePHash(uploadedImage) : generatePHash(name + email);
    const sha = await generateSha256(`${name}:${email}:${pHash}:${Date.now()}`);
    const token = `EXCL-GDPR-2026-${sha.substring(0, 8).toUpperCase()}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessToken(token);
      onRegisteredOptOut(name, email, pHash, reason);
    }, 600);
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setUploadedImage(null);
    setSuccessToken(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl space-y-0 text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-400">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Right-to-be-Forgotten & Opt-Out Portal</h3>
              <p className="text-xs text-slate-400">
                Permanently purge and exclude your visual biometric signature from public indexing
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {successToken ? (
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Biometric Exclusion Enforced</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your facial vector signature has been registered into the global zero-knowledge exclusion bloom filter. All
                  future reverse-lookups will be permanently blocked at the cryptographic routing layer.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-left space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>EXCLUSION RECEIPT ID:</span>
                  <span className="text-emerald-400 font-bold">{successToken}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>LEGAL BASIS:</span>
                  <span className="text-slate-200">GDPR Art. 17 / CCPA Section 1798.105</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IMMUTABILITY PROOF:</span>
                  <span className="text-blue-400">SHA256: Signed by Consensus Ring</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg text-xs text-slate-300 flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Under ISO/IEC 27701 and international privacy regulations, any individual may submit a photo or facial
                  signature to be permanently excluded from AuraTrace search results. This process creates an immutable
                  cryptographic block without storing your raw image.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label htmlFor="optout-name" className="block text-slate-300 font-medium mb-1">
                    Full Legal Name:
                  </label>
                  <input
                    id="optout-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="optout-email" className="block text-slate-300 font-medium mb-1">
                    Verification Email:
                  </label>
                  <input
                    id="optout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. elena@research.org"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="optout-reason" className="block text-slate-300 text-xs font-medium mb-1">
                  Reason for Exclusion:
                </label>
                <select
                  id="optout-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
                >
                  <option value="personal_privacy">Personal Privacy & Digital Footprint Minimization</option>
                  <option value="impersonation_protection">Protection Against Malicious Impersonation / Deepfakes</option>
                  <option value="regulatory_gdpr_ccpa">Formal GDPR / CCPA Deletion Right</option>
                  <option value="minor_protection">Protection of Minor / Family Member</option>
                </select>
              </div>

              {/* Optional Reference Image to generate exact vector blacklist */}
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1">
                  Facial Reference Photo (Client-Side Vectorized & Immediately Discarded):
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-700 hover:border-slate-600 rounded-lg p-4 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 flex items-center justify-center gap-3 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadedImage ? (
                    <div className="flex items-center gap-3">
                      <img src={uploadedImage} alt="Uploaded preview" className="h-10 w-10 rounded object-cover border border-slate-700" />
                      <div className="text-left text-xs font-mono">
                        <span className="text-emerald-400 block font-semibold">Reference Image Loaded</span>
                        <span className="text-slate-400 text-[10px]">pHash extracted for exclusion vector table</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-slate-400" />
                      <span className="text-xs text-slate-300">Click to upload reference portrait for exact match filtering</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="btn-submit-optout"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Enforcing Exclusion Across Ring...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Submit Irrevocable Opt-Out Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
