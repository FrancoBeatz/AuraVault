export type SocialPlatform =
  | 'All Platforms'
  | 'LinkedIn'
  | 'X / Twitter'
  | 'Instagram'
  | 'GitHub'
  | 'ResearchGate'
  | 'Web Citations';

export interface DiscoveredEntity {
  id: string;
  name: string;
  handle: string;
  role: string;
  location: string;
  platform: SocialPlatform;
  confidenceScore: number; // e.g. 98.6
  baselineScore?: number; // e.g. 75.0
  alignmentScore: number; // e.g. 99.1
  pHash: string;
  vectorDigest: string;
  imageUrl: string;
  bio: string;
  verified: boolean;
  isFeatured?: boolean;
  publicLinks: { label: string; url: string; platform: string }[];
  tags: string[];
  firstIndexed: string;
  exposureRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface EnclaveNode {
  id: string;
  name: string;
  city: string;
  region: string;
  status: 'Online & Verified' | 'Maintenance' | 'Enclave Encrypted';
  latency: string;
  complianceStandard: string;
  totalIndexed: string;
}

export interface FilterState {
  searchQuery: string;
  platform: SocialPlatform;
  minConfidence: number;
  regionEnclave: string;
  verifiedOnly: boolean;
  exposureFilter: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'Vector Ingestion' | 'Distributed Query' | 'Graph Traversal' | 'Exclusion Bloom Update' | 'Dossier Export';
  targetHash: string;
  zeroKnowledgeProof: string;
  nodeRouted: string;
  status: 'Committed' | 'Encrypted' | 'Zero-Knowledge Verified';
}

export interface InvestigationDossierItem {
  id: string;
  entity: DiscoveredEntity;
  addedAt: string;
  notes: string;
  priority: 'Routine' | 'High Review' | 'Urgent Threat';
}
