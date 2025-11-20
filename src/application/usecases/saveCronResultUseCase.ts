import { PollData, PollResult } from "../../domain/pollResult.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const saveCronResultUseCase = async (pollData: PollResult) => {
  try {
    await pollResultRepository.createPollResult({
      messageId: pollData.message_id,
      question: pollData.question,
    });

    console.log("💾 [CRON] Firestore に投票結果を保存しました");
  } catch (err) {
    console.error("❌ [CRON] Firestore 保存エラー:", err);
  }
};
