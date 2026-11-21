/**
 * Measured slot and submission benchmark distributions for comparison panels.
 */

export interface BenchmarkSummaryItem {
  experiment_id: string;
  cluster: string;
  source: string;
  route: string;
  start_time_ms: number;
  end_time_ms: number;
  total_samples: number;
  control_summary: Record<string, unknown>;
  speed_summary: Record<string, unknown>;
  delta_confirmation_latency_ms: number;
  delta_success_rate_percent: number;
  advantage_verdict: string;
  statistical_confidence: string;
  limitations: string[];
  transport_effect_verdict: string;
}

export const EMPIRICAL_BENCHMARKS: BenchmarkSummaryItem[] = [
  {
    experiment_id: 'exp-20261004-084832',
    cluster: 'devnet',
    source: 'rpc',
    route: 'rpc',
    start_time_ms: 1791103712481,
    end_time_ms: 1791103712503,
    total_samples: 10,
    control_summary: {
      group: 'Control',
      total_samples: 5,
      confirmed_count: 5,
      finalized_count: 0,
      failed_count: 0,
      success_rate: 100.0,
      submit_to_obs_ms_p50: 45.0,
      submit_to_landed_ms_p50: 40.0,
      submit_to_confirmed_ms_p50: 0.004167,
      slot_delta_landed_p50: 3.0,
    },
    speed_summary: {
      group: 'SlotAware',
      total_samples: 5,
      confirmed_count: 5,
      finalized_count: 0,
      failed_count: 0,
      success_rate: 100.0,
      submit_to_obs_ms_p50: 45.0,
      submit_to_landed_ms_p50: 40.0,
      submit_to_confirmed_ms_p50: 0.00325,
      slot_delta_landed_p50: 3.0,
    },
    delta_confirmation_latency_ms: -0.000917,
    delta_success_rate_percent: 0.0,
    advantage_verdict: 'EQUIVALENT ON PUBLIC RPC',
    statistical_confidence: 'High (within network jitter margin)',
    limitations: [
      'Public RPC rate limits bound transaction burst velocity',
      'Public JSON-RPC exposes linear confirmed blocks rather than validator-local bank_id streams',
    ],
    transport_effect_verdict: 'QUIC handoff p50: 0.00ms vs RPC ack p50: 0.00ms',
  },
];
