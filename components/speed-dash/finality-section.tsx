'use client';

import { FinalityInfo, FieldProvenance } from '@/lib/speed-client/types';
import { CheckCircle2, Circle, Zap, ArrowDown } from 'lucide-react';
import { ProvenanceBadge } from './provenance-badge';

interface FinalitySectionProps {
  finalityInfo: FinalityInfo | null;
  currentSlot: number;
}

export function FinalitySection({
  finalityInfo,
  currentSlot,
}: FinalitySectionProps) {
  const isBls =
    finalityInfo?.mode === 'ALPENGLOW_VOTOR' ||
    finalityInfo?.certificateType === 'BLS_FAST_PATH_CERT' ||
    finalityInfo?.certificateType === 'BLS_FALLBACK_CERT';

  const consensusLatency = finalityInfo?.consensusFinalityMs ?? (isBls ? 150 : 12800);
  const providerLag = finalityInfo?.providerLatencyMs ?? 98;

  const stages = [
    {
      name: '1. OBSERVED STREAM',
      description: 'Slot and block received via RPC / WebSocket transport',
      time: '0ms',
      provenance: 'DIRECT' as FieldProvenance,
      achieved: Boolean(currentSlot && currentSlot > 0),
    },
    {
      name: '2. CANONICAL RESOLUTION',
      description: 'Head of active fork resolved across candidate banks',
      time: 'FORK TIP',
      provenance: 'DERIVED' as FieldProvenance,
      achieved: Boolean(currentSlot && currentSlot > 0),
    },
    {
      name: '3. CONSENSUS NOTARIZATION',
      description: isBls
        ? 'BLS aggregate certificate notarized (SIMD-0326 fast path)'
        : 'TowerBFT 32-lockout progressive root commitment',
      time: isBls ? `${consensusLatency}ms` : '~12.8s',
      provenance: (finalityInfo?.provenance || 'ESTIMATED') as FieldProvenance,
      achieved: Boolean(currentSlot && currentSlot > 31),
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 border-b border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-3 text-xs font-mono text-[#A1A1AA] mb-3">
            <span className="w-6 h-px bg-[#26262E]" />
            FINALITY COMPARISON • SIMD-0326
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
            Consensus changed.
            <span className="block text-[#A1A1AA]">SVM execution did not.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Programs, accounts, and transaction signatures work the exact same way. What changed is
            how validators agree on finality: off-chain aggregate BLS certificates replace 32
            on-chain lockout rounds.
          </p>
        </div>

        {/* TowerBFT vs Alpenglow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 lg:p-8 border border-[#26262E] rounded-2xl bg-[#141418] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#26262E] mb-6">
                <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                  Legacy Consensus
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA]">
                  TOWERBFT
                </span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-3 p-3.5 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                  <span className="w-6 h-6 rounded-md border border-[#26262E] flex items-center justify-center text-xs text-[#A1A1AA] shrink-0">
                    1
                  </span>
                  <div>
                    <div className="font-semibold text-[#E4E4E7] text-xs sm:text-sm">
                      Votes landed on-chain as normal transactions
                    </div>
                    <div className="text-xs text-[#71717A]">
                      Consumed ~75% of every block&apos;s compute space
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-[#71717A]">
                  <ArrowDown className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                  <span className="w-6 h-6 rounded-md border border-[#26262E] flex items-center justify-center text-xs text-[#A1A1AA] shrink-0">
                    2
                  </span>
                  <div>
                    <div className="font-semibold text-[#E4E4E7] text-xs sm:text-sm">
                      32 progressive lockout rounds
                    </div>
                    <div className="text-xs text-[#71717A]">
                      ~12.8 seconds before irreversible root finality
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 border border-[#FFFFFF] rounded-2xl bg-[#141418] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#26262E] mb-6">
                <span className="text-xs font-mono text-[#FFFFFF] uppercase tracking-wider font-bold">
                  Alpenglow Votor
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#FFFFFF] text-[#000000] font-bold">
                  BLS FAST-PATH
                </span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-3 p-3.5 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                  <span className="w-6 h-6 rounded-md bg-[#FFFFFF] text-[#000000] flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <div>
                    <div className="font-semibold text-[#FFFFFF] text-xs sm:text-sm">
                      Validators vote off-chain via Votor
                    </div>
                    <div className="text-xs text-[#A1A1AA]">
                      Reclaims ~75% of block compute units for user apps
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-[#FFFFFF]">
                  <ArrowDown className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                  <span className="w-6 h-6 rounded-md bg-[#FFFFFF] text-[#000000] flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <div>
                    <div className="font-semibold text-[#FFFFFF] text-xs sm:text-sm">
                      ~150ms aggregate BLS12-381 certificate
                    </div>
                    <div className="text-xs text-[#A1A1AA]">
                      80% stake fast-path notarization in a single sub-second round
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Finality Card */}
        <div className="border border-[#26262E] bg-[#141418] p-6 lg:p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Finality vs Transport Separation
              </span>
              <span className="text-sm font-medium text-[#FFFFFF]">
                Decoupling protocol notarization target from public RPC delivery lag
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#26262E] bg-[#0B0B0E] text-xs font-mono text-[#FFFFFF]">
                <Zap className="w-3.5 h-3.5" />
                {isBls ? 'FAST PATH (80% STAKE)' : '32-SLOT ROOT'}
              </span>
              <ProvenanceBadge provenance={finalityInfo?.provenance || 'ESTIMATED'} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-[#26262E] font-mono">
            <div>
              <span className="text-xs text-[#A1A1AA] block mb-1">CONSENSUS TARGET</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                {isBls ? `${consensusLatency}ms` : '~12.8s'}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#A1A1AA] block mb-1">STAKE QUORUM</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                {finalityInfo?.stakePercent ? `${finalityInfo.stakePercent}%` : '80.0%'}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#A1A1AA] block mb-1">RPC ENDPOINT RTT</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">{providerLag}ms</span>
            </div>
            <div>
              <span className="text-xs text-[#A1A1AA] block mb-1">CLIENT NORMALIZER</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">&lt;0.05ms</span>
            </div>
          </div>

          <div className="space-y-3 pt-6 font-mono text-xs">
            {stages.map((stage) => (
              <div
                key={stage.name}
                className="p-4 border border-[#26262E] rounded-xl flex items-center justify-between gap-2 bg-[#0B0B0E]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {stage.achieved ? (
                    <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#71717A] shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-[#FFFFFF] text-xs sm:text-sm truncate">
                      {stage.name}
                    </div>
                    <div className="text-[11px] text-[#A1A1AA] truncate">{stage.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[#FFFFFF] font-bold">{stage.time}</span>
                  <ProvenanceBadge provenance={stage.provenance} showIcon={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
