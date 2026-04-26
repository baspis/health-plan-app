<script lang="ts">
  import { onMount } from 'svelte';
  import { phase, daysSincePlanStart } from '../lib/stores/phase';
  import { clock } from '../lib/stores/clock';
  import { health, refreshHealth } from '../lib/stores/health';
  import { db, type LabResult } from '../lib/db/db';
  import { checkGLPStatus, type GLPCheckResult } from '../lib/judgment/glpCheck';

  let labs = $state<LabResult[]>([]);
  let glp = $state<GLPCheckResult | null>(null);

  onMount(async () => {
    await refreshHealth();
    labs = await db.labResults.toArray();
    glp = checkGLPStatus($phase, $health, labs, $clock);
  });

  $effect(() => {
    glp = checkGLPStatus($phase, $health, labs, $clock);
  });

  const days = $derived(daysSincePlanStart($phase, $clock));
  const day0Weight = $derived(findDay0Weight(labs));
  const currentWeight = $derived($health.weight7Avg);

  const weightLossPct = $derived(
    day0Weight !== null && currentWeight !== null ? ((day0Weight - currentWeight) / day0Weight) * 100 : null
  );

  const paceKgPerMonth = $derived(
    day0Weight !== null && currentWeight !== null && days > 0
      ? ((day0Weight - currentWeight) / days) * 30
      : null
  );

  function projectWeight(targetDays: number): { low: number; high: number } | null {
    if (day0Weight === null || paceKgPerMonth === null || paceKgPerMonth <= 0) return null;
    const monthsRemaining = Math.max(0, (targetDays - days) / 30);
    const centerLoss = paceKgPerMonth * monthsRemaining;
    const low = currentWeight! - centerLoss * 1.2;
    const high = currentWeight! - centerLoss * 0.8;
    return { low: Math.max(low, 72), high: Math.min(high, 110) };
  }

  const month6 = $derived(projectWeight(180));
  const month12 = $derived(projectWeight(365));
  const month36 = $derived(projectWeight(1095));

  function findDay0Weight(labs: LabResult[]): number | null {
    const entry = labs.find((l) => l.kind === 'dexa' && l.milestone === 'day0');
    if (entry && typeof entry.payload.weightKg === 'number') return entry.payload.weightKg;
    return null;
  }

  function fmt(v: number): string {
    return v.toFixed(1);
  }

  const vo2maxLikelihood = $derived<'high' | 'mid' | 'low' | 'unknown'>(
    $health.vo2maxTrend90 === 'up'
      ? 'high'
      : $health.vo2maxTrend90 === 'flat'
        ? 'mid'
        : $health.vo2maxTrend90 === 'down'
          ? 'low'
          : 'unknown'
  );
</script>

