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
