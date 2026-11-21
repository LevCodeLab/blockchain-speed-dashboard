'use client';

import React, { useState } from 'react';
import { GitFork, GitBranch, XCircle, RefreshCw, Info } from 'lucide-react';
import { ProvenanceBadge } from '@/components/speed-dash/provenance-badge';

interface CandidateBanksDemoProps {
  technicalMode: boolean;
}

export function CandidateBanksDemo({ technicalMode }: CandidateBanksDemoProps) {
  const [bankCount, setBankCount] = useState<number>(3);
  const [slotNumber] = useState<number>(447809653);
  const [followedBank, setFollowedBank] = useState<string>('bank-B');
  const [abandonedBanks, setAbandonedBanks] = useState<string[]>([]);
  const [canonicalBank, setCanonicalBank] = useState<string | null>(null);
  const [updateParentTriggered, setUpdateParentTriggered] = useState<boolean>(false);
  const [parentSlot, setParentSlot] = useState<number>(499);

  const resetDemo = () => {
    setAbandonedBanks([]);
    setCanonicalBank(null);
    setUpdateParentTriggered(false);
    setParentSlot(499);
    setFollowedBank('bank-B');
  };

  const handleAbandonFollowed = () => {
    if (!abandonedBanks.includes(followedBank)) {
      setAbandonedBanks([...abandonedBanks, followedBank]);
      setCanonicalBank(followedBank === 'bank-A' ? 'bank-B' : 'bank-A');
    }
  };

  const handleUpdateParent = () => {
    setUpdateParentTriggered(true);
    setParentSlot(500);
    if (!abandonedBanks.includes('bank-A')) {
      setAbandonedBanks([...abandonedBanks, 'bank-A']);
    }
    setCanonicalBank('bank-B');
    setFollowedBank('bank-B');
  };

  const letters = ['A', 'B', 'C', 'D'].slice(0, bankCount);

  return (
    <section id="forks" className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
              <GitFork className="w-3.5 h-3.5" />
              <span>CANDIDATE BANK GRAPH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              One Slot. Multiple Competing Banks.
            </h2>
            <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-2xl">
              Click any bank below to follow it, then abandon it or fire SIMD-0337 UpdateParent to
              watch how canonical fork resolution prunes uncommitted branches.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141418] p-1 rounded-xl border border-[#26262E] self-start">
            <span className="text-xs font-mono text-[#A1A1AA] px-2">Branches:</span>
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setBankCount(count);
                  resetDemo();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  bankCount === count
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#26262E]">
            <div>
              <span className="text-[11px] font-mono text-[#A1A1AA] uppercase">Active Slot</span>
              <div className="text-xl font-mono font-bold text-[#FFFFFF]">SLOT {slotNumber}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAbandonFollowed}
                disabled={abandonedBanks.includes(followedBank)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono border border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF] disabled:opacity-40 cursor-pointer inline-flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>ABANDON {followedBank.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={handleUpdateParent}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FFFFFF] text-[#000000] hover:bg-[#E4E4E7] cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRIGGER UPDATE_PARENT (SIMD-0337)</span>
              </button>

              <button
                type="button"
                onClick={resetDemo}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="py-8">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 rounded-lg border border-[#26262E] bg-[#0B0B0E] text-[#FFFFFF] font-mono text-xs">
                Parent Block: Slot {parentSlot}{' '}
                {updateParentTriggered && '(Reparented via SIMD-0337)'}
              </div>
              <div className="w-px h-6 bg-[#26262E] mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {letters.map((letter) => {
                const bankId = `bank-${letter}`;
                const isFollowed = followedBank === bankId;
                const isAbandoned = abandonedBanks.includes(bankId);
                const isCanonical =
                  canonicalBank === bankId || (!isAbandoned && !canonicalBank && isFollowed);

                return (
                  <div
                    key={letter}
                    onClick={() => !isAbandoned && setFollowedBank(bankId)}
                    className={`rounded-xl border p-4 bg-[#0B0B0E] transition-all cursor-pointer ${
                      isAbandoned
                        ? 'border-[#26262E] opacity-55'
                        : isFollowed
                        ? 'border-[#FFFFFF]'
                        : 'border-[#26262E] hover:border-[#52525B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        <span className="font-mono text-sm font-bold text-[#FFFFFF]">
                          BANK {letter}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          isAbandoned
                            ? 'border-[#26262E] bg-[#141418] text-[#71717A] line-through'
                            : isCanonical
                            ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold'
                            : 'border-[#26262E] bg-[#141418] text-[#E4E4E7]'
                        }`}
                      >
                        {isAbandoned ? 'ABANDONED' : isCanonical ? 'CANONICAL' : 'CANDIDATE'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#A1A1AA] font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#71717A]">Parent Slot:</span>
                        <span className="text-[#E4E4E7]">
                          {isAbandoned && updateParentTriggered ? parentSlot - 1 : parentSlot}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#71717A]">Blockhash:</span>
                        <span className="text-[#E4E4E7]">4xMvK...{letter}653</span>
                      </div>
                      {technicalMode && (
                        <div className="flex justify-between pt-1.5 border-t border-[#26262E] text-[11px]">
                          <span className="text-[#71717A]">bank_hash:</span>
                          <span className="text-[#FFFFFF]">Hash_{letter}{slotNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#26262E] bg-[#0B0B0E] p-4 flex items-start gap-3 text-xs text-[#A1A1AA]">
            <Info className="w-4 h-4 text-[#FFFFFF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#FFFFFF]">Takeaway:</strong> Treating an unnotarized
              candidate bank as final risks acting on rolled-back state whenever SIMD-0337 switches
              the parent branch.
            </div>
          </div>

          {technicalMode && (
            <div className="mt-6 pt-6 border-t border-[#26262E]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#E4E4E7] uppercase">
                  CanonicalResolver State Dump
                </span>
                <ProvenanceBadge provenance="ESTIMATED" />
              </div>
              <pre className="p-4 rounded-xl bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7] font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(
                  {
                    slot: slotNumber,
                    active_banks_count: bankCount,
                    followed_bank: followedBank,
                    abandoned_branches: abandonedBanks,
                    canonical_resolution: canonicalBank || followedBank,
                    update_parent_triggered: updateParentTriggered,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
