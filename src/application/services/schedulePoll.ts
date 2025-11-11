import cron from "node-cron";
import { Client } from "discord.js";
import { createPoll } from "../usecases/createPoll.js";
import { updatePollResultUseCase } from "../usecases/updatePollResultUseCase.js";

export const schedulePoll = (client: Client) => {
  const channelId = process.env.CHANNEL_ID;
  if (!channelId) return console.error("❌ CHANNEL_ID 未設定");

  // 🕛 毎日12:00にPoll作成
  cron.schedule("0 12 * * *", async () => {
    try {
      // 🟩 createPollが返す message を受け取る
      const message = await createPoll(client, channelId);
      console.log("✅ JST12:00 定時投票を送信しました");

      // 🕒 Poll終了時刻を取得
      const expiresAt = message.poll?.expiresTimestamp;
      if (!expiresAt) {
        console.warn("⚠️ Pollの終了時刻が取得できませんでした。");
        return;
      }

      const delay = expiresAt - Date.now();
      if (delay <= 0) {
        console.warn("⚠️ Pollがすでに終了しているか、終了時刻が不正です。");
        return;
      }

      console.log(
        `⏰ Poll終了まで ${Math.round(
          delay / 1000 / 60
        )} 分、終了時にFirestore更新予定`
      );

      // 🕓 Poll終了時に一度だけFirestoreへ最終結果を反映
      setTimeout(async () => {
        try {
          const channel = await client.channels.fetch(channelId);
          if (!channel?.isTextBased()) return;

          const freshMessage = await channel.messages.fetch(message.id);
          const freshPoll = freshMessage.poll;
          if (!freshPoll) {
            console.error("❌ Pollを再取得できませんでした");
            return;
          }

          await updatePollResultUseCase(freshPoll);
          console.log(
            "📊 Poll終了→Firestoreへ最終結果を反映しました:",
            message.id
          );
        } catch (err) {
          console.error("❌ Poll終了時のFirestore更新エラー:", err);
        }
      }, delay + 5000); // 5秒の猶予を持たせて安全に実行
    } catch (err) {
      console.error("❌ 自動投票エラー:", err);
    }
  });
};
