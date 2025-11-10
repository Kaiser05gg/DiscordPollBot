import dotenv from "dotenv";
dotenv.config({ path: path.resolve("backend/.env") });
import fs from "fs";
import path from "path";

const firebaseKeyEnv = process.env.FIREBASE_KEY;

// Python側が使うfirebase-key.jsonを生成
if (firebaseKeyEnv) {
  const keyPath = path.resolve("/usr/src/app/firebase-key.json");
  if (!fs.existsSync(keyPath)) {
    fs.writeFileSync(keyPath, firebaseKeyEnv);
    console.log("✅ firebase-key.json を自動生成しました");
  }
} else {
  console.warn("⚠️ FIREBASE_KEY が環境変数に存在しません");
}

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseKey = process.env.FIREBASE_KEY;

if (!firebaseKey) throw new Error("❌ FIREBASE_KEY が設定されていません");

const serviceAccount = JSON.parse(firebaseKey);

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
console.log("✅ Firebase接続成功");
