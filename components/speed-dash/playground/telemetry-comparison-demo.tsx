'use client';

import React, { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { ProvenanceBadge } from '@/components/speed-dash/provenance-badge';
import type { FieldProvenance } from '@/lib/speed-client/types';

export function TelemetryComparisonDemo() {
  const [telemetryMode, setTelemetryMode] = useState<'PUBLIC' | 'GEYSER'>('PUBLIC');
  const [gameSelection, setGameSelection] = useState<string | null>(null);

  const capabilities: {
    name: string;
    rpc: boolean;
    geyser: boolean;
    provRpc: FieldProvenance;
    provGeyser: FieldProvenance;
  }[] = [
    { name: 'Slot Number', rpc: true, geyser: true, provRpc: 'DIRECT', provGeyser: 'DIRECT' },
    { name: 'Root Finality', rpc: true, geyser: true, provRpc: 'DIRECT', provGeyser: 'DIRECT' },
    { name: 'Leader Schedule', rpc: true, geyser: true, provRpc: 'DERIVED', provGeyser: 'DERIVED' },
    { name: 'Candidate Banks', rpc: false, geyser: true, provRpc: 'UNAVAILABLE', provGeyser: 'DIRECT' },
    { name: 'Bank Hash', rpc: false, geyser: true, provRpc: 'UNAVAILABLE', provGeyser: 'DIRECT' },
    { name: 'UpdateParent Markers', rpc: false, geyser: true, provRpc: 'UNAVAILABLE', provGeyser: 'DIRECT' },
    { name: 'BLS12-381 Certificates', rpc: false, geyser: true, provRpc: 'UNAVAILABLE', provGeyser: 'DIRECT' },
    { name: 'Pre-Execution Deshred', rpc: false, geyser: true, provRpc: 'UNAVAILABLE', provGeyser: 'DIRECT' },
  ];

  return (
    <section id="reality" className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>PROVENANCE MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              Public JSON-RPC vs Validator Geyser
            </h2>
            <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-2xl">
              Public RPC endpoints only expose sealed linear blocks. Inspect which fields come
              directly from RPC versus validator-level Geyser streams.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-xl border border-[#26262E] self-start">
            <button
              type="button"
              onClick={() => setTelemetryMode('PUBLIC')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                telemetryMode === 'PUBLIC'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              PUBLIC RPC
            </button>
            <button
              type="button"
              onClick={() => setTelemetryMode('GEYSER')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                telemetryMode === 'GEYSER'
                  ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                  : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
              }`}
            >
              VALIDATOR GEYSER
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 mb-6 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#26262E] text-[#71717A] font-mono">
                <th className="pb-3 font-medium">Consensus Dimension</th>
                <th className="pb-3 font-medium text-center">Public RPC</th>
                <th className="pb-3 font-medium text-center">Validator Geyser</th>
                <th className="pb-3 font-medium text-right">Active Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262E] font-mono">
              {capabilities.map((item) => {
                const prov = telemetryMode === 'PUBLIC' ? item.provRpc : item.provGeyser;
                return (
                  <tr key={item.name}>
                    <td className="py-3 font-sans font-medium text-[#FFFFFF]">{item.name}</td>
                    <td className="py-3 text-center">
                      {item.rpc ? (
                        <Check className="w-4 h-4 text-[#FFFFFF] inline" />
                      ) : (
                        <X className="w-4 h-4 text-[#52525B] inline" />
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {item.geyser ? (
                        <Check className="w-4 h-4 text-[#FFFFFF] inline" />
                      ) : (
                        <X className="w-4 h-4 text-[#52525B] inline" />
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <ProvenanceBadge provenance={prov} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Quiz */}
        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6">
          <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">QUICK CHECK</span>
          <h3 className="text-base font-bold text-[#FFFFFF] mt-1">
            Can a standard public Solana JSON-RPC endpoint return the internal `bank_hash` of an unconfirmed candidate fork?
          </h3>

          {!gameSelection ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {['DIRECT', 'ESTIMATED', 'UNAVAILABLE'].map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setGameSelection(choice)}
                  className="px-4 py-2 rounded-lg text-xs font-mono border border-[#26262E] bg-[#0B0B0E] text-[#E4E4E7] hover:border-[#FFFFFF] cursor-pointer"
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E] text-xs text-[#E4E4E7] flex items-center justify-between gap-4">
              <span>
                <strong>Answer: UNAVAILABLE.</strong> (You picked {gameSelection}.) Public JSON-RPC
                only returns confirmed blocks; internal candidate bank hashes require a validator
                Geyser plugin.
              </span>
              <button
                type="button"
                onClick={() => setGameSelection(null)}
                className="text-xs font-mono text-[#FFFFFF] underline shrink-0 cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
