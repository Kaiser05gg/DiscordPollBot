import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("../.env") });

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 🔹 環境変数から直接JSONをパース
const firebaseKey = process.env.FIREBASE_KEY;

if (!firebaseKey) {
  throw new Error("❌ FIREBASE_KEY が設定されていません");
}

let serviceAccount: any;
try {
  serviceAccount = JSON.parse(firebaseKey);
} catch (err) {
  console.error("❌ FIREBASE_KEY のJSONパースに失敗しました");
  throw err;
}

// 🔹 Firebase初期化
initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
console.log("✅ Firebase接続成功（ファイル書き出し不要）");
