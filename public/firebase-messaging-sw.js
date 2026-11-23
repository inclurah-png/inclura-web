// Keep the notification click handler before Firebase imports.
// Firebase documents that importing Messaging can otherwise replace
// a custom notificationclick listener.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow("/");
    })
  );
});

importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCb7YlZynAbMKjPWAwuOH61D4uUeAVtUlU",
  authDomain: "inclura-prod-90734.firebaseapp.com",
  projectId: "inclura-prod-90734",
  storageBucket: "inclura-prod-90734.firebasestorage.app",
  messagingSenderId: "694509989399",
  appId: "1:694509989399:web:dda8a2ba4cd25efd4af652"
});

// Inclura's backend sends a standard FCM notification payload.
// The Firebase Messaging SDK displays notification payloads
// automatically when the web app is in the background. Do not
// call showNotification() again here, or users may see duplicates.
const messaging = firebase.messaging();
