import "dotenv/config";
import { REST, Routes, Client } from "discord.js";

const TEST_GUILD_ID = "856217369260982275";

const commands = [
  {
    name: "poll",
    description: "本日のVALORANTの投票を手動で投稿します",
  },
  {
    name: "graph",
    description: "指定した月の投票結果をグラフ化します",
    options: [
      {
        name: "month",
        description: "表示したい月",
        type: 4, // INTEGER型（Discordの定義では4が整数）
        required: false,
      },
    ],
  },
];

export const registerCommands = async (client?: Client) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, TEST_GUILD_ID),
      { body: commands }
    );
    console.log(
      "✅ スラッシュコマンド /poll・/graph を登録しました（ギルド限定）"
    );
  } catch (err) {
    console.error("❌ コマンド登録エラー:", err);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  registerCommands();
}
