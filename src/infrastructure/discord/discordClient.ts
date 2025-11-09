import { Client, GatewayIntentBits, DiscordAPIError } from "discord.js";

// ✅ Discordクライアントの生成（Infrastructure層の責務）
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
  ],
});

//Discord APIの低レベル例外ハンドリング
client.on("error", (err: unknown) => {
  if (err instanceof DiscordAPIError) {
    // すでに応答済み（40060）や期限切れ（10062）は警告としてスルー
    if (err.code === 40060 || err.code === 10062) {
      console.warn(
        `⚠️ DiscordAPIWarning [${err.code}]: ${err.message}（無視しました）`
      );
      return;
    }

    //それ以外のDiscordAPIエラーは明示的に出す
    console.error(`❌ DiscordAPIError [${err.code}]: ${err.message}`);
  } else {
    //型外エラー（Node内部 or Discord.js側など）
    console.error("❌ Unknown Discord Client Error:", err);
  }
});