<div class="forecast">
  <div class="intro">
    <h2 class="intro-title">見通し</h2>
    <p class="intro-sub">現在のペースを延長した場合の予測帯（確約ではなく参考）</p>
  </div>

  {#if $phase.stage === 'prep'}
    <div class="card empty prep-empty">
      <p>事前準備期は予測なし。</p>
      <p class="prep-hint">
        Today タブで準備チェックリストを完了し、「今日から開始」を押すと Stage 0a が始まり、
        Day 0 DEXA 結果の入力後にこの見通しが表示されます。
      </p>
    </div>
  {:else if day0Weight === null || currentWeight === null}
    <div class="card empty">
      <p>Day 0 の DEXA 結果を Input タブから入力すると、ここに予測が表示されます。</p>
    </div>
  {:else}
    <div class="card pace">
      <span class="label">現在のペース</span>
      {#if paceKgPerMonth !== null && paceKgPerMonth > 0}
        <span class="value num">-{fmt(paceKgPerMonth)} kg / 月</span>
      {:else}
        <span class="value muted">データ蓄積中</span>
      {/if}
      {#if weightLossPct !== null}
        <span class="sub num">累計 {weightLossPct >= 0 ? '-' : '+'}{fmt(Math.abs(weightLossPct))}%</span>
      {/if}
    </div>

    <section class="projections">
      {#each [['Month 6', month6], ['Month 12', month12], ['Month 36 Sweet Spot', month36]] as [label, pred]}
        <div class="proj card">
          <span class="proj-label">{label}</span>
          {#if pred}
            <span class="proj-value num">{fmt(pred.high)} - {fmt(pred.low)} kg</span>
          {:else}
            <span class="proj-value muted">---</span>
          {/if}
        </div>
      {/each}
    </section>
  {/if}

  {#if $phase.stage !== 'prep'}
  <section class="vo2max card">
    <h3 class="vo2-title">VO2max Month 12 到達可能性</h3>
    <div class="vo2-body">
      {#if vo2maxLikelihood === 'high'}
        <span class="pill pill-ok">高（上昇トレンド）</span>
      {:else if vo2maxLikelihood === 'mid'}
        <span class="pill pill-warn">中（横ばい）</span>
      {:else if vo2maxLikelihood === 'low'}
        <span class="pill pill-danger">低（下降傾向）</span>
      {:else}
        <span class="pill pill-neutral">データ不足</span>
      {/if}
      <p class="vo2-note">3 ヶ月移動平均のトレンド方向が主指標。絶対値 >40 は参考（Apple Watch MAPE 約 13%）。</p>
    </div>
  </section>

  {#if glp}
    <section class="glp card">
      <h3 class="glp-title">GLP-1 判断チャート（ADR-020）</h3>
      <p class="glp-milestone">
        現在: {glp.milestone === 'before-month3' ? 'Month 3 以前' : glp.milestone === 'month3' ? 'Month 3' : glp.milestone === 'month6' ? 'Month 6' : 'Month 12'}
        （Day <span class="num">{glp.daysSincePlanStart}</span>）
      </p>
      <ul class="conditions">
        {#each glp.primaryConditions as cond}
          <li class="cond">
            <span class="cond-id">{cond.id}</span>
            <span class="cond-label">{cond.label}</span>
            <span class="cond-value num">{cond.value ?? '—'}</span>
            {#if cond.met === true}
              <span class="pill pill-ok">達成</span>
            {:else if cond.met === false}
              <span class="pill pill-warn">未達</span>
            {:else}
              <span class="pill pill-neutral">データなし</span>
            {/if}
          </li>
        {/each}
      </ul>
      <p class="glp-rec">{glp.recommendation}</p>
    </section>
  {/if}
  {/if}

  <footer class="disclaimer">
    予測はあくまで参考。個人差・体調・家族イベント・季節で容易にずれる（ADR-008 日数断定を避ける方針）。
  </footer>
</div>

<style>
  .forecast {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .intro-title {
    font-size: 18px;
    margin-bottom: 4px;
  }
  .intro-sub {
    color: var(--ink-muted);
    font-size: 12px;
    line-height: 1.6;
  }
  .empty {
    padding: 22px;
    color: var(--ink-muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .prep-empty {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .prep-hint {
    color: var(--ink-subtle);
    font-size: 12px;
  }
  .pace {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px 22px;
  }
  .pace .label {
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-muted);
    letter-spacing: 0.06em;
  }
  .pace .value {
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }
  .pace .sub {
    font-size: 12px;
    color: var(--ink-dim);
  }
  .projections {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .proj {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
  }
  .proj-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }
  .proj-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--accent-dark);
  }
  .vo2max {
    padding: 18px 22px;
  }
  .vo2-title {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .vo2-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .vo2-note {
    font-size: 11px;
    color: var(--ink-muted);
    line-height: 1.6;
  }
  .glp {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .glp-title {
    font-size: 13px;
  }
  .glp-milestone {
    font-size: 12px;
    color: var(--ink-muted);
  }
  .conditions {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cond {
    display: grid;
    grid-template-columns: 22px 1fr auto auto;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-radius: var(--rounded-sm);
    background: var(--bg);
  }
  .cond-id {
    font-weight: 700;
    font-size: 12px;
    color: var(--ink-muted);
  }
  .cond-label {
    font-size: 12px;
    color: var(--ink-dim);
    line-height: 1.4;
  }
  .cond-value {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
  }
  .glp-rec {
    font-size: 13px;
    color: var(--accent-dark);
    font-weight: 600;
    padding: 10px 12px;
    background: var(--accent-light);
    border-radius: var(--rounded-sm);
  }
  .disclaimer {
    font-size: 11px;
    color: var(--ink-subtle);
    line-height: 1.6;
    text-align: center;
    padding: 16px 8px 8px;
  }
</style>
