import { Client } from "discord.js";
import { pollRepository } from "../../infrastructure/mysql/pollRepository.js";

export const createPoll = async (client: Client, channelId: string) => {
  const channel = await client.channels.fetch(channelId);
  if (!channel?.isTextBased())
    throw new Error("❌ 指定チャンネルがテキストチャンネルではありません");

  const message = await channel.send({
    poll: {
      question: { text: "本日の VALORANT" },
      answers: [
        { text: "〜8時" },
        { text: "8〜9" },
        { text: "9時" },
        { text: "10時半〜" },
        { text: "時間未定" },
        { text: "不参加" },
      ],
      duration: 60 * 0.2,
      allowMultiselect: false,
      layoutType: 1,
    },
  });

  console.log("✅ 投票をDiscordに送信しました");

  await pollRepository.savePoll({
    messageId: message.id,
    guildId: message.guild?.id || null,
    channelId: message.channel.id,
    question: "本日の VALORANT",
  });

  console.log("💾 投票データをDBに保存しました");
};
