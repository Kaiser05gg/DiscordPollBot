import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
config(); // .envの読み込み
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});
client.on("messageCreate", async (message) => {
    if (message.content === "!poll") {
        if (!message.channel.isTextBased())
            return;
        await message.channel.send({
            content: "どれが好き？",
            poll: {
                question: {
                    text: "あなたの好きなレイアウトは？",
                },
                answers: [
                    { text: "カード形式" },
                    { text: "リスト形式" },
                    { text: "グリッド形式" },
                ],
                duration: 60 * 2, // 2時間
                allowMultiselect: false,
                layoutType: 1, // 任意の整数。例: 1 = カード型, 2 = リスト型など
            },
        });
    }
});
client.login(process.env.DISCORD_TOKEN);
