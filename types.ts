/**
 * ProofLens AI — TypeScript Type Definitions
 * Data contracts for claims, evidence sources, verification reports, and Spring Boot DTOs.
 */

export type VerificationStatus = 
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'CONTRADICTED'
  | 'UNVERIFIED'
  | 'CONFLICTING_EVIDENCE'
  | 'OUTDATED';

export interface EvidenceSource {
  id?: string;
  title: string;
  publisher: string;
  date?: string;
  url: string;
  doi?: string;
  passage?: string;
  relevanceScore?: number;
}

export interface FactualClaim {
  id: string;
  claimText: string;
  status: VerificationStatus;
  statusLabel: string;
  confidence: number; // 0 - 100 percentage based on defined scoring rubric
  explanation: string;
  evidenceSummary: string;
  source: EvidenceSource;
  contradictoryPassage?: string;
}

export interface VerificationSummary {
  totalClaims: number;
  supportedCount: number;
  partiallySupportedCount: number;
  contradictedCount: number;
  unverifiedCount: number;
  conflictingCount: number;
  overallCredibilityScore: number; // 0 - 100
}

export interface VerificationReport {
  id: string;
  timestamp: string;
  originalText: string;
  summary: VerificationSummary;
  claims: FactualClaim[];
  isDemoMode: boolean;
  metadata?: {
    modelVersion?: string;
    processingTimeMs?: number;
    sha256EvidenceHash?: string;
  };
}

/**
 * Spring Boot REST API Request & Response Contracts
 * Proposed endpoints:
 * - POST /api/verification/analyze
 * - GET  /api/verification/{id}
 * - GET  /api/verification/{id}/claims
 */
export interface SpringBootAnalyzeRequest {
  textToVerify: string;
  domain?: string;
  uploadedDocumentId?: string;
  strictnessMode?: 'LENIENT' | 'STANDARD' | 'RIGOROUS';
}

export interface SpringBootAnalyzeResponse {
  verificationId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  report?: VerificationReport;
  error?: string;
}
