import type { SlotProgress } from './types';

/**
 * SpeedDash Monotonic Slot Clock
 * Tracks slot phase, elapsed duration, and drift across SIMD-0525 200ms slots.
 */
export class SlotClock {
  private currentSlot: number = 0;
  private targetSlotDurationMs: number = 200;
  private slotStartTimestampMs: number = 0;
  private lastObservedSlotDurationMs: number = 200;
  private totalSlotsObserved: number = 0;

  constructor(targetSlotDurationMs: number = 200) {
    this.targetSlotDurationMs = targetSlotDurationMs;
    this.slotStartTimestampMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  public setTargetSlotDuration(durationMs: number): void {
    if (durationMs > 0 && durationMs <= 1000) {
      this.targetSlotDurationMs = durationMs;
    }
  }

  public getTargetSlotDuration(): number {
    return this.targetSlotDurationMs;
  }

  public getCurrentSlot(): number {
    return this.currentSlot;
  }

  public getTotalSlotsObserved(): number {
    return this.totalSlotsObserved;
  }

  /**
   * Called whenever an authoritative slot is observed on the cluster stream.
   */
  public onSlotObserved(slot: number, timestampMs?: number): void {
    const now = timestampMs ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());

    if (this.currentSlot > 0 && slot > this.currentSlot) {
      const deltaSlots = slot - this.currentSlot;
      const elapsedTime = now - this.slotStartTimestampMs;
      if (deltaSlots === 1 && elapsedTime > 50 && elapsedTime < 2000) {
        this.lastObservedSlotDurationMs = elapsedTime;
      }
    }

    this.currentSlot = slot;
    this.slotStartTimestampMs = now;
    this.totalSlotsObserved++;
  }

  /**
   * Computes slot phase and progression at `nowOverrideMs` (or current clock).
   */
  public getSlotProgress(nowOverrideMs?: number): SlotProgress {
    if (this.currentSlot === 0) {
      return {
        slot: 0,
        targetDurationMs: this.targetSlotDurationMs,
        targetSlotDurationMs: this.targetSlotDurationMs,
        elapsedMs: 0,
        remainingMs: this.targetSlotDurationMs,
        phaseRatio: 0,
        driftMs: 0,
        isRealTime: false,
        provenance: 'UNAVAILABLE',
      };
    }

    const now = nowOverrideMs ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const elapsed = Math.max(0, now - this.slotStartTimestampMs);
    const duration = this.targetSlotDurationMs;

    const phaseRatio = Math.min(1.0, elapsed / duration);
    const remaining = Math.max(0, duration - elapsed);
    const drift = elapsed > duration ? elapsed - duration : 0;

    return {
      slot: this.currentSlot,
      targetDurationMs: duration,
      targetSlotDurationMs: duration,
      elapsedMs: Math.round(elapsed),
      remainingMs: Math.round(remaining),
      phaseRatio: Number(phaseRatio.toFixed(3)),
      driftMs: Math.round(drift),
      isRealTime: true,
      provenance: 'ESTIMATED',
    };
  }

  public getMeasuredSlotDuration(): number {
    return this.lastObservedSlotDurationMs;
  }
}
