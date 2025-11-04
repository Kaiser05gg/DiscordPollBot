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
      try {
        await interaction.deferReply({ ephemeral: false });

        const month = new Date().toISOString().slice(0, 7);
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

        if (interaction.deferred || interaction.replied) {
          console.warn("⚠️ Interaction already acknowledged, skipping reply.");
          return;
        }

        await interaction.reply({
          content: "❌ グラフ生成中にエラーが発生しました。",
          ephemeral: true,
        });
      }
    }
  });
};
