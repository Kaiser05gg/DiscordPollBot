import "dotenv/config";
import { startExpressServer } from "./interfaces/http/server.js";
import { client } from "./infrastructure/discord/discordClient.js";
import { ensureTables } from "./infrastructure/mysql/schema.js";
import { registerCommands } from "./application/usecases/registerCommands.js";
import { schedulePoll } from "./application/services/schedulePoll.js";
import { setupPollListeners } from "./application/usecases/pollVoteHandlers.js";
import { setupInteractionHandlers } from "./application/usecases/interactionHandlers.js";

startExpressServer();

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
  await ensureTables();
  await registerCommands(client);
  schedulePoll(client);
  setupPollListeners(client);
  setupInteractionHandlers(client);
});

client.login(process.env.DISCORD_TOKEN);
