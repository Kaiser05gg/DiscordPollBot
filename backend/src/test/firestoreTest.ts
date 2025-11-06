import "dotenv/config";
import { savePollResult } from "../infrastructure/firebase/savePollResult";

(async () => {
  const testData = {
    question: "JSTテスト: 本日のVALORANT",
    results: {
      "8〜9": 3,
      "9時": 1,
      不参加: 0,
    },
    voted_at: new Date(), // ← 現在時刻（JST補正される予定）
  };

  await savePollResult(testData);
  console.log("✅ Firestore保存テスト完了");
})();
