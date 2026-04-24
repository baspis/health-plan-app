<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type LabResult, type LabKind } from '../lib/db/db';
  import { refreshHealth } from '../lib/stores/health';
  import { getIngestToken } from '../lib/ingest/ingest';

  let labs = $state<LabResult[]>([]);
  let activeForm = $state<null | { kind: LabKind; milestone: 'day0' | 'month6' | 'month12' }>(null);
  let formValues = $state<Record<string, string>>({});

  const token = getIngestToken();
  const ingestSnippet = $derived(
    `${typeof window !== 'undefined' ? window.location.origin : 'https://app.example'}/?ingest=1&token=${token}&date=YYYY-MM-DD&weight=...&sleep=...&vo2max=...`
  );

  onMount(async () => {
    labs = await db.labResults.orderBy('dateISO').reverse().toArray();
  });

  async function reload() {
    labs = await db.labResults.orderBy('dateISO').reverse().toArray();
    await refreshHealth();
  }

  async function saveForm() {
    if (!activeForm) return;
    const payload: Record<string, number | string | null> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === '') continue;
      const n = Number(v);
      payload[k] = Number.isFinite(n) ? n : v;
    }
    const today = new Date().toISOString().slice(0, 10);
    await db.labResults.add({
      kind: activeForm.kind,
      dateISO: today,
      milestone: activeForm.milestone,
      payload,
      enteredAt: Date.now()
    });
    activeForm = null;
    formValues = {};
    await reload();
  }

  function openForm(kind: LabKind, milestone: 'day0' | 'month6' | 'month12') {
    activeForm = { kind, milestone };
    formValues = {};
  }

  function closeForm() {
    activeForm = null;
    formValues = {};
  }

  async function deleteLab(id: number | undefined) {
    if (!id) return;
    if (!confirm('この記録を削除しますか?')) return;
    await db.labResults.delete(id);
    await reload();
  }

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
      { key: 'severity', label: '重症度（正常/軽症/中等症/重症）', placeholder: '軽症' }
    ]
  };

  const LAB_LABEL: Record<LabKind, string> = {
    dexa: 'DEXA',
    'blood-core': '血液検査（必須）',
    'blood-ext': '血液検査（拡張）',
    waist: 'ウエスト + 体重',
    bp: '家庭血圧 1 週間',
    sas: 'SAS 検査'
  };

  const MILESTONE_LABEL = {
    day0: 'Day 0',
    month6: 'Month 6',
    month12: 'Month 12'
  } as const;
</script>

<div class="input">
  <div class="intro">
    <h2 class="intro-title">検査結果を入力</h2>
    <p class="intro-sub">
      Day 0 / Month 6 / Month 12 の検査結果のみをここで手入力。日次データは Apple Health → iOS Shortcuts から自動同期されます。
    </p>
  </div>

  <details class="shortcuts-info card">
    <summary>iOS Shortcuts 同期 URL</summary>
    <p class="shortcuts-note">
      Shortcuts アプリで Apple Health からデータを取得し、以下の URL を開く設定を作ります。トークンは本端末固有、外部共有不可。
    </p>
    <code class="shortcuts-snippet">{ingestSnippet}</code>
    <p class="shortcuts-hint">手順の詳細は webapp/shortcuts/README.md を参照。</p>
  </details>

  {#each (['day0', 'month6', 'month12'] as const) as ms}
    <section class="milestone-group">
      <h3 class="ms-title">{MILESTONE_LABEL[ms]}</h3>
      <div class="ms-buttons">
        {#each (['dexa', 'blood-core', 'blood-ext', 'waist', 'bp', 'sas'] as LabKind[]) as kind}
          {@const existing = labs.find((l) => l.kind === kind && l.milestone === ms)}
          <button class="ms-btn" class:filled={!!existing} onclick={() => openForm(kind, ms)}>
            <span class="ms-btn-label">{LAB_LABEL[kind]}</span>
            {#if existing}
              <span class="pill pill-ok">入力済み</span>
            {:else}
              <span class="pill pill-neutral">未入力</span>
            {/if}
          </button>
        {/each}
      </div>
    </section>
  {/each}

  {#if labs.length > 0}
    <section class="history card">
      <h3 class="hist-title">入力履歴</h3>
      <ul class="hist-list">
        {#each labs as lab (lab.id)}
          <li class="hist-item">
            <span class="hist-ms pill pill-neutral">{MILESTONE_LABEL[lab.milestone as 'day0' | 'month6' | 'month12'] ?? lab.milestone}</span>
            <span class="hist-kind">{LAB_LABEL[lab.kind]}</span>
            <span class="hist-date num">{lab.dateISO}</span>
            <button class="hist-del" onclick={() => deleteLab(lab.id)}>×</button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

{#if activeForm}
  <div class="modal-backdrop" onclick={closeForm} role="presentation">
    <div class="modal card card-lifted" onclick={(e) => e.stopPropagation()} role="dialog">
      <h3 class="modal-title">
        {LAB_LABEL[activeForm.kind]} — {MILESTONE_LABEL[activeForm.milestone]}
      </h3>
      <div class="fields">
        {#each FIELDS[activeForm.kind] as field}
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
        <button class="btn-secondary" onclick={closeForm}>キャンセル</button>
        <button class="btn-primary" onclick={saveForm}>保存</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .input {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .intro-title {
    font-size: 18px;
    margin-bottom: 4px;
  }
  .intro-sub {
    color: var(--ink-muted);
    font-size: 12px;
    line-height: 1.7;
  }
  .shortcuts-info {
    padding: 14px 18px;
  }
  .shortcuts-info summary {
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .shortcuts-note {
    font-size: 11px;
    color: var(--ink-muted);
    margin: 10px 0;
    line-height: 1.6;
  }
  .shortcuts-snippet {
    display: block;
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px;
    padding: 8px 10px;
    background: var(--bg);
    border-radius: 8px;
    overflow-x: auto;
    white-space: nowrap;
    color: var(--ink-dim);
  }
  .shortcuts-hint {
    font-size: 10px;
    color: var(--ink-subtle);
    margin-top: 8px;
  }
  .milestone-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ms-title {
    font-size: 14px;
    color: var(--ink-muted);
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .ms-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .ms-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: var(--bg-elevated);
    border-radius: var(--rounded-sm);
    box-shadow: var(--card-shadow);
    font-size: 12px;
    color: var(--ink);
    text-align: left;
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .ms-btn:active {
    transform: scale(0.97);
  }
  .ms-btn-label {
    font-weight: 600;
    flex: 1;
  }
  .history {
    padding: 14px 18px;
  }
  .hist-title {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .hist-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .hist-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    background: var(--bg);
    border-radius: 8px;
    font-size: 12px;
  }
  .hist-kind {
    color: var(--ink-dim);
  }
  .hist-date {
    color: var(--ink-muted);
    font-size: 11px;
  }
  .hist-del {
    color: var(--danger);
    font-size: 16px;
    padding: 0 4px;
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(27, 43, 74, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
  }
  .modal {
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 22px;
  }
  .modal-title {
    font-size: 15px;
    margin-bottom: 16px;
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
    border-radius: 8px;
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
    font-weight: 600;
    font-size: 14px;
  }
  .btn-secondary {
    background: var(--bg);
    color: var(--ink-dim);
    border: 1px solid var(--divider);
  }
  .btn-primary {
    background: var(--ink);
    color: var(--bg);
  }
</style>
