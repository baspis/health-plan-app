<script lang="ts">
  import type { PrepItem, PickSource } from '../data/preparation';

  interface Props {
    item: PrepItem;
    isCompleted: boolean;
    onClose: () => void;
    onToggleCompleted: () => void;
  }

  const { item, isCompleted, onClose, onToggleCompleted }: Props = $props();

  const SOURCE_LABEL: Record<PickSource, string> = {
    yodobashi: 'ヨドバシ.com',
    'amazon-direct': 'Amazon 直販',
    official: 'メーカー公式',
    service: 'クリニック / サービス'
  };

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

    {#if item.spec?.pick}
      {@const pick = item.spec.pick}
      <section class="hero-pick source-{pick.source}">
        <div class="hero-head">
          <span class="hero-badge">これを買う</span>
          <span class="source-pill">{SOURCE_LABEL[pick.source]}</span>
        </div>
        <h3 class="hero-name">{pick.productName}</h3>
        {#if pick.price}
          <p class="hero-price num">{pick.price}</p>
        {/if}
        {#if pick.color}
          <p class="hero-meta"><span class="meta-key">色</span>{pick.color}</p>
        {/if}
        {#if pick.quantity}
          <p class="hero-meta"><span class="meta-key">数量</span>{pick.quantity}</p>
        {/if}
        {#if pick.note}
          <p class="hero-note">{pick.note}</p>
        {/if}
        <button class="hero-buy" onclick={() => openLink(pick.url)}>
          {pick.source === 'service' ? '申込ページ / 地図を開く →' : '買う →'}
        </button>
      </section>
    {/if}

    {#if item.spec}
      <section class="sec sec-why">
        <h3 class="sec-title">なぜこれか</h3>
        <p class="why">{item.spec.why}</p>
      </section>

      <section class="sec">
        <h3 class="sec-title">届いたら / 予約後に確認</h3>
        <ul class="verify">
          {#each item.spec.verify as line}
            <li>{line}</li>
          {/each}
        </ul>
      </section>

      {#if item.spec.altLinks && item.spec.altLinks.length > 0}
        <section class="sec">
          <h3 class="sec-title">補助リンク</h3>
          <div class="alt-links">
            {#each item.spec.altLinks as link}
              <button class="link-alt" onclick={() => openLink(link.url)}>
                {link.label} →
              </button>
            {/each}
          </div>
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

      <details class="sec sec-must">
        <summary class="sec-title">妥協できない仕様（参考）</summary>
        <ul class="must">
          {#each item.spec.must as line}
            <li>{line}</li>
          {/each}
        </ul>
      </details>
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
  .hero-pick {
    background: var(--bg-elevated);
    border-radius: var(--rounded-sm);
    padding: 18px 18px;
    margin-bottom: 18px;
    box-shadow: var(--card-shadow-lifted);
    border: 2px solid var(--coral);
  }
  .hero-pick.source-yodobashi {
    border-color: #CC0000;
  }
  .hero-pick.source-amazon-direct {
    border-color: #FF9900;
  }
  .hero-pick.source-official {
    border-color: var(--accent-dark);
  }
  .hero-pick.source-service {
    border-color: var(--ok);
  }
  .hero-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }
  .hero-badge {
    font-size: 11px;
    font-weight: 700;
    color: var(--coral);
    background: var(--coral-light);
    padding: 4px 10px;
    border-radius: var(--rounded-pill);
    letter-spacing: 0.04em;
  }
  .source-pill {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: var(--rounded-pill);
    letter-spacing: 0.04em;
    color: var(--bg-elevated);
  }
  .source-yodobashi .source-pill {
    background: #CC0000;
  }
  .source-amazon-direct .source-pill {
    background: #FF9900;
    color: #232F3E;
  }
  .source-official .source-pill {
    background: var(--accent-dark);
  }
  .source-service .source-pill {
    background: var(--ok);
  }
  .hero-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.45;
    margin-bottom: 8px;
  }
  .hero-price {
    font-size: 14px;
    font-weight: 700;
    color: var(--accent-dark);
    margin-bottom: 6px;
  }
  .hero-meta {
    font-size: 12px;
    color: var(--ink-dim);
    line-height: 1.6;
    margin-bottom: 4px;
  }
  .meta-key {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    color: var(--ink-muted);
    background: var(--bg);
    padding: 1px 8px;
    border-radius: var(--rounded-pill);
    margin-right: 6px;
    letter-spacing: 0.04em;
  }
  .hero-note {
    font-size: 11px;
    color: var(--ink-muted);
    line-height: 1.6;
    padding: 8px 10px;
    background: var(--bg);
    border-radius: 8px;
    margin: 8px 0 12px;
  }
  .hero-buy {
    display: block;
    width: 100%;
    padding: 14px 18px;
    border-radius: var(--rounded-pill);
    font-size: 14px;
    font-weight: 700;
    color: var(--bg-elevated);
    background: var(--coral);
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .source-yodobashi .hero-buy {
    background: #CC0000;
  }
  .source-amazon-direct .hero-buy {
    background: #FF9900;
    color: #232F3E;
  }
  .source-official .hero-buy {
    background: var(--accent-dark);
  }
  .source-service .hero-buy {
    background: var(--ok);
  }
  .hero-buy:active {
    transform: scale(0.98);
  }
  details.sec-must {
    background: var(--bg);
    padding: 10px 14px;
    border-radius: var(--rounded-sm);
  }
  details.sec-must summary {
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  details.sec-must summary::-webkit-details-marker {
    display: none;
  }
  details.sec-must summary::after {
    content: '▼';
    font-size: 9px;
    margin-left: 6px;
    color: var(--ink-muted);
  }
  details.sec-must[open] summary::after {
    content: '▲';
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
  .verify {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .must li,
  .verify li {
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
