import { SpeedDashClient } from '@/lib/speed-client/client';
import type {
  TransactionAutopsyResult,
  NetworkStatus,
} from '@/lib/speed-client/types';

/**
 * SpeedDashService
 * High-level facade wrapping SpeedDashClient for cluster switching and consensus snapshots.
 */
export class SpeedDashService {
  private static instance: SpeedDashService | null = null;
  private client: SpeedDashClient = SpeedDashClient.getInstance();

  public static getInstance(): SpeedDashService {
    if (!SpeedDashService.instance) {
      SpeedDashService.instance = new SpeedDashService();
    }
    return SpeedDashService.instance;
  }

  public async setCluster(cluster: string): Promise<void> {
    await this.client.switchCluster(cluster);
  }

  public start(): void {
    this.client.start();
  }

  public stop(): void {
    this.client.stop();
  }

  public async analyzeTransaction(signature: string): Promise<TransactionAutopsyResult> {
    return this.client.analyzeTransaction(signature);
  }

  public getNetworkStatus(): NetworkStatus {
    return this.client.getSnapshotState().networkStatus;
  }
}
