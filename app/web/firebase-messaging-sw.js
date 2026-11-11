// Shows "intimar" pushes when the site is closed or in the background.
// Firebase registers this file from the site root (/firebase-messaging-sw.js),
// so the beta at /beta/ uses the root's copy. Tapping the notification opens
// the room's invite link (webpush.fcm_options.link, set by the Edge Function
// "intimar"). The values are the public web config, as in config/supabase.json.
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBlbciXEp13BOEEU2L4ddg_w4QPaRdNixI',
  appId: '1:141903400984:web:17555d351386132682b36d',
  messagingSenderId: '141903400984',
  projectId: 'truco-91afd',
});
firebase.messaging();
