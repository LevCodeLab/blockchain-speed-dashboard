'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { ProvenanceBadge } from '@/components/speed-dash/provenance-badge';
import { fetchPlaygroundLive, type PlaygroundLiveResponse } from '@/lib/speed-client/playground';

interface LiveNetworkExplorerProps {
  technicalMode: boolean;
}

export function LiveNetworkExplorer({ technicalMode }: LiveNetworkExplorerProps) {
  const [data, setData] = useState<PlaygroundLiveResponse | null>(null);
  const [rawExpanded, setRawExpanded] = useState<boolean>(false);

  const fetchLive = async () => {
    const resp = await fetchPlaygroundLive();
    setData(resp);
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 800);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="py-16 text-center font-mono text-xs text-[#A1A1AA]">
        Initializing live cluster inspector...
      </div>
    );
  }

  return (
    <section className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#FFFFFF] text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
              <span>LIVE PROVENANCE INSPECTOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              Live Stream Inspector
            </h2>
            <p className="mt-1 text-xs text-[#A1A1AA] font-mono">
              Cluster: {data.cluster.toUpperCase()} | Source: {data.source.toUpperCase()} | Mode: {data.mode}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLive}
            className="px-3.5 py-2 rounded-lg border border-[#26262E] bg-[#141418] text-xs font-mono text-[#E4E4E7] hover:border-[#FFFFFF] inline-flex items-center gap-1.5 cursor-pointer self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Snapshot</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-[#26262E] bg-[#141418] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">Current Slot</span>
              <ProvenanceBadge provenance={data.slot.provenance} />
            </div>
            <div className="text-2xl font-mono font-bold text-[#FFFFFF]">
              {data.slot.current_slot.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#71717A]">
              Target: {data.slot.target_duration_ms ?? 200}ms
            </div>
          </div>

          <div className="rounded-xl border border-[#26262E] bg-[#141418] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">Active Leader</span>
              <ProvenanceBadge provenance={data.leader.provenance} />
            </div>
            <div className="text-sm font-mono font-bold text-[#FFFFFF] truncate">
              {data.leader.current_leader || 'Resolving...'}
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#71717A] truncate">
              Handoff: {data.leader.handoff_state}
            </div>
          </div>

          <div className="rounded-xl border border-[#26262E] bg-[#141418] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">Candidate Banks</span>
              <ProvenanceBadge
                provenance={data.banks.candidate_banks_supported ? 'ESTIMATED' : 'UNAVAILABLE'}
              />
            </div>
            <div className="text-sm font-mono font-bold text-[#FFFFFF]">
              {data.banks.candidate_banks_supported
                ? `${data.banks.total_banks_tracked} Banks Tracked`
                : 'PUBLIC RPC LINEAR'}
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#71717A]">{data.banks.note}</div>
          </div>

          <div className="rounded-xl border border-[#26262E] bg-[#141418] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#A1A1AA]">Consensus Mode</span>
              <ProvenanceBadge provenance={data.finality.provenance} />
            </div>
            <div className="text-sm font-mono font-bold text-[#FFFFFF]">{data.finality.mode}</div>
            <div className="mt-2 text-[11px] font-mono text-[#71717A]">
              Target: {data.finality.fast_path_target_ms}ms
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 mb-6 overflow-x-auto">
          <div className="text-xs font-mono uppercase font-bold text-[#A1A1AA] mb-4">
            Field Provenance Manifest
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#26262E] text-[#71717A] font-mono">
                <th className="pb-2.5 font-medium">Field</th>
                <th className="pb-2.5 font-medium">Provenance</th>
                <th className="pb-2.5 font-medium">Source</th>
                <th className="pb-2.5 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262E] font-mono">
              {data.provenance_manifest.map((item) => (
                <tr key={item.field}>
                  <td className="py-3 font-bold text-[#FFFFFF]">{item.field}</td>
                  <td className="py-3">
                    <ProvenanceBadge provenance={item.provenance} />
                  </td>
                  <td className="py-3 uppercase text-[#A1A1AA]">{item.source}</td>
                  <td className="py-3 text-[#A1A1AA] font-sans">{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {technicalMode && (
          <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-4">
            <button
              type="button"
              onClick={() => setRawExpanded(!rawExpanded)}
              className="flex items-center justify-between w-full text-xs font-mono font-bold text-[#FFFFFF] cursor-pointer"
            >
              <span>RAW SNAPSHOT PAYLOAD (JSON)</span>
              {rawExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {rawExpanded && (
              <pre className="mt-3 p-4 rounded-xl bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7] font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
