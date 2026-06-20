
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker registered:", registration.scope);
    } catch (err) {
      console.error("❌ Service Worker registration failed:", err);
    }
  }
}


export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Browser does not support notifications.");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    console.log("Notification permission denied.");
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}


export function sendNotification(
  title,
  body,
  options = {}
) {
  if (Notification.permission !== "granted") return;

const notification = new Notification(title, {
  body,
  icon: "/logo.png",
  badge: "/logo.png",
  tag: options.tag || title,
  renotify: true,
  requireInteraction:
    options.requireInteraction ?? true,
  silent: options.silent ?? false,
});

notification.onclick = () => {
  window.focus();

  window.location.href =
    options.url || "/dashboard";

  notification.close();
};

  return notification;
}


export function sendTestNotification() {
  sendNotification(
    "🚨 SafePeep Alert",
    "Notifications are working correctly.",
    {
      tag: "test",
    }
  );
}