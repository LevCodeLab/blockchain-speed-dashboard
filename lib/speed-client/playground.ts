/**
 * SpeedDash Playground Simulator & Live Inspector
 * Runs in-browser with deterministic simulations and live SpeedDashClient state.
 */

import { SpeedDashClient } from './client';
import type { FieldProvenance } from './types';

export interface PlaygroundBankNode {
  bank_id: string;
  bank_hash: string | null;
  blockhash: string;
  parent_slot: number;
  state: 'CANDIDATE' | 'ABANDONED' | 'CANONICAL';
  is_followed: boolean;
  provenance: string;
  notes: string;
}

export interface PlaygroundSimulationRequest {
  scenario: string;
  seed?: number;
  bank_count?: number;
  followed_bank_id?: string;
  action_type?: string;
  perturbation?: string;
}

export interface BreakNetworkResponse {
  perturbation: string;
  action: 'WAIT' | 'CANCEL' | 'UNKNOWN' | 'UNAVAILABLE';
  why: string;
  state_impact: string;
  capital_protection: boolean;
  technical_detail: string;
}

export interface PlaygroundReplayEvent {
  seq: number;
  timestamp_offset_ms: number;
  event_type: string;
  slot: number;
  bank_id: string | null;
  detail: string;
  raw_json: Record<string, unknown>;
}

export interface PlaygroundReplaySession {
  session_id: string;
  title: string;
  cluster: string;
  total_events: number;
  total_duration_ms: number;
  events: PlaygroundReplayEvent[];
}

export interface PlaygroundProvenanceItem {
  field: string;
  provenance: FieldProvenance;
  source: string;
  explanation: string;
}

export interface PlaygroundLiveResponse {
  connected: boolean;
  cluster: string;
  source: string;
  mode: string;
  slot: {
    current_slot: number;
    target_duration_ms?: number;
    elapsed_ms?: number;
    phase_ratio?: number;
    provenance: FieldProvenance;
  };
  leader: {
    current_leader: string | null;
    next_leader: string | null;
    handoff_state: string;
    lookahead: Array<{ slot: number; leader: string }>;
    provenance: FieldProvenance;
  };
  banks: {
    total_banks_tracked: number;
    canonical_bank: unknown;
    candidate_banks: unknown[];
    candidate_banks_supported: boolean;
    note: string;
  };
  update_parent: {
    supported: boolean;
    tracked_count: number;
    recent: unknown[];
    provenance: FieldProvenance;
    note: string;
  };
  certificates: {
    supported: boolean;
    total_captured: number;
    recent: unknown[];
    provenance: FieldProvenance;
    note: string;
  };
  finality: {
    mode: string;
    finality_latency_ms: number | null;
    consensus_finality_ms: number | null;
    legacy_confirmation_slots: number;
    fast_path_target_ms: number;
    fast_finality_records: number;
    provenance: FieldProvenance;
  };
  source_health: {
    connected: boolean;
    source_type: string;
    cluster: string;
    coverage_score: number;
  };
  provenance_manifest: PlaygroundProvenanceItem[];
}

