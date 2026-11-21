'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Server,
} from 'lucide-react';

export function EpochTestbench() {
  const [epochMode, setEpochMode] = useState<'PRE_FORK' | 'POST_FORK'>('POST_FORK');
  const [offlineStake, setOfflineStake] = useState<number>(12);
  const [txFlightState, setTxFlightState] = useState<'IDLE' | 'FLIGHT' | 'CONFIRMED'>('IDLE');
  const [flightElapsedMs, setFlightElapsedMs] = useState<number>(0);
  const [flightStage, setFlightStage] = useState<string>('Ready to dispatch');
  const [txPreset, setTxPreset] = useState<'launchpad' | 'raydium' | 'transfer'>('launchpad');

  const flightTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeStake = 100 - offlineStake;
  let consensusPath: 'FAST_PATH' | 'FALLBACK_PATH' | 'STALLED' = 'FAST_PATH';
  let targetFinalityMs = 148;

  if (activeStake >= 80) {
    consensusPath = 'FAST_PATH';
    targetFinalityMs = Math.round(135 + (100 - activeStake) * 1.5);
  } else if (activeStake >= 60) {
    consensusPath = 'FALLBACK_PATH';
    targetFinalityMs = Math.round(210 + (80 - activeStake) * 2.5);
  } else {
    consensusPath = 'STALLED';
    targetFinalityMs = 0;
  }

  const handleFireTx = () => {
    if (txFlightState === 'FLIGHT') return;
    if (consensusPath === 'STALLED' && epochMode === 'POST_FORK') {
      setFlightStage('Halted: less than 60% active stake online');
      return;
    }

    if (flightTimerRef.current) clearInterval(flightTimerRef.current);
    setTxFlightState('FLIGHT');
    setFlightElapsedMs(0);
    setFlightStage('Signing and submitting to leader QUIC port...');

    const startTime = performance.now();
    const finality = epochMode === 'POST_FORK' ? targetFinalityMs : 12800;

    flightTimerRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = Math.round(now - startTime);
      setFlightElapsedMs(elapsed);

      if (epochMode === 'POST_FORK') {
        if (elapsed < 35) {
          setFlightStage('Turbine shred dispatched to 200ms candidate bank...');
        } else if (elapsed < 85) {
          setFlightStage('Candidate bank executed. Collecting Votor votes...');
        } else if (elapsed < finality) {
          setFlightStage(`Aggregating BLS12-381 signatures (${activeStake.toFixed(1)}% stake)...`);
        } else {
          clearInterval(flightTimerRef.current!);
          setFlightElapsedMs(finality);
          setFlightStage(`Votor certificate notarized in ${finality}ms`);
          setTxFlightState('CONFIRMED');
        }
      } else {
        if (elapsed < 400) {
          setFlightStage('Included in 400ms block. Waiting for TowerBFT lockouts...');
        } else if (elapsed < 3200) {
          setFlightStage(`Lockout round: ${Math.min(32, Math.floor(elapsed / 100))}/32 slots...`);
        } else {
          clearInterval(flightTimerRef.current!);
          setFlightElapsedMs(12800);
          setFlightStage('Rooted after 32 lockouts (~12.8s)');
          setTxFlightState('CONFIRMED');
        }
      }
    }, 20);
  };

  const handleResetTx = () => {
    if (flightTimerRef.current) clearInterval(flightTimerRef.current);
    setTxFlightState('IDLE');
    setFlightElapsedMs(0);
    setFlightStage('Ready to dispatch');
  };

  useEffect(() => {
    return () => {
      if (flightTimerRef.current) clearInterval(flightTimerRef.current);
    };
  }, []);

  return (
    <section className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#26262E] bg-[#141418] text-xs font-mono text-[#E4E4E7] mb-3">
              INTERACTIVE CONSENSUS FLIGHT BENCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              TowerBFT vs Votor Flight Timer
            </h2>
            <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-xl">
              Fire a test transaction and drag the offline validator stake slider to test fast-path
              (&ge;80% stake) versus fallback-path (&ge;60% stake) notarization.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl border border-[#26262E] bg-[#141418] gap-1 self-start">
            <button
              type="button"
              onClick={() => {
                setEpochMode('PRE_FORK');
                handleResetTx();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                epochMode === 'PRE_FORK'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              Legacy TowerBFT
            </button>
            <button
              type="button"
              onClick={() => {
                setEpochMode('POST_FORK');
                handleResetTx();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                epochMode === 'POST_FORK'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              Alpenglow Votor
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Flight Engine */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-[#26262E] bg-[#141418] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#26262E] mb-5 text-xs font-mono">
                <span className="text-[#FFFFFF] font-bold flex items-center gap-2">
                  <Play className="w-3.5 h-3.5" />
                  TRANSACTION FLIGHT
                </span>
                <span className="text-[#A1A1AA]">
                  Engine: <strong className="text-[#FFFFFF]">{epochMode === 'POST_FORK' ? 'Votor BLS' : 'TowerBFT'}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs font-mono text-[#A1A1AA] mr-1">Workload:</span>
                {[
                  { id: 'launchpad' as const, label: 'Bonding Curve Swap' },
                  { id: 'raydium' as const, label: 'AMM Arbitrage' },
                  { id: 'transfer' as const, label: 'SOL Transfer' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTxPreset(p.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono border cursor-pointer ${
                      txPreset === p.id
                        ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                        : 'bg-[#0B0B0E] text-[#E4E4E7] border-[#26262E] hover:border-[#FFFFFF]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-xl border border-[#26262E] bg-[#0B0B0E] mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-[#A1A1AA] uppercase mb-1">
                    Elapsed Time
                  </div>
                  <div className="text-4xl font-mono font-bold text-[#FFFFFF] flex items-baseline gap-1.5">
                    <span>{flightElapsedMs}</span>
                    <span className="text-base text-[#A1A1AA] font-normal">ms</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-[11px] font-mono text-[#A1A1AA] uppercase mb-1">
                    Target Finality
                  </div>
                  <div className="text-lg font-mono font-bold text-[#FFFFFF]">
                    {epochMode === 'POST_FORK'
                      ? consensusPath === 'STALLED'
                        ? 'HALTED (<60%)'
                        : `~${targetFinalityMs}ms BLS Cert`
                      : '~12,800ms Root'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
                  <span>STAGE</span>
                  <span className="text-[#FFFFFF] truncate max-w-xs">{flightStage}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0B0B0E] border border-[#26262E] overflow-hidden">
                  <div
                    className="h-full bg-[#FFFFFF] transition-all duration-75"
                    style={{
                      width: `${
                        txFlightState === 'CONFIRMED'
                          ? 100
                          : epochMode === 'POST_FORK' && targetFinalityMs > 0
                          ? Math.min(100, Math.round((flightElapsedMs / targetFinalityMs) * 100))
                          : Math.min(100, Math.round((flightElapsedMs / 3200) * 100))
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#26262E]">
              <Button
                onClick={handleFireTx}
                disabled={txFlightState === 'FLIGHT'}
                className="h-10 px-5 rounded-lg font-mono text-xs font-bold"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                {txFlightState === 'FLIGHT' ? 'In Flight...' : 'Fire Transaction'}
              </Button>

              <Button
                onClick={handleResetTx}
                variant="outline"
                className="h-10 px-4 rounded-lg font-mono text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </Button>

              {txFlightState === 'CONFIRMED' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FFFFFF] px-3 py-1.5 rounded-md bg-[#0B0B0E] border border-[#26262E]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Certified
                </span>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Stake Fault Tolerance Slider */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-[#26262E] bg-[#141418] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#26262E] mb-5 text-xs font-mono">
                <span className="text-[#FFFFFF] font-bold flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  STAKE QUORUM LAB
                </span>
                <span className="px-2 py-0.5 rounded border border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA] text-[10px]">
                  QUORUM THRESHOLDS
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A1A1AA]">Offline Validator Stake:</span>
                  <span className="text-[#FFFFFF] font-bold">{offlineStake}% OFFLINE</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={offlineStake}
                  onChange={(e) => setOfflineStake(Number(e.target.value))}
                  className="w-full accent-white h-2 bg-[#0B0B0E] rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                  <span>0%</span>
                  <span>20% (Fast Limit)</span>
                  <span>40% (Fallback)</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] space-y-2.5 mb-5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">ACTIVE STAKE:</span>
                  <span className="text-[#FFFFFF] font-bold">{activeStake.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">PATHWAY:</span>
                  <span className="px-2 py-0.5 rounded bg-[#FFFFFF] text-[#000000] font-bold text-[10px]">
                    {consensusPath === 'FAST_PATH'
                      ? 'FAST PATH (>=80%)'
                      : consensusPath === 'FALLBACK_PATH'
                      ? 'FALLBACK (>=60%)'
                      : 'HALTED (<60%)'}
                  </span>
                </div>

                <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed pt-2 border-t border-[#26262E]">
                  {consensusPath === 'FAST_PATH'
                    ? '80%+ stake reachable: single-round BLS aggregate certificate finalizes in ~150ms.'
                    : consensusPath === 'FALLBACK_PATH'
                    ? '60%-79% stake reachable: two-round fallback certificate preserves safety.'
                    : 'Under 60% stake online: consensus halts safely rather than risking conflicting forks.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#26262E] bg-[#0B0B0E] flex items-center justify-between text-xs font-mono text-[#A1A1AA]">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span>SIMD-0326 Quorum Spec</span>
              </span>
              <span className="text-[#FFFFFF] font-bold">20% / 40%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
