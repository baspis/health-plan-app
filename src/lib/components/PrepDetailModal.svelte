<script lang="ts">
  import type { PrepItem } from '../data/preparation';

  interface Props {
    item: PrepItem;
    isCompleted: boolean;
    onClose: () => void;
    onToggleCompleted: () => void;
  }

  const { item, isCompleted, onClose, onToggleCompleted }: Props = $props();

  function openLink(url: string) {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="backdrop" onclick={onClose} role="presentation">
  <div
    class="modal card card-lifted"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <header class="head">
      <div class="head-text">
        <h2 class="title">{item.title}</h2>
        {#if item.summary}
          <p class="summary">{item.summary}</p>
        {/if}
      </div>
      <button class="close" onclick={onClose} aria-label="閉じる">×</button>
    </header>

    {#if item.cost}
      <div class="cost-row">
        <span class="cost-label">想定コスト</span>
        <span class="cost-value num">{item.cost}</span>
      </div>
    {/if}

    {#if item.spec}
      <section class="sec sec-purpose">
        <h3 class="sec-title">目的</h3>
        <p class="why">{item.spec.purpose}</p>
      </section>

      <section class="sec">
        <h3 class="sec-title">必須仕様</h3>
        <ul class="must">
          {#each item.spec.must as line}
            <li>{line}</li>
          {/each}
        </ul>
      </section>

      {#if item.spec.niceToHave && item.spec.niceToHave.length > 0}
        <section class="sec">
          <h3 class="sec-title">あると良い</h3>
          <ul class="must optional">
            {#each item.spec.niceToHave as line}
              <li>{line}</li>
            {/each}
          </ul>
        </section>
      {/if}

      <section class="sec sec-why">
        <h3 class="sec-title">なぜこの仕様か</h3>
        <p class="why">{item.spec.why}</p>
      </section>

      {#if item.spec.searchLinks && item.spec.searchLinks.length > 0}
        <section class="sec">
          <h3 class="sec-title">仕様で探す</h3>
          <div class="alt-links">
            {#each item.spec.searchLinks as link, i}
              <button class={i === 0 ? 'link-primary' : 'link-alt'} onclick={() => openLink(link.url)}>
                {link.label} →
              </button>
            {/each}
          </div>
        </section>
      {/if}

      {#if item.spec.examples && item.spec.examples.length > 0}
        <section class="sec">
          <h3 class="sec-title">例示（これに限らない）</h3>
          <ul class="examples">
            {#each item.spec.examples as line}
              <li>{line}</li>
            {/each}
          </ul>
        </section>
      {/if}

      <section class="sec sec-avoid">
        <h3 class="sec-title">これは買わない / 注意点</h3>
        <ul class="avoid">
          {#each item.spec.avoid as line}
            <li>{line}</li>
          {/each}
        </ul>
      </section>

      <section class="sec">
        <h3 class="sec-title">買う前 / 予約前に確認</h3>
        <ul class="verify">
          {#each item.spec.verifyBeforeBuy as line}
            <li>{line}</li>
          {/each}
        </ul>
      </section>

      <section class="sec">
        <h3 class="sec-title">届いたら / 実施後に確認</h3>
        <ul class="verify">
          {#each item.spec.verifyAfterReceive as line}
            <li>{line}</li>
          {/each}
        </ul>
      </section>
    {:else if item.detail}
      <section class="sec">
        <p class="why">{item.detail}</p>
      </section>
      {#if item.link}
        <section class="sec">
          <button class="link-primary" onclick={() => openLink(item.link!.url)}>
            {item.link.label} →
          </button>
        </section>
      {/if}
    {/if}

    <footer class="foot">
      <button
        class="toggle-btn"
        class:done={isCompleted}
        onclick={onToggleCompleted}
      >
        {isCompleted ? '✓ 完了済み（取り消す）' : 'これを完了にする'}
      </button>
    </footer>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(61, 46, 32, 0.45);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 16px;
    z-index: 100;
    overflow-y: auto;
  }
  .modal {
    width: 100%;
    max-width: 480px;
    padding: 22px;
    margin: auto 0;
  }
  .head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }
  .head-text {
    flex: 1;
    min-width: 0;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.35;
    margin-bottom: 4px;
  }
  .summary {
    font-size: 12px;
    color: var(--ink-muted);
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg);
    color: var(--ink-dim);
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cost-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--accent-light);
    border-radius: var(--rounded-sm);
    margin-bottom: 16px;
  }
  .cost-label {
    font-size: 11px;
    color: var(--accent-dark);
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .cost-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
  }
  .sec {
    margin-bottom: 18px;
  }
  .sec-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink-dim);
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  .must,
  .verify,
  .examples {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .must li,
  .verify li,
  .examples li {
    font-size: 13px;
    color: var(--ink);
    line-height: 1.5;
    padding-left: 18px;
    position: relative;
  }
  .must li::before {
    content: '◉';
    position: absolute;
    left: 0;
    color: var(--accent-dark);
    font-size: 9px;
    top: 5px;
  }
  .must.optional li::before {
    content: '＋';
    color: var(--ink-muted);
    top: 1px;
  }
  .examples li::before {
    content: '例';
    position: absolute;
    left: 0;
    color: var(--ink-muted);
    font-size: 10px;
    font-weight: 700;
    top: 1px;
  }
  .verify li::before {
    content: '☐';
    position: absolute;
    left: 0;
    color: var(--ok);
    top: 0;
  }
  .why {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.65;
  }
  .sec-avoid {
    background: var(--coral-light);
    padding: 12px 14px;
    border-radius: var(--rounded-sm);
  }
  .sec-avoid .sec-title {
    color: var(--coral);
  }
  .avoid {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .avoid li {
    font-size: 12px;
    color: var(--ink);
    line-height: 1.5;
    padding-left: 18px;
    position: relative;
  }
  .avoid li::before {
    content: '✕';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 700;
    top: 0;
  }
  .link-primary {
    display: block;
    width: 100%;
    padding: 14px 18px;
    background: var(--ink);
    color: var(--bg-elevated);
    border-radius: var(--rounded-pill);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    transition: transform var(--anim-fast) var(--ease-smooth);
    margin-bottom: 8px;
  }
  .link-primary:active {
    transform: scale(0.98);
  }
  .alt-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .link-alt {
    text-align: left;
    padding: 8px 12px;
    background: var(--bg);
    border-radius: var(--rounded-sm);
    font-size: 12px;
    color: var(--accent-dark);
    font-weight: 600;
  }
  .foot {
    padding-top: 8px;
    border-top: 1px solid var(--divider);
    margin-top: 8px;
  }
  .toggle-btn {
    width: 100%;
    padding: 14px;
    border-radius: var(--rounded-pill);
    background: var(--coral);
    color: var(--bg-elevated);
    font-size: 14px;
    font-weight: 700;
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .toggle-btn.done {
    background: var(--ok-light);
    color: var(--ok);
  }
  .toggle-btn:active {
    transform: scale(0.98);
  }
</style>
