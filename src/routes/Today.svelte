<script lang="ts">
  import { onMount } from 'svelte';
  import { clock } from '../lib/stores/clock';
  import { phase, STAGE_META, daysSinceStageStart } from '../lib/stores/phase';
  import { health, refreshHealth } from '../lib/stores/health';
  import { getDayTimeline, type TimeSlot } from '../lib/data/plan';
  import { assessRest } from '../lib/judgment/restTrigger';
  import { detectAnomalies, logAnomalies, getRecentNotifications } from '../lib/notify/anomaly';
  import { ensureNotificationPermission, fireLocalNotification } from '../lib/notify/local';
  import type { NotificationLog } from '../lib/db/db';

  let notifications = $state<NotificationLog[]>([]);
  let notifPermission = $state<NotificationPermission>('default');

  onMount(async () => {
    await refreshHealth();
    const signals = detectAnomalies($health);
    if (signals.length > 0) {
      await logAnomalies(signals);
      if (notifPermission === 'granted') {
        for (const s of signals) fireLocalNotification(s);
      }
    }
    notifications = await getRecentNotifications(3);
    notifPermission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
  });

  async function enableNotifications() {
    notifPermission = await ensureNotificationPermission();
  }

  const now = $derived($clock);
  const dow = $derived(now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  const nowMin = $derived(now.getHours() * 60 + now.getMinutes());
  const timeline = $derived(getDayTimeline(dow, $phase.stage));
  const stageMeta = $derived(STAGE_META[$phase.stage]);

  const currentSlot = $derived<TimeSlot | null>(
    timeline.find((s) => nowMin >= s.startMin && nowMin < s.endMin) ?? null
  );

  const nextSlot = $derived<TimeSlot | null>(
    timeline.find((s) => s.startMin >= nowMin) ?? null
  );

  const primarySlot = $derived<TimeSlot | null>(currentSlot ?? nextSlot);
  const rest = $derived(assessRest($health));

  const DOW_JP = ['日', '月', '火', '水', '木', '金', '土'];
  const dowJp = $derived(DOW_JP[dow]);
  const hours = $derived(String(now.getHours()).padStart(2, '0'));
  const minutes = $derived(String(now.getMinutes()).padStart(2, '0'));

  function formatTime(slot: TimeSlot | null): string {
    if (!slot) return '';
    const h = Math.floor(slot.startMin / 60);
    const m = slot.startMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function openCta(url: string) {
    try {
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="today">
  <div class="time-row">
    <span class="now-time num">{hours}:{minutes}</span>
    <span class="now-dow">{dowJp}曜日</span>
  </div>

  <div class="rest-badge-row">
    <span class="pill pill-{rest.level === 'normal' ? 'ok' : rest.level === 'level2' ? 'warn' : 'danger'}">
      {rest.badge}
    </span>
    {#if rest.reasons.length > 0}
      <span class="rest-reason">{rest.reasons.join(' / ')}</span>
    {/if}
  </div>

  {#if primarySlot}
    <div class="hero card card-lifted">
      <div class="hero-label">
        {currentSlot ? 'いま' : `つぎは ${formatTime(primarySlot)}`}
      </div>
      <h1 class="hero-title">{primarySlot.action.title}</h1>
      {#if primarySlot.action.subtitle}
        <p class="hero-sub">{primarySlot.action.subtitle}</p>
      {/if}
      {#if primarySlot.action.cta && rest.level !== 'level1'}
        <button class="cta" onclick={() => openCta(primarySlot.action.cta!.url)}>
          {primarySlot.action.cta.label} を開く
        </button>
      {/if}
    </div>
  {:else}
    <div class="hero card">
      <div class="hero-label">今日</div>
      <h1 class="hero-title">{stageMeta.jp}</h1>
      <p class="hero-sub">{stageMeta.description}</p>
    </div>
  {/if}

  {#if nextSlot && nextSlot !== primarySlot}
    <div class="next card">
      <span class="next-label">次</span>
      <span class="next-time num">{formatTime(nextSlot)}</span>
      <span class="next-action">{nextSlot.action.title}</span>
    </div>
  {/if}

  {#if notifications.length > 0}
    <section class="notifs">
      <h3 class="section-title">最近の通知</h3>
      {#each notifications as notif (notif.id)}
        <div class="notif card pill-{notif.severity === 'alert' ? 'danger' : notif.severity === 'warn' ? 'warn' : 'ok'}">
          <span class="notif-date num">{notif.dateISO}</span>
          <p class="notif-msg">{notif.message}</p>
        </div>
      {/each}
    </section>
  {/if}

  {#if notifPermission === 'default'}
    <section class="perm-prompt card">
      <p class="perm-msg">
        異常検知（体重 2 週間上昇・睡眠連続不足・HRV 急低下）を iOS 通知で受け取りますか?
      </p>
      <button class="perm-btn" onclick={enableNotifications}>通知を許可</button>
    </section>
  {/if}

  <footer class="north-star">
    80 歳まで息子と歩き、孫を抱き、妻と旅に出られる体と心
  </footer>
</div>

<style>
  .today {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
  }
  .time-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .now-time {
    font-size: 36px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .now-dow {
    font-size: 14px;
    color: var(--ink-muted);
    font-weight: 500;
  }
  .rest-badge-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .rest-reason {
    font-size: 12px;
    color: var(--ink-muted);
  }
  .hero {
    padding: 26px 24px;
  }
  .hero-label {
    display: inline-block;
    padding: 4px 12px;
    background: var(--accent-light);
    color: var(--accent-dark);
    border-radius: var(--rounded-pill);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-bottom: 14px;
  }
  .hero-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
    line-height: 1.35;
  }
  .hero-sub {
    font-size: 14px;
    color: var(--ink-dim);
    line-height: 1.6;
    margin-bottom: 18px;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--ink);
    color: var(--bg);
    padding: 12px 22px;
    border-radius: var(--rounded-pill);
    font-weight: 600;
    font-size: 14px;
    transition: transform var(--anim-fast) var(--ease-smooth);
  }
  .cta:active {
    transform: scale(0.97);
  }
  .next {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
  }
  .next-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-muted);
    letter-spacing: 0.08em;
  }
  .next-time {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    min-width: 52px;
  }
  .next-action {
    font-size: 13px;
    color: var(--ink-dim);
    flex: 1;
  }
  .notifs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink-muted);
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }
  .notif {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 16px;
  }
  .notif-date {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.75;
  }
  .notif-msg {
    font-size: 13px;
    line-height: 1.55;
  }
  .north-star {
    text-align: center;
    font-size: 11px;
    color: var(--ink-subtle);
    padding: 24px 16px 0;
    letter-spacing: 0.03em;
    line-height: 1.6;
  }
  .perm-prompt {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 18px;
    background: var(--accent-light);
  }
  .perm-msg {
    font-size: 12px;
    color: var(--accent-dark);
    line-height: 1.6;
  }
  .perm-btn {
    align-self: flex-start;
    background: var(--accent-dark);
    color: var(--bg-elevated);
    padding: 8px 18px;
    border-radius: var(--rounded-pill);
    font-size: 12px;
    font-weight: 600;
  }
</style>
