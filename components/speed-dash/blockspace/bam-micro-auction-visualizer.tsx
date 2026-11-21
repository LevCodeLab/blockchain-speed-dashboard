'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, ShieldCheck } from 'lucide-react';

interface BamTick {
  index: number;
  timeRange: string;
  type: string;
  cuAllocated: number;
}

export function BamMicroAuctionVisualizer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTickIndex, setCurrentTickIndex] = useState<number>(0);
  const [elapsedSlotMs, setElapsedSlotMs] = useState<number>(0);
  const [priorityFeeTier, setPriorityFeeTier] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [userTxTick, setUserTxTick] = useState<number | null>(2);
  const [txHistory, setTxHistory] = useState<{ id: string; fee: string; tick: number; time: string }[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const TICKS: BamTick[] = [
    { index: 0, timeRange: '0-25ms', type: 'Ingestion', cuAllocated: 5200000 },
    { index: 1, timeRange: '25-50ms', type: 'Ultra Batch', cuAllocated: 6100000 },
    { index: 2, timeRange: '50-75ms', type: 'High DEX', cuAllocated: 6400000 },
    { index: 3, timeRange: '75-100ms', type: 'Rebalance', cuAllocated: 5900000 },
    { index: 4, timeRange: '100-125ms', type: 'Notarize', cuAllocated: 5500000 },
    { index: 5, timeRange: '125-150ms', type: 'BLS Cert', cuAllocated: 6200000 },
    { index: 6, timeRange: '150-175ms', type: 'Standard', cuAllocated: 6800000 },
    { index: 7, timeRange: '175-200ms', type: 'Handoff', cuAllocated: 5900000 },
  ];

  const VISUAL_SLOT_DURATION = 1200;

  useEffect(() => {
    lastTimeRef.current = performance.now();
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const animate = (now: number) => {
      const delta = (now - lastTimeRef.current) % VISUAL_SLOT_DURATION;
      const progress = delta / VISUAL_SLOT_DURATION;
      setElapsedSlotMs(Math.round(progress * 200));
      setCurrentTickIndex(Math.min(7, Math.floor(progress * 8)));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const handleSimulateTx = () => {
    let assignedTick = 2;
    let feeLabel = '50,000 uL (High)';

    if (priorityFeeTier === 'ultra') {
      assignedTick = 1;
      feeLabel = '250,000 uL (Ultra)';
    } else if (priorityFeeTier === 'high') {
      assignedTick = 2;
      feeLabel = '50,000 uL (High)';
    } else if (priorityFeeTier === 'medium') {
      assignedTick = 3;
      feeLabel = '10,000 uL (Med)';
    } else {
      assignedTick = 6;
      feeLabel = '1,000 uL (Low)';
    }

    setUserTxTick(assignedTick);
    setTxHistory((prev) => [
      {
        id: `tx-${Math.random().toString(36).substring(2, 7)}`,
        fee: feeLabel,
        tick: assignedTick,
        time: `${assignedTick * 25}ms window`,
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#26262E]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF]">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
              Block Assembly Marketplace (BAM)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
            25ms Discrete Batch Auction Visualizer
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl">
            Each 200ms slot divides into eight 25ms discrete micro-auction ticks, ordering bundles
            by priority fee without continuous intra-tick latency races.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsPlaying(!isPlaying)}
          className="rounded-lg text-xs font-mono h-9 px-3.5 self-start"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1.5" />
              Pause Sweep
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Resume Sweep
            </>
          )}
        </Button>
      </div>

      {/* 8 Ticks Grid */}
      <div className="py-6 border-b border-[#26262E] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A1A1AA]">
            SLOT SWEEP: <strong className="text-[#FFFFFF]">{elapsedSlotMs}ms / 200ms</strong>
          </span>
          <span className="text-[#FFFFFF] font-bold">Active: Tick {currentTickIndex}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {TICKS.map((tick) => {
            const isActive = tick.index === currentTickIndex;
            const isUserTick = userTxTick === tick.index;

            return (
              <div
                key={tick.index}
                className={`p-3 rounded-xl border transition-all relative ${
                  isActive
                    ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]'
                    : 'border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7]'
                }`}
              >
                {isUserTick && (
                  <div
                    className={`mb-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      isActive
                        ? 'bg-[#0B0B0E] text-[#FFFFFF] border-[#0B0B0E]'
                        : 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                    }`}
                  >
                    YOUR TX
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono flex justify-between ${
                    isActive ? 'text-[#26262E]' : 'text-[#71717A]'
                  }`}
                >
                  <span>T{tick.index}</span>
                  <span>{tick.timeRange}</span>
                </div>
                <div className="text-xs font-bold mt-1 truncate">{tick.type}</div>
                <div
                  className={`text-[10px] font-mono mt-1 ${
                    isActive ? 'text-[#000000] font-bold' : 'text-[#A1A1AA]'
                  }`}
                >
                  {(tick.cuAllocated / 1000000).toFixed(1)}M CU
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Fee Placement */}
      <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-sm font-bold text-[#FFFFFF]">
            Simulate Priority Fee Batch Placement
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {[
              { id: 'low' as const, fee: '1k uL', name: 'Low', land: 'Tick 6' },
              { id: 'medium' as const, fee: '10k uL', name: 'Medium', land: 'Tick 3' },
              { id: 'high' as const, fee: '50k uL', name: 'High', land: 'Tick 2' },
              { id: 'ultra' as const, fee: '250k uL', name: 'Ultra', land: 'Tick 1' },
            ].map((t) => {
              const active = priorityFeeTier === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPriorityFeeTier(t.id)}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000] font-bold'
                      : 'border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF]'
                  }`}
                >
                  <div className="text-[10px] opacity-75">{t.fee}</div>
                  <div className="font-bold text-xs mt-0.5">{t.name}</div>
                  <div className="text-[10px] opacity-75 mt-1">{t.land}</div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleSimulateTx}
            className="rounded-lg font-mono text-xs font-bold px-6 h-10"
          >
            Place Batch Order
          </Button>
        </div>

        <div className="lg:col-span-5 p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] space-y-3 font-mono text-xs">
          <div className="text-[#A1A1AA] uppercase text-[11px] pb-2 border-b border-[#26262E] flex justify-between">
            <span>Batch Feed</span>
            <span className="text-[#FFFFFF]">8 Ticks / Slot</span>
          </div>

          {txHistory.length === 0 ? (
            <div className="text-center py-6 text-[#71717A]">
              Click &quot;Place Batch Order&quot; to test tick assignment.
            </div>
          ) : (
            <div className="space-y-2">
              {txHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-[#26262E] bg-[#141418] flex items-center justify-between"
                >
                  <div>
                    <span className="text-[#FFFFFF] font-bold">{item.id}</span>
                    <span className="text-[10px] text-[#A1A1AA] ml-2">{item.fee}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#FFFFFF] font-bold">Tick {item.tick}</span>
                    <div className="text-[10px] text-[#71717A]">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#26262E] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
          Discrete 25ms batch clearing reduces continuous mempool jitter.
        </span>
        <span className="text-[#FFFFFF] font-bold">200ms = 8 x 25ms</span>
      </div>
    </div>
  );
}
