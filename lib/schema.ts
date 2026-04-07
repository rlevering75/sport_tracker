import { pgTable, serial, varchar, numeric, integer, text, timestamp } from "drizzle-orm/pg-core";

// ─── NBA All-Star Career Per-100 Possession Leaderboard ───────────────────────
export const allstarPer100 = pgTable("allstar_per100", {
  id:               serial("id").primaryKey(),
  rank:             integer("rank").notNull(),
  name:             varchar("name", { length: 120 }).notNull(),
  yearsActive:      varchar("years_active", { length: 20 }),
  allstarSeasons:   integer("allstar_seasons"),
  asYears:          text("as_years"),              // comma-separated list
  gamesPlayed:      integer("games_played"),

  // Per-100 Offense
  pts100:           numeric("pts_100",  { precision: 5, scale: 1 }),
  ast100:           numeric("ast_100",  { precision: 5, scale: 1 }),
  reb100:           numeric("reb_100",  { precision: 5, scale: 1 }),
  orb100:           numeric("orb_100",  { precision: 5, scale: 1 }),
  drb100:           numeric("drb_100",  { precision: 5, scale: 1 }),
  threepm100:       numeric("threepm_100", { precision: 5, scale: 1 }),
  fgPct:            numeric("fg_pct",   { precision: 5, scale: 1 }),
  tov100:           numeric("tov_100",  { precision: 5, scale: 1 }),

  // Per-100 Defense
  stl100:           numeric("stl_100",  { precision: 5, scale: 1 }),
  blk100:           numeric("blk_100",  { precision: 5, scale: 1 }),

  // Points Created per 100 (PTS + AST*1.5)
  ptsCreated100:    numeric("pts_created_100", { precision: 6, scale: 1 }),

  // Advanced
  per:              numeric("per",   { precision: 5, scale: 1 }),
  tsPct:            numeric("ts_pct", { precision: 5, scale: 1 }),
  ws:               numeric("ws",    { precision: 6, scale: 1 }),
  bpm:              numeric("bpm",   { precision: 5, scale: 1 }),
  obpm:             numeric("obpm",  { precision: 5, scale: 1 }),
  dbpm:             numeric("dbpm",  { precision: 5, scale: 1 }),
  vorp:             numeric("vorp",  { precision: 6, scale: 1 }),

  // Awards
  mvps:             integer("mvps").default(0),
  finalsMvps:       integer("finals_mvps").default(0),
  championships:    integer("championships").default(0),
  allNbaTotal:      integer("all_nba_total").default(0),
  allNba1st:        integer("all_nba_1st").default(0),
  allNba2nd:        integer("all_nba_2nd").default(0),
  allNba3rd:        integer("all_nba_3rd").default(0),
  allDef1st:        integer("all_def_1st").default(0),
  allDef2nd:        integer("all_def_2nd").default(0),
  dpoy:             integer("dpoy").default(0),

  updatedAt:        timestamp("updated_at").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  team: varchar("team", { length: 10 }).notNull(),
  position: varchar("position", { length: 5 }).notNull(),
  jerseyNumber: integer("jersey_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seasonStats = pgTable("season_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id),
  season: varchar("season", { length: 10 }).notNull(), // e.g. "2023-24"
  gamesPlayed: integer("games_played"),
  pointsPerGame: numeric("points_per_game", { precision: 5, scale: 1 }),
  reboundsPerGame: numeric("rebounds_per_game", { precision: 5, scale: 1 }),
  assistsPerGame: numeric("assists_per_game", { precision: 5, scale: 1 }),
  fieldGoalPct: numeric("field_goal_pct", { precision: 5, scale: 1 }),
  threePointPct: numeric("three_point_pct", { precision: 5, scale: 1 }),
  freeThrowPct: numeric("free_throw_pct", { precision: 5, scale: 1 }),
  stealsPerGame: numeric("steals_per_game", { precision: 4, scale: 1 }),
  blocksPerGame: numeric("blocks_per_game", { precision: 4, scale: 1 }),
  minutesPerGame: numeric("minutes_per_game", { precision: 4, scale: 1 }),
  playerEfficiencyRating: numeric("player_efficiency_rating", { precision: 5, scale: 1 }),
  trend: varchar("trend", { length: 4 }).default("up"), // "up" | "down"
});

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  author: varchar("author", { length: 80 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
