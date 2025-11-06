import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
interface PollData {
  question: string;
  results: Record<string, number>;
  top_option: string;
}
const db = admin.firestore();
export const savePollToFirestore = async (pollData: PollData) => {
  const now = new Date();
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const jstDate = jstNow.toISOString().split("T")[0];
  const docId = `${jstDate}_${Date.now()}`;

  await db
    .collection("poll_results")
    .doc(docId)
    .set({
      question: pollData.question,
      results: pollData.results,
      top_option: pollData.top_option,
      voted_at: admin.firestore.Timestamp.fromDate(jstNow),
    });

  console.log(`✅ Firestoreに投票結果を保存しました: ${pollData.question}`);
};
