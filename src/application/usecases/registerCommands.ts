import "dotenv/config";
import { REST, Routes, Client } from "discord.js";

export const registerCommands = async (client: Client) => {
  const commands = [
    {
      name: "poll",
      description: "本日のVALORANTの投票を手動で投稿します",
    },
    {
      name: "graph",
      description: "指定した月の投票結果をグラフ化します",
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    // 🌟 ギルド限定登録に変更！
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        "856217369260982275" // ← テストサーバーID
      ),
      { body: commands }
    );
    console.log(
      "✅ スラッシュコマンド /poll・/graph を登録しました（ギルド限定）"
    );
  } catch (err) {
    console.error("❌ コマンド登録エラー:", err);
  }
};

// 直接実行時にも同じ処理
if (process.argv[1].includes("registerCommands.ts")) {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
  const commands = [
    {
      name: "poll",
      description: "本日のVALORANTの投票を手動で投稿します",
    },
    {
      name: "graph",
      description: "指定した月の投票結果をグラフ化します",
    },
  ];

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        "856217369260982275" // ← 同じギルドIDを指定
      ),
      { body: commands }
    );
    console.log(
      "✅ スラッシュコマンド /poll・/graph を登録しました（ギルド限定）"
    );
  } catch (err) {
    console.error("❌ コマンド登録エラー:", err);
  }
}
