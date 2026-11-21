'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { AnimatedWave } from '@/components/visuals/animated-wave';

const footerRoutes = [
  { name: 'Live Slot & Fork Dashboard', href: '/' },
  { name: 'Interactive Consensus Playground', href: '/playground' },
  { name: '48M CU Blockspace & BAM Visualizer', href: '/blockspace' },
];

const footerAnchors = [
  { name: '200ms Slot Clock', href: '/#live' },
  { name: 'Candidate Bank Graph', href: '/#network' },
  { name: 'Transaction Autopsy', href: '/#transactions' },
  { name: 'Live Event Stream', href: '/#developers' },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] overflow-hidden">
      <div className="absolute inset-0 h-56 opacity-25 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#141418] border border-[#26262E] flex items-center justify-center text-[#FFFFFF]">
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-lg font-bold text-[#FFFFFF]">SpeedDash</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#141418] border border-[#26262E] text-[#A1A1AA]">
                BlockPulse
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md leading-relaxed">
              Open-source Solana 200ms slot clock, candidate bank fork visualizer, 25ms BAM
              micro-auction explorer, and offline-capable consensus playground.
            </p>

            <div className="text-xs font-mono text-[#71717A]">
              Runs directly in the browser on public Solana RPC or deterministic offline simulation.
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#FFFFFF] mb-4">
              Views
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerRoutes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#FFFFFF] mb-4">
              Dashboard Modules
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerAnchors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-[#26262E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs text-[#A1A1AA]">
          <p>MIT License • Copyright (c) 2026 LevCodeLab</p>
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#26262E] bg-[#141418] text-[#E4E4E7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span>SIMD-0326 / SIMD-0337 / SIMD-0525</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
