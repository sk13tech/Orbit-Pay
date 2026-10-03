/**
 * Local push-style notifications via the Service Worker.
 * White notification card with black text content.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function showNotification(
  title: string,
  body: string,
  url: string = "/",
): Promise<void> {
  if (typeof window === "undefined") return;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const reg = await navigator.serviceWorker?.ready;
  if (!reg) return;

  await reg.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: `orbit-${Date.now()}`,
    data: { url },
  } as NotificationOptions);
}
