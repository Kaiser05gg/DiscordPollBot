import { Client } from "discord.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const createPoll = async (client: Client, channelId: string) => {
  const channel = await client.channels.fetch(channelId);
  if (!channel?.isTextBased())
    throw new Error("❌ 指定チャンネルがテキストチャンネルではありません");

  // DiscordにPollを送信
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
      duration: 720, // ✅ 12時間（分単位）
      allowMultiselect: false,
      layoutType: 1,
    },
  });

  console.log(`✅ 投票をDiscordに送信しました（ID: ${message.id}）`);

  // ✅ Firestoreに初期ドキュメントを保存
  try {
    await pollResultRepository.createPollResult({
      messageId: message.id,
      question: "本日の VALORANT",
    });

    console.log(
      `💾 Firestoreに新規投票ドキュメントを作成しました (ID: ${message.id})`
    );
    console.log(
      `🧾 Firestore登録確認: ${new Date().toLocaleString("ja-JP")} に ${
        message.id
      } を登録`
    );
  } catch (err) {
    console.error("❌ Firestore登録エラー:", err);
  }
  return message;
};
