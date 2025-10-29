import { getPool } from "./connection.js";

export const pollRepository = {
  //投票の作成をDBに保存
  async savePoll(poll: {
    messageId: string;
    guildId: string | null;
    channelId: string;
    question: string;
  }) {
    const db = await getPool();
    await db.query(
      `INSERT INTO polls (message_id, guild_id, channel_id, question)
       VALUES (?, ?, ?, ?)`,
      [poll.messageId, poll.guildId, poll.channelId, poll.question]
    );
    console.log("💾 Poll saved to DB:", poll.question);
  },

  // 投票選択時の保存（poll_votesテーブル）
  async saveVote(vote: {
    messageId: string;
    userId: string;
    optionId: string;
  }) {
    const db = await getPool();
    await db.query(
      `INSERT INTO poll_votes (message_id, user_id, option_index)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         option_index = VALUES(option_index),
         voted_at = CURRENT_TIMESTAMP`,
      [vote.messageId, vote.userId, vote.optionId]
    );
    console.log(`🗳️ Vote saved: ${vote.userId} → ${vote.optionId}`);
  },

  //投票取消（poll_votesから削除）
  async removeVote(vote: { messageId: string; userId: string }) {
    const db = await getPool();
    await db.query(
      `DELETE FROM poll_votes WHERE message_id = ? AND user_id = ?`,
      [vote.messageId, vote.userId]
    );
    console.log(`↩️ Vote removed: ${vote.userId}`);
  },
};
