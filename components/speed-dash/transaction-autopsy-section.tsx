'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TransactionAutopsyResult } from '@/lib/speed-client/types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useAbandonedTxAlert } from '@/hooks/useAbandonedTxAlert';
import { AbandonedTxAlertToast } from '@/components/speed-dash/abandoned-tx-alert-toast';

interface TransactionAutopsySectionProps {
  onAnalyze: (signature: string) => Promise<TransactionAutopsyResult>;
}

export function TransactionAutopsySection({
  onAnalyze,
}: TransactionAutopsySectionProps) {
  const [signature, setSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TransactionAutopsyResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { activeToast, dismissToast, checkAndAlert } = useAbandonedTxAlert();

  const handleAnalyze = async (sigToAnalyze?: string) => {
    const targetSig = (sigToAnalyze || signature).trim();
    if (!targetSig) return;

    setIsLoading(true);
    try {
      const res = await onAnalyze(targetSig);
      setResult(res);
      checkAndAlert(res);
    } catch (err: unknown) {
      setResult({
        signature: targetSig,
        observed: false,
        slot: null,
        bankId: null,
        blockhash: null,
        bankHash: null,
        parent: null,
        canonical: false,
        finalized: false,
        latencyMs: null,
        parentSwitch: null,
        certificateInfo: null,
        error: err instanceof Error ? err.message : 'Forensic lookup failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="transactions" className="relative py-16 sm:py-24 border-b border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12">
          <span className="inline-flex items-center gap-3 text-xs font-mono text-[#A1A1AA] mb-3">
            <span className="w-6 h-px bg-[#26262E]" />
            Forensic Inspector
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-3">
            Transaction autopsy.
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-xl leading-relaxed">
            Paste any base58 signature to check public Solana RPC inclusion, or run the built-in
            SIMD-0337 presets to inspect how parent switches affect in-flight transactions.
          </p>
        </div>

        <div className="border border-[#26262E] p-6 lg:p-8 bg-[#141418] mb-8 rounded-2xl">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              type="text"
              placeholder="Paste transaction signature (base58) or select a preset below..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              className="font-mono text-xs sm:text-sm h-12 px-4 bg-[#0B0B0E] border-[#26262E]"
            />
            <Button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !signature.trim()}
              className="h-12 px-7 rounded-lg text-xs font-mono font-bold shrink-0"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Signature'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#A1A1AA] mr-1">Simulation Presets:</span>
            <button
              type="button"
              onClick={() => {
                const reorgSig = 'simd0337-reorg-abandoned-tx-8xLz9Q';
                setSignature(reorgSig);
                handleAnalyze(reorgSig);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF] border border-[#26262E] transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Test Reorg Dropped TX (SIMD-0337)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const canonSig = '5K3LzHk9474U8N2a3f76h9wJ7G9H3K2L1J5N8M6P4Q2R';
                setSignature(canonSig);
                handleAnalyze(canonSig);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF] border border-[#26262E] transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Test Canonical Fast-Path TX</span>
            </button>
          </div>
        </div>

        {result && (
          <div className="border border-[#26262E] bg-[#141418] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#26262E] bg-[#0B0B0E] flex items-center justify-between font-mono text-xs">
              <span className="text-[#E4E4E7] truncate max-w-md">
                AUTOPSY REPORT: {result.signature}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
            </div>

            {result.parentSwitch?.occurred && (
              <div className="p-6 bg-[#0B0B0E] border-b border-[#26262E] font-mono text-xs">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>PARENT SWITCH DETECTED (SIMD-0337)</span>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed mb-3">
                  This transaction landed inside an uncommitted candidate bank (
                  {result.parentSwitch.abandonedBankId || 'BANK 01'}) that was pruned when the next
                  leader switched parent lineage.
                </p>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#141418] border border-[#26262E] rounded-md text-xs text-[#E4E4E7]">
                  Canonical fork: <strong className="text-[#FFFFFF]">{result.parentSwitch.canonicalBankId || 'BANK 02'}</strong>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#26262E] font-mono">
              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">Observed</span>
                <span className="text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
                  {result.observed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      YES
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#71717A]" />
                      NO
                    </>
                  )}
                </span>
              </div>

              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">Slot</span>
                <span className="text-lg font-bold text-[#FFFFFF]">
                  {result.slot ? result.slot.toLocaleString() : '--'}
                </span>
              </div>

              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                  Candidate Bank
                </span>
                <span className="text-lg font-bold text-[#FFFFFF] truncate block">
                  {result.bankId || result.candidateBank || '--'}
                </span>
              </div>

              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                  Finality Latency
                </span>
                <span className="text-lg font-bold text-[#FFFFFF]">
                  {result.latencyMs ? `${result.latencyMs}ms` : '--'}
                </span>
              </div>

              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                  Canonical State
                </span>
                <span className="text-lg font-bold text-[#FFFFFF]">
                  {result.canonical ? 'CANONICAL' : 'ABANDONED'}
                </span>
              </div>

              <div className="bg-[#141418] p-5">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                  Certification
                </span>
                <span className="text-lg font-bold text-[#FFFFFF]">
                  {result.finalized ? 'FINALIZED' : 'UNCONFIRMED'}
                </span>
              </div>

              <div className="bg-[#141418] p-5 col-span-2">
                <span className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                  Parent Linkage
                </span>
                <span className="text-sm font-bold text-[#E4E4E7] truncate block">
                  {result.parent || result.parentRelation || '--'}
                </span>
              </div>
            </div>

            {result.error && (
              <div className="p-4 border-t border-[#26262E] bg-[#0B0B0E] text-xs font-mono text-[#A1A1AA]">
                Note: {result.error}
              </div>
            )}
          </div>
        )}
      </div>

      <AbandonedTxAlertToast
        activeToast={activeToast}
        onDismiss={dismissToast}
        onInspect={(sig) => {
          setSignature(sig);
          handleAnalyze(sig);
        }}
      />
    </section>
  );
}
