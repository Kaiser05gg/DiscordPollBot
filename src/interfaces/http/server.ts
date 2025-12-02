import express, { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import "../../infrastructure/firebase/firebase.js";
import cors from "cors";

export function startExpressServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const PORT = process.env.PORT || 3001;

  app.get("/", (_req, res) => {
    res.send("Express is running!");
  });

  app.get("/api/poll_results", async (_req, res) => {
    try {
      const db = getFirestore();

      const snapshot = await db
        .collection("poll_results")
        .orderBy("__name__", "desc")
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

  const getPollByUuid = async (req: Request, res: Response) => {
    try {
      const uuid = req.params.uuid;
      const db = getFirestore();

      const snap = await db
        .collection("poll_results")
        .where("uuid", "==", uuid)
        .limit(1)
        .get();

      if (snap.empty) {
        return res.status(404).json({ error: "Not found" });
      }

      const doc = snap.docs[0];
      const ref = db.collection("poll_results").doc(doc.id);

      // サブコレクション cron/poll を取得
      const cronSnap = await ref.collection("cron").doc("latest").get();
      const pollSnap = await ref.collection("poll").doc("latest").get();

      return res.json({
        id: doc.id,
        uuid,
        ...doc.data(),
        cron: cronSnap.exists ? cronSnap.data() : null,
        poll: pollSnap.exists ? pollSnap.data() : null,
      });
    } catch (error) {
      console.error("UUIDデータ取得エラー:", error);
      return res.status(500).json({ error: "取得に失敗しました" });
    }
  };

  app.get("/api/poll_result_by_uuid/:uuid", (req, res) => {
    getPollByUuid(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}