export async function fetchPlaygroundLive(): Promise<PlaygroundLiveResponse> {
  const client = SpeedDashClient.getInstance();
  client.start();
  const snap = client.getSnapshotState();
  const isSimulated = snap.networkStatus.environment === 'simulated';

  return {
    connected: snap.networkStatus.connected,
    cluster: String(snap.networkStatus.cluster),
    source: snap.networkStatus.source || 'solana-public-rpc',
    mode: isSimulated ? 'SIMULATED' : 'LIVE_PUBLIC_RPC',
    slot: {
      current_slot: snap.slotProgress.slot,
      target_duration_ms: snap.slotProgress.targetSlotDurationMs || 200,
      elapsed_ms: snap.slotProgress.elapsedMs,
      phase_ratio: snap.slotProgress.phaseRatio,
      provenance: snap.slotProgress.provenance,
    },
    leader: {
      current_leader: snap.leaderInfo.currentLeader,
      next_leader: snap.leaderInfo.nextLeader,
      handoff_state: snap.leaderInfo.handoffState,
      lookahead: snap.leaderInfo.lookahead || [],
      provenance: snap.leaderInfo.provenance,
    },
    banks: {
      total_banks_tracked: snap.candidateBanks.length,
      canonical_bank: snap.candidateBanks.find((b) => b.state === 'CANONICAL') || null,
      candidate_banks: snap.candidateBanks,
      candidate_banks_supported: isSimulated,
      note: isSimulated
        ? 'Multi-bank candidate graph simulated locally'
        : 'Public JSON-RPC exposes canonical confirmed blocks only',
    },
    update_parent: {
      supported: isSimulated,
      tracked_count: snap.parentSwitch ? 1 : 0,
      recent: snap.parentSwitch ? [snap.parentSwitch] : [],
      provenance: isSimulated ? 'ESTIMATED' : 'UNAVAILABLE',
      note: isSimulated
        ? 'SIMD-0337 UpdateParent simulated in memory'
        : 'Requires validator Geyser plugin',
    },
    certificates: {
      supported: isSimulated,
      total_captured: 1,
      recent: snap.finalityInfo ? [snap.finalityInfo] : [],
      provenance: snap.finalityInfo?.provenance || 'ESTIMATED',
      note: 'Target ~150ms BLS fast-path certificate',
    },
    finality: {
      mode: snap.finalityInfo?.mode || 'ALPENGLOW_VOTOR',
      finality_latency_ms: snap.finalityInfo?.finalityLatencyMs ?? 150,
      consensus_finality_ms: snap.finalityInfo?.consensusFinalityMs ?? 150,
      legacy_confirmation_slots: 32,
      fast_path_target_ms: 150,
      fast_finality_records: 1,
      provenance: snap.finalityInfo?.provenance || 'ESTIMATED',
    },
    source_health: {
      connected: snap.networkStatus.connected,
      source_type: snap.networkStatus.source || 'public-rpc',
      cluster: String(snap.networkStatus.cluster),
      coverage_score: snap.networkStatus.coverageScore ?? 30,
    },
    provenance_manifest: [
      {
        field: 'slot.current_slot',
        provenance: snap.slotProgress.provenance,
        source: snap.networkStatus.source || 'public-rpc',
        explanation: isSimulated
          ? 'Generated by local 200ms monotonic slot clock simulator'
          : 'Queried directly via getSlot and slotSubscribe on public RPC',
      },
      {
        field: 'leader.current_leader',
        provenance: snap.leaderInfo.provenance,
        source: snap.networkStatus.source || 'public-rpc',
        explanation: 'Derived from getSlotLeaders lookahead window',
      },
      {
        field: 'banks.candidate_banks',
        provenance: isSimulated ? 'ESTIMATED' : 'UNAVAILABLE',
        source: isSimulated ? 'offline-sim' : 'public-rpc',
        explanation: isSimulated
          ? 'Deterministic candidate fork simulation'
          : 'Validator-internal bank_id requires Geyser stream; never faked on live RPC',
      },
      {
        field: 'finality.bls_certificate',
        provenance: 'ESTIMATED',
        source: 'simd-0326-model',
        explanation: 'Estimated against SIMD-0326 80% stake fast-path target (~150ms)',
      },
    ],
  };
}

