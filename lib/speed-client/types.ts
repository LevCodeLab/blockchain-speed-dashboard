export type FieldProvenance = 'DIRECT' | 'DERIVED' | 'INFERRED' | 'ESTIMATED' | 'UNAVAILABLE';
export type SpeedServiceStatus = 'LIVE' | 'SIMULATED' | 'STALE' | 'DISCONNECTED' | 'DEGRADED' | 'OFFLINE' | 'CONNECTING';
export type ClusterId = 'mainnet-beta' | 'devnet' | 'offline-sim' | string;
export type BankState = 'OBSERVED' | 'CANONICAL' | 'ABANDONED' | 'FINALIZED' | 'DEAD' | 'ROOTED';
export type CertificateType =
  | 'BLS_FAST_PATH_CERT'
  | 'BLS_FALLBACK_CERT'
  | 'TOWER_BFT_ROOT'
  | 'UNKNOWN';

export interface SlotProgress {
  slot: number;
  targetDurationMs?: number;
  targetSlotDurationMs?: number;
  elapsedMs: number;
  remainingMs: number;
  phaseRatio: number;
  driftMs?: number;
  isMeasured?: boolean;
  isRealTime?: boolean;
  provenance: FieldProvenance;
}

export type HandoffState =
  | 'SLOT_CONTINUATION'
  | 'LEADER_TRANSITION_PENDING'
  | 'HANDOVER_IMMINENT'
  | 'BUILDING'
  | 'PARENT_READY'
  | 'HANDOVER'
  | 'UNKNOWN';

export interface LeaderInfo {
  currentLeader: string | null;
  nextLeader: string | null;
  upcomingLeaders?: string[];
  leaderEstimatedDurationMs?: number;
  handoffState: HandoffState;
  lookahead?: Array<{ slot: number; leader: string }>;
  provenance: FieldProvenance;
}

export interface CandidateBank {
  bankId: string;
  rawBankId?: number | null;
  slot: number;
  parentBankId?: string | null;
  parentBlockhash?: string | null;
  blockhash: string | null;
  bankHash?: string | null;
  state: BankState;
  txCount: number;
  observedAtMs: number;
  isUpdateParentTarget?: boolean;
  abandonmentReason?: string;
  provenance: FieldProvenance;
}

export interface ParentSwitchEvent {
  id?: string;
  slot: number;
  clearedBankId: string;
  replacementBankId: string;
  abandonedBankId?: string;
  canonicalBankId?: string;
  newParentBlockhash?: string;
  parentSlot?: number;
  timestampMs?: number;
  observedAtMs?: number;
  authoritativeParent?: string;
  reason: string;
  fecSetIndex?: number;
  source: string;
  provenance: FieldProvenance;
}

export interface ProtocolInfo {
  consensusMode: string;
  alpenglowActive: boolean;
  genesisSlot: number | null;
  targetFinalityMs: number;
  observedFinalityMs: number | null;
  protocolVersion: string;
  consensusEngine: string;
  executionStatus: string;
}

export interface FinalityInfo {
  slot: number;
  mode?: string;
  observedAtMs?: number;
  canonicalAtMs?: number | null;
  finalizedAtMs?: number | null;
  latencyMs?: number | null;
  finalityLatencyMs?: number | null;
  consensusFinalityMs?: number | null;
  providerLatencyMs?: number | null;
  observationLatencyMs?: number | null;
  processingUs?: number;
  targetFinalityMs?: number;
  isFastPath?: boolean;
  stakeParticipatedPercent?: number;
  stakePercent?: number;
  certificateType?: CertificateType;
  certType?: string;
  status?: 'OBSERVED' | 'CANONICAL' | 'FINALIZED' | 'WAITING';
  provenance: FieldProvenance;
  rawCertBytes?: string;
}

export interface AlpenglowTelemetry {
  coverageScore: number;
  provenance: Record<string, FieldProvenance>;
  bankHash?: string;
  producerTimeNanos?: number;
  producerUserAgent?: string;
  finalCertificate?: {
    type: string;
    stakePercent: number;
    latencyMs: number;
    status: string;
    rawLen: number;
  };
  notarRewardCert?: {
    stakePercent: number;
    status: string;
    rawLen: number;
  };
  skipRewardCert?: {
    status: string;
    rawLen: number;
  };
  deshredSupported: boolean;
}

