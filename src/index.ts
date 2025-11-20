import "dotenv/config";
import "./infrastructure/firebase/firebase.js";
import { startExpressServer } from "./interfaces/http/server.js";
import { client } from "./infrastructure/discord/discordClient.js";
import { registerCommands } from "./application/services/registerCommands.js";
import { schedulePoll } from "./application/services/schedulePoll.js";
import { setupPollListeners } from "./application/services/setupPollListeners.js";
import { setupInteractionHandlers } from "./application/services/interactionHandlers.js";

try {
  startExpressServer();
  setupInteractionHandlers(client);
  client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);

    await registerCommands(client);
    setupPollListeners(client);
    setupInteractionHandlers(client);

    // ColdStart対策
    try {
      await fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      });
      console.log("🔥 Discord API warm-up completed!");
    } catch (err) {
      console.warn("⚠️ Warm-up skipped:", err);
    }
    setTimeout(() => {
      schedulePoll(client);
      console.log("⏰ Pollスケジューラーを起動しました");
    }, 3000);
    console.log("🚀 Bot initialization completed!");
  });
  client.login(process.env.DISCORD_TOKEN);
} catch (err) {
  console.error("❌ 起動時エラー:", err);
}
// Node.js全体の例外処理をキャッチしてBotが落ちないようにする
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});
