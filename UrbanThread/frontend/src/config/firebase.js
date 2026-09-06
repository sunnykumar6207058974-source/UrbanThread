import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA5pnFXy445TQbYWXzFtdF-C5tsAPF7TJY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "urbanthread-ecommerce.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "urbanthread-ecommerce",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "urbanthread-ecommerce.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "664832983943",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:664832983943:web:73e851a9fb241f8cd18922",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9MQZHMLRHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to prompt user to pick account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
