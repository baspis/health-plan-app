<script lang="ts">
  import { db, type LabKind } from '../db/db';
  import { refreshHealth } from '../stores/health';

  type Milestone = 'day0' | 'month6' | 'month12';

  interface Props {
    milestone: Milestone;
    onClose: () => void;
  }

  const { milestone, onClose }: Props = $props();

  let activeKind = $state<LabKind | null>(null);
  let formValues = $state<Record<string, string>>({});
  let savedKinds = $state<Set<LabKind>>(new Set());

  $effect(() => {
    db.labResults
      .where('milestone')
      .equals(milestone)
      .toArray()
      .then((rows) => {
        savedKinds = new Set(rows.map((r) => r.kind));
      });
  });

  const FIELDS: Record<LabKind, { key: string; label: string; unit?: string; placeholder?: string }[]> = {
    dexa: [
      { key: 'weightKg', label: '体重', unit: 'kg', placeholder: '110.0' },
      { key: 'bodyFatPct', label: '体脂肪率', unit: '%', placeholder: '32.0' },
      { key: 'lbmKg', label: 'LBM（除脂肪体重）', unit: 'kg', placeholder: '75.0' },
      { key: 'visceralFatG', label: '内臓脂肪量', unit: 'g', placeholder: '2500' },
      { key: 'boneDensityG', label: '骨密度', unit: 'g/cm²', placeholder: '1.2' }
    ],
    'blood-core': [
      { key: 'hba1c', label: 'HbA1c', unit: '%', placeholder: '5.5' },
      { key: 'fpg', label: '空腹時血糖', unit: 'mg/dL', placeholder: '95' },
      { key: 'ldl', label: 'LDL', unit: 'mg/dL', placeholder: '120' },
      { key: 'hdl', label: 'HDL', unit: 'mg/dL', placeholder: '50' },
      { key: 'triglyceride', label: '中性脂肪', unit: 'mg/dL', placeholder: '140' },
      { key: 'ast', label: 'AST', unit: 'U/L', placeholder: '25' },
      { key: 'alt', label: 'ALT', unit: 'U/L', placeholder: '28' },
      { key: 'ggtp', label: 'γ-GTP', unit: 'U/L', placeholder: '40' },
      { key: 'uricAcid', label: '尿酸', unit: 'mg/dL', placeholder: '6.5' },
      { key: 'tsh', label: 'TSH', unit: 'μIU/mL', placeholder: '2.0' }
    ],
    'blood-ext': [
      { key: 'fastingInsulin', label: '空腹時インスリン', unit: 'μU/mL', placeholder: '12' },
      { key: 'homaIR', label: 'HOMA-IR', placeholder: '2.8' },
      { key: 'ogtt2h', label: 'OGTT 2h 血糖', unit: 'mg/dL', placeholder: '155' },
      { key: 'sdLDL', label: 'sdLDL', unit: 'mg/dL', placeholder: '30' },
      { key: 'apoB', label: 'ApoB', unit: 'mg/dL', placeholder: '95' },
      { key: 'lpa', label: 'Lp(a)', unit: 'mg/dL', placeholder: '15' }
    ],
    waist: [
      { key: 'weightKg', label: '体重（同時測定）', unit: 'kg', placeholder: '110.0' },
      { key: 'waistCm', label: 'ウエスト（3 回平均）', unit: 'cm', placeholder: '100.0' }
    ],
    bp: [
      { key: 'systolicAvg', label: '収縮期血圧 1 週間平均', unit: 'mmHg', placeholder: '128' },
      { key: 'diastolicAvg', label: '拡張期血圧 1 週間平均', unit: 'mmHg', placeholder: '82' }
    ],
    sas: [
      { key: 'ahi', label: 'AHI', placeholder: '8.0' },
      { key: 'severity', label: '重症度', placeholder: '正常 / 軽症 / 中等症 / 重症' }
    ]
  };

  const LAB_LABEL: Record<LabKind, string> = {
    dexa: 'DEXA',
    'blood-core': '血液（必須）',
    'blood-ext': '血液（拡張）',
    waist: 'ウエスト',
    bp: '家庭血圧',
    sas: 'SAS'
  };

  const MS_LABEL = {
    day0: 'Day 0',
    month6: 'Month 6',
    month12: 'Month 12'
  } as const;

  async function saveForm() {
    if (!activeKind) return;
    const payload: Record<string, number | string | null> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === '') continue;
      const n = Number(v);
      payload[k] = Number.isFinite(n) ? n : v;
    }
    const today = new Date().toISOString().slice(0, 10);
    await db.labResults.add({
      kind: activeKind,
      dateISO: today,
      milestone,
      payload,
      enteredAt: Date.now()
    });
    savedKinds = new Set([...savedKinds, activeKind]);
    activeKind = null;
    formValues = {};
    await refreshHealth();
  }

  function openForm(kind: LabKind) {
    activeKind = kind;
    formValues = {};
  }

  function backToList() {
    activeKind = null;
    formValues = {};
  }

  const KINDS_FOR_MS: Record<Milestone, LabKind[]> = {
    day0: ['dexa', 'blood-core', 'blood-ext', 'waist', 'bp', 'sas'],
    month6: ['dexa', 'blood-core', 'waist', 'bp'],
    month12: ['dexa', 'blood-core', 'blood-ext', 'waist', 'bp']
  };
