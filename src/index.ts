import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Interaction
} from "discord.js";
import { config } from "dotenv";
import cron from "node-cron";
import express from "express";
config();


const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Express is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
  cron.schedule("0  12 * * *", async () => {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return console.error("❌ CHANNEL_ID が設定されていません");

    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased()) return console.error("❌ 指定チャンネルがテキストチャンネルではありません");

    // @ts-expect-error: 'poll' は型定義外だが Discord API で有効
    await channel.send({
      poll: {
        question: { text: "本日の VALORANT" },
        answers: [
          { text: "〜8時" },
          { text: "8〜9" },
          { text: "9時" },
          { text: "10〜" },
          { text: "時間未定" },
          { text: "不参加" }
        ],
        duration: 60 * 0.2,
        allowMultiselect: false,
        layoutType: 1
      }
    });
    console.log("✅ JST12:00 定時投票を送信しました");
  });

  const commands = [
    {
      name: "poll",
      description: "本日のVALORANTの投票を手動で投稿します",
      options: []
    }
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );
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
    ephemeral: true
  });

  if (interaction.channel?.isTextBased()) {
    // @ts-expect-error: 'poll' は型未定義だが Discord API で有効
    await interaction.channel.send({
      poll: {
        question: { text: "本日の VALORANT" },
        answers: [
          { text: "〜8時" },
          { text: "8〜9" },
          { text: "9時" },
          { text: "10〜" },
          { text: "時間未定" },
          { text: "不参加" }
        ],
        duration: 60 * 0.2,
        allowMultiselect: false,
        layoutType: 1
      }
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`✅ ${client.user?.tag} としてログインしました`);
});
