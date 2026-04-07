import { pgTable, serial, varchar, numeric, integer, text, timestamp } from "drizzle-orm/pg-core";

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
