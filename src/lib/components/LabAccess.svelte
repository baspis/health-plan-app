<script lang="ts">
  import LabModal from './LabModal.svelte';

  type Milestone = 'day0' | 'month6' | 'month12';

  let pickerOpen = $state(false);
  let activeMs = $state<Milestone | null>(null);

  const MS_LABEL: Record<Milestone, string> = {
    day0: 'Day 0（ベースライン）',
    month6: 'Month 6（中間）',
    month12: 'Month 12（年次）'
  };

  function openPicker() {
    pickerOpen = true;
  }

  function closePicker() {
    pickerOpen = false;
  }

  function selectMs(ms: Milestone) {
    pickerOpen = false;
    activeMs = ms;
  }

  function closeModal() {
    activeMs = null;
  }
</script>

<div class="lab-access">
  <button class="link" onclick={openPicker}>
    検査結果を入力 →
  </button>
</div>

{#if pickerOpen}
  <div class="backdrop" onclick={closePicker} role="presentation">
    <div
      class="modal card card-lifted"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <h3 class="m-title">どの検査結果を入力しますか?</h3>
      <p class="m-msg">時期を選択（自分のタイミングで）</p>
      <div class="ms-list">
        {#each (['day0', 'month6', 'month12'] as Milestone[]) as ms (ms)}
          <button class="ms-btn" onclick={() => selectMs(ms)}>
            {MS_LABEL[ms]}
          </button>
        {/each}
      </div>
      <button class="cancel" onclick={closePicker}>キャンセル</button>
    </div>
  </div>
{/if}

{#if activeMs}
  <LabModal milestone={activeMs} onClose={closeModal} />
{/if}

<style>
  .lab-access {
    display: flex;
    justify-content: center;
    padding: 12px 0 4px;
  }
  .link {
    font-size: 12px;
    color: var(--accent-dark);
    font-weight: 600;
    padding: 8px 14px;
    border-radius: var(--rounded-pill);
    transition: background var(--anim-fast) var(--ease-smooth);
  }
  .link:hover {
    background: var(--accent-light);
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
    padding: 22px;
  }
  .m-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .m-msg {
    font-size: 12px;
    color: var(--ink-muted);
    margin-bottom: 16px;
  }
  .ms-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
  }
  .ms-btn {
    padding: 14px 16px;
    background: var(--bg);
    border-radius: var(--rounded-sm);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    text-align: left;
    transition: background var(--anim-fast) var(--ease-smooth);
  }
  .ms-btn:hover {
    background: var(--accent-light);
  }
  .cancel {
    width: 100%;
    padding: 10px;
    background: transparent;
    color: var(--ink-muted);
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--rounded-pill);
  }
</style>
