'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Check, Activity } from 'lucide-react';
import { ClusterId } from '@/lib/speed-core/types';

interface NavigationProps {
  currentCluster: ClusterId;
  onClusterChange: (cluster: ClusterId) => void;
  connected: boolean;
}

const navLinks = [
  { name: 'Live Dashboard', href: '/', badge: '200MS' },
  { name: 'Consensus Playground', href: '/playground', badge: 'SIMULATOR' },
  { name: 'Blockspace & BAM', href: '/blockspace', badge: '48M CU' },
];

const CLUSTER_ITEMS: {
  id: ClusterId;
  label: string;
  shortLabel: string;
  badge: string;
}[] = [
  {
    id: 'mainnet-beta',
    label: 'Solana Mainnet',
    shortLabel: 'Mainnet',
    badge: 'PUBLIC RPC',
  },
  {
    id: 'devnet',
    label: 'Solana Devnet',
    shortLabel: 'Devnet',
    badge: 'PUBLIC RPC',
  },
  {
    id: 'offline-sim',
    label: 'Offline Simulator',
    shortLabel: 'Sim',
    badge: 'LOCAL 200MS',
  },
];

export function Navigation({
  currentCluster,
  onClusterChange,
  connected,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsClusterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedPath = pathname?.replace(/\/$/, '') || '/';
  const activeClusterObj =
    CLUSTER_ITEMS.find((c) => c.id === currentCluster) || CLUSTER_ITEMS[0];

  return (
    <header
      className={`fixed z-50 transition-all duration-300 ${
        isScrolled ? 'top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4' : 'top-0 left-0 right-0'
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#0B0B0E]/95 backdrop-blur-xl border border-[#26262E] rounded-2xl max-w-[1400px]'
            : 'bg-[#0B0B0E]/80 backdrop-blur-md border-b border-[#26262E] max-w-[1440px]'
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-18'
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group outline-none"
          >
            <span className="w-8 h-8 rounded-lg bg-[#141418] border border-[#26262E] flex items-center justify-center text-[#FFFFFF] group-hover:border-[#FFFFFF] transition-colors">
              <Activity className="w-4 h-4" />
            </span>
            <span className="font-sans tracking-tight text-base sm:text-lg font-bold text-[#FFFFFF]">
              SpeedDash
            </span>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#141418] border border-[#26262E] text-[#A1A1AA]">
              BlockPulse
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const target = link.href.replace(/\/$/, '') || '/';
              const isActive = normalizedPath === target;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                      : 'bg-[#141418] text-[#E4E4E7] border-[#26262E] hover:border-[#FFFFFF] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border ${
                      isActive
                        ? 'bg-[#0B0B0E] text-[#FFFFFF] border-[#0B0B0E]'
                        : 'bg-[#0B0B0E] text-[#A1A1AA] border-[#26262E]'
                    }`}
                  >
                    {link.badge}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Cluster Selector + Status */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsClusterDropdownOpen(!isClusterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#26262E] bg-[#141418] hover:border-[#FFFFFF] text-xs font-mono text-[#E4E4E7] transition-colors cursor-pointer"
                aria-label="Select Solana Cluster"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                <span className="font-medium text-[#FFFFFF]">{activeClusterObj.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#A1A1AA] transition-transform ${
                    isClusterDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isClusterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-68 p-2 rounded-xl bg-[#141418] border border-[#26262E] z-50 font-mono text-xs shadow-2xl">
                  <div className="px-2.5 py-1.5 border-b border-[#26262E] mb-1.5 text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                    Telemetry Source
                  </div>
                  <div className="space-y-1">
                    {CLUSTER_ITEMS.map((c) => {
                      const isSelected = currentCluster === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            onClusterChange(c.id);
                            setIsClusterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                              : 'bg-[#0B0B0E] text-[#E4E4E7] border-[#26262E] hover:border-[#FFFFFF]'
                          }`}
                        >
                          <span>{c.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded border ${
                                isSelected
                                  ? 'bg-[#141418] text-[#FFFFFF] border-[#141418]'
                                  : 'bg-[#141418] text-[#A1A1AA] border-[#26262E]'
                              }`}
                            >
                              {c.badge}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#26262E] bg-[#141418] text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#71717A]'
                }`}
              />
              <span className="text-[11px] text-[#E4E4E7]">
                {currentCluster === 'offline-sim'
                  ? 'SIMULATED'
                  : connected
                  ? 'STREAMING'
                  : 'SYNCING'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-[#26262E] bg-[#141418] text-[#E4E4E7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
              <span>{activeClusterObj.shortLabel}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-[#26262E] bg-[#141418] text-[#FFFFFF]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#26262E] bg-[#0B0B0E] px-4 py-5 space-y-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const target = link.href.replace(/\/$/, '') || '/';
                const isActive = normalizedPath === target;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg border font-mono text-xs flex items-center justify-between ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                        : 'bg-[#141418] text-[#E4E4E7] border-[#26262E]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span>{link.badge}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#26262E] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                Select Telemetry Source
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {CLUSTER_ITEMS.map((c) => {
                  const isSelected = currentCluster === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onClusterChange(c.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-lg border text-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                          : 'bg-[#141418] text-[#E4E4E7] border-[#26262E]'
                      }`}
                    >
                      {c.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
