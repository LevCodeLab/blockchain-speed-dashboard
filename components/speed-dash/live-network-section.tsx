'use client';

import { useEffect, useState } from 'react';
import {
  SlotProgress,
  LeaderInfo,
  CandidateBank,
  FinalityInfo,
  NetworkStatus,
  FieldProvenance,
} from '@/lib/speed-core/types';
import { Radio } from 'lucide-react';
import { ProvenanceBadge } from './provenance-badge';

interface LiveNetworkSectionProps {
  slotProgress: SlotProgress;
  leaderInfo: LeaderInfo;
  candidateBanks: CandidateBank[];
  finalityInfo: FinalityInfo | null;
  networkStatus: NetworkStatus;
}

export function LiveNetworkSection({
  slotProgress,
  leaderInfo,
  candidateBanks,
  finalityInfo,
  networkStatus,
}: LiveNetworkSectionProps) {
  const [clockTime, setClockTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => setClockTime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(slotProgress.phaseRatio * 100));
  const coverageScore = networkStatus.telemetry?.coverageScore ?? networkStatus.coverageScore ?? 30;

  const metrics: {
    label: string;
    value: string;
    detail: string;
    provenance: FieldProvenance;
  }[] = [
    {
      label: 'CURRENT SLOT',
      value: slotProgress.slot > 0 ? slotProgress.slot.toLocaleString() : 'UNAVAILABLE',
      detail: `${slotProgress.targetSlotDurationMs ?? 200}ms window`,
      provenance: slotProgress.slot > 0 ? slotProgress.provenance : 'UNAVAILABLE',
    },
    {
      label: 'SLOT DURATION',
      value: `${slotProgress.targetSlotDurationMs ?? 200}ms`,
      detail: 'SIMD-0525 Target Slot Interval',
      provenance: 'DERIVED',
    },
    {
      label: 'CURRENT LEADER',
      value: leaderInfo.currentLeader || 'SYNCING...',
      detail: `Phase: ${leaderInfo.handoffState}`,
      provenance: leaderInfo.currentLeader ? leaderInfo.provenance : 'DERIVED',
    },
    {
      label: 'NEXT LEADER',
      value: leaderInfo.nextLeader || 'SYNCING...',
      detail: 'Scheduled rotation',
      provenance: leaderInfo.nextLeader ? leaderInfo.provenance : 'DERIVED',
    },
    {
      label: 'TIME REMAINING',
      value: `${slotProgress.remainingMs}ms`,
      detail: `Drift: ${slotProgress.driftMs ?? 0}ms`,
      provenance: 'ESTIMATED',
    },
    {
      label: 'CANDIDATE BANKS',
      value:
        candidateBanks.length > 0
          ? `0${candidateBanks.length} BRANCH${candidateBanks.length > 1 ? 'ES' : ''}`
          : '01 BRANCH',
      detail:
        candidateBanks.length > 1
          ? 'Multi-candidate fork slot (SIMD-0326)'
          : 'Linear canonical block stream (Public RPC)',
      provenance: candidateBanks.length > 0 ? candidateBanks[0].provenance : 'DIRECT',
    },
    {
      label: 'FINALITY STATE',
      value: finalityInfo?.mode === 'ALPENGLOW_VOTOR' ? 'VOTOR NOTARIZED' : 'ROOTED (32 SLOTS)',
      detail:
        finalityInfo?.mode === 'ALPENGLOW_VOTOR'
          ? 'BLS Fast-Path Certificate (~80% stake)'
          : 'TowerBFT 32-slot lockout root',
      provenance: finalityInfo?.provenance || 'ESTIMATED',
    },
    {
      label: 'CONSENSUS FINALITY',
      value: finalityInfo?.consensusFinalityMs ? `${finalityInfo.consensusFinalityMs}ms` : '~150ms',
      detail: 'Target SIMD-0326 BLS fast-path latency',
      provenance: finalityInfo?.provenance || 'ESTIMATED',
    },
  ];

  return (
    <section id="live" className="relative py-16 sm:py-24 border-b border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-mono text-[#A1A1AA] mb-3">
              <span className="w-6 h-px bg-[#26262E]" />
              Live Consensus Telemetry
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Monotonic slot timing.
              <span className="block text-[#A1A1AA]">Tracked every 50ms frame.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#A1A1AA]">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#26262E] bg-[#141418] text-[#FFFFFF]">
              <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
              {networkStatus.speedStatus || (networkStatus.connected ? 'LIVE' : 'OFFLINE')}
            </span>
            <span className="uppercase px-2.5 py-1 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7]">
              {networkStatus.source || networkStatus.cluster}
            </span>
            <span>{clockTime || '00:00:00'}</span>
          </div>
        </div>

        {/* Coverage Matrix Bar */}
        <div className="border border-[#26262E] p-5 mb-8 bg-[#141418] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#FFFFFF] animate-pulse shrink-0" />
            <div>
              <div className="text-xs font-mono text-[#A1A1AA] uppercase">
                Telemetry Field Coverage
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FFFFFF] font-medium">
                {coverageScore}% of consensus dimensions observable on current transport ({networkStatus.cluster})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-48 h-2 bg-[#0B0B0E] border border-[#26262E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFFFFF] transition-all duration-500"
                style={{ width: `${coverageScore}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#A1A1AA] whitespace-nowrap">
              {coverageScore === 100 ? 'SIMULATOR (10/10)' : 'PUBLIC RPC (3/10)'}
            </span>
          </div>
        </div>

        {/* Latency Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#141418] border border-[#26262E] rounded-xl p-5 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#A1A1AA] uppercase">1. Source Observation</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7]">
                RPC / WS
              </span>
            </div>
            <div className="text-2xl font-bold text-[#FFFFFF]">
              {networkStatus.serviceTelemetry?.sourceLatencyUs
                ? `${Math.max(0.4, networkStatus.serviceTelemetry.sourceLatencyUs / 1000).toFixed(1)}ms`
                : '~45ms'}
            </div>
            <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
              Public endpoint round-trip or WebSocket push delivery.
            </p>
          </div>

          <div className="bg-[#141418] border border-[#26262E] rounded-xl p-5 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#A1A1AA] uppercase">2. SpeedDash Core</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#FFFFFF]">
                IN-MEMORY
              </span>
            </div>
            <div className="text-2xl font-bold text-[#FFFFFF]">&lt; 0.05ms</div>
            <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
              SlotClock phase math, BankGraph fork tracking, and event bus dispatch.
            </p>
          </div>

          <div className="bg-[#141418] border border-[#26262E] rounded-xl p-5 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#A1A1AA] uppercase">3. Browser Frame</span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7]">
                DOM
              </span>
            </div>
            <div className="text-2xl font-bold text-[#FFFFFF]">16.6ms (60fps)</div>
            <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
              React state reconciliation and smooth slot progress bar interpolation.
            </p>
          </div>
        </div>

        {/* Active Slot Progress Monitor */}
        <div className="border border-[#26262E] p-6 mb-8 bg-[#141418] rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                Active Slot Engine
              </div>
              <div className="text-2xl sm:text-4xl font-mono font-bold text-[#FFFFFF]">
                SLOT {slotProgress.slot > 0 ? slotProgress.slot.toLocaleString() : '--'}
              </div>
            </div>

            <div className="font-mono text-left md:text-right">
              <div className="text-xl sm:text-3xl font-bold text-[#FFFFFF]">
                {slotProgress.elapsedMs}ms / {slotProgress.targetSlotDurationMs ?? 200}ms
              </div>
              <div className="text-xs text-[#A1A1AA]">
                Phase: {progressPercent}% | Remaining: {slotProgress.remainingMs}ms
              </div>
            </div>
          </div>

          <div className="h-3 w-full bg-[#0B0B0E] border border-[#26262E] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#FFFFFF] rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between items-center text-[11px] font-mono text-[#71717A]">
            <span>0ms (Leader Open)</span>
            <span>100ms (Mid-Slot)</span>
            <span>200ms (Handoff Boundary)</span>
          </div>
        </div>

        {/* 8-Cell Technical Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-[#141418] border border-[#26262E] rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <ProvenanceBadge provenance={metric.provenance} />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#FFFFFF] truncate">
                  {metric.value}
                </div>
              </div>
              <div className="mt-3 text-xs text-[#A1A1AA]">{metric.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
