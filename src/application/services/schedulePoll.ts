import cron from "node-cron";
import { Client } from "discord.js";
import { createPoll } from "../usecases/createPoll.js";

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
};
