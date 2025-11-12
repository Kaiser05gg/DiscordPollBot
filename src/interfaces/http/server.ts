import express from "express";
import { getFirestore } from "firebase-admin/firestore";
import "../firebase/firebase.js";

export function startExpressServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get("/", (_req, res) => {
    res.send("Express is running!");
  });

  app.get("/api/polls", async (_req, res) => {
    try {
      const db = getFirestore();
      const snapshot = await db
        .collection("pollResults")
        .orderBy("voted_at", "desc")
        .get();
      const polls = snapshot.docs.map((doc) => doc.data());
      res.json(polls);
    } catch (error) {
      console.error("Firestore取得エラー:", error);
      res
        .status(500)
        .json({ error: "Firestoreからデータを取得できませんでした。" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}
