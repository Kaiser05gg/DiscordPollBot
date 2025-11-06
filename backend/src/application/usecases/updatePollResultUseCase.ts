import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

/**
 * @param question
 * @param selectedOption
 * @param delta
 */
export const updatePollResultUseCase = async (
  question: string,
  selectedOption: string,
  delta: number = 1
) => {
  const existing = await pollResultRepository.getByQuestion(question);
  if (!existing) {
    console.warn("⚠️ Firestoreに対象の質問が見つかりません:", question);
    return;
  }

  const newResults = { ...existing.results };
  newResults[selectedOption] = (newResults[selectedOption] || 0) + delta;
  if (newResults[selectedOption] < 0) newResults[selectedOption] = 0;

  const sorted = Object.entries(newResults).sort((a, b) => b[1] - a[1]);
  const topOption = sorted[0]?.[0] ?? "なし";

  await pollResultRepository.updateResult(question, newResults, topOption);
};
