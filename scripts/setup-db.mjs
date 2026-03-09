import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function setup() {
  console.log("Enabling RLS...");
  await sql`ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE user_completed_tracks ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE user_history ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY`;

  console.log("Creating RLS policies...");
  const tables = ["user_settings", "user_favorites", "user_completed_tracks", "user_history", "user_streaks"];
  for (const t of tables) {
    try { await sql(`CREATE POLICY ${t}_all ON ${t} FOR ALL USING (true)`); } catch { /* already exists */ }
  }

  console.log("Database setup complete!");
}

setup().catch(console.error);
