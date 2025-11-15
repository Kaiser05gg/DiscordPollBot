import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const savePollResult = async (data: any) => {
  // data = { question, results, voted_at }
  const jst = new Date(data.voted_at.getTime() + 9 * 60 * 60 * 1000);
  const dateId = jst.toISOString().split("T")[0];
  const docId = `${dateId}_本日のVALORANT`;

  // topOption の計算（cron と揃える）
  const entries = Object.entries(data.results) as [string, number][];
  const allZero = entries.every(([, v]) => v === 0);
  const topOption = allZero
    ? "投票なし"
    : entries.sort(([, a], [, b]) => b - a)[0][0];

  await db
    .collection("poll_results")
    .doc(docId)
    .collection("poll")
    .doc("latest")
    .set(
      {
        question: data.question,
        results: data.results,
        top_option: topOption,
        timestamp: Timestamp.fromDate(jst),
      },
      { merge: true }
    );

  console.log("🟦 /poll 保存完了");
};
