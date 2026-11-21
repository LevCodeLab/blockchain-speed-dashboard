/**
 * examples/slot-simulator-cli.mjs
 *
 * Runs 6 simulated 200ms Solana slots in the terminal using the exact
 * SlotClock, BankGraph, LeaderEngine, and FinalityEngine from lib/speed-core.
 *
 * Usage:
 *   node examples/slot-simulator-cli.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.resolve(__dirname, '../lib/speed-core');

async function loadCore(filename) {
  const source = fs.readFileSync(path.join(coreDir, filename), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const { SlotClock } = await loadCore('slot-clock.ts');
const { BankGraph } = await loadCore('bank-graph.ts');
const { FinalityEngine } = await loadCore('finality-engine.ts');
const { LeaderEngine } = await loadCore('leader-engine.ts');

const clock = new SlotClock(200);
const graph = new BankGraph();
const finality = new FinalityEngine();
const leaders = new LeaderEngine();

const baseSlot = 460_144_000;
const validators = ['Val_Alpha_111', 'Val_Alpha_111', 'Val_Beta_222', 'Val_Beta_222', 'Val_Gamma_333', 'Val_Gamma_333', 'Val_Delta_444'];

leaders.setLeadersForWindow(
  baseSlot,
  validators.map((leader, idx) => ({ slot: baseSlot + idx, leader }))
);

console.log('SpeedDash // BlockPulse CLI Simulator (6 x 200ms slots)\n');

let simNow = 100_000;
for (let i = 0; i < 6; i++) {
  const slot = baseSlot + i;
  clock.onSlotObserved(slot, simNow);
  finality.onSlotObserved(slot, simNow);

  const leaderState = leaders.recomputeLeaders(slot, 0.88);
  const progressMid = clock.getSlotProgress(simNow + 120);

  graph.registerBank({
    bankId: `bank-${slot}-A`,
    slot,
    parentBankId: `bank-${slot - 1}-B`,
    blockhash: `hash_${slot}_A`,
    state: 'OBSERVED',
    txCount: 820 + i * 35,
    observedAtMs: simNow,
    provenance: 'ESTIMATED',
  });

  let forkNote = `canonical=bank-${slot}-A`;
  if (i % 2 === 1) {
    graph.registerBank({
      bankId: `bank-${slot}-B`,
      slot,
      parentBankId: `bank-${slot - 1}-B`,
      blockhash: `hash_${slot}_B`,
      state: 'OBSERVED',
      txCount: 1290 + i * 20,
      observedAtMs: simNow + 16,
      provenance: 'ESTIMATED',
    });
    const ev = graph.handleUpdateParent(slot, `bank-${slot}-A`, `bank-${slot}-B`);
    forkNote = `UpdateParent(${ev.clearedBankId} -> ${ev.replacementBankId})`;
  } else {
    graph.setCanonicalBank(slot, `bank-${slot}-A`);
  }

  const certMs = 144 + (i % 4) * 3;
  const fin = finality.onSlotFinalized(slot, 'BLS_FAST_PATH_CERT', 84.2, simNow + certMs);

  console.log(
    `[slot ${slot}] phase=${Math.round(progressMid.phaseRatio * 100)}% | leader=${leaderState.currentLeader} (${leaderState.handoffState}) | ${forkNote} | finality=${fin.finalityLatencyMs}ms`
  );

  simNow += 200;
}
