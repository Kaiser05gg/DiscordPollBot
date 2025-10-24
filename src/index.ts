/// <reference path="./types/discord.d.ts" />

import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Interaction,
  VoiceState,
} from "discord.js";
import { startExpressServer } from "./intetfaces/http/server.js";
import { ensureTables } from "./infrastructure/mysql/schema.js";
import { getPool, pool } from "./infrastructure/mysql/connection.js";
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
  const db = await getPool();
  cron.schedule("0  12 * * *", async () => {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return console.error("❌ CHANNEL_ID が設定されていません");

    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased())
      return console.error(
        "❌ 指定チャンネルがテキストチャンネルではありません"
      );

    // @ts-expect-error: 'poll' は型定義外だが Discord API で有効
    const message = await channel.send({
      poll: {
        question: { text: "本日の VALORANT" },
        answers: [
          { text: "〜8時" },
          { text: "8〜9" },
          { text: "9時" },
          { text: "10時半〜" },
          { text: "時間未定" },
          { text: "不参加" },
        ],
        duration: 60 * 0.2,
        allowMultiselect: false,
        layoutType: 1,
      },
    });
    console.log("✅ JST12:00 定時投票を送信しました");

    try {
      const [result] = await db.query(
        `INSERT INTO polls (message_id, guild_id, channel_id, question) VALUES (?, ?, ?, ?)`,
        [
          message.id,
          message.guild?.id || null,
          message.channel.id,
          "本日の VALORANT",
        ]
      );
      console.log("💾 投票データをDBに保存しました:", result);
    } catch (err) {
      console.error("❌ DB保存エラー:", err);
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
  const db = await getPool();

  await interaction.reply({
    content: "✅ 手動で投票を作成しました！",
    ephemeral: true,
  });

  if (interaction.channel?.isTextBased()) {
    // @ts-expect-error: 'poll' は型未定義だが Discord API で有効
    const message = await interaction.channel.send({
      poll: {
        question: { text: "本日の VALORANT" },
        answers: [
          { text: "〜8時" },
          { text: "8〜9" },
          { text: "9時" },
          { text: "10時半〜" },
          { text: "時間未定" },
          { text: "不参加" },
        ],
        duration: 60 * 0.2,
        allowMultiselect: false,
        layoutType: 1,
      },
    });
    try {
      await db.query(
        `INSERT INTO polls (message_id, guild_id, channel_id, question)
         VALUES (?, ?, ?, ?)`,
        [
          message.id,
          message.guild?.id || null,
          message.channel.id,
          "本日の VALORANT",
        ]
      );
      console.log("💾 手動投票データをDBに保存しました");
    } catch (err) {
      console.error("❌ 手動DB保存エラー:", err);
    }
  }
});
//(vote: anyの型安全は後回しにします)
client.on(Events.MessagePollVoteAdd, async (vote: any) => {
  const db = await getPool();
  try {
    await db.query(
      `INSERT INTO poll_votes (message_id, user_id, option_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         option_id = VALUES(option_id),
         voted_at = CURRENT_TIMESTAMP`,
      [vote.message.id, vote.user.id, vote.option.id]
    );
    console.log(`🗳️ ${vote.user.tag} が ${vote.option.text} に投票しました`);
  } catch (err) {
    console.error("❌ 投票保存エラー:", err);
  }
});
//(vote: anyの型安全は後回しにします)
client.on(Events.MessagePollVoteRemove, async (vote: any) => {
  const db = await getPool();
  try {
    await db.query(
      `DELETE FROM poll_votes
       WHERE message_id = ? AND user_id = ?`,
      [vote.message.id, vote.user.id]
    );
    console.log(
      `↩️ ${vote.user.tag} が ${vote.option.text} の投票を取り消しました`
    );
  } catch (err) {
    console.error("❌ 投票削除エラー:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
