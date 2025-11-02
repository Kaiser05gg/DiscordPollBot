import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

interface PollResult {
  question: string;
  results: Record<string, number>;
  voted_at: Date;
}

export const savePollResult = async (data: PollResult) => {
  const docId = `${data.voted_at.toISOString().split("T")[0]}_${Date.now()}`;

  await db
    .collection("poll_results")
    .doc(docId)
    .set({
      question: data.question,
      results: data.results,
      voted_at: Timestamp.fromDate(data.voted_at),
    });

  console.log(`✅ Firestoreに投票結果を保存しました: ${data.question}`);
};
