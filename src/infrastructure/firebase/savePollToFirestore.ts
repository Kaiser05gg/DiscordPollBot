import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

interface PollData {
  question: string; // 質問文
  results: Record<string, number>; // 各選択肢と得票数
  top_option: string; // 最多票の選択肢
}

export const savePollToFirestore = async (pollData: PollData) => {
  const today = new Date();
  const docId = today.toISOString().split("T")[0] + "_" + Date.now();

  await db
    .collection("poll_results")
    .doc(docId)
    .set({
      question: pollData.question,
      results: pollData.results,
      top_option: pollData.top_option,
      voted_at: Timestamp.fromDate(today),
    });

  console.log(`✅ Firestoreに投票結果を保存しました: ${pollData.question}`);
};
