'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import {
  fetchPlaygroundReplay,
  type PlaygroundReplaySession,
} from '@/lib/speed-client/playground';

interface ReplayPlayerProps {
  technicalMode: boolean;
}

export function ReplayPlayer({ technicalMode }: ReplayPlayerProps) {
  const [session, setSession] = useState<PlaygroundReplaySession | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  useEffect(() => {
    fetchPlaygroundReplay().then((s) => setSession(s));
  }, []);

  useEffect(() => {
    if (!playing || !session) return;
    const intervalMs = Math.max(800 / playbackSpeed, 100);

    const timer = setInterval(() => {
      setCurrentIdx((prev) => {
        if (prev < session.events.length - 1) {
          return prev + 1;
        } else {
          setPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [playing, session, playbackSpeed]);

  const handlePlayPause = () => {
    if (session && currentIdx >= session.events.length - 1) {
      setCurrentIdx(0);
    }
    setPlaying(!playing);
  };

  const handleReset = () => {
    setPlaying(false);
    setCurrentIdx(0);
  };

  const activeEvent = session?.events[currentIdx];

  return (
    <section className="py-12 border-t border-[#26262E] bg-[#0B0B0E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141418] border border-[#26262E] text-[#E4E4E7] text-xs font-mono mb-3">
              <RotateCcw className="w-3 h-3" />
              <span>FRAME-BY-FRAME FORK REPLAY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
              Replay a Recorded 152ms Fork &amp; BLS Finalization
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141418] p-1.5 rounded-xl border border-[#26262E] self-start">
            <button
              type="button"
              onClick={handlePlayPause}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FFFFFF] text-[#000000] hover:bg-[#E4E4E7] cursor-pointer inline-flex items-center gap-1.5"
            >
              {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{playing ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FFFFFF] cursor-pointer"
              title="Reset replay"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 10].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-[#FFFFFF] text-[#000000] font-bold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#26262E] bg-[#141418] p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#26262E] mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#71717A]">Trace</span>
              <div className="text-sm font-bold text-[#FFFFFF]">
                {session?.title || 'Loading session...'}
              </div>
            </div>
            <div className="text-right text-xs font-mono text-[#A1A1AA]">
              Frame {currentIdx + 1} / {session?.total_events || 0} (+
              {activeEvent ? `${activeEvent.timestamp_offset_ms}ms` : '0ms'})
            </div>
          </div>

          <div className="mb-6 w-full h-2 rounded-full bg-[#0B0B0E] border border-[#26262E] overflow-hidden">
            <div
              className="h-full bg-[#FFFFFF] transition-all duration-200"
              style={{
                width: `${((currentIdx + 1) / (session?.total_events || 1)) * 100}%`,
              }}
            />
          </div>

          {activeEvent && (
            <div className="p-5 rounded-xl border border-[#FFFFFF] bg-[#0B0B0E] mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#FFFFFF] text-[#000000] text-xs font-mono font-bold uppercase">
                  {activeEvent.event_type}
                </span>
                <span className="text-xs font-mono text-[#A1A1AA]">
                  +{activeEvent.timestamp_offset_ms}ms
                </span>
              </div>
              <p className="text-base font-bold text-[#FFFFFF]">{activeEvent.detail}</p>
            </div>
          )}

          <div className="space-y-2">
            {session?.events.map((ev, idx) => {
              const isCurrent = idx === currentIdx;
              return (
                <div
                  key={ev.seq}
                  onClick={() => setCurrentIdx(idx)}
                  className={`p-3 rounded-xl border text-xs font-mono cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-[#FFFFFF] bg-[#0B0B0E] font-bold text-[#FFFFFF]'
                      : 'border-[#26262E] bg-[#0B0B0E] text-[#A1A1AA] hover:border-[#52525B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{ev.seq}.</span>
                    <span>{ev.event_type}</span>
                  </div>
                  <span>+{ev.timestamp_offset_ms}ms</span>
                </div>
              );
            })}
          </div>

          {technicalMode && activeEvent && (
            <div className="mt-6 pt-6 border-t border-[#26262E]">
              <pre className="p-4 rounded-xl bg-[#0B0B0E] border border-[#26262E] text-[#E4E4E7] font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(activeEvent.raw_json, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
