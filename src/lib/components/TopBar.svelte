<script lang="ts">
  import { phase, STAGE_META, daysSincePlanStart, daysSinceStageStart } from '../stores/phase';
  import { clock } from '../stores/clock';

  const stageMeta = $derived(STAGE_META[$phase.stage]);
  const planDays = $derived(daysSincePlanStart($phase, $clock));
  const stageDays = $derived(daysSinceStageStart($phase, $clock));
</script>

<header>
  <div class="brand">
    <span class="brand-mark">道</span>
    <span class="brand-name">道標 2</span>
  </div>
  <div class="stage">
    <span class="stage-label">{stageMeta.label}</span>
    <span class="stage-sub">{stageMeta.jp} · Day <span class="num">{planDays}</span></span>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 18px;
    position: sticky;
    top: var(--safe-top);
    background: var(--bg);
    z-index: 10;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-mark {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 16px;
    color: var(--bg);
    background: var(--ink);
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-weight: 700;
    font-size: 15px;
    color: var(--ink);
    letter-spacing: 0.01em;
  }
  .stage {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .stage-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--accent-dark);
    letter-spacing: 0.03em;
  }
  .stage-sub {
    font-size: 11px;
    color: var(--ink-muted);
  }
</style>
