import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";
import { PollResult } from "../../domain/pollResult.js";

export const pollResultRepository = {
  // 🔹 新規Pollデータを保存
  async save(poll: PollResult): Promise<void> {
    const docId = `${poll.voted_at.toISOString().split("T")[0]}_${Date.now()}`;
    await db
      .collection("poll_results")
      .doc(docId)
      .set({
        question: poll.question,
        results: poll.results,
        top_option: poll.top_option,
        voted_at: Timestamp.fromDate(poll.voted_at),
      });
    console.log(`✅ Firestoreに投票結果を保存しました: ${poll.question}`);
  },

  // 🔹 質問文で既存データを取得
  async getByQuestion(question: string): Promise<PollResult | null> {
    const snapshot = await db
      .collection("poll_results")
      .where("question", "==", question)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as PollResult;
  },

  // 🔹 結果を更新（得票数を上書き）
  async updateResult(
    question: string,
    results: Record<string, number>,
    top_option: string
  ): Promise<void> {
    const snapshot = await db
      .collection("poll_results")
      .where("question", "==", question)
      .limit(1)
      .get();

    if (snapshot.empty) return;

    const docRef = snapshot.docs[0].ref;
    await docRef.update({
      results,
      top_option,
      voted_at: Timestamp.fromDate(new Date()),
    });

    console.log(`📊 Firestore更新: ${question} の集計データを更新しました`);
  },
};
