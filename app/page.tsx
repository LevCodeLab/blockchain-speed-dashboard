'use client';

import { useSpeedDash } from '@/hooks/useSpeedDash';
import { Navigation } from '@/components/speed-dash/navigation';
import { HeroSection } from '@/components/speed-dash/hero-section';
import { AlpenglowOverview } from '@/components/speed-dash/alpenglow-overview';
import { LiveNetworkSection } from '@/components/speed-dash/live-network-section';
import { BankGraphSection } from '@/components/speed-dash/bank-graph-section';
import { FinalitySection } from '@/components/speed-dash/finality-section';
import { TransactionAutopsySection } from '@/components/speed-dash/transaction-autopsy-section';
import { DevelopersSection } from '@/components/speed-dash/developers-section';
import { FooterSection } from '@/components/speed-dash/footer-section';

export default function Home() {
  const {
    slotProgress,
    leaderInfo,
    candidateBanks,
    parentSwitch,
    finalityInfo,
    networkStatus,
    streamEvents,
    switchCluster,
    analyzeTransaction,
  } = useSpeedDash();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B0B0E] text-[#E4E4E7]">
      <Navigation
        currentCluster={networkStatus.cluster}
        onClusterChange={switchCluster}
        connected={networkStatus.connected}
      />

      <HeroSection
        slotProgress={slotProgress}
        leaderInfo={leaderInfo}
        finalityInfo={finalityInfo}
        networkStatus={networkStatus}
        connected={networkStatus.connected}
      />

      <AlpenglowOverview />

      <LiveNetworkSection
        slotProgress={slotProgress}
        leaderInfo={leaderInfo}
        candidateBanks={candidateBanks}
        finalityInfo={finalityInfo}
        networkStatus={networkStatus}
      />

      <BankGraphSection
        currentSlot={slotProgress.slot}
        candidateBanks={candidateBanks}
        parentSwitch={parentSwitch}
      />

      <FinalitySection
        finalityInfo={finalityInfo}
        currentSlot={slotProgress.slot}
      />

      <TransactionAutopsySection onAnalyze={analyzeTransaction} />

      <DevelopersSection streamEvents={streamEvents} networkStatus={networkStatus} />

      <FooterSection />
    </main>
  );
}
