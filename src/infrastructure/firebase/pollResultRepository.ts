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
    const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const jstDate = jst.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    const uuid = uuidv4();
    await db.collection("poll_results").doc(docId).set(
      {
        uuid,
        message_id: messageId,
        question,
        created_at: jst,
      },
      { merge: true }
    );

    console.log(`🗳️ Firestore 親ドキュメント作成: ${docId}`);

    return docId;
  },

  ///poll の保存（poll/latest）
  async savePoll({
    question,
    results,
    votedAt,
  }: {
    question: string;
    results: Record<string, number>;
    votedAt: Date;
  }) {
    const jst = new Date(votedAt.getTime() + 9 * 60 * 60 * 1000);
    const jstDate = jst.toISOString().split("T")[0];
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
          voted_at: jst,
        },
        { merge: true }
      );
    console.log(`🟦 /poll 保存完了: ${docId}`);
  },
  // cron の保存（cron/latest）
  async saveCron({
    question,
    results,
    topOption,
  }: {
    question: string;
    results: Record<string, number>;
    topOption: string;
  }) {
    const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const jstDate = jst.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    console.log(`🟧 cron 保存開始: ${docId}`);

    await db
      .collection("poll_results")
      .doc(docId)
      .collection("cron")
      .doc("latest")
      .set(
        {
          results,
          top_option: topOption,
          created_at: jst,
        },
        { merge: true }
      );

    console.log(`🟧 cron 保存完了: ${docId}`);
  },
};
