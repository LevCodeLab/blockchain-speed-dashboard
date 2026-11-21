/**
 * Browser and CLI Solana JSON-RPC client with endpoint fallback,
 * short-term memory caching, and request timeouts.
 */

const CLUSTER_ENDPOINTS: Record<string, string[]> = {
  'mainnet-beta': [
    'https://solana-rpc.publicnode.com',
    'https://api.mainnet-beta.solana.com',
  ],
  mainnet: [
    'https://solana-rpc.publicnode.com',
    'https://api.mainnet-beta.solana.com',
  ],
  devnet: [
    'https://api.devnet.solana.com',
  ],
  testnet: [
    'https://api.testnet.solana.com',
  ],
};

interface CacheEntry {
  data: { result: unknown; endpoint: string; latencyMs: number };
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 4000;

export function getRpcEndpoints(cluster: string = 'mainnet-beta'): string[] {
  const customUrl =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SOLANA_RPC_URL
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL.trim()
      : '';

  const defaults =
    CLUSTER_ENDPOINTS[cluster.toLowerCase()] || CLUSTER_ENDPOINTS['mainnet-beta'];

  if (customUrl) {
    return [customUrl, ...defaults.filter((u) => u !== customUrl)];
  }
  return defaults;
}

export function getWsEndpoint(cluster: string = 'mainnet-beta'): string {
  const [primaryHttp] = getRpcEndpoints(cluster);
  return primaryHttp.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
}

export async function fetchSolanaRpc<T = unknown>(
  cluster: string = 'mainnet-beta',
  method: string,
  params: unknown[] = [],
  options: { timeoutMs?: number; skipCache?: boolean } = {}
): Promise<{ result: T; endpoint: string; latencyMs: number }> {
  const { timeoutMs = 3500, skipCache = false } = options;
  const cacheKey = `${cluster}:${method}:${JSON.stringify(params)}`;

  if (!skipCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return {
        result: cached.data.result as T,
        endpoint: cached.data.endpoint,
        latencyMs: cached.data.latencyMs,
      };
    }
  }

  const endpoints = getRpcEndpoints(cluster);
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method,
          params,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const latencyMs = Math.max(1, Math.round(end - start));

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const json = await resp.json();

      if (json.error) {
        throw new Error(json.error.message || `RPC Error ${json.error.code}`);
      }

      const payload = {
        result: json.result as T,
        endpoint,
        latencyMs,
      };

      memoryCache.set(cacheKey, { data: payload, timestamp: Date.now() });
      return payload;
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error(`All ${cluster} RPC endpoints unreachable`);
}
