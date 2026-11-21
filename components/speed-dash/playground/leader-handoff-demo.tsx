'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface LeaderHandoffDemoProps {
  technicalMode: boolean;
}

export function LeaderHandoffDemo({ technicalMode: _technicalMode }: LeaderHandoffDemoProps) {
  const [activeLeaderIdx, setActiveLeaderIdx] = useState<number>(0);
  const [subSlotRemainingMs, setSubSlotRemainingMs] = useState<number>(160);
  const [decisionState, setDecisionState] = useState<'FIRE' | 'WAIT' | 'CANCEL' | 'UNKNOWN'>('FIRE');
  const [interactiveOutcome, setInteractiveOutcome] = useState<string | null>(null);

  const leaders = [
    { name: 'Validator A (dv4AC...RBVJB)', stake: '2.4%', latency: '8ms' },
    { name: 'Validator B (7xKXt...Q1L)', stake: '1.9%', latency: '12ms' },
    { name: 'Validator C (3kLmn...90P)', stake: '3.1%', latency: '9ms' },
  ];

  const handleNextLeader = () => {
    setActiveLeaderIdx((prev) => (prev + 1) % leaders.length);
    setSubSlotRemainingMs(185);
    setDecisionState('FIRE');
    setInteractiveOutcome(null);
  };

  const handleTestLateFire = () => {
    setSubSlotRemainingMs(18);
    setDecisionState('WAIT');
    setInteractiveOutcome('LATE_FIRED');
  };

  const handleTestFreshFire = () => {
    setSubSlotRemainingMs(160);
    setDecisionState('FIRE');
    setInteractiveOutcome('FRESH_FIRED');
  };

  return (
    <section id="leader" className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>SUB-SLOT TIMING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              Leader Handoff Boundary
            </h2>
            <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-2xl">
              Sending a packet with 18ms left in a 200ms slot hits an outgoing validator right as
              its window closes. Compare late dispatch versus handoff-aware holding.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextLeader}
            className="self-start px-4 py-2 rounded-lg text-xs font-mono font-bold bg-[#FFFFFF] text-[#000000] hover:bg-[#E4E4E7] cursor-pointer inline-flex items-center gap-2"
          >
            <span>ROTATE LEADER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-[#FFFFFF] bg-[#0B0B0E] p-4">
                <span className="text-[10px] font-mono uppercase text-[#FFFFFF] font-bold">
                  CURRENT LEADER
                </span>
                <div className="mt-1 text-sm font-bold text-[#FFFFFF] truncate">
                  {leaders[activeLeaderIdx].name}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                  <span>Stake: {leaders[activeLeaderIdx].stake}</span>
                  <span>QUIC RTT: {leaders[activeLeaderIdx].latency}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#26262E] bg-[#0B0B0E] p-4">
                <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                  NEXT LEADER
                </span>
                <div className="mt-1 text-sm font-bold text-[#E4E4E7] truncate">
                  {leaders[(activeLeaderIdx + 1) % leaders.length].name}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[#71717A] font-mono">
                  <span>Stake: {leaders[(activeLeaderIdx + 1) % leaders.length].stake}</span>
                  <span>Prewarmed TPU</span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA]">Remaining Slot Budget:</span>
                <span className="font-bold text-[#FFFFFF]">
                  {subSlotRemainingMs}ms / 200ms
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#141418] border border-[#26262E] overflow-hidden">
                <div
                  className="h-full bg-[#FFFFFF] transition-all duration-300"
                  style={{ width: `${(subSlotRemainingMs / 200) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleTestLateFire}
                className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] hover:border-[#FFFFFF] text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#FFFFFF] mb-1">
                  <span>1. Simulate Late Dispatch (18ms left)</span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Holds packet for next leader instead of firing into closing window.
                </p>
              </button>

              <button
                type="button"
                onClick={handleTestFreshFire}
                className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] hover:border-[#FFFFFF] text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#FFFFFF] mb-1">
                  <span>2. Simulate Fresh Window (160ms left)</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Dispatches immediately while active leader has full execution headroom.
                </p>
              </button>
            </div>

            {interactiveOutcome && (
              <div className="mt-5 p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] text-xs text-[#E4E4E7] font-mono">
                {interactiveOutcome === 'LATE_FIRED'
                  ? 'DECISION: WAIT -> Only 18ms left in slot. Holding 18ms to route directly to incoming leader TPU.'
                  : 'DECISION: FIRE -> 160ms budget remaining in active slot window. Immediate dispatch.'}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'WAIT',
                icon: Clock,
                title: 'Leader boundary imminent',
                desc: 'Under 40ms left in slot. Hold brief moment for incoming leader.',
              },
              {
                key: 'CANCEL',
                icon: XCircle,
                title: 'Candidate bank abandoned',
                desc: 'UpdateParent invalidated parent branch; abort stale submission.',
              },
              {
                key: 'FIRE',
                icon: Zap,
                title: 'Healthy slot window',
                desc: 'Active leader verified with >=40ms slot headroom.',
              },
              {
                key: 'UNKNOWN',
                icon: HelpCircle,
                title: 'Missing stream data',
                desc: 'Transport offline or stale; never guess fork state.',
              },
            ].map((card) => {
              const Icon = card.icon;
              const active = decisionState === card.key;
              return (
                <div
                  key={card.key}
                  className={`p-4 rounded-xl border bg-[#141418] transition-all ${
                    active ? 'border-[#FFFFFF]' : 'border-[#26262E] opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-mono font-bold text-xs mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span>ACTION: {card.key}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#E4E4E7]">{card.title}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
