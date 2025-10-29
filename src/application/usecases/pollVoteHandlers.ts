import { Client, Events } from "discord.js";
import { pollRepository } from "../../infrastructure/mysql/pollRepository.js";
import { getPool } from "../../infrastructure/mysql/connection.js";
export const setupPollListeners = (client: Client) => {
  // 投票追加イベント
  //現在の状態dddiscord.jsのバージョンではではMessagePollVoteAddとMessagePollVoteRemoveにおいてmessage/user を記録できない
  client.on(Events.MessagePollVoteAdd, async (pollAnswer: any) => {
    //(vote: anyの型安全は後回しにします)
    try {
      const optionText = String(pollAnswer.text ?? "不明");
      // 仮Pollが存在しない場合のみ作成（Duplicate防止）
      const dbConn = await getPool();
      await dbConn.query(
        `INSERT IGNORE INTO polls (message_id, guild_id, channel_id, question)
   VALUES (?, ?, ?, ?)`,
        ["0", "0", "0", "仮のPoll（Discord.js制限中）"]
      );
      // 仮の選択肢をpoll_optionsに自動作成（存在しなければ）
      const optionId = String(pollAnswer.id ?? "0");
      await dbConn.query(
        `INSERT IGNORE INTO poll_options (message_id, option_id, option_label)
         VALUES (?, ?, ?)`,
        ["0", optionId, optionText]
      );
      // 投票を保存
      await pollRepository.saveVote({
        messageId: "0", // 仮のID
        userId: "0", // 仮のユーザーID
        optionId,
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
      const dbConn = await getPool();
      await dbConn.query(
        `INSERT IGNORE INTO polls (message_id, guild_id, channel_id, question)
         VALUES (?, ?, ?, ?)`,
        ["0", "0", "0", "仮のPoll（Discord.js制限中）"]
      );
      await pollRepository.removeVote({
        messageId: "0", // 仮のID
        userId: "0", // 仮のユーザーID
      });
      console.log(`↩️ 投票が削除されました（${optionText}）`);
    } catch (err) {
      console.error("❌ 投票削除エラー:", err);
    }
  });
};
