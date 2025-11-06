import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

interface PollResult {
  question: string;
  results: Record<string, number>;
  voted_at: Date;
}

export const savePollResult = async (data: PollResult) => {
  const jstNow = new Date(data.voted_at.getTime() + 9 * 60 * 60 * 1000);
  const jstDate = jstNow.toISOString().split("T")[0];
  const docId = `${jstDate}_${Date.now()}`;

  await db
    .collection("poll_results")
    .doc(docId)
    .set({
      question: data.question,
      results: data.results,
      voted_at: Timestamp.fromDate(jstNow),
    });
};
