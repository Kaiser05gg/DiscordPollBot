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
        let replied = false; // ✅ 初期reply成否フラグ

        // 🔸 Discordに即応答（tryで安全に包む）
        try {
          await interaction.reply({
            content: "⏳ グラフ生成を開始しました。しばらくお待ちください…",
            ephemeral: false,
          });
          replied = true; // ✅ reply成功フラグON
        } catch (e) {
          console.warn("⚠️ 初期reply失敗（期限切れまたは二重呼び出し）:", e);
        }

        const monthOption = interaction.options.getInteger("month");
        const now = new Date();
        const targetMonth = monthOption
          ? `${now.getFullYear()}-${String(monthOption).padStart(2, "0")}`
          : now.toISOString().slice(0, 7);

        // --- Python呼び出し ---
        const result = await generateGraph(targetMonth);

        // --- 結果表示 ---
        if (result.status === "success" && result.file) {
          if (replied) {
            await interaction.editReply({
              content: `✅ ${targetMonth} の投票結果グラフです！`,
              files: [{ attachment: result.file }],
            });
          } else {
            // ✅ fallback: reply失敗時でもメッセージを返す
            await interaction.followUp({
              content: `✅ ${targetMonth} の投票結果グラフです！（遅延応答）`,
              files: [{ attachment: result.file }],
            });
          }
        } else {
          const message = result.message?.includes("No poll data found")
            ? `⚠️ ${targetMonth} のデータが存在しませんでした。`
            : `⚠️ グラフ生成に失敗しました。\n${
                result.message ?? "不明なエラー"
              }`;

          if (replied) {
            await interaction.editReply({ content: message });
          } else {
            await interaction.followUp({ content: message });
          }
        }
      } catch (err) {
        console.error("❌ /graph 実行エラー:", err);
        try {
          await interaction.followUp({
            content: "⚠️ グラフ生成中にエラーが発生しました。",
            ephemeral: true,
          });
        } catch (nested) {
          console.warn("⚠️ Discord応答失敗:", nested);
        }
      }
    }
  });
};
