'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, ArrowRight, Copy, Check } from 'lucide-react';
import type { AbandonedTxAlertItem } from '@/hooks/useAbandonedTxAlert';

interface AbandonedTxAlertToastProps {
  activeToast: AbandonedTxAlertItem | null;
  onDismiss: () => void;
  onInspect?: (signature: string) => void;
}

export function AbandonedTxAlertToast({
  activeToast,
  onDismiss,
  onInspect,
}: AbandonedTxAlertToastProps) {
  const [copied, setCopied] = useState(false);

  if (!activeToast) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeToast.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspectClick = () => {
    if (onInspect) {
      onInspect(activeToast.signature);
    }
    onDismiss();
  };

  const truncatedSig =
    activeToast.signature.length > 24
      ? `${activeToast.signature.slice(0, 10)}...${activeToast.signature.slice(-8)}`
      : activeToast.signature;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[420px] w-full"
    >
      <div className="rounded-2xl bg-[#141418] border border-[#FFFFFF] p-5 shadow-2xl text-[#E4E4E7]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#FFFFFF]">
            <AlertTriangle className="w-4 h-4" />
            <span>Candidate Bank Abandoned</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7]">
              SIMD-0337 REORG
            </span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss alert"
              className="text-[#A1A1AA] hover:text-[#FFFFFF] p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-[#A1A1AA] leading-relaxed mb-3">
          Transaction was observed on an uncommitted candidate bank that was superseded during a
          fast leader handover.
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[11px] font-mono mb-3">
          <div>
            <span className="text-[#71717A] block text-[10px]">DROPPED BANK</span>
            <span className="text-[#A1A1AA] line-through truncate block">
              {activeToast.abandonedBankId}
            </span>
          </div>
          <div>
            <span className="text-[#71717A] block text-[10px]">CANONICAL FORK</span>
            <span className="text-[#FFFFFF] font-bold truncate block">
              {activeToast.canonicalBankId}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[#0B0B0E] border border-[#26262E] text-xs font-mono mb-3">
          <span className="text-[#A1A1AA] truncate text-[11px]">{truncatedSig}</span>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1 text-[11px] text-[#E4E4E7] hover:text-[#FFFFFF] cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onInspect && (
            <button
              onClick={handleInspectClick}
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#FFFFFF] text-[#000000] font-mono font-bold text-xs cursor-pointer"
            >
              <span>Inspect Autopsy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onDismiss}
            type="button"
            className="py-2 px-3 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7] hover:border-[#FFFFFF] text-xs font-mono cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
