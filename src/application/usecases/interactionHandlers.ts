import { Client, Interaction } from "discord.js";
import { createPoll } from "./createPoll.js";
import { runPythonScript as generateGraph } from "../../infrastructure/python/pythonExecutor.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    ///pollコマンド
    if (interaction.commandName === "poll") {
      try {
        //3秒ルール対策
        await interaction.deferReply({ ephemeral: true });

        const channelId = process.env.CHANNEL_ID!;
        await createPoll(client, channelId);

        await interaction.editReply("✅ 投票を作成しました！");
      } catch (err) {
        console.error("❌ /poll 実行エラー:", err);
        await interaction.editReply("⚠️ 投票の作成に失敗しました。");
      }
    }

    if (interaction.commandName === "graph") {
      try {
        // 🔸 Discordへ即時応答（3秒ルール完全回避）
        await interaction.reply({
          content: "⏳ グラフ生成を開始しました。しばらくお待ちください…",
          ephemeral: false,
        });

        const monthOption = interaction.options.getInteger("month");
        const now = new Date();
        const targetMonth = monthOption
          ? `${now.getFullYear()}-${String(monthOption).padStart(2, "0")}`
          : now.toISOString().slice(0, 7);

        const result = await generateGraph(targetMonth);

        if (result.status === "success" && result.file) {
          await interaction.editReply({
            content: `✅ ${targetMonth} の投票結果グラフです！`,
            files: [{ attachment: result.file }],
          });
          return;
        }

        const message = result.message?.includes("No poll data found")
          ? `⚠️ ${targetMonth} のデータが存在しませんでした。`
          : `⚠️ グラフ生成に失敗しました。\n${
              result.message ?? "不明なエラー"
            }`;
        await interaction.editReply({ content: message });
      } catch (err) {
        console.error("❌ /graph 実行エラー:", err);
        try {
          await interaction.editReply({
            content: "⚠️ グラフ生成中にエラーが発生しました。",
          });
        } catch (nestedErr) {
          console.warn("⚠️ Discord応答失敗:", nestedErr);
        }
      }
    }
  });
};
