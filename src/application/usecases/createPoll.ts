// src/application/usecases/createPoll.ts
import { Client } from "discord.js";
import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js"; // ✅ 変更
import { savePollResultUseCase } from "./savePollResultUseCase.js"; // ✅ 投票データ保存用UseCase

export const createPoll = async (client: Client, channelId: string) => {
  const channel = await client.channels.fetch(channelId);
  if (!channel?.isTextBased())
    throw new Error("❌ 指定チャンネルがテキストチャンネルではありません");

  // ✅ DiscordにPollを送信
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

  // ✅ Firestoreに初期レコードを保存
  await savePollResultUseCase({
    question: "本日の VALORANT",
    results: {}, // ← まだ投票結果なし
    top_option: null,
    voted_at: new Date(),
  });

  console.log("💾 Firestoreに初期投票データを保存しました");
};
