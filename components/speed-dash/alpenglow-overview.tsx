'use client';

import { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export function AlpenglowOverview() {
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');
  const [simActiveTab, setSimActiveTab] = useState<'aware' | 'blind'>('blind');

  return (
    <section className="relative py-16 sm:py-24 border-b border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7] font-mono text-xs uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
            <span>CONSENSUS ARCHITECTURE • SIMD-0326 &amp; SIMD-0525</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
            What Changed Inside 200ms Slots
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl">
            Slots compressed from 400ms to 200ms while votes moved off-chain into aggregate BLS
            certificates. Here is why slot-level visibility matters when forks compete in real time.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto mb-12">
          {[
            { value: '200ms', label: 'Target Slot Clock' },
            { value: '~150ms', label: 'Votor Fast Finality' },
            { value: '0 CU', label: 'On-Chain Vote Overhead' },
            { value: '8 x 25ms', label: 'BAM Auction Ticks' },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-xl border border-[#26262E] bg-[#141418] text-center"
            >
              <div className="text-2xl sm:text-4xl font-mono font-bold text-[#FFFFFF]">
                {card.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mt-1.5">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl border border-[#26262E] bg-[#141418] gap-1">
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'simple'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              Plain English
            </button>
            <button
              type="button"
              onClick={() => setViewMode('technical')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'technical'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              Protocol Spec
            </button>
          </div>
        </div>

        {viewMode === 'simple' ? (
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="w-9 h-9 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF] flex items-center justify-center mb-4 font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFFFFF]" />
                Sub-Second Finality
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Instead of waiting 32 slots (~12.8s) for TowerBFT lockouts, validators sign
                off-chain BLS certificates and finalize blocks in roughly 150ms when 80% stake agrees.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="w-9 h-9 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF] flex items-center justify-center mb-4 font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FFFFFF]" />
                Competing Candidate Banks
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                During fast leader handoffs, two candidate versions of a slot can exist briefly. If
                an incoming leader issues UpdateParent, the older candidate branch gets dropped.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="w-9 h-9 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF] flex items-center justify-center mb-4 font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
                Provenance First
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Every field in SpeedDash is badged DIRECT, DERIVED, ESTIMATED, or UNAVAILABLE so you
                always know what public RPC actually returned versus what requires validator Geyser.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="text-xs font-mono text-[#A1A1AA] mb-2">SIMD-0326 • VOTOR</div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">BLS12-381 Certificates</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Aggregates validator votes off-chain into compact 192-byte BLS certificates. Fast
                path triggers at 80% active stake; fallback path finalizes at 60% stake.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="text-xs font-mono text-[#A1A1AA] mb-2">SIMD-0337 • HANDOVER</div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">UpdateParent Reparenting</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Incoming leaders begin block production optimistically and emit UpdateParent if a
                stronger notarized parent arrives, pruning uncommitted candidate state cleanly.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#26262E] bg-[#141418]">
              <div className="text-xs font-mono text-[#A1A1AA] mb-2">SIMD-0525 • 200MS CLOCK</div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">5x Per-Second Cap Resets</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Halving slot duration from 400ms to 200ms resets the 12M CU writable-account cap 5
                times per second, doubling single-pool throughput to 60M CU/s.
              </p>
            </div>
          </div>
        )}

        {/* Comparison Simulator */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl border border-[#26262E] bg-[#141418]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#26262E]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">
                <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span>Fork-Boundary Submission Trace</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#FFFFFF]">
                Blind RPC Polling vs Slot-Aware Dispatch
              </h3>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B0B0E] border border-[#26262E]">
              <button
                type="button"
                onClick={() => setSimActiveTab('blind')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  simActiveTab === 'blind'
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                Blind Polling
              </button>
              <button
                type="button"
                onClick={() => setSimActiveTab('aware')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  simActiveTab === 'aware'
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                Slot-Aware
              </button>
            </div>
          </div>

          {simActiveTab === 'blind' ? (
            <div className="p-5 rounded-xl bg-[#0B0B0E] border border-[#26262E] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-mono text-xs text-[#A1A1AA] pb-2 border-b border-[#26262E]">
                <span>SCENARIO: SUBMITTING AT 182MS OF A 200MS SLOT</span>
                <span className="text-[#FFFFFF] font-bold">RESULT: DROPPED ON HANDOFF</span>
              </div>
              <div className="space-y-2 text-[#A1A1AA] font-mono text-xs">
                <div>1. Client fires transaction with only 18ms left in current leader tenure.</div>
                <div>2. Next validator takes over at 200ms and emits SIMD-0337 UpdateParent.</div>
                <div>3. Standard HTTP polling lags by ~450ms and misses the parent switch marker.</div>
                <div className="text-[#FFFFFF] font-semibold">
                  4. Transaction stays stuck on abandoned candidate bank until blockhash expiry.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-[#0B0B0E] border border-[#26262E] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-mono text-xs text-[#A1A1AA] pb-2 border-b border-[#26262E]">
                <span>SCENARIO: SUBMITTING AT 182MS OF A 200MS SLOT</span>
                <span className="text-[#FFFFFF] font-bold">RESULT: CANONICAL INCLUSION</span>
              </div>
              <div className="space-y-2 text-[#A1A1AA] font-mono text-xs">
                <div>1. SlotClock sees &lt;25ms remaining in slot window and holds packet for 18ms.</div>
                <div>2. Engine observes new leader boundary and fresh canonical parent hash.</div>
                <div>3. Transaction dispatches at 0ms of the fresh 200ms leader window.</div>
                <div className="text-[#FFFFFF] font-semibold">
                  4. Confirmed on canonical fork with ~150ms BLS fast-path notarization.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
