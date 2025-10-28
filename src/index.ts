/// <reference path="./types/discord.d.ts" />

import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Interaction,
  VoiceState,
} from "discord.js";
import { createPoll } from "./application/usecases/createPoll.js";
import { client } from "./infrastructure/discord/discordClient.js";
import { schedulePoll } from "./application/services/schedulePoll.js";
import { registerCommands } from "./application/usecases/registerCommands.js";
import { startExpressServer } from "./interfaces/http/server.js";
import { ensureTables } from "./infrastructure/mysql/schema.js";
import { setupPollListeners } from "./application/usecases/pollVoteHandlers.js";
import { pollRepository } from "./infrastructure/mysql/pollRepository.js";
import { Events, MessagePollVoteAdd, MessagePollVoteRemove } from "discord.js"; //client.on(Events.MessagePollVoteAdd, async (vote: any)の関数。現在後回しにしている。
import { config } from "dotenv";
import cron from "node-cron";
config();

startExpressServer();

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
  await ensureTables();
  await registerCommands(client);
  schedulePoll(client);
  setupPollListeners(client);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "poll") return;

  if (interaction.channelId) {
    try {
      await createPoll(client, interaction.channelId); // ✅ createPollで送信＋DB保存を共通化
      console.log("✅ 手動投票を作成しました");
    } catch (err) {
      console.error("❌ 手動投票エラー:", err);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
