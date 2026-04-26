<script lang="ts">
  import type { TodoItem } from '../data/todoBuilder';
  import { isDetectableKind } from '../judgment/autoDetect';

  type Position = 'past' | 'now' | 'future' | 'flow';

  interface Props {
    item: TodoItem;
    position: Position;
    detected: { done: boolean; valueText?: string };
    praiseText?: string;
    onCtaClick?: (item: TodoItem) => void;
    onItemClick?: (item: TodoItem) => void;
  }

  const { item, position, detected, praiseText, onCtaClick, onItemClick }: Props = $props();

  const timeLabel = $derived(formatTime(item.startMin));
  const detectable = $derived(isDetectableKind(item.kind));
  const showPraise = $derived(detectable && detected.done);
  const isClickable = $derived(item.kind === 'prep-item' || item.kind.startsWith('lab-') || item.kind === 'prep-ready');

  function formatTime(min: number | null): string {
    if (min === null) return '';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function handleCta(e: Event) {
    e.stopPropagation();
    if (item.cta && onCtaClick) onCtaClick(item);
    else if (item.cta) {
      try {
        window.location.href = item.cta.url;
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleItem() {
    if (isClickable && onItemClick) onItemClick(item);
  }
</script>

<article
  class="todo"
  class:past={position === 'past'}
  class:now={position === 'now'}
  class:future={position === 'future'}
  class:flow={position === 'flow'}
  class:done={showPraise}
  class:clickable={isClickable}
  onclick={handleItem}
  role={isClickable ? 'button' : undefined}
  tabindex={isClickable ? 0 : undefined}
>
  {#if timeLabel}
    <div class="time num">{timeLabel}</div>
  {:else}
    <div class="time bullet">·</div>
  {/if}

  <div class="body">
    <div class="title-row">
      <h3 class="title">{item.title}</h3>
      {#if showPraise && detected.valueText}
        <span class="value num">{detected.valueText}</span>
      {/if}
    </div>
    {#if item.detail}
      <p class="detail">{item.detail}</p>
    {/if}
    {#if showPraise && praiseText}
      <p class="praise"><span class="check">✓</span> {praiseText}</p>
    {/if}
    {#if item.cta && position !== 'past'}
      <button class="cta" onclick={handleCta}>
        {item.cta.label} を開く →
      </button>
    {/if}
  </div>
</article>

<style>
  .todo {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-elevated);
    border-radius: var(--rounded-sm);
    box-shadow: var(--card-shadow);
    transition: all var(--anim-fast) var(--ease-smooth);
    text-align: left;
    width: 100%;
  }
  .todo.clickable {
    cursor: pointer;
  }
  .todo.clickable:active {
    transform: scale(0.99);
  }
  .todo.past {
    background: transparent;
    box-shadow: none;
    padding: 10px 16px;
  }
  .todo.past .title {
    color: var(--ink-muted);
    font-weight: 500;
  }
  .todo.past .detail {
    display: none;
  }
  .todo.past.done .title {
    color: var(--ink-dim);
    font-weight: 600;
  }
  .todo.now {
    background: linear-gradient(135deg, var(--accent-light) 0%, var(--bg-elevated) 90%);
    box-shadow: var(--card-shadow-lifted);
    padding: 18px 18px;
    transform: scale(1.0);
    border: 1px solid rgba(232, 169, 61, 0.35);
  }
  .todo.now .title {
    color: var(--ink);
    font-weight: 700;
    font-size: 17px;
  }
  .todo.flow {
    background: var(--bg-elevated);
  }
  .todo.future {
    background: var(--bg-elevated);
  }
  .time {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent-dark);
    padding-top: 2px;
  }
  .todo.past .time {
    color: var(--ink-subtle);
  }
  .todo.now .time {
    color: var(--coral);
    font-size: 14px;
  }
  .time.bullet {
    text-align: center;
    color: var(--ink-subtle);
    font-size: 18px;
    line-height: 1;
    padding-top: 6px;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.45;
    flex: 1;
    min-width: 0;
  }
  .value {
    font-size: 13px;
    font-weight: 700;
    color: var(--ok);
    flex-shrink: 0;
  }
  .detail {
    font-size: 12px;
    color: var(--ink-dim);
    line-height: 1.55;
  }
  .todo.past .value {
    color: var(--ink-muted);
  }
  .praise {
    font-size: 12px;
    color: var(--ok);
    font-weight: 600;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .todo.past .praise {
    color: var(--ink-muted);
  }
  .check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--ok);
    color: var(--bg-elevated);
    font-size: 10px;
    font-weight: 700;
  }
  .todo.past .check {
    background: var(--ink-subtle);
  }
  .cta {
    align-self: flex-start;
    margin-top: 8px;
    padding: 8px 16px;
    border-radius: var(--rounded-pill);
    background: var(--ink);
    color: var(--bg-elevated);
    font-size: 12px;
    font-weight: 700;
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .todo.now .cta {
    background: var(--coral);
  }
  .cta:active {
    transform: scale(0.96);
  }
</style>
