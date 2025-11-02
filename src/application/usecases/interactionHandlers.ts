import { Client, Interaction } from "discord.js";
import { createPoll } from "./createPoll.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "poll") return;
    if (interaction.channelId) {
      try {
        await interaction.reply({
          content: "🗳️ 投票を作成中です...",
          ephemeral: true,
        });
        await createPoll(client, interaction.channelId);
        console.log("✅ 手動投票を作成しました");
        await interaction.editReply("✅ 投票を作成しました！");
      } catch (err) {
        console.error("❌ 手動投票エラー:", err);
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply("⚠️ 投票作成に失敗しました。");
        } else {
          await interaction.reply("⚠️ 投票作成に失敗しました。");
        }
      }
    }
  });
};