export interface ServiceTelemetry {
  eventsReceivedTotal: number;
  eventsNormalizedTotal: number;
  eventsDroppedTotal: number;
  sourceLatencyUs: number;
  processingLatencyUs: number;
  websocketClients: number;
}

export interface NetworkStatus {
  cluster: ClusterId;
  source?: string;
  environment?: 'live' | 'simulated' | 'fixture';
  connected: boolean;
  speedStatus?: SpeedServiceStatus;
  rpcEndpoint: string;
  targetSlotDurationMs: number;
  currentSlot: number | null;
  liveTps: number | null;
  activeValidators: number | null;
  lastUpdateMs: number;
  coverageScore?: number;
  telemetry: AlpenglowTelemetry;
  serviceTelemetry?: ServiceTelemetry;
  currentSequence?: number;
  dimensions?: Record<string, string>;
  limitations?: string[];
  protocol?: ProtocolInfo;
}

export interface SpeedStreamEvent {
  id: string;
  sequence?: number;
  timestamp: string;
  type: string;
  slot: number;
  bankId?: string;
  blockhash?: string;
  source: string;
  details: string;
  provenance: FieldProvenance;
}

export interface AutopsyEvidenceItem {
  tier: 'OBSERVED' | 'INFERRED' | 'UNKNOWN';
  title: string;
  detail: string;
  provenance: FieldProvenance;
}

export interface AutopsyTimelineStep {
  step: string;
  stage?: number;
  title?: string;
  status: 'CONFIRMED' | 'PENDING' | 'ABANDONED' | 'UNAVAILABLE';
  timestamp_ms?: number | null;
  timestampMs?: number | null;
  detail: string;
  source: string;
  provenance: FieldProvenance;
}

export interface TransactionAutopsyResult {
  signature: string;
  observed?: boolean;
  slot: number | null;
  block_time?: number | null;
  blockTime?: number | null;
  blockhash?: string | null;
  bank_hash?: string | null;
  bankHash?: string | null;
  fee?: number | null;
  compute_units_consumed?: number | null;
  computeUnitsConsumed?: number | null;
  leader?: string | null;
  bankId?: string | null;
  candidateBank?: string | null;
  parent?: string | null;
  parentRelation?: string | null;
  canonical?: boolean;
  finalized?: boolean;
  confirmationStatus?: string;
  latencyMs?: number | null;
  producerTimeNanos?: number | null;
  producerUserAgent?: string | null;
  err?: string | null;
  parentSwitch?: {
    occurred: boolean;
    clearedBankId?: string;
    replacementBankId?: string;
    abandonedBankId?: string;
    canonicalBankId?: string;
    details?: string;
  } | null;
  certificateInfo?: {
    type: string;
    status: string;
    stakePercent?: number;
    finality_latency_ms?: number | null;
  } | null;
  evidence?: AutopsyEvidenceItem[];
  timeline?: AutopsyTimelineStep[];
  inferredConclusions?: string[];
  unknowns?: string[];
  provenance?: Record<string, FieldProvenance>;
  sourceProvenance?: FieldProvenance;
  error?: string;
}

export interface ExecutionStateWire {
  decision: {
    action: string;
    explanation: string;
    evidence: string[];
  };
  freshness: {
    slot_tier: string;
    slot_elapsed_ms: number;
    slot_target_duration_ms: number;
    leader_tier: string;
    current_leader: string | null;
    next_leader: string | null;
    remaining_window_ms: number;
    blockhash_tier: string;
    blockhash: string;
    blockhash_age_ms: number;
    source_tier: string;
    last_event_received_ago_ms: number;
    bank_tier: string;
    bank_id: string | null;
  };
  leader_window_ms: number;
  target_leader: string | null;
  next_leader: string | null;
  quic_route: {
    leader: string | null;
    tpu_quic_port: number;
    prewarmed: boolean;
    connection_state: string;
    fallback_rpc: boolean;
  };
  mainnet_safety_guard: boolean;
  execution_mode: string;
  timestamps_t0_t10_contract: string[];
}
