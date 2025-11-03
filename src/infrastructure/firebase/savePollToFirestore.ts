import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

interface PollData {
  question: string; // 質問文
  results: Record<string, number>; // 各選択肢と得票数
  top_option: string; // 最多票の選択肢
}

export const savePollToFirestore = async (pollData: PollData) => {
  // JSTで日付生成
  const now = new Date();
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const jstDate = jstNow.toISOString().split("T")[0];
  const docId = `${jstDate}_${Date.now()}`;

  // firebase-admin の書き込みAPIを使用
  await db
    .collection("poll_results")
    .doc(docId)
    .set({
      question: pollData.question,
      results: pollData.results,
      top_option: pollData.top_option,
      voted_at: Timestamp.fromDate(jstNow),
    });

  console.log(`✅ Firestoreに投票結果を保存しました: ${pollData.question}`);
};
