// import { pool } from "./db/connection";

// async function testConnection() {
//   const [rows] = await pool.query("SELECT NOW() AS now");
//   console.log(rows);
// }

// testConnection();

// import { pool } from "./db/connection.js";

// (async () => {
//   try {
//     const [result] = await pool.query(
//       "INSERT INTO polls (message_id, guild_id, channel_id, question) VALUES (?, ?, ?, ?)",
//       [
//         1234567890123456n, // 仮のメッセージID（BIGINT）
//         9876543210987654n, // 仮のギルドID
//         1111111111111111n, // 仮のチャンネルID
//         "テスト投票：Bot→MySQL接続確認",
//       ]
//     );
//     console.log("✅ データ挿入成功:", result);
//   } catch (err) {
//     console.error("❌ エラー:", err);
//   } finally {
//     process.exit();
//   }
// })();
// import "dotenv/config";
// import "../infrastructure/firebase/firebase.js"; // ✅ Firestore初期化
// import { client } from "../infrastructure/discord/discordClient.js"; // ✅ パス修正
// import { createPoll } from "../application/usecases/createPoll.js"; // ✅ パス修正

// (async () => {
//   try {
//     console.log("🚀 Firestore・Discord Poll テスト開始");

//     // Discordログイン
//     await client.login(process.env.DISCORD_TOKEN);
//     console.log("✅ Discordログイン成功");

//     // ログイン完了を待つ
//     await new Promise((resolve) =>
//       client.once("ready", async () => {
//         console.log(`✅ Logged in as ${client.user?.tag}`);

//         // ✅ createPoll を直接実行（自動投票と同じ挙動）
//         await createPoll(client, process.env.CHANNEL_ID!);

//         console.log("🎯 Poll送信完了 → Firestoreを確認してください");
//         resolve(true);
//       })
//     );
//   } catch (err) {
//     console.error("❌ テスト実行エラー:", err);
//   }
// })();
