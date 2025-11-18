import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import admin from "firebase-admin";

if (!admin.apps.length) {
  const jsonString = Buffer.from(
    process.env.FIREBASE_PRIVATE_KEY_BASE64!,
    "base64"
  ).toString("utf-8");

  const serviceAccount = JSON.parse(jsonString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
console.log("🔥 Firebase接続成功");
