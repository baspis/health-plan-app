<script lang="ts">
  import { resetToPrep, resetAll } from '../stores/phase';

  let open = $state(false);
  let confirmingPhaseReset = $state(false);
  let confirmingWipe1 = $state(false);
  let confirmingWipe2 = $state(false);

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function startPhaseReset() {
    open = false;
    confirmingPhaseReset = true;
  }

  function commitPhaseReset() {
    resetToPrep();
    confirmingPhaseReset = false;
  }

  function startWipe() {
    open = false;
    confirmingWipe1 = true;
  }

  function nextWipe() {
    confirmingWipe1 = false;
    confirmingWipe2 = true;
  }

  function commitWipe() {
    confirmingWipe2 = false;
    resetAll();
  }

  function cancel() {
    confirmingPhaseReset = false;
    confirmingWipe1 = false;
    confirmingWipe2 = false;
  }
</script>

<div class="settings-wrap">
  <button class="trigger" onclick={toggle} aria-label="設定">
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="16" cy="10" r="1.6" />
    </svg>
  </button>

  {#if open}
    <div class="overlay" onclick={close} role="presentation"></div>
    <div class="popover card card-lifted" role="menu">
      <button class="item" onclick={startPhaseReset}>
        <span class="item-title">フェーズを戻す</span>
        <span class="item-sub">準備期に戻る、記録は保持</span>
      </button>
      <button class="item danger" onclick={startWipe}>
        <span class="item-title">すべて初期化</span>
        <span class="item-sub">体重・検査・準備チェック、すべて消去</span>
      </button>
    </div>
  {/if}
</div>

{#if confirmingPhaseReset}
  <div class="backdrop" onclick={cancel} role="presentation">
    <div
      class="modal card card-lifted"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title">フェーズを準備期に戻しますか?</h3>
      <p class="m-msg">
        現在のフェーズを <strong>prep（事前準備期）</strong> に戻します。
        体重・検査・準備チェックリストの記録は残ります。
      </p>
      <div class="m-actions">
        <button class="m-btn cancel" onclick={cancel}>キャンセル</button>
        <button class="m-btn confirm" onclick={commitPhaseReset}>戻す</button>
      </div>
    </div>
  </div>
{/if}

{#if confirmingWipe1}
  <div class="backdrop" onclick={cancel} role="presentation">
    <div
      class="modal card card-lifted"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title">すべて初期化しますか?</h3>
      <p class="m-msg">
        体重履歴・検査結果・準備チェックリスト・フェーズ・トークンを <strong>すべて消去</strong> します。
      </p>
      <div class="m-actions">
        <button class="m-btn cancel" onclick={cancel}>キャンセル</button>
        <button class="m-btn warn" onclick={nextWipe}>次へ</button>
      </div>
    </div>
  </div>
{/if}

{#if confirmingWipe2}
  <div class="backdrop" onclick={cancel} role="presentation">
    <div
      class="modal card card-lifted danger-modal"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title danger-title">最終確認</h3>
      <p class="m-msg">
        この操作は <strong>取り消せません</strong>。
        本当に全データを削除しますか?
      </p>
      <div class="m-actions">
        <button class="m-btn cancel" onclick={cancel}>キャンセル</button>
        <button class="m-btn danger-btn" onclick={commitWipe}>削除する</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .settings-wrap {
    position: relative;
  }
  .trigger {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-elevated);
    color: var(--ink-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--card-shadow);
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .trigger:active {
    transform: scale(0.94);
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
  }
  .popover {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 220px;
    padding: 8px;
    z-index: 91;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 14px;
    border-radius: var(--rounded-sm);
    text-align: left;
    transition: background var(--anim-fast) var(--ease-smooth);
  }
  .item:hover {
    background: var(--bg);
  }
  .item.danger .item-title {
    color: var(--coral);
  }
  .item-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
  }
  .item-sub {
    font-size: 11px;
    color: var(--ink-muted);
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
  .danger-modal {
    border-top: 4px solid var(--coral);
  }
  .m-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .danger-title {
    color: var(--coral);
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
    background: var(--ink);
    color: var(--bg-elevated);
  }
  .m-btn.warn {
    background: var(--coral-light);
    color: var(--coral);
  }
  .m-btn.danger-btn {
    background: var(--coral);
    color: var(--bg-elevated);
  }
</style>
