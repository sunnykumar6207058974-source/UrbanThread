const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let adminAuth = null;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    const app = getApps().length === 0 
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApps()[0];

    adminAuth = getAuth(app);
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
  }
} else {
  console.warn('⚠️ serviceAccountKey.json not found. Firebase Admin not initialized.');
}

module.exports = {
  auth: () => adminAuth,
  isConfigured: () => Boolean(adminAuth),
  getApps
};
