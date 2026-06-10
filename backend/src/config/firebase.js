const admin = require('firebase-admin');
const path = require('path');

let firebaseApp = null;

const initFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, '../serviceAccountKey.json');

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });

  return firebaseApp;
};

const getMessaging = () => {
  initFirebase();
  return admin.messaging();
};

module.exports = { initFirebase, getMessaging };
