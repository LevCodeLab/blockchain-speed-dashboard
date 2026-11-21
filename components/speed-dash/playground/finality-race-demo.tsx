'use client';

import React, { useState } from 'react';
import { Timer, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { ProvenanceBadge } from '@/components/speed-dash/provenance-badge';

interface FinalityRaceDemoProps {
  technicalMode: boolean;
}

export function FinalityRaceDemo({ technicalMode: _technicalMode }: FinalityRaceDemoProps) {
  const [raceRunning, setRaceRunning] = useState<boolean>(false);
  const [clockValue, setClockValue] = useState<number>(12.8);
  const [lane1Progress, setLane1Progress] = useState<number>(0);
  const [lane2Progress, setLane2Progress] = useState<number>(0);
  const [lane2Done, setLane2Done] = useState<boolean>(false);
  const [lane1Done, setLane1Done] = useState<boolean>(false);
  const [tampered, setTampered] = useState<boolean>(false);

  const startRace = () => {
    setRaceRunning(true);
    setLane1Progress(0);
    setLane2Progress(0);
    setLane2Done(false);
    setLane1Done(false);
    setClockValue(12.8);

    let p2 = 0;
    const interval2 = setInterval(() => {
      p2 += 10;
      setLane2Progress(p2);
      if (p2 >= 100) {
        clearInterval(interval2);
        setLane2Done(true);
        setClockValue(0.15);
      }
    }, 100);

    let p1 = 0;
    const interval1 = setInterval(() => {
      p1 += 2;
      setLane1Progress(p1);
      if (p1 >= 100) {
        clearInterval(interval1);
        setLane1Done(true);
        setRaceRunning(false);
      }
    }, 90);
  };

  const resetRace = () => {
    setRaceRunning(false);
    setLane1Progress(0);
    setLane2Progress(0);
    setLane1Done(false);
    setLane2Done(false);
    setClockValue(12.8);
  };

  return (
    <section id="finality" className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
            <Timer className="w-3.5 h-3.5" />
            <span>FINALITY RACE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] tracking-tight">
            32 TowerBFT Lockouts vs 150ms BLS Certificate
          </h2>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Run both consensus lanes side-by-side to see 85x faster notarization, then test tampered
            BLS certificate rejection.
          </p>
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
            <div className="p-5 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <span className="text-[11px] font-mono uppercase text-[#71717A]">
                TOWERBFT BASELINE
              </span>
              <div className="text-3xl font-bold text-[#A1A1AA] font-mono mt-1">~12.8s</div>
              <p className="text-xs text-[#71717A] mt-2">32 sequential block lockouts.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <span className="text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                FINALITY CLOCK
              </span>
              <div className="text-5xl font-bold font-mono text-[#FFFFFF] my-1">
                {clockValue === 0.15 ? '0.150s' : `${clockValue.toFixed(1)}s`}
              </div>
              <span className="px-3 py-1 rounded-md bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7] text-xs font-mono">
                85.3x compression target
              </span>
            </div>

            <div className="p-5 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E]">
              <span className="text-[11px] font-mono uppercase text-[#FFFFFF] font-bold">
                VOTOR FAST-PATH
              </span>
              <div className="text-3xl font-bold text-[#FFFFFF] font-mono mt-1">~150ms</div>
              <p className="text-xs text-[#A1A1AA] mt-2">Aggregate BLS proof (&ge;80% stake).</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#26262E]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-[#E4E4E7]">
                Consensus Lanes
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startRace}
                  disabled={raceRunning}
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-[#FFFFFF] text-[#000000] hover:bg-[#E4E4E7] disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN RACE</span>
                </button>
                <button
                  type="button"
                  onClick={resetRace}
                  className="p-2 rounded-lg border border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
                  title="Reset race"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#A1A1AA]">LANE 1: LEGACY TOWERBFT</span>
                <span className="text-[#71717A]">
                  {lane1Done ? 'FINAL (12,800ms)' : `${Math.round(lane1Progress * 0.32)} / 32 Lockouts`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#141418] border border-[#26262E] overflow-hidden">
                <div
                  className="h-full bg-[#71717A] transition-all duration-100"
                  style={{ width: `${lane1Progress}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[#FFFFFF]">LANE 2: ALPENGLOW BLS FAST-PATH</span>
                <span className="font-bold text-[#FFFFFF]">
                  {lane2Done ? 'FINALIZED (~150ms)' : `${lane2Progress}%`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#141418] border border-[#26262E] overflow-hidden">
                <div
                  className="h-full bg-[#FFFFFF] transition-all duration-100"
                  style={{ width: `${lane2Progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLS Verifier Card */}
        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#FFFFFF]">
                BLS12-381 Certificate Quorum Verifier
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Toggle signature tampering to test quorum threshold and pairing rejection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTampered(!tampered)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono border cursor-pointer inline-flex items-center gap-1.5 ${
                tampered
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                  : 'bg-[#0B0B0E] text-[#E4E4E7] border-[#26262E] hover:border-[#FFFFFF]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{tampered ? 'REVERT TAMPERED CERT' : 'SIMULATE CORRUPTED CERT'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <span className="text-[10px] text-[#71717A] block mb-1">PARTICIPATING STAKE</span>
              <span className="text-2xl font-bold text-[#FFFFFF]">
                {tampered ? '58.0%' : '84.6%'}
              </span>
              <span className="block text-[11px] text-[#A1A1AA] mt-1">
                {tampered ? 'Below 80% fast-path quorum' : 'Exceeds 80% fast-path quorum'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
              <span className="text-[10px] text-[#71717A] block mb-1">PAIRING CHECK</span>
              <span className="text-2xl font-bold text-[#FFFFFF]">
                {tampered ? 'INVALID' : 'VERIFIED'}
              </span>
              <span className="block text-[11px] text-[#A1A1AA] mt-1">
                120 validator signatures aggregated
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#71717A]">PROVENANCE</span>
                <ProvenanceBadge provenance="ESTIMATED" />
              </div>
              <p className="text-xs font-sans text-[#A1A1AA] mt-2">
                {tampered
                  ? 'Corrupted pairing rejected before state promotion.'
                  : 'Valid BLS12-381 aggregate proof notarizes canonical bank.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
