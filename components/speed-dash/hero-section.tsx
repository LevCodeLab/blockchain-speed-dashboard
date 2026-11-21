'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Activity, Layers } from 'lucide-react';
import { AnimatedSphere } from '@/components/visuals/animated-sphere';
import { SlotProgress, LeaderInfo, FinalityInfo, NetworkStatus } from '@/lib/speed-client/types';
import { ProvenanceBadge } from './provenance-badge';
import Link from 'next/link';

interface HeroSectionProps {
  slotProgress: SlotProgress;
  leaderInfo: LeaderInfo;
  finalityInfo: FinalityInfo | null;
  networkStatus?: NetworkStatus;
  connected: boolean;
}

export function HeroSection({
  slotProgress,
  leaderInfo,
  finalityInfo,
  networkStatus,
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const protocol = networkStatus?.protocol;
  const clusterLabel = String(networkStatus?.cluster || 'mainnet-beta').toUpperCase();
  const observedFinality = finalityInfo?.consensusFinalityMs ?? protocol?.observedFinalityMs ?? 150;
  const targetFinality = protocol?.targetFinalityMs ?? 150;
  const providerLag = finalityInfo?.providerLatencyMs ?? 98;
  const slotNumberFormatted = slotProgress.slot > 0 ? slotProgress.slot.toLocaleString() : '--';
  const progressPercent = Math.min(100, Math.max(0, Math.round(slotProgress.phaseRatio * 100)));

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden border-b border-[#26262E]">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[520px] sm:h-[520px] lg:w-[700px] lg:h-[700px] opacity-30 pointer-events-none">
        <AnimatedSphere />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-16 sm:py-28 w-full">
        {/* Top Protocol Pills (Monochrome Only) */}
        <div
          className={`mb-6 transition-all duration-700 flex flex-wrap items-center gap-2.5 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-mono text-[11px] font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#000000] animate-pulse" />
            SPEEDDASH // BLOCKPULSE
          </span>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7] font-mono text-[11px]">
            SIMD-0525 200ms Slots • SIMD-0326 Votor • SIMD-0337 UpdateParent
          </span>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#26262E] bg-[#141418] text-[#A1A1AA] font-mono text-[11px]">
            Public RPC + Offline Simulator
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <h1
              className={`text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight text-[#FFFFFF] transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Watch every 200ms slot
              <span className="block text-[#A1A1AA] mt-1">and candidate fork live.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl">
              Most block explorers just spin a loader until blocks are old news. SpeedDash
              tracks sub-second slot windows, competing candidate banks, SIMD-0337 parent
              switches, 25ms BAM micro-auctions, and ~150ms BLS finality directly in your browser.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="h-11 px-6 rounded-lg font-mono text-xs font-bold">
                <Link href="/playground">
                  Open Consensus Playground
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 rounded-lg font-mono text-xs"
              >
                <Link href="/blockspace">
                  <Layers className="w-4 h-4 mr-1.5" />
                  Explore 48M CU Blockspace
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-5 rounded-lg font-mono text-xs"
              >
                <a href="#transactions">Run TX Autopsy</a>
              </Button>
            </div>

            <div className="pt-6 border-t border-[#26262E] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[#A1A1AA]">
              <div className="p-3 rounded-lg bg-[#141418] border border-[#26262E]">
                <span className="block text-[10px] uppercase text-[#71717A]">Slot Target</span>
                <span className="text-sm font-bold text-[#FFFFFF]">200ms (5 blocks/s)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#141418] border border-[#26262E]">
                <span className="block text-[10px] uppercase text-[#71717A]">BAM Sub-Ticks</span>
                <span className="text-sm font-bold text-[#FFFFFF]">8 x 25ms Auctions</span>
              </div>
              <div className="p-3 rounded-lg bg-[#141418] border border-[#26262E]">
                <span className="block text-[10px] uppercase text-[#71717A]">Votor Fast-Path</span>
                <span className="text-sm font-bold text-[#FFFFFF]">~150ms (&ge;80% Stake)</span>
              </div>
            </div>
          </div>

          {/* Right Live Telemetry Card */}
          <div className="lg:col-span-5 border border-[#26262E] bg-[#141418] p-6 lg:p-7 rounded-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#26262E] text-xs font-mono">
              <span className="text-[#FFFFFF] font-semibold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                {clusterLabel}
              </span>
              <span className="px-2 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA] text-[10px] uppercase">
                {networkStatus?.source || 'solana-public-rpc'}
              </span>
            </div>

            <div className="py-5 border-b border-[#26262E]">
              <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">
                <span>Current Slot</span>
                <ProvenanceBadge provenance={slotProgress.provenance} showIcon={false} />
              </div>
              <div className="text-4xl lg:text-5xl font-mono font-bold tracking-tight text-[#FFFFFF] mb-4">
                {slotNumberFormatted}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[#A1A1AA]">
                  <span>Slot Window ({slotProgress.targetSlotDurationMs ?? 200}ms)</span>
                  <span className="text-[#FFFFFF]">
                    {slotProgress.elapsedMs}ms / {slotProgress.targetSlotDurationMs ?? 200}ms
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#0B0B0E] border border-[#26262E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFFFFF] transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-5 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#A1A1AA] text-[10px]">CONSENSUS TARGET</span>
                </div>
                <div className="text-xl font-bold text-[#FFFFFF] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FFFFFF]" />
                  {observedFinality}ms
                </div>
                <span className="text-[10px] text-[#71717A] block mt-0.5">
                  BLS fast-path (~{targetFinality}ms)
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#26262E] bg-[#0B0B0E]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#A1A1AA] text-[10px]">RPC OBSERVATION</span>
                </div>
                <div className="text-xl font-bold text-[#FFFFFF]">{providerLag}ms</div>
                <span className="text-[10px] text-[#71717A] block mt-0.5">
                  Endpoint RTT / stream lag
                </span>
              </div>

              <div className="col-span-2 pt-3 border-t border-[#26262E]">
                <span className="text-[#A1A1AA] block text-[10px] uppercase mb-1">
                  Active Slot Leader
                </span>
                <span
                  className="font-mono text-xs text-[#FFFFFF] truncate block"
                  title={leaderInfo.currentLeader || 'Syncing leader schedule'}
                >
                  {leaderInfo.currentLeader || 'SYNCING LEADER SCHEDULE...'}
                </span>
                <div className="flex items-center justify-between mt-1 text-[10px] text-[#71717A]">
                  <span>Handoff: {leaderInfo.handoffState}</span>
                  <span>Progress: {progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
