import "dotenv/config";
import "./infrastructure/firebase/firebase.js";
import { startExpressServer } from "./interfaces/http/server.js";
import { client } from "./infrastructure/discord/discordClient.js";
import { registerCommands } from "./application/usecases/registerCommands.js";
import { schedulePoll } from "./application/services/schedulePoll.js";
import { setupPollListeners } from "./application/usecases/setupPollListeners.js"; // ✅ Firestore対応に変更
import { setupInteractionHandlers } from "./application/usecases/interactionHandlers.js";

startExpressServer();

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
  await registerCommands(client);
  schedulePoll(client);
  setupPollListeners(client);
  setupInteractionHandlers(client);
  console.log("🚀 Bot initialization completed!");
});

client.login(process.env.DISCORD_TOKEN);
