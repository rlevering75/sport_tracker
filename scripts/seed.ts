import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { players, seasonStats, discussions } from "../lib/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      team VARCHAR(10) NOT NULL,
      position VARCHAR(5) NOT NULL,
      jersey_number INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS season_stats (
      id SERIAL PRIMARY KEY,
      player_id INTEGER NOT NULL REFERENCES players(id),
      season VARCHAR(10) NOT NULL,
      games_played INTEGER,
      points_per_game NUMERIC(5,1),
      rebounds_per_game NUMERIC(5,1),
      assists_per_game NUMERIC(5,1),
      field_goal_pct NUMERIC(5,1),
      three_point_pct NUMERIC(5,1),
      free_throw_pct NUMERIC(5,1),
      steals_per_game NUMERIC(4,1),
      blocks_per_game NUMERIC(4,1),
      minutes_per_game NUMERIC(4,1),
      player_efficiency_rating NUMERIC(5,1),
      trend VARCHAR(4) DEFAULT 'up'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS discussions (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      author VARCHAR(80) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log("Seeding players...");

  const insertedPlayers = await db
    .insert(players)
    .values([
      { name: "LeBron James", team: "LAL", position: "SF", jerseyNumber: 23 },
      { name: "Stephen Curry", team: "GSW", position: "PG", jerseyNumber: 30 },
      { name: "Nikola Jokić", team: "DEN", position: "C", jerseyNumber: 15 },
      { name: "Luka Dončić", team: "DAL", position: "PG", jerseyNumber: 77 },
      { name: "Giannis Antetokounmpo", team: "MIL", position: "PF", jerseyNumber: 34 },
      { name: "Kevin Durant", team: "PHX", position: "SF", jerseyNumber: 35 },
      { name: "Joel Embiid", team: "PHI", position: "C", jerseyNumber: 11 },
      { name: "Jayson Tatum", team: "BOS", position: "SF", jerseyNumber: 0 },
      { name: "Shai Gilgeous-Alexander", team: "OKC", position: "PG", jerseyNumber: 2 },
      { name: "Anthony Edwards", team: "MIN", position: "SG", jerseyNumber: 5 },
    ])
    .returning();

  console.log(`Inserted ${insertedPlayers.length} players`);

  const statsData = [
    { pts: 25.7, reb: 7.3, ast: 8.3, fg: 50.4, three: 40.8, ft: 75.0, stl: 1.3, blk: 0.5, min: 35.3, per: 24.5, trend: "up" },
    { pts: 26.4, reb: 4.5, ast: 5.1, fg: 45.2, three: 40.8, ft: 92.3, stl: 0.7, blk: 0.4, min: 32.7, per: 23.1, trend: "up" },
    { pts: 26.4, reb: 12.4, ast: 9.0, fg: 58.3, three: 35.9, ft: 81.7, stl: 1.4, blk: 0.9, min: 33.6, per: 31.3, trend: "up" },
    { pts: 33.9, reb: 9.2, ast: 9.8, fg: 47.5, three: 38.2, ft: 78.7, stl: 1.4, blk: 0.5, min: 37.5, per: 30.8, trend: "down" },
    { pts: 30.4, reb: 11.5, ast: 6.5, fg: 61.0, three: 27.4, ft: 65.4, stl: 1.2, blk: 1.1, min: 35.2, per: 29.0, trend: "up" },
    { pts: 27.1, reb: 6.6, ast: 5.0, fg: 52.5, three: 41.3, ft: 85.5, stl: 0.7, blk: 1.1, min: 36.6, per: 25.7, trend: "up" },
    { pts: 34.7, reb: 11.0, ast: 5.6, fg: 52.8, three: 33.5, ft: 85.9, stl: 1.2, blk: 1.7, min: 34.6, per: 31.6, trend: "down" },
    { pts: 26.9, reb: 8.1, ast: 4.9, fg: 46.6, three: 37.6, ft: 83.4, stl: 1.0, blk: 0.6, min: 36.0, per: 21.8, trend: "up" },
    { pts: 30.1, reb: 5.5, ast: 6.2, fg: 53.5, three: 35.3, ft: 87.4, stl: 2.0, blk: 1.1, min: 33.7, per: 28.2, trend: "up" },
    { pts: 25.9, reb: 5.4, ast: 5.1, fg: 46.1, three: 36.9, ft: 83.7, stl: 1.5, blk: 0.6, min: 34.9, per: 21.6, trend: "up" },
  ];

  const statsInserts = insertedPlayers.map((p, i) => ({
    playerId: p.id,
    season: "2023-24",
    gamesPlayed: Math.floor(Math.random() * 20) + 60,
    pointsPerGame: String(statsData[i].pts),
    reboundsPerGame: String(statsData[i].reb),
    assistsPerGame: String(statsData[i].ast),
    fieldGoalPct: String(statsData[i].fg),
    threePointPct: String(statsData[i].three),
    freeThrowPct: String(statsData[i].ft),
    stealsPerGame: String(statsData[i].stl),
    blocksPerGame: String(statsData[i].blk),
    minutesPerGame: String(statsData[i].min),
    playerEfficiencyRating: String(statsData[i].per),
    trend: statsData[i].trend,
  }));

  await db.insert(seasonStats).values(statsInserts);
  console.log("Inserted season stats");

  await db.insert(discussions).values([
    { playerId: insertedPlayers[2].id, author: "HoopsHead99", body: "Jokić is the most complete player in the league. Three MVPs speaks for itself." },
    { playerId: insertedPlayers[3].id, author: "DallasForever", body: "Luka's court vision is unreal. 33 PPG at his age is historic." },
    { playerId: insertedPlayers[4].id, author: "BucksIn6", body: "Giannis's FT% improvement is the biggest key to a championship run." },
  ]);
  console.log("Inserted discussions");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
