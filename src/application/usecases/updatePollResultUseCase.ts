import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";
import { PollData } from "../../domain/pollResult.js";

/**
 * Discord Pollの最新状態を解析し、Firestore保存用データを返す
 */
export const updatePollResultUseCase = async (
  poll: any
): Promise<PollData | undefined> => {
  if (!poll) return;

  console.log("🧩 Pollデータ構造確認:", JSON.stringify(poll, null, 2));
  console.log("🧩 poll.answers =", poll.answers);
  const newResults: Record<string, number> = {};

  try {
    poll.answers.forEach((answer: any) => {
      const key = answer?.text ?? "不明";
      const value =
        typeof answer?.voteCount === "number" ? answer.voteCount : 0;
      newResults[key] = value;
    });
  } catch (err) {
    console.error("❌ poll.answers の処理中にエラー:", err);
  }

  const filteredResults = Object.fromEntries(
    Object.entries(newResults).filter(([key]) => key && key !== "undefined")
  );

  const allVotesZero = Object.values(filteredResults).every(
    (count) => count === 0
  );

  const topOption = allVotesZero
    ? "投票なし"
    : Object.entries(filteredResults).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "投票なし";

  const result = {
    question: poll.question?.text ?? "不明な質問",
    results: filteredResults,
    top_option: topOption,
    voted_at: new Date(),
  };

  // Firestore に /poll/latest を保存
  await pollResultRepository.savePoll({
    question: result.question,
    results: result.results,
    votedAt: result.voted_at,
  });

  return result;
};
