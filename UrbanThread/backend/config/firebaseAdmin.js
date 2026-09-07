const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let adminAuth = null;

try {
  let serviceAccount = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : process.env.FIREBASE_SERVICE_ACCOUNT;
    } catch (e) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', e.message);
    }
  } else if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  }

  if (serviceAccount) {
    const app = getApps().length === 0 
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApps()[0];

    adminAuth = getAuth(app);
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    console.warn('⚠️ serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT not found. Firebase Admin not initialized.');
  }
} catch (err) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
}

module.exports = {
  auth: () => adminAuth,
  isConfigured: () => Boolean(adminAuth),
  getApps
};
