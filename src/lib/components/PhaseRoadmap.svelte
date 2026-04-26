<script lang="ts">
  import { phase, STAGE_META, STAGE_SEQUENCE, nextStage, advanceStage, type Stage } from '../stores/phase';

  const currentStage = $derived($phase.stage);
  const currentIdx = $derived(STAGE_SEQUENCE.indexOf(currentStage));
  const next = $derived(nextStage(currentStage));

  let confirming = $state(false);

  function statusOf(s: Stage): 'past' | 'current' | 'future' {
    const idx = STAGE_SEQUENCE.indexOf(s);
    if (idx < currentIdx) return 'past';
    if (idx === currentIdx) return 'current';
    return 'future';
  }

  function openConfirm() {
    if (!next) return;
    confirming = true;
  }

  function cancel() {
    confirming = false;
  }

  function commit() {
    advanceStage();
    confirming = false;
  }

  const nextMeta = $derived(next ? STAGE_META[next] : null);
</script>

<section class="roadmap">
  <h2 class="title">これから先の見通し</h2>
  <ol class="steps">
    {#each STAGE_SEQUENCE as s, i (s)}
      {@const status = statusOf(s)}
      <li class="step status-{status}">
        <div class="dot-wrap">
          {#if status === 'past'}
            <span class="dot done">✓</span>
          {:else if status === 'current'}
            <span class="dot current">●</span>
          {:else}
            <span class="dot future"></span>
          {/if}
          {#if i < STAGE_SEQUENCE.length - 1}
            <span class="line" class:line-done={status === 'past'}></span>
          {/if}
        </div>
        <div class="body">
          <div class="step-head">
            <span class="step-label">{STAGE_META[s].label}</span>
            <span class="step-jp">{STAGE_META[s].jp}</span>
          </div>
          <p class="step-desc">{STAGE_META[s].description}</p>
        </div>
      </li>
    {/each}
  </ol>

  {#if next && nextMeta}
    <button class="advance" onclick={openConfirm}>
      次のフェーズへ進む → {nextMeta.label} {nextMeta.jp}
    </button>
  {:else}
    <p class="final-note">最終フェーズです。Sweet Spot は近い。</p>
  {/if}
</section>

{#if confirming && nextMeta}
  <div class="backdrop" onclick={cancel} role="presentation">
    <div
      class="modal card card-lifted"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title">{nextMeta.label}（{nextMeta.jp}）に進みますか?</h3>
      <p class="m-msg">{nextMeta.description}</p>
      <p class="m-hint">整ったと感じてからで大丈夫です。いつでも戻せます。</p>
      <div class="m-actions">
        <button class="m-btn cancel" onclick={cancel}>もう少し待つ</button>
        <button class="m-btn confirm" onclick={commit}>進む</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .roadmap {
    background: var(--bg-elevated);
    border-radius: var(--rounded);
    padding: 18px 20px;
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink-dim);
    letter-spacing: 0.06em;
  }
  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .step {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 12px;
    padding-bottom: 10px;
  }
  .step:last-child {
    padding-bottom: 0;
  }
  .dot-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2px;
  }
  .dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .dot.done {
    background: var(--ok);
    color: var(--bg-elevated);
  }
  .dot.current {
    background: var(--coral);
    color: var(--bg-elevated);
    box-shadow: 0 0 0 4px var(--coral-light);
    font-size: 8px;
  }
  .dot.future {
    background: var(--divider);
    border: 1px solid var(--divider-soft);
  }
  .line {
    flex: 1;
    width: 2px;
    background: var(--divider);
    margin-top: 4px;
    min-height: 22px;
  }
  .line-done {
    background: var(--ok);
    opacity: 0.4;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .step-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .step-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
  }
  .step-jp {
    font-size: 12px;
    color: var(--ink-dim);
    font-weight: 600;
  }
  .step-desc {
    font-size: 11px;
    color: var(--ink-muted);
    line-height: 1.55;
  }
  .step.status-current .step-label {
    color: var(--coral);
  }
  .step.status-current .step-jp {
    color: var(--coral);
  }
  .step.status-future .step-label,
  .step.status-future .step-jp {
    opacity: 0.7;
  }
  .step.status-future .step-desc {
    opacity: 0.65;
  }
  .advance {
    align-self: stretch;
    padding: 12px 18px;
    border-radius: var(--rounded-pill);
    background: var(--coral);
    color: var(--bg-elevated);
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(230, 122, 92, 0.3);
    transition: transform var(--anim-fast) var(--ease-smooth);
    margin-top: 4px;
  }
  .advance:active {
    transform: scale(0.98);
  }
  .final-note {
    text-align: center;
    font-size: 12px;
    color: var(--ink-muted);
    padding: 6px;
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
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
  }
  .m-msg {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.65;
    margin-bottom: 6px;
  }
  .m-hint {
    font-size: 11px;
    color: var(--ink-muted);
    margin-bottom: 18px;
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
