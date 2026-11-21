'use client';

import { useState, useEffect } from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

interface BlockSegment {
  id: string;
  label: string;
  cu: number;
  percent: number;
  shade: string;
  badge: string;
  description: string;
}

export function BlockSpaceMeter() {
  const [mode, setMode] = useState<'legacy' | 'alpenglow'>('alpenglow');
  const [animatedCu, setAnimatedCu] = useState(48000000);

  const legacySegments: BlockSegment[] = [
    {
      id: 'votes',
      label: 'Validator Vote Transactions',
      cu: 36000000,
      percent: 75.0,
      shade: 'bg-[#26262E] text-[#A1A1AA] border-[#3F3F46]',
      badge: 'OVERHEAD',
      description: 'TowerBFT votes submitted as on-chain transactions by ~1,450 active validators.',
    },
    {
      id: 'dex',
      label: 'DEX Swaps & Orderbooks',
      cu: 6240000,
      percent: 13.0,
      shade: 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]',
      badge: 'USER APP',
      description: 'AMM and orderbook swaps competing for remaining compute headroom.',
    },
    {
      id: 'launchpad',
      label: 'Bonding Curve Pools',
      cu: 3840000,
      percent: 8.0,
      shade: 'bg-[#A1A1AA] text-[#000000] border-[#A1A1AA]',
      badge: 'USER APP',
      description: 'High-contention bonding curve swaps hitting writable account caps.',
    },
    {
      id: 'system',
      label: 'Transfers & Oracles',
      cu: 1920000,
      percent: 4.0,
      shade: 'bg-[#52525B] text-[#FFFFFF] border-[#71717A]',
      badge: 'USER APP',
      description: 'SOL/SPL transfers, account initializations, and oracle price feeds.',
    },
  ];

  const alpenglowSegments: BlockSegment[] = [
    {
      id: 'votes',
      label: 'Validator Vote Overhead',
      cu: 0,
      percent: 0.0,
      shade: 'bg-[#141418] text-[#71717A] border-[#26262E]',
      badge: 'OFF-CHAIN BLS',
      description: 'Zero on-chain vote transactions; aggregated into 192-byte BLS certificates.',
    },
    {
      id: 'dex',
      label: 'DEX Swaps & Orderbooks',
      cu: 24960000,
      percent: 52.0,
      shade: 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]',
      badge: '4X CAPACITY',
      description: 'Quadrupled block compute headroom for routers, CLOBs, and AMM pools.',
    },
    {
      id: 'launchpad',
      label: 'Bonding Curve Pools',
      cu: 15360000,
      percent: 32.0,
      shade: 'bg-[#A1A1AA] text-[#000000] border-[#D4D4D8]',
      badge: '4X CAPACITY',
      description: 'Four times higher swap capacity per block with lower contention drops.',
    },
    {
      id: 'system',
      label: 'Transfers & Oracles',
      cu: 7680000,
      percent: 16.0,
      shade: 'bg-[#3F3F46] text-[#FFFFFF] border-[#52525B]',
      badge: 'UNCONGESTED',
      description: 'Clean execution room for payments, transfers, and consumer programs.',
    },
  ];

  const currentSegments = mode === 'legacy' ? legacySegments : alpenglowSegments;
  const userCuAvailable = mode === 'legacy' ? 12000000 : 48000000;
  const userPercent = mode === 'legacy' ? 25 : 100;

  useEffect(() => {
    const end = userCuAvailable;
    const duration = 500;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAnimatedCu(Math.round(end * progress));
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }, [mode, userCuAvailable]);

  return (
    <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#26262E]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF]">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
              48,000,000 Compute Unit Block Limit
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
            Block Space Allocation Meter
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl">
            Under TowerBFT, ~75% of every block was consumed by validator votes. Moving votes into
            off-chain BLS certificates unlocks all 48M CU for user transactions.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B0B0E] border border-[#26262E] self-start">
          <button
            type="button"
            onClick={() => setMode('legacy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
              mode === 'legacy'
                ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
            }`}
          >
            Legacy TowerBFT
          </button>
          <button
            type="button"
            onClick={() => setMode('alpenglow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
              mode === 'alpenglow'
                ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
            }`}
          >
            Alpenglow Votor
          </button>
        </div>
      </div>

      <div className="py-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
            <div className="text-[11px] text-[#A1A1AA] uppercase">User App Space</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] mt-1">
              {(animatedCu / 1000000).toFixed(1)}M{' '}
              <span className="text-xs font-normal text-[#71717A]">/ 48M CU</span>
            </div>
            <div className="text-[11px] text-[#A1A1AA] mt-1">{userPercent}% available to apps</div>
          </div>

          <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
            <div className="text-[11px] text-[#A1A1AA] uppercase">Vote Overhead</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] mt-1">
              {mode === 'legacy' ? '36.0M CU' : '0.0 CU'}
            </div>
            <div className="text-[11px] text-[#A1A1AA] mt-1">
              {mode === 'legacy' ? '75% locked by votes' : 'Off-chain BLS certificates'}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
            <div className="text-[11px] text-[#A1A1AA] uppercase">Capacity Multiplier</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] mt-1">
              {mode === 'alpenglow' ? '4.0x (+300%)' : '1.0x'}
            </div>
            <div className="text-[11px] text-[#A1A1AA] mt-1">
              {mode === 'alpenglow' ? '4x user compute per block' : 'Vote-congested baseline'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
            <span>0 CU</span>
            <span className="text-[#FFFFFF] font-bold">48,000,000 CU</span>
          </div>

          <div className="h-11 w-full rounded-xl border border-[#26262E] bg-[#0B0B0E] overflow-hidden flex p-1 gap-1">
            {currentSegments.map((seg) => {
              if (seg.percent <= 0) return null;
              return (
                <div
                  key={seg.id}
                  style={{ width: `${seg.percent}%` }}
                  className={`h-full rounded-lg ${seg.shade} border transition-all duration-500 flex items-center justify-center px-2`}
                >
                  <span className="text-[10px] sm:text-xs font-mono font-bold truncate select-none">
                    {seg.percent >= 8 ? `${seg.percent}%` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentSegments.map((seg) => (
            <div
              key={seg.id}
              className={`p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] ${
                seg.cu === 0 ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#FFFFFF] truncate">{seg.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#26262E] bg-[#141418] text-[#A1A1AA]">
                  {seg.badge}
                </span>
              </div>
              <div className="text-lg font-mono font-bold text-[#FFFFFF] mt-2">
                {(seg.cu / 1000000).toFixed(1)}M CU{' '}
                <span className="text-xs font-normal text-[#A1A1AA]">({seg.percent}%)</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">{seg.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#26262E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#A1A1AA]">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
          Derived from SIMD-0326 off-chain Votor vote aggregation.
        </span>
        <span className="text-[#FFFFFF] font-bold">
          Non-Vote Space: {mode === 'alpenglow' ? '100%' : '25%'}
        </span>
      </div>
    </div>
  );
}
