import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseKey = process.env.FIREBASE_KEY;

if (!firebaseKey) throw new Error("❌ FIREBASE_KEY が設定されていません");

const serviceAccount = JSON.parse(firebaseKey);

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
