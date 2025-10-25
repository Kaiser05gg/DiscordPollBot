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
import { startExpressServer } from "./interfaces/http/server.js";
import { ensureTables } from "./infrastructure/mysql/schema.js";
import { pollRepository } from "./infrastructure/mysql/pollRepository.js";
import { Events, MessagePollVoteAdd, MessagePollVoteRemove } from "discord.js"; //client.on(Events.MessagePollVoteAdd, async (vote: any)の関数。現在後回しにしている。
import { config } from "dotenv";
import cron from "node-cron";
config();

startExpressServer();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
  await ensureTables();
  cron.schedule("0  12 * * *", async () => {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return console.error("❌ CHANNEL_ID が設定されていません");

    try {
      await createPoll(client, channelId); // ✅ 自動投票もcreatePollを使用
      console.log("✅ JST12:00 定時投票を送信しました");
    } catch (err) {
      console.error("❌ 自動投票エラー:", err);
    }
  });

  const commands = [
    {
      name: "poll",
      description: "本日のVALORANTの投票を手動で投稿します",
      options: [],
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("✅ スラッシュコマンド /poll を登録しました");
  } catch (error) {
    console.error("❌ コマンド登録に失敗しました:", error);
  }
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "poll") return;

  await interaction.reply({
    content: "✅ 手動で投票を作成しました！",
    ephemeral: true,
  });

  if (interaction.channelId) {
    try {
      await createPoll(client, interaction.channelId); // ✅ createPollで送信＋DB保存を共通化
      console.log("✅ 手動投票を作成しました");
    } catch (err) {
      console.error("❌ 手動投票エラー:", err);
    }
  }
});
//(vote: anyの型安全は後回しにします)
client.on(Events.MessagePollVoteAdd, async (vote: any) => {
  try {
    await pollRepository.saveVote({
      messageId: vote.message.id,
      userId: vote.user.id,
      optionId: vote.option.id,
    });
    console.log(`🗳️ ${vote.user.tag} が ${vote.option.text} に投票しました`);
  } catch (err) {
    console.error("❌ 投票保存エラー:", err);
  }
});
//(vote: anyの型安全は後回しにします)
client.on(Events.MessagePollVoteRemove, async (vote: any) => {
  try {
    await pollRepository.removeVote({
      messageId: vote.message.id,
      userId: vote.user.id,
    });
    console.log(
      `↩️ ${vote.user.tag} が ${vote.option.text} の投票を取り消しました`
    );
  } catch (err) {
    console.error("❌ 投票削除エラー:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
