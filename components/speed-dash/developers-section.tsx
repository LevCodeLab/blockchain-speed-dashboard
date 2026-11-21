'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Play, Pause, Trash2 } from 'lucide-react';
import { SpeedStreamEvent, NetworkStatus } from '@/lib/speed-core/types';

interface DevelopersSectionProps {
  streamEvents: SpeedStreamEvent[];
  networkStatus?: NetworkStatus;
}

const codeExamples = [
  {
    label: 'TypeScript Client',
    code: `import { SpeedDashClient } from '@/lib/speed-client';

const dash = SpeedDashClient.getInstance();
dash.start();

// Track 200ms slot phase ticks
dash.onSlot((progress) => {
  console.log(\`Slot \${progress.slot}: \${progress.elapsedMs}ms / \${progress.targetSlotDurationMs}ms\`);
});

// Detect SIMD-0337 fast leader handover reparents
dash.onParentSwitch((ev) => {
  console.log(\`UpdateParent: \${ev.clearedBankId} -> \${ev.replacementBankId}\`);
});`,
  },
  {
    label: 'Core Slot & Fork Engine',
    code: `import { SlotClock } from '@/lib/speed-core/slot-clock';
import { BankGraph } from '@/lib/speed-core/bank-graph';
import { FinalityEngine } from '@/lib/speed-core/finality-engine';

const clock = new SlotClock(200);
const graph = new BankGraph();
const finality = new FinalityEngine();

clock.onSlotObserved(460143900, Date.now());
finality.onSlotObserved(460143900, Date.now());
finality.onSlotFinalized(460143900, 'BLS_FAST_PATH_CERT', 84.5);`,
  },
  {
    label: 'Custom RPC Env',
    code: `# Use public Solana RPC out of the box, or point at your own validator:
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-rpc.publicnode.com npm run dev

# Run unit tests for SlotClock, BankGraph, and FinalityEngine:
npm test`,
  },
];

const features = [
  {
    title: 'Browser-Direct Public RPC',
    description: 'Connects straight to public Solana JSON-RPC and WebSocket endpoints without private backend proxies.',
  },
  {
    title: 'Offline Deterministic Simulator',
    description: 'Automatically switches to an in-memory 200ms slot and fork simulator when offline or in Sim mode.',
  },
  {
    title: 'Monotonic Sequence Stream',
    description: 'Every slot, fork, and finality event is tagged with a sequence counter and strict data provenance.',
  },
  {
    title: 'Zero-Dependency Core Math',
    description: 'SlotClock, BankGraph, LeaderEngine, and FinalityEngine are standalone TypeScript classes with unit tests.',
  },
];

export function DevelopersSection({ streamEvents, networkStatus }: DevelopersSectionProps) {
  const [activeTab, setActiveTab] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [viewRawJson, setViewRawJson] = useState(false);
  const [localEvents, setLocalEvents] = useState<SpeedStreamEvent[]>([]);

  useEffect(() => {
    if (isStreaming && streamEvents.length > 0) {
      setLocalEvents(streamEvents.slice(0, 30));
    }
  }, [isStreaming, streamEvents]);

  const handleCopy = () => {
    if (activeTab >= 0) {
      navigator.clipboard.writeText(codeExamples[activeTab].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="developers" className="relative py-16 sm:py-24 bg-[#0B0B0E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-mono text-[#A1A1AA] mb-3">
              <span className="w-6 h-px bg-[#26262E]" />
              Developer Stream &amp; SDK
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
              Clean primitives.
              <span className="block text-[#A1A1AA]">Zero API key drama.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#A1A1AA] mb-8 leading-relaxed">
              Import `SpeedDashClient` or the standalone `lib/speed-core` engines into your own
              Solana tools to track slot boundaries, leader handoffs, and fork lineage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-[#141418] border border-[#26262E]"
                >
                  <h3 className="font-bold text-[#FFFFFF] mb-1 text-sm">{feature.title}</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal & Code Tabs */}
          <div className="border border-[#26262E] bg-[#141418] rounded-2xl overflow-hidden">
            <div className="flex items-center border-b border-[#26262E] bg-[#0B0B0E] overflow-x-auto p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab(-1)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === -1
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Live Event Stream
              </button>

              {codeExamples.map((example, idx) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                    activeTab === idx
                      ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                >
                  {example.label}
                </button>
              ))}

              <div className="flex-1" />

              {activeTab >= 0 && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
                  aria-label="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {activeTab === -1 ? (
              <div className="p-5 font-mono text-xs">
                <div className="mb-4 pb-3 border-b border-[#26262E] grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#71717A] block text-[10px] uppercase">Status</span>
                    <span className="font-bold text-[#FFFFFF]">
                      {networkStatus?.speedStatus || 'LIVE'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block text-[10px] uppercase">Source</span>
                    <span className="text-[#E4E4E7] truncate block">
                      {networkStatus?.source || 'solana-public-rpc'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block text-[10px] uppercase">Sequence</span>
                    <span className="text-[#FFFFFF]">
                      #{localEvents[0]?.sequence ?? networkStatus?.currentSequence ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#26262E] text-[#A1A1AA] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewRawJson(false)}
                      className={`px-2.5 py-1 rounded text-[10px] uppercase cursor-pointer border ${
                        !viewRawJson
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                          : 'bg-[#0B0B0E] text-[#A1A1AA] border-[#26262E]'
                      }`}
                    >
                      Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewRawJson(true)}
                      className={`px-2.5 py-1 rounded text-[10px] uppercase cursor-pointer border ${
                        viewRawJson
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                          : 'bg-[#0B0B0E] text-[#A1A1AA] border-[#26262E]'
                      }`}
                    >
                      Raw JSON
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsStreaming(!isStreaming)}
                      className="hover:text-[#FFFFFF] flex items-center gap-1 cursor-pointer"
                    >
                      {isStreaming ? (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalEvents([])}
                      className="hover:text-[#FFFFFF] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                </div>

                {viewRawJson ? (
                  <div className="h-[260px] overflow-y-auto p-3 bg-[#0B0B0E] border border-[#26262E] rounded-lg text-[11px] leading-relaxed">
                    <pre className="text-[#E4E4E7]">
                      {localEvents.length > 0
                        ? JSON.stringify(localEvents[0], null, 2)
                        : '// Waiting for incoming slot stream event...'}
                    </pre>
                  </div>
                ) : (
                  <div className="h-[260px] overflow-y-auto space-y-1.5 pr-1">
                    {localEvents.length > 0 ? (
                      localEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="py-1.5 px-2.5 bg-[#0B0B0E] border border-[#26262E] rounded-md flex items-center gap-2.5"
                        >
                          <span className="text-[#71717A] shrink-0">{ev.timestamp}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                              ev.type === 'UPDATE_PARENT'
                                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                                : 'bg-[#141418] text-[#E4E4E7] border-[#26262E]'
                            }`}
                          >
                            {ev.type}
                          </span>
                          <span className="text-[#A1A1AA] truncate flex-1">{ev.details}</span>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-[#71717A]">
                        Listening to slot stream...
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 font-mono text-xs bg-[#0B0B0E] min-h-[320px] overflow-x-auto">
                <pre className="text-[#E4E4E7] leading-relaxed">
                  {codeExamples[activeTab].code}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
