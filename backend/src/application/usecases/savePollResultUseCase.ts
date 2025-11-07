import { PollResult } from "../../domain/pollResult.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const savePollResultUseCase = async (pollData: PollResult) => {
  try {
    await pollResultRepository.createPollResult({
      messageId: pollData.message_id, // Firestoreの識別用
      question: pollData.question,
    });
    console.log("💾 Firestoreに初期投票データを保存しました");
  } catch (err) {
    console.error("❌ Firestore初期保存エラー:", err);
  }
};
