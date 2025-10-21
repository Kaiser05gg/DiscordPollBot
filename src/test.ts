import { pool } from "./db/connection";

async function testConnection() {
  const [rows] = await pool.query("SELECT NOW() AS now");
  console.log(rows);
}

testConnection();
