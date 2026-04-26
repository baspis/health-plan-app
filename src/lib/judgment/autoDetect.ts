import type { HealthSnapshot } from '../db/db';
import type { TodoItem, TodoKind } from '../data/todoBuilder';

export interface DetectionResult {
  done: boolean;
  valueText?: string;
}

export function detectDone(item: TodoItem, today: HealthSnapshot | null): DetectionResult {
  if (!today) return { done: false };
  switch (item.kind) {
    case 'weigh':
      if (typeof today.weightKg === 'number') {
        return { done: true, valueText: `${today.weightKg.toFixed(1)} kg` };
      }
      return { done: false };
    case 'walking':
      if (matchesWorkoutType(today.workoutType, ['walk', 'hiking'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      if (typeof today.steps === 'number' && today.steps >= 6000 && (today.workoutMinutes ?? 0) >= 15) {
        return { done: true, valueText: `${today.steps.toLocaleString()} 歩` };
      }
      return { done: false };
    case 'strength':
      if (matchesWorkoutType(today.workoutType, ['functionalstrength', 'traditionalstrength', 'core', 'strength'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      return { done: false };
    case 'cooldown':
      if (matchesWorkoutType(today.workoutType, ['mindcooldown', 'cooldown', 'mindfulness', 'flexibility'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      return { done: false };
    case 'hiit':
      if (matchesWorkoutType(today.workoutType, ['highintensityinterval', 'hiit'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      return { done: false };
    case 'yoga':
      if (matchesWorkoutType(today.workoutType, ['yoga'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      return { done: false };
    case 'meditation':
      if (matchesWorkoutType(today.workoutType, ['mindfulness', 'meditation'])) {
        return { done: true, valueText: minutesText(today.workoutMinutes) };
      }
      return { done: false };
    case 'grocery':
    case 'family-walk':
      if (typeof today.steps === 'number' && today.steps >= 8000) {
        return { done: true, valueText: `${today.steps.toLocaleString()} 歩` };
      }
      return { done: false };
    default:
      return { done: false };
  }
}

export function isDetectableKind(kind: TodoKind): boolean {
  return [
    'weigh',
    'walking',
    'strength',
    'cooldown',
    'hiit',
    'yoga',
    'meditation',
    'grocery',
    'family-walk'
  ].includes(kind);
}

function matchesWorkoutType(workoutType: string | undefined, needles: string[]): boolean {
  if (!workoutType) return false;
  const lower = workoutType.toLowerCase().replace(/[\s_-]/g, '');
  return needles.some((n) => lower.includes(n));
}

function minutesText(min: number | undefined): string | undefined {
  if (typeof min !== 'number' || min <= 0) return undefined;
  return `${Math.round(min)} 分`;
}
