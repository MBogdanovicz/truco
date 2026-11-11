// Shows "intimar" pushes when the site is closed or in the background.
// Firebase registers this file from the site root (/firebase-messaging-sw.js),
// so the beta at /beta/ uses the root's copy. Tapping the notification opens
// the room's invite link (webpush.fcm_options.link, set by the Edge Function
// "intimar"). The values are the public web config, as in config/supabase.json.
// Tapping the notification opens the room. Added before Firebase's own
// handler so it runs first. It opens in the site last opened (the official
// one or the beta at /beta/; index.html saves which), else the invite link.
self.addEventListener('notificationclick', function (event) {
  console.log('Truco: notification click', event.notification.data);
  var raw = event.notification.data || {};
  var msg = raw.FCM_MSG || {};
  var data = msg.data || raw;
  var link = data.link || (msg.fcmOptions && msg.fcmOptions.link);
  if (!data.path && !link) return;
  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil(
    caches.open('truco-push')
      .then(function (c) { return c.match('/push-base'); })
      .then(function (r) { return r ? r.text() : null; })
      .catch(function () { return null; })
      .then(function (base) {
        var url = data.path && base
          ? self.location.origin + base + '#' + data.path
          : link;
        return clients.openWindow(url);
      })
  );
});

importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBlbciXEp13BOEEU2L4ddg_w4QPaRdNixI',
  appId: '1:141903400984:web:17555d351386132682b36d',
  messagingSenderId: '141903400984',
  projectId: 'truco-91afd',
});
firebase.messaging();
