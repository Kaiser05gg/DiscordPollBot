// src/test/testPollInsert.ts
import { pollRepository } from "../infrastructure/mysql/pollRepository.js";
import { ensureTables } from "../infrastructure/mysql/schema.js";

const runTest = async () => {
  try {
    // ✅ テーブルが存在するか確認（なければ作成）
    await ensureTables();

    // ✅ ダミーデータを挿入
    await pollRepository.savePoll({
      messageId: "999999999999999999",
      guildId: "888888888888888888",
      channelId: "777777777777777777",
      question: "Clever Cloud接続テスト (from testPollInsert)",
    });

    console.log("✅ Pollデータを挿入しました！");
  } catch (err) {
    console.error("❌ テスト中にエラー:", err);
  } finally {
    process.exit(0);
  }
};

runTest();
