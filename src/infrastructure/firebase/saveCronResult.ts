import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const saveCronResult = async (pollData: any) => {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dateId = jst.toISOString().split("T")[0];
  const docId = `${dateId}_本日のVALORANT`;

  const allZero = Object.values(pollData.results).every((v) => v === 0);
  const topOption = allZero ? "投票なし" : pollData.top_option;

  await db
    .collection("poll_results")
    .doc(docId)
    .collection("cron")
    .doc("latest")
    .set(
      {
        question: pollData.question,
        results: pollData.results,
        top_option: topOption,
        timestamp: Timestamp.fromDate(jst),
      },
      { merge: true }
    );

  console.log("🟧 cron 保存完了");
};
