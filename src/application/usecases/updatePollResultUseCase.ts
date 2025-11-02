// src/application/usecases/updatePollResultUseCase.ts
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

/**
 * Firestore上の投票結果をリアルタイム更新
 * @param question 質問文
 * @param selectedOption 選ばれた選択肢
 * @param delta 投票変化（+1 or -1）
 */
export const updatePollResultUseCase = async (
  question: string,
  selectedOption: string,
  delta: number = 1 // ✅ ← 第3引数を受け取るようにする
) => {
  const existing = await pollResultRepository.getByQuestion(question);
  if (!existing) {
    console.warn("⚠️ Firestoreに対象の質問が見つかりません:", question);
    return;
  }

  // 投票数を加減算
  const newResults = { ...existing.results };
  newResults[selectedOption] = (newResults[selectedOption] || 0) + delta;
  if (newResults[selectedOption] < 0) newResults[selectedOption] = 0; // マイナス防止

  // 最多票を再計算
  const sorted = Object.entries(newResults).sort((a, b) => b[1] - a[1]);
  const topOption = sorted[0]?.[0] ?? "なし";

  // Firestore更新
  await pollResultRepository.updateResult(question, newResults, topOption);
};
