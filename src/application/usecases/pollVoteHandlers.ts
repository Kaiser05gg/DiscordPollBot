import { Client, Events } from "discord.js";
import { pollRepository } from "../../infrastructure/mysql/pollRepository.js";

export const setupPollListeners = (client: Client) => {
  // 投票追加イベント
  //現在の状態dddiscord.jsのバージョンではではMessagePollVoteAddとMessagePollVoteRemoveにおいてmessage/user を記録できない
  client.on(Events.MessagePollVoteAdd, async (pollAnswer: any) => {
    //(vote: anyの型安全は後回しにします)
    try {
      const optionText = String(pollAnswer.text ?? "不明");
      await pollRepository.saveVote({
        messageId: "0", //仮のID
        userId: "0", //仮のユーザーID
        optionId: String(pollAnswer.id ?? "0"),
      });
      console.log(`🗳️ 投票が追加されました（${optionText}）`);
    } catch (err) {
      console.error("❌ 投票保存エラー:", err);
    }
  });

  // 投票削除イベント
  //現在の状態dddiscord.jsのバージョンではではMessagePollVoteAddとMessagePollVoteRemoveにおいてmessage/user を記録できない
  client.on(Events.MessagePollVoteRemove, async (pollAnswer: any) => {
    //(vote: anyの型安全は後回しにします)
    try {
      const optionText = String(pollAnswer.text ?? "不明");
      await pollRepository.removeVote({
        messageId: "0", //仮のID
        userId: "0", //仮のユーザーID
      });
      console.log(`↩️ 投票が削除されました（${optionText}）`);
    } catch (err) {
      console.error("❌ 投票削除エラー:", err);
    }
  });
};
