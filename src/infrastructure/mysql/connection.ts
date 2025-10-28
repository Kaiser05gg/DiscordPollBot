import "dotenv/config";
import mysql, { Pool } from "mysql2/promise";

export let pool: Pool | null = null;

export const getPool = async () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
};
