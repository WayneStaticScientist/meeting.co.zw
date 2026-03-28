importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBIuccc_5plQWbfbpcFjJH_SPORf5BjHMA",
  authDomain: "cloud-meeting-c3b80.firebaseapp.com",
  projectId: "cloud-meeting-c3b80",
  storageBucket: "cloud-meeting-c3b80.firebasestorage.app",
  messagingSenderId: "341999955537",
  appId: "1:341999955537:web:3880b187dfbd1f3fae1270",
  measurementId: "G-MHYNFJBE9Y",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/zanu.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
