import { db } from "./firebase.js";
import { Timestamp } from "firebase-admin/firestore";
import { PollResult } from "../../domain/pollResult";

type SavePollResultDTO = Pick<PollResult, "question" | "results" | "voted_at">;

export const savePollResult = async (data: SavePollResultDTO) => {
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
