import { db } from "./firebase.js";
import { v4 as uuidv4 } from "uuid";

export const pollResultRepository = {
  //ドキュメント作成
  async createPollResult({
    messageId,
    question,
  }: {
    messageId: string;
    question: string;
  }) {
    const now = new Date();
    const jstDate = now.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    const uuid = uuidv4();
    await db.collection("poll_results").doc(docId).set(
      {
        uuid,
        message_id: messageId,
        question,
        created_at: now,
      },
      { merge: true }
    );

    console.log(`🗳️ Firestore 親ドキュメント作成: ${docId}`);

    return docId;
  },

  async savePoll({
    question,
    results,
    votedAt,
  }: {
    question: string;
    results: Record<string, number>;
    votedAt: Date;
  }) {
    const jstDate = votedAt.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    console.log(`🟦 /poll 保存開始: ${docId}`);

    await db
      .collection("poll_results")
      .doc(docId)
      .collection("poll")
      .doc("latest")
      .set(
        {
          results,
          voted_at: votedAt,
        },
        { merge: true }
      );
    console.log(`🟦 /poll 保存完了: ${docId}`);
  },

  async saveCron({
    question,
    results,
    topOption,
  }: {
    question: string;
    results: Record<string, number>;
    topOption: string;
  }) {
    const now = new Date();
    const jstDate = now.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    console.log(`🟧 cron 保存開始: ${docId}`);
    console.log("🟧 cron 保存開始 docId:", docId);

    await db
      .collection("poll_results")
      .doc(docId)
      .collection("cron")
      .doc("latest")
      .set(
        {
          results,
          top_option: topOption,
          created_at: now,
        },
        { merge: true }
      );

    console.log(`🟧 cron 保存完了: ${docId}`);
  },
};
