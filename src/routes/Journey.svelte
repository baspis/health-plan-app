<script lang="ts">
  import { onMount } from 'svelte';
  import { phase, daysSincePlanStart } from '../lib/stores/phase';
  import { clock } from '../lib/stores/clock';
  import { health, refreshHealth } from '../lib/stores/health';
  import { db, type LabResult } from '../lib/db/db';
  import { MILESTONES, type Milestone } from '../lib/data/plan';

  let labs = $state<LabResult[]>([]);

  onMount(async () => {
    await refreshHealth();
    labs = await db.labResults.toArray();
  });

  const daysElapsed = $derived(daysSincePlanStart($phase, $clock));

  function milestoneStatus(m: Milestone): 'done' | 'current' | 'upcoming' {
    const nextIdx = MILESTONES.findIndex((x) => x.daysFromPlanStart > daysElapsed);
    const currentIdx = nextIdx === -1 ? MILESTONES.length - 1 : nextIdx - 1;
    const myIdx = MILESTONES.findIndex((x) => x.id === m.id);
    if (myIdx < currentIdx) return 'done';
    if (myIdx === currentIdx) return 'current';
    return 'upcoming';
  }

  function daysUntil(m: Milestone): number {
    return m.daysFromPlanStart - daysElapsed;
  }

  function indicatorLine(m: Milestone): string {
    const parts: string[] = [];
    if (m.id === 'day30') {
      const avg = $health.avgSleepHours7;
      if (avg !== null) parts.push(`睡眠 7 日平均 ${avg.toFixed(1)}h`);
    }
    if (['month3', 'month6', 'month12'].includes(m.id)) {
      const day0 = labs.find((l) => l.kind === 'dexa' && l.milestone === 'day0');
      const msLab = labs.find((l) => l.kind === 'dexa' && l.milestone === m.id);
      if (day0 && msLab && typeof day0.payload.weightKg === 'number' && typeof msLab.payload.weightKg === 'number') {
        const diff = msLab.payload.weightKg - day0.payload.weightKg;
        parts.push(`体重 ${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg`);
      } else if ($health.weight7Avg !== null) {
        parts.push(`体重 7 日平均 ${$health.weight7Avg.toFixed(1)} kg`);
      }
      if ($health.vo2maxTrend90 !== 'unknown') {
        const arrow = $health.vo2maxTrend90 === 'up' ? '↑' : $health.vo2maxTrend90 === 'down' ? '↓' : '→';
        parts.push(`VO2max ${arrow}`);
      }
    }
    return parts.join(' · ');
  }
</script>

<div class="journey">
  <div class="intro">
    <h2 class="intro-title">道のり</h2>
    <p class="intro-sub num">
      Day <span class="big">{daysElapsed}</span> / 1095（3 年）
    </p>
  </div>

  <div class="timeline">
    {#each MILESTONES as m, i (m.id)}
      {@const status = milestoneStatus(m)}
      <div class="stop" class:done={status === 'done'} class:current={status === 'current'} class:upcoming={status === 'upcoming'}>
        <div class="stop-marker">
          {#if status === 'done'}
            <span class="dot done-dot">✓</span>
          {:else if status === 'current'}
            <span class="dot current-dot">●</span>
          {:else}
            <span class="dot upcoming-dot"></span>
          {/if}
          {#if i < MILESTONES.length - 1}
            <span class="line" class:line-done={status === 'done'}></span>
          {/if}
        </div>

        <div class="stop-card card">
          <div class="stop-header">
            <div>
              <span class="stop-label">{m.label}</span>
              <span class="stop-sub">{m.sub}</span>
            </div>
            {#if status === 'upcoming' && daysUntil(m) > 0}
              <span class="stop-days num pill pill-neutral">残 {daysUntil(m)} 日</span>
            {:else if status === 'current'}
              <span class="stop-days pill pill-warn">現在地</span>
            {:else}
              <span class="stop-days pill pill-ok">通過</span>
            {/if}
          </div>
          <ul class="indicators">
            {#each m.indicators as ind}
              <li>{ind}</li>
            {/each}
          </ul>
          {#if status !== 'upcoming'}
            {@const line = indicatorLine(m)}
            {#if line}
              <p class="indicator-actual num">{line}</p>
            {/if}
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .journey {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .intro-title {
    font-size: 18px;
    margin-bottom: 4px;
  }
  .intro-sub {
    color: var(--ink-muted);
    font-size: 13px;
  }
  .big {
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .stop {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 12px;
    padding-bottom: 16px;
  }
  .stop-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8px;
  }
  .dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .done-dot {
    background: var(--ok);
    color: var(--bg-elevated);
  }
  .current-dot {
    background: var(--accent);
    color: var(--bg-elevated);
    box-shadow: 0 0 0 4px var(--accent-light);
  }
  .upcoming-dot {
    background: var(--divider);
  }
  .line {
    flex: 1;
    width: 2px;
    background: var(--divider);
    margin-top: 4px;
  }
  .line-done {
    background: var(--ok);
    opacity: 0.4;
  }
  .stop-card {
    padding: 14px 16px;
  }
  .stop-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stop-label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
  }
  .stop-sub {
    display: block;
    font-size: 11px;
    color: var(--ink-muted);
    margin-top: 2px;
  }
  .indicators {
    margin: 0;
    padding-left: 18px;
    font-size: 12px;
    color: var(--ink-dim);
    line-height: 1.7;
  }
  .indicator-actual {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed var(--divider);
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
  }
  .upcoming .stop-card {
    opacity: 0.6;
  }
</style>
