import { SCAN_QUALITY_CONFIG } from "@/constants/scan-quality";

interface PositionSample {
  x: number;
  y: number;
}

export class StillnessTracker {
  private history: PositionSample[] = [];

  push(centerX: number, centerY: number): number {
    this.history.push({ x: centerX, y: centerY });
    if (this.history.length > SCAN_QUALITY_CONFIG.movementHistoryLength) {
      this.history.shift();
    }

    if (this.history.length < 3) {
      return 0.4;
    }

    const latest = this.history[this.history.length - 1];
    let totalMovement = 0;

    for (let i = 0; i < this.history.length - 1; i += 1) {
      const point = this.history[i];
      totalMovement += Math.hypot(latest.x - point.x, latest.y - point.y);
    }

    const averageMovement = totalMovement / (this.history.length - 1);
    const normalized = averageMovement / SCAN_QUALITY_CONFIG.maxNormalizedMovement;

    return Math.max(0, Math.min(1, 1 - normalized));
  }

  reset(): void {
    this.history = [];
  }
}
