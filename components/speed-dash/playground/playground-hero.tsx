'use client';

import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface PlaygroundHeroProps {
  onStartPlayground: () => void;
}

export function PlaygroundHero({ onStartPlayground }: PlaygroundHeroProps) {
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState<number>(0);

  const handleStart = () => {
    if (animating) return;
    setAnimating(true);
    setStep(1);

    setTimeout(() => setStep(2), 400);
    setTimeout(() => setStep(3), 800);
    setTimeout(() => setStep(4), 1200);
    setTimeout(() => {
      setStep(5);
      setAnimating(false);
      onStartPlayground();
    }, 1600);
  };

  const resetIntro = () => {
    setStep(0);
    setAnimating(false);
  };

  return (
    <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7] text-xs font-mono uppercase mb-6">
          Interactive Solana Consensus Simulator
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]">
          Break forks, handoffs, and finality in your browser.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
          Spawn competing candidate banks, trigger SIMD-0337 UpdateParent switches, race TowerBFT
          against 150ms BLS certificates, and step through frame-by-frame fork replays.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {step === 0 ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-lg font-mono font-bold text-xs bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START PLAYGROUND</span>
            </button>
          ) : step < 5 ? (
            <div className="inline-flex items-center justify-center w-36 py-3 rounded-lg font-mono text-sm font-bold bg-[#141418] border border-[#FFFFFF] text-[#FFFFFF]">
              {step === 1 && 'SLOT...'}
              {step === 2 && 'FORK...'}
              {step === 3 && 'CERT...'}
              {step === 4 && 'FINAL!'}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141418] border border-[#26262E] text-[#FFFFFF] text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Simulator Ready
              </span>
              <button
                type="button"
                onClick={resetIntro}
                className="p-2 rounded-lg border border-[#26262E] bg-[#141418] text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
                title="Replay intro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Pipeline */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            term: 'SLOT',
            meaning: '200ms time window.',
            detail: 'SIMD-0525 cuts slot intervals from 400ms to 200ms.',
            stepNum: '01',
          },
          {
            term: 'LEADER',
            meaning: 'Active block producer.',
            detail: 'Rotates every 4 slots (~800ms tenure window).',
            stepNum: '02',
          },
          {
            term: 'BANK',
            meaning: 'Candidate slot state.',
            detail: 'Multiple candidate banks can compete in the same slot.',
            stepNum: '03',
          },
          {
            term: 'REPARENT',
            meaning: 'SIMD-0337 switch.',
            detail: 'UpdateParent prunes stale branches without full timeouts.',
            stepNum: '04',
          },
          {
            term: 'FINALITY',
            meaning: '~150ms BLS proof.',
            detail: '80% stake certificate replaces 32-slot lockouts.',
            stepNum: '05',
          },
        ].map((item, idx) => {
          const isHighlighted = step === idx + 1;
          return (
            <div
              key={item.term}
              className={`rounded-xl border p-4 bg-[#141418] transition-all ${
                isHighlighted ? 'border-[#FFFFFF]' : 'border-[#26262E]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[#71717A]">{item.stepNum}</span>
                {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-[#71717A] hidden md:inline" />}
              </div>
              <h3 className="text-sm font-mono font-bold text-[#FFFFFF] mb-1">{item.term}</h3>
              <p className="text-xs font-medium text-[#E4E4E7] mb-1.5">{item.meaning}</p>
              <p className="text-[11px] text-[#A1A1AA] leading-normal">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
