import cron from "node-cron";
import { Client } from "discord.js";
import { createPoll } from "../usecases/createPoll.js";
import { updatePollResultUseCase } from "../usecases/updatePollResultUseCase.js";

export const schedulePoll = (client: Client) => {
  const channelId = process.env.CHANNEL_ID;
  if (!channelId) return console.error("❌ CHANNEL_ID 未設定");

  cron.schedule("0 12 * * *", async () => {
    try {
      await createPoll(client, channelId);
      console.log("✅ JST12:00 定時投票を送信しました");
    } catch (err) {
      console.error("❌ 自動投票エラー:", err);
    }
  });
  cron.schedule("* * * * *", async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel?.isTextBased()) return;

      const messages = await channel.messages.fetch({ limit: 10 });
      for (const msg of messages.values()) {
        if (!msg.poll) continue;
        await updatePollResultUseCase(msg.poll);
      }

      console.log("✅ 1分ごとのPoll結果反映完了");
    } catch (err) {
      console.error("❌ Poll結果更新ジョブエラー:", err);
    }
  });
};
