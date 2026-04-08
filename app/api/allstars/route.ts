import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { allstarPer100 } from "@/lib/schema";
import { asc, desc, ilike, sql } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "50"), 636);
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const search = searchParams.get("q") ?? "";
    const sort   = searchParams.get("sort") ?? "pts_created_100";
    const order  = searchParams.get("order") ?? "desc";

    const allowedSorts = new Set([
      "rank", "pts_created_100", "pts_100", "ast_100", "reb_100",
      "stl_100", "blk_100", "bpm", "dbpm", "per", "ws", "vorp",
      "mvps", "finals_mvps", "dpoy", "championships", "all_nba_total", "ts_pct",
    ]);
    const sortCol = allowedSorts.has(sort) ? sort : "pts_created_100";
    const sortDir = order === "asc" ? asc : desc;

    const col = sql.raw(`"${sortCol}"`);

    const rows = await db
      .select()
      .from(allstarPer100)
      .where(search ? ilike(allstarPer100.name, `%${search}%`) : undefined)
      .orderBy(sortDir(col as any))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(allstarPer100)
      .where(search ? ilike(allstarPer100.name, `%${search}%`) : undefined);

    return NextResponse.json({ total: Number(count), rows });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch allstars" }, { status: 500 });
  }
}
