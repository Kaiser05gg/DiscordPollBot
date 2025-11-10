import "dotenv/config";
import "./infrastructure/firebase/firebase.js";
import { startExpressServer } from "./interfaces/http/server.js";
import { client } from "./infrastructure/discord/discordClient.js";
import { registerCommands } from "./application/usecases/registerCommands.js";
import { schedulePoll } from "./application/services/schedulePoll.js";
import { setupPollListeners } from "./application/usecases/setupPollListeners.js";
import { setupInteractionHandlers } from "./application/usecases/interactionHandlers.js";

try {
  startExpressServer();

  client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
    await registerCommands(client);
    setupPollListeners(client);
    setupInteractionHandlers(client);
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
