import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const sql = neon(process.env.VITE_DATABASE_URL!);

function getUserId(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  return auth.replace("Bearer ", "");
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  (req as any).userId = userId;
  next();
}

// --- Settings ---
app.get("/api/settings", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const rows = await sql`SELECT * FROM user_settings WHERE user_id = ${userId}`;
  res.json(rows[0] || { volume: 1, last_track_id: null });
});

app.put("/api/settings", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { volume, last_track_id } = req.body;
  await sql`INSERT INTO user_settings (user_id, volume, last_track_id, updated_at)
    VALUES (${userId}, ${volume ?? 1}, ${last_track_id}, now())
    ON CONFLICT (user_id) DO UPDATE SET
      volume = COALESCE(${volume}, user_settings.volume),
      last_track_id = COALESCE(${last_track_id}, user_settings.last_track_id),
      updated_at = now()`;
  res.json({ ok: true });
});

// --- Favorites ---
app.get("/api/favorites", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const rows = await sql`SELECT track_id FROM user_favorites WHERE user_id = ${userId} ORDER BY created_at DESC`;
  res.json(rows.map((r: any) => r.track_id));
});

app.post("/api/favorites", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { track_id } = req.body;
  await sql`INSERT INTO user_favorites (user_id, track_id) VALUES (${userId}, ${track_id}) ON CONFLICT DO NOTHING`;
  res.json({ ok: true });
});

app.delete("/api/favorites/:trackId", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  await sql`DELETE FROM user_favorites WHERE user_id = ${userId} AND track_id = ${req.params.trackId}`;
  res.json({ ok: true });
});

// --- Completed tracks ---
app.get("/api/completed", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const rows = await sql`SELECT track_id FROM user_completed_tracks WHERE user_id = ${userId}`;
  res.json(rows.map((r: any) => r.track_id));
});

app.post("/api/completed", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { track_id } = req.body;
  await sql`INSERT INTO user_completed_tracks (user_id, track_id) VALUES (${userId}, ${track_id}) ON CONFLICT DO NOTHING`;
  res.json({ ok: true });
});

// --- History ---
app.get("/api/history", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const rows = await sql`SELECT track_id, EXTRACT(EPOCH FROM played_at) * 1000 AS timestamp FROM user_history WHERE user_id = ${userId} ORDER BY played_at DESC LIMIT 50`;
  res.json(rows.map((r: any) => ({ trackId: r.track_id, timestamp: Number(r.timestamp) })));
});

app.post("/api/history", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { track_id } = req.body;
  await sql`INSERT INTO user_history (user_id, track_id) VALUES (${userId}, ${track_id})`;
  const count = await sql`SELECT COUNT(*) as c FROM user_history WHERE user_id = ${userId}`;
  if (Number(count[0].c) > 50) {
    await sql`DELETE FROM user_history WHERE id IN (SELECT id FROM user_history WHERE user_id = ${userId} ORDER BY played_at ASC LIMIT ${Number(count[0].c) - 50})`;
  }
  res.json({ ok: true });
});

// --- Streaks ---
app.get("/api/streaks", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const rows = await sql`SELECT current_streak, longest_streak, last_study_date, total_days, study_dates FROM user_streaks WHERE user_id = ${userId}`;
  if (rows.length === 0) {
    res.json({ currentStreak: 0, longestStreak: 0, lastStudyDate: null, totalDays: 0, studyDates: [] });
  } else {
    const r = rows[0] as any;
    res.json({
      currentStreak: r.current_streak,
      longestStreak: r.longest_streak,
      lastStudyDate: r.last_study_date,
      totalDays: r.total_days,
      studyDates: r.study_dates || [],
    });
  }
});

app.put("/api/streaks", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { currentStreak, longestStreak, lastStudyDate, totalDays, studyDates } = req.body;
  await sql`INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_study_date, total_days, study_dates, updated_at)
    VALUES (${userId}, ${currentStreak}, ${longestStreak}, ${lastStudyDate}, ${totalDays}, ${studyDates}, now())
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = ${currentStreak},
      longest_streak = ${longestStreak},
      last_study_date = ${lastStudyDate},
      total_days = ${totalDays},
      study_dates = ${studyDates},
      updated_at = now()`;
  res.json({ ok: true });
});

// --- Reset all user data ---
app.delete("/api/reset", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  await sql`DELETE FROM user_settings WHERE user_id = ${userId}`;
  await sql`DELETE FROM user_favorites WHERE user_id = ${userId}`;
  await sql`DELETE FROM user_completed_tracks WHERE user_id = ${userId}`;
  await sql`DELETE FROM user_history WHERE user_id = ${userId}`;
  await sql`DELETE FROM user_streaks WHERE user_id = ${userId}`;
  res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
