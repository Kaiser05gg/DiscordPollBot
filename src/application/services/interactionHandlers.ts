import { Client, Interaction } from "discord.js";
import { createPoll } from "./createPoll.js";
import { runPythonScript as generateGraph } from "../../infrastructure/python/pythonExecutor.js";
import { updatePollResultUseCase } from "../usecases/updatePollResultUseCase.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "poll") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const channelId = process.env.CHANNEL_ID!;
        await createPoll(client, channelId);

        await interaction.editReply("✅ 投票を作成しました！");
      } catch (err) {
        console.error("❌ /poll 実行エラー:", err);

        // deferReply済みなのでeditReplyだけ
        await interaction.editReply("⚠️ 投票の作成に失敗しました。");
      }
      return;
    }

    if (interaction.commandName === "update") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const channelId = process.env.CHANNEL_ID!;
        const channel = await client.channels.fetch(channelId);

        if (!channel || !channel.isTextBased()) {
          await interaction.editReply(
            "⚠️ 対象チャンネルがテキストではありません。"
          );
          return;
        }

        // Pollメッセージ検出
        const messages = await channel.messages.fetch({ limit: 10 });
        const pollMessage = messages.find((m) => m.poll);

        if (!pollMessage?.poll) {
          await interaction.editReply("⚠️ Pollが見つかりませんでした。");
          return;
        }

        const pollData = await updatePollResultUseCase(pollMessage.poll);

        console.log("📝 Poll解析結果:", pollData);

        await interaction.editReply(
          "✅ Poll結果を解析しました（保存は自動タスクが実施）！"
        );
      } catch (err) {
        console.error("❌ /update 実行エラー:", err);
        await interaction.editReply(`⚠️ 更新に失敗しました: ${err}`);
      }
      return;
    }

    if (interaction.commandName === "graph") {
      try {
        let replied = false;

        try {
          await interaction.reply({
            content: "⏳ グラフ生成を開始しました。しばらくお待ちください…",
            ephemeral: false,
          });
          replied = true;
        } catch (e) {
          console.warn("⚠️ 初期reply失敗:", e);
        }

        const monthOption = interaction.options.getInteger("month");
        const now = new Date();
        const targetMonth = monthOption
          ? `${now.getFullYear()}-${String(monthOption).padStart(2, "0")}`
          : now.toISOString().slice(0, 7);

        const result = await generateGraph(targetMonth);

        // グラフ成功
        if (result.status === "success" && result.file) {
          if (replied) {
            await interaction.editReply({
              content: `✅ ${targetMonth} の投票結果グラフです！`,
              files: [{ attachment: result.file }],
            });
          } else {
            await interaction.followUp({
              content: `⏳ グラフ完成！（遅延応答）`,
              files: [{ attachment: result.file }],
            });
          }
          return;
        }

        const msg = result.message?.includes("No poll data found")
          ? `⚠️ ${targetMonth} のデータはありませんでした。`
          : `⚠️ グラフ生成に失敗しました。\n${
              result.message ?? "不明なエラー"
            }`;

        if (replied) {
          await interaction.editReply({ content: msg });
        } else {
          await interaction.followUp({ content: msg });
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
      return;
    }
  });
};
