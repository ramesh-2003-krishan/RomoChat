export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
};

export const showSystemNotification = (title, body, onClickCallback) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    const notification = new Notification(title, {
      body,
      tag: "romochat-new-msg",
      silent: true,
    });

    if (onClickCallback) {
      notification.onclick = () => {
        window.focus();
        onClickCallback();
        notification.close();
      };
    }
  } catch (e) {
    console.warn("Native Notification failure:", e);
  }
};