export async function breakNetworkAction(perturbation: string): Promise<BreakNetworkResponse> {
  switch (perturbation.toLowerCase()) {
    case 'kill_leader':
      return {
        perturbation: 'KILL LEADER',
        action: 'WAIT',
        why: 'Leader change detected. Pausing submission for next leader.',
        state_impact: 'Leader boundary triggered; prevents transaction drop in abandoned slot.',
        capital_protection: true,
        technical_detail: 'ExecutionDecisionEngine::evaluate -> RoutingAction::WaitForNextLeader',
      };
    case 'abandon_bank':
      return {
        perturbation: 'ABANDON BANK',
        action: 'CANCEL',
        why: 'Candidate invalidated. Bank abandoned.',
        state_impact: 'Uncommitted candidate branch pruned from state graph.',
        capital_protection: true,
        technical_detail: 'BankFreshnessTier::Abandoned -> RoutingAction::Abort',
      };
    case 'change_parent':
      return {
        perturbation: 'CHANGE PARENT',
        action: 'CANCEL',
        why: 'UpdateParent observed. Candidate invalidated and uncommitted transactions purged.',
        state_impact: 'State graph rolls back abandoned parent state and reroutes to new tip.',
        capital_protection: true,
        technical_detail: 'UpdateParentOutcome::ClearedCandidateInvalidated -> StateRollback',
      };
    case 'provider_conflict':
      return {
        perturbation: 'PROVIDER CONFLICT',
        action: 'UNKNOWN',
        why: 'Sources disagree. Provider conflict detected; engine refuses to guess.',
        state_impact: 'Evidence graph records ProviderDivergence and awaits cryptographic cert.',
        capital_protection: true,
        technical_detail: 'MultiStreamReconciler::reconcile -> DivergenceDetected',
      };
    case 'remove_telemetry':
      return {
        perturbation: 'REMOVE TELEMETRY',
        action: 'UNAVAILABLE',
        why: 'Cannot safely infer candidate state. Telemetry unavailable.',
        state_impact: 'Zero synthetic assumptions; fails safe.',
        capital_protection: true,
        technical_detail: 'NetworkStatus::Connected = false -> HonestyGuard',
      };
    default:
      return {
        perturbation: perturbation.toUpperCase(),
        action: 'WAIT',
        why: 'Data stale. Pausing until fresh network tick observed.',
        state_impact: 'Execution pauses until fresh cluster tick is verified.',
        capital_protection: true,
        technical_detail: 'FreshnessTier::Stale -> SafeWaitState',
      };
  }
}

export async function fetchPlaygroundReplay(): Promise<PlaygroundReplaySession> {
  const slot = 507123490;
  return {
    session_id: 'replay-alpenglow-canonical-01',
    title: 'Alpenglow Fork Reconciliation & BLS Notarization Trace',
    cluster: 'devnet',
    total_events: 7,
    total_duration_ms: 152,
    events: [
      {
        seq: 1,
        timestamp_offset_ms: 0,
        event_type: 'SLOT_START',
        slot,
        bank_id: null,
        detail: `Slot ${slot} started with leader dv4AC...RBVJB`,
        raw_json: { event: 'slot', slot, provenance: 'DIRECT' },
      },
      {
        seq: 2,
        timestamp_offset_ms: 25,
        event_type: 'CANDIDATE_BANK_A',
        slot,
        bank_id: 'bank-A',
        detail: 'Candidate bank A observed (blockhash 4xMvK...A1)',
        raw_json: { event: 'bank', slot, bank_id: 'bank-A', state: 'CANDIDATE' },
      },
      {
        seq: 3,
        timestamp_offset_ms: 38,
        event_type: 'CANDIDATE_BANK_B',
        slot,
        bank_id: 'bank-B',
        detail: 'Competing candidate bank B observed (blockhash 4xMvK...B1)',
        raw_json: { event: 'bank', slot, bank_id: 'bank-B', state: 'CANDIDATE' },
      },
      {
        seq: 4,
        timestamp_offset_ms: 65,
        event_type: 'UPDATE_PARENT',
        slot,
        bank_id: 'bank-A',
        detail: 'SIMD-0337 UpdateParent marker observed: bank-A discarded',
        raw_json: { event: 'UpdateParent', cleared_bank_id: 'bank-A', replacement_bank_id: 'bank-B' },
      },
      {
        seq: 5,
        timestamp_offset_ms: 110,
        event_type: 'CANONICAL_PROMOTION',
        slot,
        bank_id: 'bank-B',
        detail: 'Candidate bank B promoted to canonical fork tip',
        raw_json: { event: 'canonical', bank_id: 'bank-B', state: 'CANONICAL' },
      },
      {
        seq: 6,
        timestamp_offset_ms: 150,
        event_type: 'BLS_CERTIFICATE',
        slot,
        bank_id: 'bank-B',
        detail: 'BLS12-381 notarization certificate verified (84.6% stake threshold met)',
        raw_json: { event: 'certificate', stake_percent: 84.6, verified: true },
      },
      {
        seq: 7,
        timestamp_offset_ms: 152,
        event_type: 'FINALIZED',
        slot,
        bank_id: 'bank-B',
        detail: `Slot ${slot} finalized under Alpenglow in 152ms`,
        raw_json: { event: 'finality', duration_ms: 152, status: 'FINALIZED' },
      },
    ],
  };
}
