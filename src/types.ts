export type SocialPlatform =
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'github'
  | 'youtube'
  | 'tiktok'
  | 'researchgate'
  | 'web';

export interface ConnectedAccount {
  platform: SocialPlatform;
  handle: string;
  url: string;
  verified: boolean;
  followersCount?: string;
  lastIndexed: string;
  isPrimary?: boolean;
}

export interface FacialBiometrics {
  landmarkCount: number;
  confidence: number;
  pitch: number;
  yaw: number;
  roll: number;
  perceptualHash: string;
  vectorEmbeddingPreview: string;
  sha256Signature: string;
}

export interface PublicProfileResult {
  id: string;
  fullName: string;
  primaryHandle: string;
  headline: string;
  avatarUrl: string;
  publicLocation: string;
  organization?: string;
  confidenceScore: number; // 0 - 100
  cosineSimilarity: number; // 0.0 - 1.0
  hammingDistance: number; // 0 - 64
  facialLandmarkAlignment: number; // 0 - 100
  sourceProvenanceUrl: string;
  indexedTimestamp: string;
  accounts: ConnectedAccount[];
  publicBio: string;
  publicTags: string[];
  publicCitationsCount: number;
  verificationBadge: 'GovID Verified' | 'Corporate Directory' | 'Public Web Index' | 'Developer Key Signed';
  riskScore: 'Low' | 'Neutral' | 'Notice';
}

export interface SearchFilterState {
  targetPlatforms: Record<SocialPlatform, boolean>;
  similarityThreshold: number; // 70 - 99
  maxResults: number;
  regionFilter: 'global' | 'north_america' | 'europe' | 'asia_pacific';
  includeAcademicAndNews: boolean;
  requireHighConfidenceOnly: boolean;
  legalPurpose: 'self_audit' | 'osint_investigation' | 'copyright_protection' | 'academic_research';
  consentAgreed: boolean;
}

export interface ScanStage {
  step: 'idle' | 'ingesting' | 'vectorizing' | 'encrypting' | 'querying' | 'synthesizing' | 'completed' | 'error';
  progress: number;
  detail: string;
  elapsedMs: number;
}

export interface TransparencyLogEntry {
  id: string;
  timestamp: string;
  action: 'QUERY_EXECUTION' | 'VECTOR_HASH_GENERATION' | 'OPT_OUT_REQUEST' | 'LEDGER_SYNC' | 'TAKEDOWN_PROCESSED';
  operatorHash: string;
  verificationHash: string;
  status: 'VERIFIED' | 'ENCRYPTED_AT_REST' | 'IMMUTABLE';
  nodeCluster: string;
}

export interface OptOutSubmission {
  id: string;
  requesterName: string;
  contactEmail: string;
  reason: 'personal_privacy' | 'impersonation_protection' | 'regulatory_gdpr_ccpa' | 'minor_protection';
  facialHash: string;
  submittedAt: string;
  status: 'ACTIVE_EXCLUSION_ENFORCED' | 'PROCESSING';
}
