'use client';

import { useState } from 'react';
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export function TpsParadoxSimulator() {
  const [userDemandTps, setUserDemandTps] = useState<number>(1200);

  const LEGACY_VOTE_TPS = 2400;
  const LEGACY_MAX_USER_TPS = 850;
  const ALPENGLOW_MAX_USER_TPS = 3400;

  const legacyProcessedUserTps = Math.min(userDemandTps, LEGACY_MAX_USER_TPS);
  const legacyHeadlineTps = legacyProcessedUserTps + LEGACY_VOTE_TPS;
  const legacyDroppedTps = Math.max(0, userDemandTps - LEGACY_MAX_USER_TPS);
  const legacySaturationPercent = Math.min(
    100,
    Math.round((userDemandTps / LEGACY_MAX_USER_TPS) * 100)
  );

  const alpenglowProcessedUserTps = Math.min(userDemandTps, ALPENGLOW_MAX_USER_TPS);
  const alpenglowHeadlineTps = alpenglowProcessedUserTps;
  const alpenglowDroppedTps = Math.max(0, userDemandTps - ALPENGLOW_MAX_USER_TPS);
  const alpenglowSaturationPercent = Math.min(
    100,
    Math.round((userDemandTps / ALPENGLOW_MAX_USER_TPS) * 100)
  );

  return (
    <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 sm:p-8">
      <div className="pb-6 border-b border-[#26262E]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[#0B0B0E] border border-[#26262E] text-[#FFFFFF]">
            <Zap className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
            Explorer Headline vs Real User Throughput
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
          The TPS Paradox Simulator
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-2xl">
          Removing 2,400/s on-chain vote transactions makes naive explorer TPS counters look lower
          during quiet periods, while quadrupling real user swap capacity under peak load.
        </p>
      </div>

      <div className="py-6 border-b border-[#26262E] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label
            htmlFor="user-demand-slider"
            className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2"
          >
            <span>User Transaction Demand:</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[#0B0B0E] text-[#FFFFFF] border border-[#26262E]">
              {userDemandTps.toLocaleString()} tx/s
            </span>
          </label>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {[
              { label: 'Quiet (600)', val: 600 },
              { label: 'Normal (1.2k)', val: 1200 },
              { label: 'Peak (2.8k)', val: 2800 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setUserDemandTps(p.val)}
                className={`px-2.5 py-1 rounded-md border cursor-pointer ${
                  userDemandTps === p.val
                    ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                    : 'bg-[#0B0B0E] text-[#E4E4E7] border-[#26262E] hover:border-[#FFFFFF]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <input
          id="user-demand-slider"
          type="range"
          min={300}
          max={3400}
          step={50}
          value={userDemandTps}
          onChange={(e) => setUserDemandTps(Number(e.target.value))}
          className="w-full h-2 bg-[#0B0B0E] rounded-lg cursor-pointer accent-white"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
          <span>300 TPS</span>
          <span>Legacy User Ceiling (~850 TPS)</span>
          <span className="text-[#FFFFFF]">Alpenglow Ceiling (3,400 TPS)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-5 rounded-xl border border-[#26262E] bg-[#0B0B0E] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono font-bold text-[#A1A1AA] uppercase">
                Legacy TowerBFT
              </span>
              <div className="text-base font-bold text-[#FFFFFF]">Vote-Padded TPS</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#26262E] bg-[#141418] text-[#A1A1AA]">
              +2,400 Vote TPS
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono text-[#A1A1AA] uppercase">Headline TPS</div>
            <div className="text-3xl font-mono font-bold text-[#FFFFFF] mt-0.5">
              {legacyHeadlineTps.toLocaleString()} TPS
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#141418] border border-[#26262E] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Real User TPS Included:</span>
              <span className="font-bold text-[#FFFFFF]">{legacyProcessedUserTps} TPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Non-Vote Saturation:</span>
              <span className="font-bold text-[#FFFFFF]">{legacySaturationPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Unserved / Queued Swaps:</span>
              <span className="font-bold text-[#FFFFFF]">
                {legacyDroppedTps > 0 ? `${legacyDroppedTps} TPS dropped` : '0 dropped'}
              </span>
            </div>
          </div>

          {legacyDroppedTps > 0 && (
            <div className="p-3 rounded-lg border border-[#26262E] bg-[#141418] text-xs text-[#A1A1AA] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FFFFFF] shrink-0" />
              <span>Non-vote blockspace saturated; priority fees spike under this load.</span>
            </div>
          )}
        </div>

        <div className="p-5 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
            <div>
              <span className="text-xs font-mono font-bold text-[#FFFFFF] uppercase">
                Alpenglow Votor
              </span>
              <div className="text-base font-bold text-[#FFFFFF]">100% Real User TPS</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#000000] font-bold">
              0 Vote TPS
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono text-[#A1A1AA] uppercase">Headline TPS</div>
            <div className="text-3xl font-mono font-bold text-[#FFFFFF] mt-0.5">
              {alpenglowHeadlineTps.toLocaleString()} TPS
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#141418] border border-[#26262E] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Real User TPS Included:</span>
              <span className="font-bold text-[#FFFFFF]">{alpenglowProcessedUserTps} TPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Block Saturation:</span>
              <span className="font-bold text-[#FFFFFF]">{alpenglowSaturationPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Unserved / Queued Swaps:</span>
              <span className="font-bold text-[#FFFFFF]">
                {alpenglowDroppedTps > 0 ? `${alpenglowDroppedTps} TPS` : '0 dropped'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#26262E] bg-[#141418] text-xs text-[#E4E4E7] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />
            <span>Every counted transaction is real user execution with ~150ms finality.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
