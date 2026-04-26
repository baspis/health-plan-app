<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '../db/db';
  import {
    PREP_GROUPS,
    PREP_ITEMS,
    getRequiredItemIds,
    type PrepGroup,
    type PrepItem
  } from '../data/preparation';
  import { startFromPrep } from '../stores/phase';

  let completedIds = $state<Set<string>>(new Set());
  let loaded = $state(false);
  let confirming = $state(false);

  onMount(async () => {
    const rows = await db.prepProgress.toArray();
    completedIds = new Set(rows.map((r) => r.itemId));
    loaded = true;
  });

  const requiredIds = getRequiredItemIds();
  const requiredDone = $derived(
    requiredIds.filter((id) => completedIds.has(id)).length
  );
  const requiredTotal = requiredIds.length;
  const allRequiredDone = $derived(requiredDone >= requiredTotal);
  const progressPct = $derived(
    Math.round((requiredDone / Math.max(requiredTotal, 1)) * 100)
  );

  function itemsOf(group: PrepGroup): PrepItem[] {
    return PREP_ITEMS.filter((i) => i.group === group);
  }

  async function toggle(item: PrepItem) {
    if (completedIds.has(item.id)) {
      await db.prepProgress.delete(item.id);
      completedIds.delete(item.id);
    } else {
      await db.prepProgress.put({ itemId: item.id, completedAt: Date.now() });
      completedIds.add(item.id);
    }
    completedIds = new Set(completedIds);
  }

  function startToday() {
    if (!allRequiredDone) return;
    confirming = true;
  }

  function confirmStart() {
    startFromPrep();
    confirming = false;
  }

  function cancelStart() {
    confirming = false;
  }
</script>

<div class="prep">
  <header class="prep-header card card-lifted">
    <div class="prep-label">事前準備期</div>
    <h1 class="prep-title">準備が整ったら、今日から始めよう</h1>
    <p class="prep-sub">
      葬儀前から道具を揃え、検査を予約し、アプリの自動同期を設定する。
      本人ペース。日数のカウントは始まっていない。
    </p>

    <div class="progress-row">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progressPct}%;"></div>
      </div>
      <span class="progress-num num">{requiredDone} / {requiredTotal}</span>
    </div>

    <button
      class="start-btn"
      class:active={allRequiredDone}
      disabled={!allRequiredDone}
      onclick={startToday}
    >
      {allRequiredDone ? '今日から開始（Stage 0a へ）' : `あと ${requiredTotal - requiredDone} 項目`}
    </button>
  </header>

  {#if loaded}
    {#each PREP_GROUPS as group (group.id)}
      <section class="group">
        <header class="group-head">
          <h2 class="group-title">{group.jp}</h2>
          <p class="group-desc">{group.description}</p>
        </header>
        <ul class="items">
          {#each itemsOf(group.id) as item (item.id)}
            {@const done = completedIds.has(item.id)}
            <li class="item card" class:done>
              <button
                class="check"
                class:checked={done}
                onclick={() => toggle(item)}
                aria-label={done ? '未完了に戻す' : '完了にする'}
              >
                {done ? '✓' : ''}
              </button>
              <div class="item-body">
                <div class="item-title-row">
                  <span class="item-title">{item.title}</span>
                  {#if item.cost}
                    <span class="item-cost num">{item.cost}</span>
                  {/if}
                </div>
                {#if item.detail}
                  <p class="item-detail">{item.detail}</p>
                {/if}
                {#if item.link}
                  <a class="item-link" href={item.link.url} target="_blank" rel="noopener noreferrer"
                    >{item.link.label} →</a
                  >
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  {/if}

  {#if confirming}
    <div class="modal-backdrop" onclick={cancelStart} role="presentation">
      <div class="modal card card-lifted" onclick={(e) => e.stopPropagation()} role="dialog">
        <h3 class="modal-title">本当に今日から開始しますか?</h3>
        <p class="modal-msg">
          押すと <strong>Stage 0a（着地期 14 日）</strong> が今日から始まります。
          以降は ADR-022 の段階ゲート（0a → 0b → Day 30 判定 → Phase 1）に沿って進みます。
        </p>
        <div class="modal-actions">
          <button class="modal-btn cancel" onclick={cancelStart}>キャンセル</button>
          <button class="modal-btn confirm" onclick={confirmStart}>はい、開始する</button>
        </div>
      </div>
    </div>
  {/if}

  <footer class="north-star">
    80 歳まで息子と歩き、孫を抱き、妻と旅に出られる体と心
  </footer>
</div>

<style>
  .prep {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 8px 0;
  }
  .prep-header {
    padding: 24px 22px;
  }
  .prep-label {
    display: inline-block;
    padding: 4px 12px;
    background: var(--accent-light);
    color: var(--accent-dark);
    border-radius: var(--rounded-pill);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
  }
  .prep-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.4;
    margin-bottom: 10px;
  }
  .prep-sub {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.65;
    margin-bottom: 18px;
  }
  .progress-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--bg);
    border-radius: var(--rounded-pill);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--accent-dark);
    transition: width var(--anim-med) var(--ease-smooth);
  }
  .progress-num {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink-muted);
    min-width: 48px;
    text-align: right;
  }
  .start-btn {
    width: 100%;
    padding: 14px 20px;
    border-radius: var(--rounded-pill);
    background: var(--bg);
    color: var(--ink-muted);
    font-size: 14px;
    font-weight: 700;
    transition: all var(--anim-fast) var(--ease-smooth);
    cursor: not-allowed;
  }
  .start-btn.active {
    background: var(--ink);
    color: var(--bg);
    cursor: pointer;
  }
  .start-btn.active:active {
    transform: scale(0.98);
  }
  .group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .group-head {
    padding: 0 4px;
  }
  .group-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .group-desc {
    font-size: 11px;
    color: var(--ink-muted);
    line-height: 1.55;
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
  }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    transition: background var(--anim-fast) var(--ease-smooth);
  }
  .item.done {
    opacity: 0.55;
  }
  .check {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--ink-subtle);
    background: transparent;
    color: var(--bg);
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--anim-fast) var(--ease-smooth);
    margin-top: 2px;
  }
  .check.checked {
    background: var(--ink);
    border-color: var(--ink);
  }
  .item-body {
    flex: 1;
    min-width: 0;
  }
  .item-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
  }
  .item-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.4;
  }
  .item-cost {
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-muted);
    flex-shrink: 0;
  }
  .item-detail {
    font-size: 12px;
    color: var(--ink-dim);
    line-height: 1.55;
    margin-bottom: 4px;
  }
  .item-link {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent-dark);
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
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
  .modal-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .modal-msg {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.65;
    margin-bottom: 20px;
  }
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .modal-btn {
    padding: 10px 18px;
    border-radius: var(--rounded-pill);
    font-size: 13px;
    font-weight: 600;
  }
  .modal-btn.cancel {
    background: var(--bg);
    color: var(--ink-muted);
  }
  .modal-btn.confirm {
    background: var(--ink);
    color: var(--bg);
  }
  .north-star {
    text-align: center;
    font-size: 11px;
    color: var(--ink-subtle);
    padding: 24px 16px 0;
    letter-spacing: 0.03em;
    line-height: 1.6;
  }
</style>
