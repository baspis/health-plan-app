<script lang="ts">
  import { phase, daysSincePlanStart, daysSinceStageStart, STAGE_META } from '../stores/phase';
  import { clock } from '../stores/clock';

  const DOW_JP = ['日', '月', '火', '水', '木', '金', '土'];

  const now = $derived($clock);
  const dow = $derived(DOW_JP[now.getDay()]);
  const hours = $derived(String(now.getHours()).padStart(2, '0'));
  const minutes = $derived(String(now.getMinutes()).padStart(2, '0'));
  const stageLabel = $derived(STAGE_META[$phase.stage].jp);
  const dayPlan = $derived(daysSincePlanStart($phase, now));
  const dayStage = $derived(daysSinceStageStart($phase, now));

  const subtitle = $derived(buildSubtitle());

  function buildSubtitle(): string {
    if ($phase.stage === 'prep') {
      return '準備期 · 自分のペースで';
    }
    if ($phase.stage === '0a') {
      return `着地期 · ${dayStage + 1}/14 日目`;
    }
    if ($phase.stage === '0b') {
      return `最小ベースライン · ${dayStage + 1}/16 日目`;
    }
    return `${stageLabel} · Day ${dayPlan + 1}`;
  }
</script>

<header class="phase-header">
  <div class="time-row">
    <span class="now-time num">{hours}:{minutes}</span>
    <span class="now-dow">{dow}曜日</span>
  </div>
  <p class="phase-line">{subtitle}</p>
</header>

<style>
  .phase-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 4px 14px;
  }
  .time-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .now-time {
    font-size: 32px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .now-dow {
    font-size: 14px;
    color: var(--ink-dim);
    font-weight: 600;
  }
  .phase-line {
    font-size: 12px;
    color: var(--accent-dark);
    font-weight: 700;
    letter-spacing: 0.04em;
  }
</style>
