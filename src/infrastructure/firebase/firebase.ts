import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
console.log("🔥 Firebase Admin 接続成功");
