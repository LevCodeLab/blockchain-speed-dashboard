'use client';

import React, { useState } from 'react';
import { Coins, Zap, Ghost, BarChart3, Landmark, ArrowRight } from 'lucide-react';

export function RealWorldScenarios() {
  const [activeScenario, setActiveScenario] = useState<string>('new_pool');

  const scenarios = [
    {
      id: 'new_pool',
      title: 'Liquidity Pool Creation',
      icon: Coins,
      summary: 'A new AMM liquidity pool initializes inside a 200ms slot.',
      pipeline: ['Shred Observed', 'Slot Boundary', 'Leader QUIC Route', 'Candidate Bank B', 'FIRE'],
      explanation:
        'Shred-level observation spots new pool initialization before standard HTTP RPC block polling catches up.',
    },
    {
      id: 'leader_handoff',
      title: 'Leader Handoff Boundary',
      icon: Zap,
      summary: 'Submission arrives 15ms before the 4-slot leader tenure ends.',
      pipeline: ['Submit Request', 'Tenure Check (<40ms)', 'Hold 15ms', 'Next Leader Active', 'SEND'],
      explanation:
        'Holding 15ms avoids sending into a closing slot window and routes cleanly to the incoming validator.',
    },
    {
      id: 'ghost_block',
      title: 'Candidate Fork Reorg',
      icon: Ghost,
      summary: 'An observed candidate bank gets superseded via UpdateParent.',
      pipeline: ['Candidate Observed', 'UpdateParent Marker', 'Branch Pruned', 'CANCEL', 'Re-Sign'],
      explanation:
        'Detecting SIMD-0337 immediately lets clients re-sign against the winning canonical blockhash.',
    },
    {
      id: 'trading_terminal',
      title: 'Sub-Second Desk',
      icon: BarChart3,
      summary: 'Desk monitors confirmed orderbook state across 200ms slots.',
      pipeline: ['Slot Height', 'Leader Schedule', 'Canonical Bank', 'BLS Proof', 'Final (~150ms)'],
      explanation:
        'Aggregate BLS certificates confirm settlement in ~150ms instead of waiting 32 TowerBFT slots.',
    },
    {
      id: 'settlement',
      title: 'Atomic DvP Settlement',
      icon: Landmark,
      summary: 'Asset and payment legs settle with irreversible finality.',
      pipeline: ['Asset Leg', 'Payment Leg', 'Candidate Notarized', '84.6% Stake Cert', 'Settled'],
      explanation:
        'Once 80% active stake signs the fast-path BLS certificate, neither leg can be rolled back.',
    },
  ];

  const current = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  return (
    <section className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
            WORKFLOW PIPELINES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
            Real-World Slot Workflows
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isSelected = activeScenario === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveScenario(s.id)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]'
                    : 'border-[#26262E] bg-[#141418] text-[#E4E4E7] hover:border-[#FFFFFF]'
                }`}
              >
                <Icon className="w-4 h-4 mb-2" />
                <div>
                  <div className="text-xs font-bold">{s.title}</div>
                  <div
                    className={`text-[10px] mt-1 line-clamp-2 ${
                      isSelected ? 'text-[#26262E]' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {s.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
          <h3 className="text-base font-bold text-[#FFFFFF] mb-4">{current.title} Pipeline</h3>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {current.pipeline.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="px-3.5 py-2 rounded-lg border border-[#26262E] bg-[#0B0B0E] text-xs font-mono text-[#FFFFFF]">
                  {step}
                </div>
                {idx < current.pipeline.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] text-xs text-[#A1A1AA] leading-relaxed">
            <strong className="text-[#FFFFFF]">Why it matters: </strong>
            {current.explanation}
          </div>
        </div>
      </div>
    </section>
  );
}
