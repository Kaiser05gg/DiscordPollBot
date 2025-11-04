import { Client, Interaction, AttachmentBuilder } from "discord.js";
import { createPoll } from "./createPoll.js";
import { generateGraph } from "../../analytics/pythonExecutor.js";
import fs from "fs";

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
      await interaction.deferReply();

      try {
        const month = new Date().toISOString().slice(0, 7);
        const result = await generateGraph(month);

        if (
          result.status === "success" &&
          result.file &&
          fs.existsSync(result.file)
        ) {
          const attachment = new AttachmentBuilder(result.file);
          await interaction.editReply({
            content: `📊 ${month} の投票結果グラフはこちらです！`,
            files: [attachment],
          });
        } else {
          const message =
            result.message && result.message.length > 1800
              ? result.message.slice(0, 1800) + "…(省略)"
              : result.message ?? "不明なエラー";
          await interaction.editReply(`⚠️ グラフ生成エラー:\n${message}`);
        }
      } catch (err) {
        console.error("❌ /graph 実行エラー:", err);

        try {
          if (interaction.deferred || interaction.replied) {
            await interaction.editReply(
              "❌ グラフ生成中にエラーが発生しました。"
            );
          } else {
            await interaction.followUp(
              "❌ グラフ生成中にエラーが発生しました。"
            );
          }
        } catch (editErr) {
          console.error("⚠️ 応答送信中にエラー:", editErr);
        }
      }
    }
  });
};
