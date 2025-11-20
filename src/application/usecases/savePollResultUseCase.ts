import { PollData } from "../../domain/pollResult.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const savePollResultUseCase = async (pollData: PollData) => {
  try {
    await pollResultRepository.savePoll({
      question: pollData.question,
      results: pollData.results,
      votedAt: pollData.voted_at,
    });

    console.log("🟦 [/poll] Firestore に poll/latest を保存しました");
  } catch (err) {
    console.error("❌ [/poll] Firestore 保存エラー:", err);
  }
};
