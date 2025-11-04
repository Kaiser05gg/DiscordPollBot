import { Client, Interaction, AttachmentBuilder } from "discord.js";
import { createPoll } from "./createPoll.js";
import { runPythonScript as generateGraph } from "../../infrastructure/python/pythonExecutor.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "poll" && interaction.channelId) {
      try {
        await interaction.reply({
          content: "🗳️ 投票を作成中です...",
          ephemeral: true,
        });
        await createPoll(client, interaction.channelId);
        await interaction.editReply("✅ 投票を作成しました！");
      } catch (err) {
        console.error("❌ 手動投票エラー:", err);
        await interaction.editReply("⚠️ 投票作成に失敗しました。");
      }
    }

    if (interaction.commandName === "graph") {
      // ✅ まずは絶対に3秒以内に deferReply() を送る
      try {
        await interaction.deferReply({ ephemeral: false });
      } catch (err) {
        console.error("⚠️ deferReply失敗:", err);
        return; // ここで止めないと Unknown interaction 確定
      }

      // ✅ deferReply 成功後にのみ重い処理を実行
      try {
        const month = new Date().toISOString().slice(0, 7);
        console.log("📊 グラフ生成開始:", month);

        const result = await generateGraph(month);

        if (result.status === "success" && result.file) {
          await interaction.editReply({
            content: `📊 ${month} の投票結果グラフです！`,
            files: [{ attachment: result.file }],
          });
        } else {
          await interaction.editReply({
            content: `⚠️ グラフ生成に失敗しました。\n${
              result.message ?? "不明なエラー"
            }`,
          });
        }
      } catch (err) {
        console.error("❌ /graph 実行エラー:", err);

        // ✅ 二重応答を防ぐ
        if (interaction.deferred || interaction.replied) {
          try {
            await interaction.editReply(
              "❌ グラフ生成中にエラーが発生しました。"
            );
          } catch {
            console.warn(
              "⚠️ Interaction already acknowledged, skipping editReply."
            );
          }
        }
      }
    }
  });
};
