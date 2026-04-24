import type { AnomalySignal } from './anomaly';

export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function fireLocalNotification(signal: AnomalySignal): void {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  try {
    const title =
      signal.severity === 'alert'
        ? '道標 2: 完全休養推奨'
        : signal.severity === 'warn'
          ? '道標 2: 要チェック'
          : '道標 2: 気づき';
    new Notification(title, {
      body: signal.message,
      tag: signal.kind,
      icon: '/icons/icon-192.png'
    });
  } catch (e) {
    console.error('[local-notify]', e);
  }
}
