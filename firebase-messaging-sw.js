// ══════════════════════════════════════════════════════════
// OLANIYI MOBILE REPAIR — Service Worker FCM
// Fichier : firebase-messaging-sw.js
// À placer à la RACINE de ton repo GitHub (olaniyigsm)
// ══════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyB2r2b5QzK9Ld6DW9et2xyxDNaKoxDgBHU",
  authDomain:        "olaniyi-repair.firebaseapp.com",
  projectId:         "olaniyi-repair",
  storageBucket:     "olaniyi-repair.firebasestorage.app",
  messagingSenderId: "186600068801",
  appId:             "1:186600068801:web:8205559719b6f19212a640",
});

const messaging = firebase.messaging();

// Notification reçue en arrière-plan
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  const data = payload.data || {};

  self.registration.showNotification(title, {
    body,
    icon:  '/icon-192.png',
    badge: '/icon-72.png',
    tag:   data.type + '-' + (data.orderCode || Date.now()),
    requireInteraction: true,
    data:  { url: data.url || '/' },
    actions: data.type === 'new_order'
      ? [{ action: 'open', title: '👁️ Voir la commande' }]
      : [{ action: 'track', title: '🔍 Voir le statut' }],
  });
});

// Clic sur la notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
