import { Client, Interaction } from "discord.js";
import { createPoll } from "./createPoll.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "poll") return;

    if (interaction.channelId) {
      try {
        await createPoll(client, interaction.channelId);
        console.log("✅ 手動投票を作成しました");
      } catch (err) {
        console.error("❌ 手動投票エラー:", err);
      }
    }
  });
};
