'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSpeedDash } from '@/hooks/useSpeedDash';
import { Navigation } from '@/components/speed-dash/navigation';
import { FooterSection } from '@/components/speed-dash/footer-section';
import { PlaygroundHero } from '@/components/speed-dash/playground/playground-hero';
import { CandidateBanksDemo } from '@/components/speed-dash/playground/candidate-banks-demo';
import { LeaderHandoffDemo } from '@/components/speed-dash/playground/leader-handoff-demo';
import { FinalityRaceDemo } from '@/components/speed-dash/playground/finality-race-demo';
import { TelemetryComparisonDemo } from '@/components/speed-dash/playground/telemetry-comparison-demo';
import { BreakNetworkSandbox } from '@/components/speed-dash/playground/break-network-sandbox';
import { RealWorldScenarios } from '@/components/speed-dash/playground/real-world-scenarios';
import { LiveNetworkExplorer } from '@/components/speed-dash/playground/live-network-explorer';
import { ReplayPlayer } from '@/components/speed-dash/playground/replay-player';
import { EpochTestbench } from '@/components/speed-dash/epoch-testbench';
import { ArrowRight } from 'lucide-react';

export default function PlaygroundPage() {
  const { networkStatus, switchCluster } = useSpeedDash();
  const [activeMode, setActiveMode] = useState<'DEMO' | 'LIVE' | 'REPLAY'>('DEMO');
  const [technicalMode, setTechnicalMode] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B0B0E] text-[#E4E4E7] pt-18">
      <Navigation
        currentCluster={networkStatus.cluster}
        onClusterChange={switchCluster}
        connected={networkStatus.connected}
      />

      {/* Sticky Monochrome Mode Toolbar */}
      <div className="sticky top-16 z-30 w-full backdrop-blur-md bg-[#0B0B0E]/95 border-b border-[#26262E] py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-xl border border-[#26262E]">
              {(['DEMO', 'LIVE', 'REPLAY'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActiveMode(mode)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeMode === mode
                      ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                >
                  {mode === 'DEMO' ? 'SANDBOX' : mode === 'LIVE' ? 'LIVE INSPECTOR' : 'REPLAY'}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#26262E] bg-[#141418] text-[#A1A1AA] text-[11px] font-mono">
              {activeMode === 'DEMO'
                ? 'INTERACTIVE SIMULATOR'
                : activeMode === 'LIVE'
                ? 'PUBLIC RPC / SIM STREAM'
                : 'RECORDED TRACE'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeMode === 'DEMO' && (
              <nav className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
                <button
                  type="button"
                  onClick={() => scrollToSection('forks')}
                  className="hover:text-[#FFFFFF] cursor-pointer"
                >
                  #forks
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('leader')}
                  className="hover:text-[#FFFFFF] cursor-pointer"
                >
                  #leader
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('finality')}
                  className="hover:text-[#FFFFFF] cursor-pointer"
                >
                  #finality
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('reality')}
                  className="hover:text-[#FFFFFF] cursor-pointer"
                >
                  #provenance
                </button>
              </nav>
            )}

            <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-xl border border-[#26262E]">
              <button
                type="button"
                onClick={() => setTechnicalMode(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                  !technicalMode
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                SIMPLE
              </button>
              <button
                type="button"
                onClick={() => setTechnicalMode(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                  technicalMode
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                TECHNICAL
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeMode === 'DEMO' && (
        <>
          <PlaygroundHero onStartPlayground={() => scrollToSection('forks')} />
          <EpochTestbench />
          <CandidateBanksDemo technicalMode={technicalMode} />
          <LeaderHandoffDemo technicalMode={technicalMode} />
          <FinalityRaceDemo technicalMode={technicalMode} />
          <TelemetryComparisonDemo />
          <BreakNetworkSandbox />
          <RealWorldScenarios />
        </>
      )}

      {activeMode === 'LIVE' && <LiveNetworkExplorer technicalMode={technicalMode} />}

      {activeMode === 'REPLAY' && <ReplayPlayer technicalMode={technicalMode} />}

      {/* Clean Navigation Footer CTA */}
      <section className="py-16 border-t border-[#26262E] bg-[#0B0B0E]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
            Next up: see where the reclaimed 48M compute units go.
          </h2>
          <p className="mt-2 text-sm text-[#A1A1AA] max-w-xl mx-auto">
            Explore the 48M CU blockspace allocation meter, TPS paradox simulator, and 25ms BAM
            micro-auction lanes.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blockspace"
              className="px-6 py-3 rounded-lg font-mono font-bold text-xs bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] inline-flex items-center gap-2"
            >
              <span>OPEN BLOCKSPACE &amp; BAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/"
              className="px-6 py-3 rounded-lg font-mono text-xs border border-[#26262E] bg-[#141418] text-[#E4E4E7] hover:border-[#FFFFFF]"
            >
              BACK TO LIVE DASHBOARD
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
