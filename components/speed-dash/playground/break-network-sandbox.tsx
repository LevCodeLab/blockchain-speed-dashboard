'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ZapOff,
  GitBranch,
  RefreshCw,
  Clock,
  Split,
  EyeOff,
} from 'lucide-react';
import { breakNetworkAction, type BreakNetworkResponse } from '@/lib/speed-client/playground';

export function BreakNetworkSandbox() {
  const [activePerturbation, setActivePerturbation] = useState<string>('kill_leader');
  const [response, setResponse] = useState<BreakNetworkResponse | null>(null);

  const perturbations = [
    { id: 'kill_leader', label: 'KILL LEADER', icon: ZapOff },
    { id: 'abandon_bank', label: 'ABANDON BANK', icon: GitBranch },
    { id: 'change_parent', label: 'CHANGE PARENT', icon: RefreshCw },
    { id: 'stale_data', label: 'STALE DATA', icon: Clock },
    { id: 'provider_conflict', label: 'RPC CONFLICT', icon: Split },
    { id: 'remove_telemetry', label: 'DROP STREAM', icon: EyeOff },
  ];

  const handleTriggerPerturbation = async (id: string) => {
    setActivePerturbation(id);
    const res = await breakNetworkAction(id);
    setResponse(res);
  };

  React.useEffect(() => {
    handleTriggerPerturbation('kill_leader');
  }, []);

  return (
    <section className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
            CHAOS SANDBOX
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
            Break The Network
          </h2>
          <p className="mt-1.5 text-sm text-[#A1A1AA] max-w-2xl">
            Inject consensus faults below and inspect how the decision state machine responds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {perturbations.map((item) => {
            const Icon = item.icon;
            const isSelected = activePerturbation === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTriggerPerturbation(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]'
                    : 'border-[#26262E] bg-[#141418] text-[#E4E4E7] hover:border-[#FFFFFF]'
                }`}
              >
                <Icon className="w-4 h-4 mb-3" />
                <span className="font-mono text-[11px] font-bold block truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {response && (
          <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#26262E]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-[#FFFFFF] text-[#000000]">
                  ACTION: {response.action}
                </span>
                <span className="text-sm font-bold text-[#FFFFFF]">
                  Fault: {response.perturbation}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs text-[#E4E4E7] font-mono">
                <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
                Fail-Safe Guard Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#71717A] block mb-1">
                    DECISION REASON
                  </span>
                  <p className="text-sm font-semibold text-[#FFFFFF]">{response.why}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#71717A] block mb-1">
                    STATE GRAPH IMPACT
                  </span>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{response.state_impact}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#26262E] bg-[#0B0B0E]">
                <span className="text-[10px] font-mono uppercase text-[#71717A] block mb-2">
                  STATE TRANSITION TRACE
                </span>
                <div className="font-mono text-xs text-[#FFFFFF] break-all">
                  {response.technical_detail}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
