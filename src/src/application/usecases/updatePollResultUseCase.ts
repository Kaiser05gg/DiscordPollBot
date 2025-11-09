import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

/**
 * Discord Pollの最新状態をFirestoreに保存（全体再集計型）
 * @param poll Discord.jsのPollオブジェクト
 */
export const updatePollResultUseCase = async (poll: any) => {
  if (!poll) return;

  console.log("🧩 Pollデータ構造確認:", JSON.stringify(poll, null, 2));
  console.log("🧩 poll.answers =", poll.answers);

  const newResults: Record<string, number> = {};

  // Discord.js v14.17構造対応：poll.answers は Collection(Map)
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

  // undefinedキーを削除（Firestore安全化）
  const filteredResults = Object.fromEntries(
    Object.entries(newResults).filter(([key]) => key && key !== "undefined")
  );

  // 最多得票の選択肢を算出
  const sorted = Object.entries(filteredResults).sort((a, b) => b[1] - a[1]);
  const topOption = sorted[0]?.[0] ?? "なし";

  console.log(
    `📊 Firestore更新: ${poll.question?.text} の集計データを更新します`
  );
  await pollResultRepository.updateResult(
    poll.question?.text ?? "不明な質問",
    filteredResults,
    topOption
  );

  console.log(`📊 Firestore更新完了: ${poll.question?.text}`);
};
