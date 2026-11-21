import { SpeedDashClient } from '@/lib/speed-client/client';
import type { TransactionAutopsyResult } from '@/lib/speed-client/types';

/**
 * AutopsyEngine
 * Delegates transaction fork and parent-switch forensics to SpeedDashClient.
 */
export class AutopsyEngine {
  public async analyzeTransaction(signature: string): Promise<TransactionAutopsyResult> {
    return SpeedDashClient.getInstance().analyzeTransaction(signature);
  }
}
