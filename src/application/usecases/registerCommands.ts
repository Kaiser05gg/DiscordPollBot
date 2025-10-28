import { REST, Routes, Client } from "discord.js";

export const registerCommands = async (client: Client) => {
  const commands = [
    {
      name: "poll",
      description: "本日のVALORANTの投票を手動で投稿します",
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("✅ スラッシュコマンド /poll を登録しました");
  } catch (err) {
    console.error("❌ コマンド登録エラー:", err);
  }
};
