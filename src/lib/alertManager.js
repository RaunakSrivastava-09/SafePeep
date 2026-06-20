const activeIntervals = new Map();   
const stoppedAlerts = new Set();    

export function startAlert(alert) {
  const id = alert._id;

 
  if (stoppedAlerts.has(id)) return;

  if (activeIntervals.has(id)) return;


  showNotification(alert);

 
  const interval = setInterval(() => {
    if (stoppedAlerts.has(id)) {
      clearInterval(interval);
      activeIntervals.delete(id);
      return;
    }

    showNotification(alert);
  }, 60000);

  activeIntervals.set(id, interval);
}

// 🛑 Stop a specific alert permanently
export function stopAlert(alertId) {
  stoppedAlerts.add(alertId);

  const interval = activeIntervals.get(alertId);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(alertId);
  }
}

// 🧹 Stop ALL alerts (optional utility)
export function stopAllAlerts() {
  activeIntervals.forEach((interval) => clearInterval(interval));
  activeIntervals.clear();
  stoppedAlerts.clear();
}

// 🔔 Notification helper
function showNotification(alert) {
  if (Notification.permission !== "granted") return;

  const notification = new Notification("🚨 SafePeep Alert", {
    body: alert.message,
  });

  // 🖱️ Clicking notification stops it
  notification.onclick = () => {
    stopAlert(alert._id);
    window.focus();
  };
}