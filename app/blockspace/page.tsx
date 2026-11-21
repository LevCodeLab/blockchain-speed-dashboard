'use client';

import Link from 'next/link';
import { Navigation } from '@/components/speed-dash/navigation';
import { FooterSection } from '@/components/speed-dash/footer-section';
import { BlockSpaceMeter } from '@/components/speed-dash/blockspace/block-space-meter';
import { TpsParadoxSimulator } from '@/components/speed-dash/blockspace/tps-paradox-simulator';
import { BamMicroAuctionVisualizer } from '@/components/speed-dash/blockspace/bam-micro-auction-visualizer';
import { AccountCapAnalyzer } from '@/components/speed-dash/blockspace/account-cap-analyzer';
import { useSpeedDash } from '@/hooks/useSpeedDash';
import { ArrowRight } from 'lucide-react';

export default function BlockSpacePage() {
  const { networkStatus, switchCluster } = useSpeedDash();

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#E4E4E7] flex flex-col font-sans">
      <Navigation
        currentCluster={networkStatus.cluster}
        onClusterChange={switchCluster}
        connected={networkStatus.connected}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-14">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#26262E] bg-[#141418] text-[#FFFFFF] text-xs font-mono uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span>BLOCKSPACE &amp; BAM MICRO-AUCTIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#FFFFFF]">
            The 75% Block Space Reclaim
          </h1>

          <p className="text-sm sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Explore why headline explorer TPS drops when on-chain votes disappear while real user
            compute quadruples to 48M CU across eight 25ms BAM auction ticks per 200ms slot.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left font-mono">
            {[
              { label: 'Vote Tx Overhead', val: '-75%', sub: 'Moved to BLS certs' },
              { label: 'User App Headroom', val: '4.0x', sub: '48M non-vote CU' },
              { label: 'BAM Sub-Auctions', val: '25ms', sub: '8 ticks / 200ms slot' },
              { label: 'Hot Account Ceiling', val: '2.0x', sub: '60M CU/s per pool' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl border border-[#26262E] bg-[#141418]"
              >
                <div className="text-[10px] uppercase text-[#A1A1AA]">{item.label}</div>
                <div className="text-xl sm:text-2xl font-bold text-[#FFFFFF] mt-1">{item.val}</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <section id="block-meter" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
              1. 48M Compute Unit Allocation
            </h2>
            <span className="text-xs font-mono text-[#A1A1AA]">SIMD-0326</span>
          </div>
          <BlockSpaceMeter />
        </section>

        <section id="tps-paradox" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
              2. Explorer TPS Paradox Simulator
            </h2>
            <span className="text-xs font-mono text-[#A1A1AA]">Votes vs Swaps</span>
          </div>
          <TpsParadoxSimulator />
        </section>

        <section id="bam-auctions" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
              3. 25ms BAM Batch Auction Lanes
            </h2>
            <span className="text-xs font-mono text-[#A1A1AA]">Sub-Slot Ordering</span>
          </div>
          <BamMicroAuctionVisualizer />
        </section>

        <section id="account-caps" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
              4. 12M CU Single-Account Contention Limit
            </h2>
            <span className="text-xs font-mono text-[#A1A1AA]">SIMD-0525</span>
          </div>
          <AccountCapAnalyzer />
        </section>

        {/* Clean Monochrome Cross-Navigation Card */}
        <section className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
              INTERACTIVE FORK LAB
            </span>
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              Test Candidate Forks &amp; UpdateParent Switches
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl">
              Jump into the Consensus Playground to spawn competing candidate banks, trigger
              SIMD-0337 reparents, and race 150ms BLS certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/playground"
              className="px-5 py-2.5 rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#E4E4E7] font-mono font-bold text-xs inline-flex items-center gap-1.5"
            >
              <span>Open Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg border border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF] font-mono text-xs"
            >
              Live Dashboard
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
