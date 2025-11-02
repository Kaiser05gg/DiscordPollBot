import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} from "discord.js";
import { generateGraphUseCase } from "../../../application/usecases/generateGraphUseCase.js";

export const graphCommand = {
  data: new SlashCommandBuilder()
    .setName("graph")
    .setDescription("指定した月の投票結果をグラフ化します")
    .addStringOption((option) =>
      option.setName("month").setDescription("例: 2025-11").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const month = interaction.options.getString("month", true);
    await interaction.deferReply();

    try {
      const result = await generateGraphUseCase(month);

      if (result.status === "success") {
        const file = new AttachmentBuilder(result.file);
        await interaction.editReply({
          content: `📊 ${month} の投票結果グラフです！`,
          files: [file],
        });
      } else {
        await interaction.editReply(
          `❌ グラフ生成に失敗しました: ${result.message}`
        );
      }
    } catch (err) {
      console.error("❌ /graph 実行エラー:", err);
      await interaction.editReply("⚠️ グラフ生成中にエラーが発生しました。");
    }
  },
};
