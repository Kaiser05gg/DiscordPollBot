import { Client, Events } from "discord.js";
import { updatePollResultUseCase } from "./updatePollResultUseCase.js";

/**
 * Discord Poll のイベント監視・Firestore反映ユースケース
 */
export const setupPollListeners = (client: Client) => {
  console.log("🗳️ Firestore対応 Pollリスナーを起動しました");

  // ✅ 投票追加イベント
  client.on(Events.MessagePollVoteAdd, async (pollAnswer: any) => {
    try {
      const optionText = pollAnswer?.option?.text || pollAnswer?.text || "不明";
      const question =
        pollAnswer?.message?.poll?.question?.text || "本日の VALORANT";

      console.log(`🟢 投票追加: ${optionText}`);
      await updatePollResultUseCase(question, optionText);
    } catch (err) {
      console.error("❌ 投票追加処理エラー:", err);
    }
  });

  // ✅ 投票削除イベント
  client.on(Events.MessagePollVoteRemove, async (pollAnswer: any) => {
    try {
      const optionText = pollAnswer?.option?.text || pollAnswer?.text || "不明";
      const question =
        pollAnswer?.message?.poll?.question?.text || "本日の VALORANT";

      console.log(`🔴 投票削除: ${optionText}`);
      await updatePollResultUseCase(question, optionText, -1); // 票をマイナス
    } catch (err) {
      console.error("❌ 投票削除処理エラー:", err);
    }
  });
};
