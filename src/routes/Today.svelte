<script lang="ts">
  import { onMount } from 'svelte';
  import { clock } from '../lib/stores/clock';
  import { phase } from '../lib/stores/phase';
  import { health, refreshHealth } from '../lib/stores/health';
  import { db } from '../lib/db/db';
  import { buildTodos, type TodoItem, type DayOfWeek } from '../lib/data/todoBuilder';
  import { detectDone } from '../lib/judgment/autoDetect';
  import { pickPraise } from '../lib/data/praise';
  import { assessRest } from '../lib/judgment/restTrigger';
  import PhaseHeader from '../lib/components/PhaseHeader.svelte';
  import PhaseRoadmap from '../lib/components/PhaseRoadmap.svelte';
  import SettingsMenu from '../lib/components/SettingsMenu.svelte';
  import LabAccess from '../lib/components/LabAccess.svelte';
  import TodoItemView from '../lib/components/TodoItem.svelte';
  import PrepDetailModal from '../lib/components/PrepDetailModal.svelte';
  import type { PrepItem } from '../lib/data/preparation';

  let prepCompletedIds = $state<Set<string>>(new Set());
  let activePrepItem = $state<PrepItem | null>(null);

  onMount(async () => {
    await refreshHealth();
    const rows = await db.prepProgress.toArray();
    prepCompletedIds = new Set(rows.map((r) => r.itemId));
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

  const todos = $derived(
    buildTodos({
      stage: $phase.stage,
      dow,
      rest: restAssessment,
      prepCompletedIds
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

  async function onItemClick(item: TodoItem) {
    if (item.kind === 'prep-item' && item.prepItem) {
      activePrepItem = item.prepItem;
    }
  }

  async function togglePrepCompleted() {
    if (!activePrepItem) return;
    const id = activePrepItem.id;
    if (prepCompletedIds.has(id)) {
      await db.prepProgress.delete(id);
      prepCompletedIds.delete(id);
    } else {
      await db.prepProgress.put({ itemId: id, completedAt: Date.now() });
      prepCompletedIds.add(id);
    }
    prepCompletedIds = new Set(prepCompletedIds);
  }

  function closePrepModal() {
    activePrepItem = null;
  }
</script>

<div class="page">
  <div class="top-row">
    <PhaseHeader />
    <SettingsMenu />
  </div>

  {#if restAssessment.level !== 'normal'}
    <div class="rest-note pill pill-warn">
      {restAssessment.badge} · {restAssessment.reasons.join(' / ') || ''}
    </div>
  {/if}

  <section class="today-block">
    <h2 class="block-title">今日のあなた</h2>
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
    {#if $phase.stage === 'prep'}
      <p class="prep-progress">
        準備チェックリスト: {prepCompletedIds.size} / 21 項目
      </p>
    {/if}
  </section>

  <PhaseRoadmap />

  <LabAccess />

  <footer class="north-star">
    80 歳まで息子と歩き、孫を抱き、妻と旅に出られる体と心
  </footer>
</div>

{#if activePrepItem}
  <PrepDetailModal
    item={activePrepItem}
    isCompleted={prepCompletedIds.has(activePrepItem.id)}
    onClose={closePrepModal}
    onToggleCompleted={togglePrepCompleted}
  />
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .rest-note {
    align-self: flex-start;
  }
  .today-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .block-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-dim);
    letter-spacing: 0.06em;
    padding: 0 4px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
  }
  .prep-progress {
    text-align: center;
    font-size: 11px;
    color: var(--ink-muted);
    font-weight: 600;
    padding-top: 4px;
  }
  .north-star {
    text-align: center;
    font-size: 11px;
    color: var(--ink-subtle);
    padding: 18px 12px 8px;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }
</style>