</script>

<div class="backdrop" onclick={onClose} role="presentation">
  <div
    class="modal card card-lifted"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    {#if !activeKind}
      <header class="header">
        <h2 class="title">{MS_LABEL[milestone]} 検査結果を入力</h2>
        <button class="close" onclick={onClose} aria-label="閉じる">×</button>
      </header>
      <p class="hint">
        各検査の結果が出たらタップして入力。一度に全部入力する必要はありません。
      </p>
      <div class="kinds">
        {#each KINDS_FOR_MS[milestone] as kind}
          {@const saved = savedKinds.has(kind)}
          <button class="kind-btn" class:saved onclick={() => openForm(kind)}>
            <span class="kind-name">{LAB_LABEL[kind]}</span>
            {#if saved}
              <span class="pill pill-ok">入力済</span>
            {:else}
              <span class="pill pill-accent">入力する</span>
            {/if}
          </button>
        {/each}
      </div>
    {:else}
      <header class="header">
        <button class="back" onclick={backToList} aria-label="戻る">←</button>
        <h2 class="title">{LAB_LABEL[activeKind]} — {MS_LABEL[milestone]}</h2>
      </header>
      <div class="fields">
        {#each FIELDS[activeKind] as field}
          <label class="field">
            <span class="field-label">
              {field.label}
              {#if field.unit}<span class="field-unit">({field.unit})</span>{/if}
            </span>
            <input
              type="text"
              placeholder={field.placeholder ?? ''}
              bind:value={formValues[field.key]}
              inputmode="decimal"
            />
          </label>
        {/each}
      </div>
      <div class="actions">
        <button class="btn-secondary" onclick={backToList}>キャンセル</button>
        <button class="btn-primary" onclick={saveForm}>保存</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(61, 46, 32, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    z-index: 100;
  }
  .modal {
    width: 100%;
    max-width: 480px;
    max-height: 88vh;
    overflow-y: auto;
    padding: 22px;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    flex: 1;
  }
  .close,
  .back {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg);
    color: var(--ink-dim);
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hint {
    font-size: 12px;
    color: var(--ink-muted);
    line-height: 1.6;
    margin-bottom: 14px;
  }
  .kinds {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .kind-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 14px;
    background: var(--bg);
    border-radius: var(--rounded-sm);
    text-align: left;
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .kind-btn:active {
    transform: scale(0.97);
  }
  .kind-btn.saved {
    opacity: 0.7;
  }
  .kind-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
  }
  .fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .field-label {
    font-size: 12px;
    color: var(--ink-dim);
    font-weight: 600;
  }
  .field-unit {
    font-weight: 400;
    color: var(--ink-muted);
    margin-left: 4px;
  }
  .field input {
    font-family: var(--font-num);
    font-size: 15px;
    padding: 10px 12px;
    border: 1px solid var(--divider);
    border-radius: 10px;
    background: var(--bg);
    color: var(--ink);
  }
  .field input:focus {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 18px;
  }
  .btn-secondary,
  .btn-primary {
    flex: 1;
    padding: 12px;
    border-radius: var(--rounded-pill);
    font-weight: 700;
    font-size: 14px;
  }
  .btn-secondary {
    background: var(--bg);
    color: var(--ink-dim);
  }
  .btn-primary {
    background: var(--ink);
    color: var(--bg-elevated);
  }
</style>
