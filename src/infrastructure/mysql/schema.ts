import { getPool } from "./connection";

export const ensureTables = async () => {
  const db = await getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS polls (
      message_id BIGINT PRIMARY KEY,
      guild_id   BIGINT NOT NULL,
      channel_id BIGINT NOT NULL,
      question   VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      closed_at  DATETIME NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS poll_options (
      message_id  BIGINT NOT NULL,
      option_id   INT NOT NULL,
      option_label VARCHAR(255) NOT NULL,
      PRIMARY KEY (message_id, option_id),
      CONSTRAINT fk_options_poll
        FOREIGN KEY (message_id) REFERENCES polls(message_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      message_id BIGINT NOT NULL,
      user_id    BIGINT NOT NULL,
      option_id  INT NOT NULL,
      voted_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (message_id, user_id),
      CONSTRAINT fk_votes_poll
        FOREIGN KEY (message_id) REFERENCES polls(message_id)
        ON DELETE CASCADE,
      CONSTRAINT fk_votes_option
        FOREIGN KEY (message_id, option_id)
        REFERENCES poll_options(message_id, option_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("✅ MySQL tables ensured");
};
