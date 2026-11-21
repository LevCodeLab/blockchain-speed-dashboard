'use client';

import { useState } from 'react';
import { ShieldCheck, Layers } from 'lucide-react';

export function AccountCapAnalyzer() {
  const [selectedPool, setSelectedPool] = useState<'curve' | 'amm' | 'clmm'>('curve');

  const POOLS = {
    curve: {
      name: 'Token Launchpad Bonding Curve',
      avgCuPerTx: 65000,
    },
    amm: {
      name: 'Constant-Product AMM Pool',
      avgCuPerTx: 140000,
    },
    clmm: {
      name: 'Concentrated Liquidity Whirlpool',
      avgCuPerTx: 180000,
    },
  };

  const currentPool = POOLS[selectedPool];
  const ACCOUNT_CU_CAP_PER_BLOCK = 12000000;

  const legacyMaxCuPerSec = 2.5 * ACCOUNT_CU_CAP_PER_BLOCK;
  const legacyMaxTxPerSec = Math.floor(legacyMaxCuPerSec / currentPool.avgCuPerTx);

  const alpenglowMaxCuPerSec = 5.0 * ACCOUNT_CU_CAP_PER_BLOCK;
  const alpenglowMaxTxPerSec = Math.floor(alpenglowMaxCuPerSec / currentPool.avgCuPerTx);

  return (
    <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 sm:p-8">
      <div className="pb-6 border-b border-[#26262E]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF]">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
            Writable Account Contention • SIMD-0525
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
          12M Compute Unit Single-Account Cap Analyzer
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-2xl">
          No single writable account can exceed 12,000,000 CU per block. Cutting slot duration from
          400ms to 200ms resets that cap 5 times per second instead of 2.5 times, doubling single-pool
          swap throughput.
        </p>
      </div>

      <div className="py-6 border-b border-[#26262E] grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        {(
          [
            { id: 'curve', title: 'Bonding Curve Pool', cu: '~65,000 CU / swap' },
            { id: 'amm', title: 'CPMM Liquidity Pool', cu: '~140,000 CU / swap' },
            { id: 'clmm', title: 'CLMM Tick Pool', cu: '~180,000 CU / swap' },
          ] as const
        ).map((item) => {
          const active = selectedPool === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedPool(item.id)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                active
                  ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF]'
              }`}
            >
              <div>{item.title}</div>
              <div className="text-[10px] opacity-75 mt-1">{item.cu}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        <div className="p-5 rounded-xl border border-[#26262E] bg-[#0B0B0E] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono text-[#A1A1AA] uppercase">Legacy 400ms Slot</span>
              <div className="text-base font-bold text-[#FFFFFF]">2.5 Cap Resets / Sec</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#26262E] bg-[#141418] text-[#A1A1AA]">
              30M CU/s Ceiling
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Reset Interval:</span>
              <span className="text-[#FFFFFF]">Every 400ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Single-Account CU / sec:</span>
              <span className="text-[#FFFFFF]">30,000,000 CU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Max Swaps / sec:</span>
              <span className="text-[#FFFFFF] font-bold">~{legacyMaxTxPerSec} swaps/sec</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono text-[#FFFFFF] font-bold uppercase">
                SIMD-0525 200ms Slot
              </span>
              <div className="text-base font-bold text-[#FFFFFF]">5.0 Cap Resets / Sec</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#000000] font-bold">
              60M CU/s (+100%)
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Reset Interval:</span>
              <span className="text-[#FFFFFF] font-bold">Every 200ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Single-Account CU / sec:</span>
              <span className="text-[#FFFFFF] font-bold">60,000,000 CU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Max Swaps / sec:</span>
              <span className="text-[#FFFFFF] font-bold">~{alpenglowMaxTxPerSec} swaps/sec</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#26262E] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
          Doubles hotspot pool throughput while keeping the 12M CU per-block lock intact.
        </span>
        <span className="text-[#FFFFFF] font-bold">2.0x Pool Throughput</span>
      </div>
    </div>
  );
}
