// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQ_li5KK4-ZciY7b2nlX3Rhb6_Eb3DXc8",
  authDomain: "sportnova-463d3.firebaseapp.com",
  projectId: "sportnova-463d3",
  storageBucket: "sportnova-463d3.firebasestorage.app",
  messagingSenderId: "179722288196",
  appId: "1:179722288196:web:38cacd93c97096cec8d011",
  measurementId: "G-MDNXSMC3WL",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;