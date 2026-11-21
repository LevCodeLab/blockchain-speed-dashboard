/**
 * examples/custom-rpc-poll.mjs
 *
 * Queries a public Solana JSON-RPC endpoint for current slot and latest blockhash,
 * and falls back cleanly to an offline simulated snapshot if no network is available.
 *
 * Usage:
 *   node examples/custom-rpc-poll.mjs
 *   SOLANA_RPC_URL=https://api.devnet.solana.com node examples/custom-rpc-poll.mjs
 */

const endpoint = process.env.SOLANA_RPC_URL || 'https://solana-rpc.publicnode.com';

async function rpcCall(method, params = []) {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'RPC error');

    return {
      ok: true,
      result: json.result,
      rttMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      rttMs: Math.round(performance.now() - start),
    };
  }
}

console.log(`Polling Solana RPC: ${endpoint}`);

const slotResp = await rpcCall('getSlot');
const hashResp = await rpcCall('getLatestBlockhash');

if (slotResp.ok && hashResp.ok) {
  console.log(
    JSON.stringify(
      {
        mode: 'LIVE_PUBLIC_RPC',
        endpoint,
        slot: slotResp.result,
        blockhash: hashResp.result?.value?.blockhash,
        lastValidBlockHeight: hashResp.result?.value?.lastValidBlockHeight,
        rttMs: slotResp.rttMs,
      },
      null,
      2
    )
  );
} else {
  console.log(
    JSON.stringify(
      {
        mode: 'OFFLINE_SIM_FALLBACK',
        endpoint,
        note: `Network unavailable (${slotResp.error || hashResp.error}); serving local simulated slot snapshot`,
        slot: 460_144_250,
        targetSlotDurationMs: 200,
        blockhash: '4xMvK8pL2nQ9vR7tW3yZ6cB1fH5jM8kP0sD4gN2qV9xA',
        votorFastFinalityMs: 148,
      },
      null,
      2
    )
  );
}
