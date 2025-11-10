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
        // 🟢 deferReply は必ず最初に一回だけ呼ぶ
        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply();
        }

        const monthOption = interaction.options.getInteger("month");
        const now = new Date();
        const targetMonth = monthOption
          ? `${now.getFullYear()}-${String(monthOption).padStart(2, "0")}`
          : now.toISOString().slice(0, 7);

        await interaction.editReply(`📊 ${targetMonth} のグラフを生成中です…`);

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
          // ✅ ここがポイント：defer済みかどうかで切り替え
          if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
              content: "⚠️ グラフ生成中にエラーが発生しました。",
            });
          } else {
            await interaction.reply({
              content: "⚠️ グラフ生成に失敗しました（初期応答エラー）",
              ephemeral: true,
            });
          }
        } catch (nestedErr) {
          // 二重応答（40060）は握り潰す
          if (
            nestedErr instanceof Error &&
            "code" in nestedErr &&
            (nestedErr as any).code === 40060
          ) {
            console.warn("⚠️ 二重応答エラーを無視しました。");
          } else {
            console.warn("⚠️ Discord応答失敗:", nestedErr);
          }
        }
      }
    }
  });
};
