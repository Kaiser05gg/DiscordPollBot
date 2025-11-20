import { Client, Events } from "discord.js";
import { updatePollResultUseCase } from "../usecases/updatePollResultUseCase.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const setupPollListeners = (client: Client) => {
  console.log("🗳️ Firestore対応 Pollリスナーを起動しました");

  // 投票が追加されたとき
  client.on(Events.MessagePollVoteAdd, async (pollVote: any) => {
    try {
      console.log("🟢 投票イベント発火:", pollVote.option?.text);
      const poll = pollVote.poll;
      if (!poll) return;

      const optionText =
        pollVote.answer?.text ??
        pollVote.pollAnswer?.text ??
        pollVote.option?.text ??
        "不明";

      console.log(`🟢 投票追加: ${optionText}`);

      const pollData = await updatePollResultUseCase(poll);

      // 🔥 Firestore 保存処理を追加
      if (pollData) {
        await pollResultRepository.savePoll({
          question: pollData.question,
          results: pollData.results,
          votedAt: pollData.voted_at,
        });
      }
      console.log("🟦 Firestoreに保存完了 (MessagePollVoteAdd)");
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

      const pollData = await updatePollResultUseCase(poll);

      // 🔥 削除時も保存
      if (pollData) {
        await pollResultRepository.savePoll({
          question: pollData.question,
          results: pollData.results,
          votedAt: pollData.voted_at,
        });
      }
      console.log("🟦 Firestoreに保存完了 (MessagePollVoteRemove)");
    } catch (err) {
      console.error("❌ 投票削除処理エラー:", err);
    }
  });
};
