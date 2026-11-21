'use client';

import { useState } from 'react';
import { CandidateBank, ParentSwitchEvent } from '@/lib/speed-client/types';
import { ArrowRight, ArrowDown, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ProvenanceBadge } from './provenance-badge';

interface BankGraphSectionProps {
  currentSlot: number;
  candidateBanks: CandidateBank[];
  parentSwitch: ParentSwitchEvent | null;
}

export function BankGraphSection({
  currentSlot,
  candidateBanks,
  parentSwitch,
}: BankGraphSectionProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true);

  return (
    <section id="network" className="relative py-16 sm:py-24 border-b border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-mono text-[#A1A1AA] mb-3">
              <span className="w-6 h-px bg-[#26262E]" />
              Candidate Bank Graph (SIMD-0326 / SIMD-0337)
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Candidate banks.
              <span className="block text-[#A1A1AA]">Slots are time windows, not single blocks.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-[#A1A1AA] max-w-md">
            <span>
              Under fast leader handover, leaders initiate blocks optimistically. Multiple candidate
              banks can compete in one slot until consensus notarizes the canonical branch.
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
              SIMD-0337 UpdateParent monitor active
            </span>
          </div>
        </div>

        {/* Version A vs Version B Explainer */}
        <div className="mb-10 p-6 lg:p-8 border border-[#26262E] rounded-2xl bg-[#141418]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Fork Choice Model
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                Multiple versions of a slot can exist at the same moment.
              </h3>
            </div>
            <div className="text-xs font-mono text-[#A1A1AA] max-w-md">
              <span className="text-[#FFFFFF] font-semibold">Switch to Offline Simulator</span> in
              the top-right cluster dropdown to watch live multi-bank forks and UpdateParent switches
              fire every few slots.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-mono text-xs">
            <div className="p-5 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#A1A1AA]">VERSION A (Candidate)</span>
                <span className="text-[10px] px-2 py-0.5 rounded border border-[#26262E] bg-[#141418] text-[#A1A1AA]">
                  DROPPED
                </span>
              </div>
              <p className="text-[#A1A1AA] text-xs font-sans mb-3">
                Built optimistically on an unfinalized predecessor. When validators switch parents
                via UpdateParent, Version A is pruned.
              </p>
              <div className="text-[11px] text-[#71717A] space-y-1">
                <div>State: <span className="text-[#E4E4E7]">ABANDONED</span></div>
                <div>Uncommitted txs: <span className="text-[#E4E4E7]">Rolled back</span></div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-2 text-[#A1A1AA]">
              <span className="text-xs font-mono mb-1 font-bold text-[#FFFFFF]">VALIDATOR FORK CHOICE</span>
              <ArrowRight className="w-5 h-5 hidden md:block text-[#A1A1AA] my-1" />
              <ArrowDown className="w-5 h-5 md:hidden text-[#A1A1AA] my-1" />
              <span className="text-[11px] text-[#71717A]">SIMD-0337 Fast Handover</span>
            </div>

            <div className="p-5 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#FFFFFF]">VERSION B (Canonical)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFFFF] text-[#000000] font-bold">
                  CANONICAL
                </span>
              </div>
              <p className="text-[#E4E4E7] text-xs font-sans mb-3">
                Gathers 80% stake notarization certificate and becomes the canonical head of the chain.
              </p>
              <div className="text-[11px] text-[#A1A1AA] space-y-1">
                <div>State: <span className="text-[#FFFFFF] font-semibold">NOTARIZED</span></div>
                <div>Consensus: <span className="text-[#FFFFFF]">Next leader builds here</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Switch Alert Card */}
        {parentSwitch ? (
          <div className="mb-10 border border-[#FFFFFF] p-6 bg-[#141418] rounded-xl">
            <div className="flex items-center justify-between gap-3 text-xs font-mono uppercase tracking-wider text-[#FFFFFF] mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>PARENT CHANGED - FAST LEADER HANDOVER (SIMD-0337)</span>
              </div>
              <ProvenanceBadge provenance={parentSwitch.provenance} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
              <div className="flex-1 p-4 border border-[#26262E] bg-[#0B0B0E] rounded-lg">
                <span className="text-[10px] font-mono text-[#A1A1AA] block mb-1">
                  ABANDONED CANDIDATE
                </span>
                <span className="text-lg font-mono font-bold block text-[#A1A1AA] line-through">
                  {parentSwitch.clearedBankId || parentSwitch.abandonedBankId}
                </span>
                <span className="text-xs font-mono text-[#71717A] mt-1 block">
                  Uncommitted state pruned
                </span>
              </div>

              <div className="flex items-center justify-center text-[#FFFFFF]">
                <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
              </div>

              <div className="flex-1 p-4 border border-[#FFFFFF] bg-[#0B0B0E] rounded-lg">
                <span className="text-[10px] font-mono text-[#FFFFFF] font-bold block mb-1">
                  NEW CANONICAL PARENT
                </span>
                <span className="text-lg font-mono font-bold block text-[#FFFFFF]">
                  {parentSwitch.replacementBankId || parentSwitch.canonicalBankId}
                </span>
                <span className="text-xs font-mono text-[#A1A1AA] mt-1 block">
                  Promoted fork head on slot #{parentSwitch.slot}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 p-4 border border-[#26262E] bg-[#141418] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#A1A1AA]">
            <span className="flex items-center gap-2 text-[#E4E4E7]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
              No parent switch recorded in current slot window
            </span>
            <span>Listening for SIMD-0337 UpdateParent events</span>
          </div>
        )}

        {/* Observed Slot State */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
            Observed Slot State (Slot #{currentSlot > 0 ? currentSlot.toLocaleString() : '--'})
          </span>
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E4E4E7] hover:text-[#FFFFFF] cursor-pointer"
          >
            <span>{showTechnicalDetails ? 'Collapse Details' : 'Expand Details'}</span>
            {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showTechnicalDetails && (
          <div className="border border-[#26262E] rounded-xl overflow-hidden bg-[#141418]">
            <div className="px-6 py-3.5 border-b border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs text-[#A1A1AA] bg-[#0B0B0E]">
              <span>
                SLOT {currentSlot > 0 ? currentSlot.toLocaleString() : '--'} BRANCHES
              </span>
              <span>{candidateBanks.length} CANDIDATE(S) TRACKED</span>
            </div>

            {candidateBanks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#26262E]">
                {candidateBanks.map((bank, index) => {
                  const isCanonical = bank.state === 'CANONICAL' || bank.state === 'FINALIZED';
                  const isAbandoned = bank.state === 'ABANDONED';

                  return (
                    <div key={`${bank.slot}-${bank.bankId}-${index}`} className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-mono font-bold text-[#FFFFFF] block">
                            {bank.bankId}
                          </span>
                          {bank.rawBankId !== undefined && (
                            <span className="text-[10px] font-mono text-[#71717A]">
                              Node Bank ID: #{bank.rawBankId}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${
                              isCanonical
                                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                                : isAbandoned
                                ? 'bg-[#0B0B0E] text-[#71717A] border-[#26262E] line-through'
                                : 'bg-[#0B0B0E] text-[#E4E4E7] border-[#26262E]'
                            }`}
                          >
                            {bank.state}
                          </span>
                          <ProvenanceBadge provenance={bank.provenance} />
                        </div>
                      </div>

                      <div className="space-y-2.5 font-mono text-xs">
                        <div>
                          <span className="text-[#71717A] block">Blockhash</span>
                          <span className="text-[#E4E4E7] truncate block">
                            {bank.blockhash || 'UNAVAILABLE'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block">Parent Reference</span>
                          <span className="text-[#E4E4E7] truncate block">
                            {bank.parentBankId || '--'}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#26262E]">
                          <span className="text-[#71717A]">Transactions</span>
                          <span className="text-[#FFFFFF]">{bank.txCount} txs</span>
                        </div>
                        {bank.abandonmentReason && (
                          <div className="pt-2 border-t border-[#26262E] text-[#A1A1AA] text-[11px]">
                            {bank.abandonmentReason}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center text-xs font-mono text-[#A1A1AA]">
                Syncing slot stream...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
