import Dexie, { type Table } from 'dexie';

export interface HealthSnapshot {
  dateISO: string;
  weightKg?: number;
  bodyFatPct?: number;
  sleepHours?: number;
  rhrBpm?: number;
  hrvMs?: number;
  steps?: number;
  vo2max?: number;
  workoutMinutes?: number;
  workoutType?: string;
  activeEnergyKcal?: number;
  ingestedAt: number;
  source: 'shortcuts' | 'manual';
}

export type LabKind = 'dexa' | 'blood-core' | 'blood-ext' | 'waist' | 'bp' | 'sas';

export interface LabResult {
  id?: number;
  kind: LabKind;
  dateISO: string;
  milestone: 'day0' | 'month6' | 'month12' | 'other';
  payload: Record<string, number | string | null>;
  note?: string;
  enteredAt: number;
}

export interface ModeLogEntry {
  id?: number;
  dateISO: string;
  mode: 'normal' | 'low-energy' | 'grief';
  source: 'auto' | 'manual';
  reason?: string;
}

export interface NotificationLog {
  id?: number;
  dateISO: string;
  kind: 'weight-up' | 'sleep-short' | 'hrv-drop' | 'workout-low' | 'stage-gate' | 'lbm-warn';
  severity: 'info' | 'warn' | 'alert';
  message: string;
  dismissedAt?: number;
}

export interface PrepProgress {
  itemId: string;
  completedAt: number;
  note?: string;
}

class DohyoDB extends Dexie {
  healthSnapshots!: Table<HealthSnapshot, string>;
  labResults!: Table<LabResult, number>;
  modeLog!: Table<ModeLogEntry, number>;
  notifications!: Table<NotificationLog, number>;
  prepProgress!: Table<PrepProgress, string>;

  constructor() {
    super('dohyo2');
    this.version(1).stores({
      healthSnapshots: 'dateISO, ingestedAt',
      labResults: '++id, kind, dateISO, milestone',
      modeLog: '++id, dateISO, mode',
      notifications: '++id, dateISO, kind, severity'
    });
    this.version(2).stores({
      healthSnapshots: 'dateISO, ingestedAt',
      labResults: '++id, kind, dateISO, milestone',
      modeLog: '++id, dateISO, mode',
      notifications: '++id, dateISO, kind, severity',
      prepProgress: 'itemId, completedAt'
    });
  }
}

export const db = new DohyoDB();

export async function upsertHealthSnapshot(snapshot: HealthSnapshot): Promise<void> {
  const existing = await db.healthSnapshots.get(snapshot.dateISO);
  if (existing) {
    const merged: HealthSnapshot = {
      ...existing,
      ...Object.fromEntries(
        Object.entries(snapshot).filter(([, v]) => v !== undefined && v !== null)
      ),
      ingestedAt: snapshot.ingestedAt
    } as HealthSnapshot;
    await db.healthSnapshots.put(merged);
  } else {
    await db.healthSnapshots.put(snapshot);
  }
}
