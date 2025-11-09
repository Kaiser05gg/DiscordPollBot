import { db } from "./firebase.js";

export const pollResultRepository = {
  // ✅ Poll作成時（初期レコード作成）
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

    await db.collection("poll_results").doc(docId).set({
      message_id: messageId,
      question,
      results: {},
      top_option: "",
      created_at: jst,
    });

    console.log(`🗳️ Firestoreに新規Pollを作成: ${docId}`);
  },

  //  投票更新時（同じ日付＋質問名ドキュメントに上書き）
  // 投票更新時
  async updateResult(
    question: string,
    results: Record<string, number>,
    topOption: string
  ) {
    const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const jstDate = jst.toISOString().split("T")[0];
    const safeQuestion = question.replace(/\s+/g, "_");
    const docId = `${jstDate}_${safeQuestion}`;

    const docRef = db.collection("poll_results").doc(docId);

    await docRef.set(
      {
        results,
        top_option: topOption,
        updated_at: jst,
      },
      { merge: true }
    );

    console.log(`📊 Firestore更新完了: ${docId}`);
  },
};
