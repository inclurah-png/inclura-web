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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Inclura SOS alert";
  const options = {
    body: payload.notification?.body || "An emergency notification was received.",
    icon: "/favicon.ico",
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
