import { PollResult } from "../../domain/pollResult.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const savePollResultUseCase = async (pollData: PollResult) => {
  try {
    await pollResultRepository.save(pollData);
  } catch (err) {
    console.error("❌ Firestore保存エラー:", err);
  }
};
