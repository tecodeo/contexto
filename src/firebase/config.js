import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA4FpTh_vhg16iidXfxL5T8FVswh4RMA0E",
  authDomain: "contexto-5dc7c.firebaseapp.com",
  projectId: "contexto-5dc7c",
  storageBucket: "contexto-5dc7c.firebasestorage.app",
  messagingSenderId: "23720228047",
  appId: "1:23720228047:web:a05db0b563934caecb33ba",
  databaseURL: "https://contexto-5dc7c-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
