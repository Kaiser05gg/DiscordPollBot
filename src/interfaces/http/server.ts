import express, { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import "../../infrastructure/firebase/firebase.js";
import cors from "cors";

export function startExpressServer() {
  const app = express();
  app.use(cors());
  const PORT = process.env.PORT || 3001;

  app.get("/", (_req, res) => {
    res.send("Express is running!");
  });

  app.get("/api/poll_results", async (req, res) => {
    try {
      const db = getFirestore();
      const snapshot = await db
        .collection("poll_results")
        .orderBy("voted_at", "desc")
        .get();

      const polls = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json(polls);
    } catch (error) {
      console.error("Firestore取得エラー:", error);
      res
        .status(500)
        .json({ error: "Firestoreからデータを取得できませんでした。" });
    }
  });

  app.get("/api/poll_results/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const db = getFirestore();
      const doc = await db.collection("poll_results").doc(id).get();

      if (!doc.exists) return res.status(404).json({ error: "Not found" });

      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("詳細取得エラー:", error);
      return res
        .status(500)
        .json({ error: "詳細データを取得できませんでした。" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}
