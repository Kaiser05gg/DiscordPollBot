import { Client, Interaction } from "discord.js";
import { createPoll } from "./createPoll.js";
import { runPythonScript as generateGraph } from "../../infrastructure/python/pythonExecutor.js";

export const setupInteractionHandlers = (client: Client) => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "graph") {
      try {
        const monthOption = interaction.options.getInteger("month"); // /graph 10 のように指定できる
        const now = new Date();
        const targetMonth = monthOption
          ? `${now.getFullYear()}-${String(monthOption).padStart(2, "0")}`
          : now.toISOString().slice(0, 7);

        await interaction.reply(
          `📊 ${targetMonth} のグラフを生成中です。完了したらここに投稿します！`
        );

        (async () => {
          const result = await generateGraph(targetMonth);

          if (result.status === "success" && result.file) {
            await interaction.followUp({
              content: `✅ ${targetMonth} の投票結果グラフです！`,
              files: [{ attachment: result.file }],
            });
          } else {
            await interaction.followUp({
              content: `⚠️ グラフ生成に失敗しました。\n${
                result.message ?? "不明なエラー"
              }`,
            });
          }
        })();
      } catch (err) {
        console.error("❌ /graph 実行エラー:", err);
      }
    }
  });
};
