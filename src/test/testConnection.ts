import { getPool } from "../infrastructure/mysql/connection.js";

const test = async () => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT NOW()");
    console.log("✅ MySQL接続成功:", rows);
  } catch (err) {
    console.error("❌ MySQL接続エラー:", err);
  }
};
test();
