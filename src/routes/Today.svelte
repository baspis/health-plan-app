<script lang="ts">
  import { onMount } from 'svelte';
  import { clock } from '../lib/stores/clock';
  import { phase, daysSincePlanStart, startFromPrep } from '../lib/stores/phase';
  import { health, refreshHealth } from '../lib/stores/health';
  import { db, type LabResult } from '../lib/db/db';
  import { buildTodos, type TodoItem, type DayOfWeek } from '../lib/data/todoBuilder';
  import { detectDone } from '../lib/judgment/autoDetect';
  import { pickPraise } from '../lib/data/praise';
  import { assessRest } from '../lib/judgment/restTrigger';
  import PhaseHeader from '../lib/components/PhaseHeader.svelte';
  import TodoItemView from '../lib/components/TodoItem.svelte';
  import LabModal from '../lib/components/LabModal.svelte';

  let prepCompletedIds = $state<Set<string>>(new Set());
  let labs = $state<LabResult[]>([]);
  let labModalMs = $state<'day0' | 'month6' | 'month12' | null>(null);

  onMount(async () => {
    await refreshHealth();
    const rows = await db.prepProgress.toArray();
    prepCompletedIds = new Set(rows.map((r) => r.itemId));
    labs = await db.labResults.toArray();
  });

  function todayISO(d: Date = new Date()): string {
    const tz = d.getTimezoneOffset() * 60_000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  const now = $derived($clock);
  const dow = $derived(now.getDay() as DayOfWeek);
  const nowMin = $derived(now.getHours() * 60 + now.getMinutes());
  const todayKey = $derived(todayISO(now));
  const restAssessment = $derived(assessRest($health));
  const dayPlan = $derived(daysSincePlanStart($phase, now));

  const hasDay0Lab = $derived(labs.some((l) => l.milestone === 'day0'));
  const hasMonth6Lab = $derived(labs.some((l) => l.milestone === 'month6'));
  const hasMonth12Lab = $derived(labs.some((l) => l.milestone === 'month12'));

  const todos = $derived(
    buildTodos({
      stage: $phase.stage,
      dow,
      rest: restAssessment,
      prepCompletedIds,
      daysSincePlanStart: dayPlan,
      hasDay0Lab,
      hasMonth6Lab,
      hasMonth12Lab
    })
  );

  const todaySnapshot = $derived(
    $health.latest && $health.latest.dateISO === todayKey ? $health.latest : null
  );

  function positionOf(item: TodoItem): 'past' | 'now' | 'future' | 'flow' {
    if (item.startMin === null) return 'flow';
    if (item.endMin !== null && nowMin >= item.startMin && nowMin < item.endMin) return 'now';
    if (nowMin >= (item.endMin ?? item.startMin)) return 'past';
    return 'future';
  }

  const allPrepDone = $derived(
    $phase.stage === 'prep' && todos.length === 1 && todos[0].kind === 'prep-ready'
  );
  let confirmingStart = $state(false);

  async function onItemClick(item: TodoItem) {
    if (item.kind === 'prep-item' && item.prepItem) {
      const id = item.prepItem.id;
      if (prepCompletedIds.has(id)) {
        await db.prepProgress.delete(id);
        prepCompletedIds.delete(id);
      } else {
        await db.prepProgress.put({ itemId: id, completedAt: Date.now() });
        prepCompletedIds.add(id);
      }
      prepCompletedIds = new Set(prepCompletedIds);
      return;
    }
    if (item.kind === 'prep-ready') {
      confirmingStart = true;
      return;
    }
    if (item.kind === 'lab-day0') labModalMs = 'day0';
    if (item.kind === 'lab-month6') labModalMs = 'month6';
    if (item.kind === 'lab-month12') labModalMs = 'month12';
  }

  function confirmStart() {
    startFromPrep();
    confirmingStart = false;
  }

  function cancelStart() {
    confirmingStart = false;
  }

  async function closeLabModal() {
    labModalMs = null;
    labs = await db.labResults.toArray();
  }
</script>

<div class="page">
  <PhaseHeader />

  {#if restAssessment.level !== 'normal'}
    <div class="rest-note pill pill-warn">
      {restAssessment.badge} · {restAssessment.reasons.join(' / ') || ''}
    </div>
  {/if}

  <ul class="list">
    {#each todos as item (item.id)}
      {@const detected = detectDone(item, todaySnapshot)}
      {@const praise = detected.done ? pickPraise(item.kind, todayKey) : undefined}
      <li>
        <TodoItemView
          {item}
          position={positionOf(item)}
          {detected}
          praiseText={praise}
          onItemClick={onItemClick}
        />
      </li>
    {/each}
  </ul>

  {#if $phase.stage === 'prep' && !allPrepDone}
    <p class="prep-progress">
      準備 {prepCompletedIds.size} / 19 項目完了
    </p>
  {/if}

  {#if allPrepDone}
    <button class="start-btn" onclick={() => (confirmingStart = true)}>
      今日から始める
    </button>
  {/if}

  <footer class="north-star">
    80 歳まで息子と歩き、孫を抱き、妻と旅に出られる体と心
  </footer>
</div>

{#if confirmingStart}
  <div class="backdrop" onclick={cancelStart} role="presentation">
    <div
      class="modal card card-lifted"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title">本当に今日から始めますか?</h3>
      <p class="m-msg">
        押すと <strong>Stage 0a（着地期 14 日）</strong> が今日から始まります。
        以降は段階ゲートに沿って進みます。
      </p>
      <div class="m-actions">
        <button class="m-btn cancel" onclick={cancelStart}>もう少し待つ</button>
        <button class="m-btn confirm" onclick={confirmStart}>はい、始める</button>
      </div>
    </div>
  </div>
{/if}

{#if labModalMs}
  <LabModal milestone={labModalMs} onClose={closeLabModal} />
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .rest-note {
    align-self: flex-start;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
  }
  .prep-progress {
    text-align: center;
    font-size: 12px;
    color: var(--ink-muted);
    font-weight: 600;
    margin-top: 6px;
  }
  .start-btn {
    align-self: stretch;
    margin-top: 4px;
    padding: 16px 22px;
    border-radius: var(--rounded-pill);
    background: var(--coral);
    color: var(--bg-elevated);
    font-size: 15px;
    font-weight: 700;
    box-shadow: var(--card-shadow-lifted);
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .start-btn:active {
    transform: scale(0.98);
  }
  .north-star {
    text-align: center;
    font-size: 11px;
    color: var(--ink-subtle);
    padding: 24px 12px 8px;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(61, 46, 32, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 100;
  }
  .modal {
    max-width: 360px;
    padding: 24px;
  }
  .m-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .m-msg {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.65;
    margin-bottom: 20px;
  }
  .m-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .m-btn {
    padding: 10px 18px;
    border-radius: var(--rounded-pill);
    font-size: 13px;
    font-weight: 700;
  }
  .m-btn.cancel {
    background: var(--bg);
    color: var(--ink-muted);
  }
  .m-btn.confirm {
    background: var(--coral);
    color: var(--bg-elevated);
  }
</style>
