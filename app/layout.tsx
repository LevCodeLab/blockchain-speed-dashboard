import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SpeedDash // BlockPulse - Real-Time Solana Slot & Fork Visualizer',
    template: '%s | SpeedDash // BlockPulse',
  },
  description:
    'Real-time 200ms Solana slot clock, candidate bank fork graph, 25ms BAM micro-auction visualizer, and interactive consensus playground.',
  applicationName: 'SpeedDash',
  keywords: [
    'Solana',
    'Alpenglow',
    'SIMD-0326',
    'SIMD-0337',
    'SIMD-0525',
    'Candidate Bank Graph',
    'Slot Clock',
    'Blockspace Visualizer',
    'Consensus Playground',
  ],
};

export const viewport: Viewport = {
  themeColor: '#0B0B0E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#0B0B0E] text-[#E4E4E7]">
        {children}
      </body>
    </html>
  );
}
