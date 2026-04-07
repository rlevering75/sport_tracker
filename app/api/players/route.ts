import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { players, seasonStats } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: players.id,
        name: players.name,
        team: players.team,
        position: players.position,
        jerseyNumber: players.jerseyNumber,
        season: seasonStats.season,
        gamesPlayed: seasonStats.gamesPlayed,
        pts: seasonStats.pointsPerGame,
        reb: seasonStats.reboundsPerGame,
        ast: seasonStats.assistsPerGame,
        fg: seasonStats.fieldGoalPct,
        threePct: seasonStats.threePointPct,
        ftPct: seasonStats.freeThrowPct,
        stl: seasonStats.stealsPerGame,
        blk: seasonStats.blocksPerGame,
        min: seasonStats.minutesPerGame,
        per: seasonStats.playerEfficiencyRating,
        trend: seasonStats.trend,
      })
      .from(players)
      .innerJoin(seasonStats, eq(players.id, seasonStats.playerId))
      .orderBy(seasonStats.pointsPerGame);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}
