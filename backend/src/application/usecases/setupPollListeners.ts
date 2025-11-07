import { Client, Events } from "discord.js";
import { updatePollResultUseCase } from "./updatePollResultUseCase.js";

export const setupPollListeners = (client: Client) => {
  console.log("🗳️ Firestore対応 Pollリスナーを起動しました");

  // 投票が追加されたとき
  client.on(Events.MessagePollVoteAdd, async (pollVote: any) => {
    try {
      console.log("🟢 投票イベント発火:", pollVote.option?.text);
      // 正しいpoll取得
      const poll = pollVote.poll;
      if (!poll) return;

      // 選択肢のテキストを安全に取得
      const optionText =
        pollVote.answer?.text ??
        pollVote.pollAnswer?.text ??
        pollVote.option?.text ??
        "不明";

      console.log(`🟢 投票追加: ${optionText}`);
      await updatePollResultUseCase(poll);
    } catch (err) {
      console.error("❌ 投票追加処理エラー:", err);
    }
  });

  client.on(Events.MessagePollVoteRemove, async (pollVote: any) => {
    try {
      const poll = pollVote.poll;
      if (!poll) {
        console.warn("⚠️ pollVote.poll が存在しません:", pollVote);
        return;
      }

      console.log(`🔴 投票削除: ${pollVote.option?.text ?? "不明"}`);
      await updatePollResultUseCase(poll);
    } catch (err) {
      console.error("❌ 投票削除処理エラー:", err);
    }
  });
};
