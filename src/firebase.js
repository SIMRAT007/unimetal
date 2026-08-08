import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy, limit, writeBatch } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig).filter(([_, v]) => !v).map(([k]) => k)

let app = null
let db = null
let auth = null

if (missing.length) {
  console.error(`[Firebase] Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill in your Firebase config.`)
} else {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (err) {
    console.error('[Firebase] Failed to initialize:', err)
  }
}

export const envMissing = missing.length > 0

export { app, db, auth }
export { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy, limit, writeBatch, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged }
