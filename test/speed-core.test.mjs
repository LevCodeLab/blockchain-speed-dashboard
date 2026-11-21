import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.resolve(__dirname, '../lib/speed-core');

async function loadTsModule(filename) {
  const fullPath = path.join(coreDir, filename);
  const source = fs.readFileSync(fullPath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const base64 = Buffer.from(outputText, 'utf8').toString('base64');
  return import(`data:text/javascript;base64,${base64}`);
}

test('SlotClock tracks 200ms slot phase ratio, remaining window, and drift', async () => {
  const { SlotClock } = await loadTsModule('slot-clock.ts');
  const clock = new SlotClock(200);

  assert.equal(clock.getCurrentSlot(), 0);
  assert.equal(clock.getSlotProgress().provenance, 'UNAVAILABLE');

  const t0 = 10_000;
  clock.onSlotObserved(460143800, t0);

  const mid = clock.getSlotProgress(t0 + 50);
  assert.equal(mid.slot, 460143800);
  assert.equal(mid.elapsedMs, 50);
  assert.equal(mid.remainingMs, 150);
  assert.equal(mid.phaseRatio, 0.25);
  assert.equal(mid.driftMs, 0);

  const drifted = clock.getSlotProgress(t0 + 235);
  assert.equal(drifted.phaseRatio, 1);
  assert.equal(drifted.remainingMs, 0);
  assert.equal(drifted.driftMs, 35);

  clock.onSlotObserved(460143801, t0 + 198);
  assert.equal(clock.getMeasuredSlotDuration(), 198);
});

test('BankGraph tracks competing candidate banks and SIMD-0337 UpdateParent switches', async () => {
  const { BankGraph } = await loadTsModule('bank-graph.ts');
  const graph = new BankGraph();
  const slot = 500_100;

  graph.registerBank({
    bankId: 'bank-A',
    slot,
    parentBankId: 'bank-prev',
    blockhash: 'hashA',
    state: 'OBSERVED',
    txCount: 420,
    observedAtMs: 1000,
    provenance: 'DIRECT',
  });

  graph.registerBank({
    bankId: 'bank-B',
    slot,
    parentBankId: 'bank-prev',
    blockhash: 'hashB',
    state: 'OBSERVED',
    txCount: 910,
    observedAtMs: 1015,
    provenance: 'DIRECT',
  });

  assert.equal(graph.getBanksForSlot(slot).length, 2);

  const ev = graph.handleUpdateParent(
    slot,
    'bank-A',
    'bank-B',
    'SIMD-0337 fast handoff',
    'parentHashNew',
    'unit-test'
  );

  assert.equal(ev.clearedBankId, 'bank-A');
  assert.equal(ev.replacementBankId, 'bank-B');

  const banksAfter = graph.getBanksForSlot(slot);
  const bankA = banksAfter.find((b) => b.bankId === 'bank-A');
  const bankB = banksAfter.find((b) => b.bankId === 'bank-B');

  assert.equal(bankA.state, 'ABANDONED');
  assert.equal(bankB.state, 'CANONICAL');

  graph.setFinalizedBank(slot, 'bank-B');
  assert.equal(graph.getBanksForSlot(slot).find((b) => b.bankId === 'bank-B').state, 'FINALIZED');
});

test('FinalityEngine computes sub-150ms BLS fast-path latency and stake quorum flags', async () => {
  const { FinalityEngine } = await loadTsModule('finality-engine.ts');
  const engine = new FinalityEngine();

  engine.onSlotObserved(700_001, 5000);
  engine.onSlotCanonical(700_001, 5060);
  const fin = engine.onSlotFinalized(700_001, 'BLS_FAST_PATH_CERT', 84.4, 5146);

  assert.ok(fin);
  assert.equal(fin.status, 'FINALIZED');
  assert.equal(fin.finalityLatencyMs, 146);
  assert.equal(fin.isFastPath, true);
  assert.equal(engine.getLatestFinality().slot, 700_001);
});

test('LeaderEngine detects continuation vs imminent handoff', async () => {
  const { LeaderEngine } = await loadTsModule('leader-engine.ts');
  const leaders = new LeaderEngine();

  leaders.setLeadersForWindow(100, [
    { slot: 100, leader: 'ValA' },
    { slot: 101, leader: 'ValA' },
    { slot: 102, leader: 'ValB' },
  ]);

  const sameLeader = leaders.recomputeLeaders(100, 0.5);
  assert.equal(sameLeader.handoffState, 'SLOT_CONTINUATION');

  const pendingHandoff = leaders.recomputeLeaders(101, 0.4);
  assert.equal(pendingHandoff.handoffState, 'LEADER_TRANSITION_PENDING');

  const imminentHandoff = leaders.recomputeLeaders(101, 0.9);
  assert.equal(imminentHandoff.handoffState, 'HANDOVER_IMMINENT');
});
