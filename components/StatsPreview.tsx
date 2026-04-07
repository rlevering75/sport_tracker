import { db } from "@/lib/db";
import { players, seasonStats } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

async function getTopPlayers() {
  try {
    return await db
      .select({
        id: players.id,
        name: players.name,
        team: players.team,
        position: players.position,
        pts: seasonStats.pointsPerGame,
        reb: seasonStats.reboundsPerGame,
        ast: seasonStats.assistsPerGame,
        fg: seasonStats.fieldGoalPct,
        trend: seasonStats.trend,
      })
      .from(players)
      .innerJoin(seasonStats, eq(players.id, seasonStats.playerId))
      .orderBy(desc(seasonStats.pointsPerGame))
      .limit(7);
  } catch {
    return null;
  }
}

// Fallback static data shown before DB is seeded
const FALLBACK = [
  { id: 1, name: "Joel Embiid", team: "PHI", position: "C", pts: "34.7", reb: "11.0", ast: "5.6", fg: "52.8", trend: "down" },
  { id: 2, name: "Luka Dončić", team: "DAL", position: "PG", pts: "33.9", reb: "9.2", ast: "9.8", fg: "47.5", trend: "down" },
  { id: 3, name: "Giannis Antetokounmpo", team: "MIL", position: "PF", pts: "30.4", reb: "11.5", ast: "6.5", fg: "61.0", trend: "up" },
  { id: 4, name: "Shai Gilgeous-Alexander", team: "OKC", position: "PG", pts: "30.1", reb: "5.5", ast: "6.2", fg: "53.5", trend: "up" },
  { id: 5, name: "Stephen Curry", team: "GSW", position: "PG", pts: "26.4", reb: "4.5", ast: "5.1", fg: "45.2", trend: "up" },
];

export default async function StatsPreview() {
  const data = await getTopPlayers();
  const rows = (data && data.length > 0 ? data : FALLBACK) as typeof FALLBACK;

  return (
    <section id="stats" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-red-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Live Data
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Season Leaders Preview
          </h2>
          <p className="text-slate-400 text-lg">
            Top scorers from the 2023–24 season. Explore full stats on every
            player.
          </p>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
            <span className="col-span-3">Player</span>
            <span className="text-center">PTS</span>
            <span className="text-center">REB</span>
            <span className="text-center">AST</span>
            <span className="text-center">FG%</span>
            <span className="text-center">Trend</span>
          </div>

          {rows.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-8 gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer ${
                i !== rows.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {p.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{p.name}</p>
                  <p className="text-slate-500 text-xs">
                    {p.team} · {p.position}
                  </p>
                </div>
              </div>
              <span className="text-center text-white font-semibold self-center">
                {p.pts}
              </span>
              <span className="text-center text-slate-300 self-center">
                {p.reb}
              </span>
              <span className="text-center text-slate-300 self-center">
                {p.ast}
              </span>
              <span className="text-center text-slate-300 self-center">
                {p.fg}%
              </span>
              <span className="text-center self-center">
                {p.trend === "up" ? (
                  <span className="text-green-400 text-lg">↑</span>
                ) : (
                  <span className="text-red-400 text-lg">↓</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-105">
            View All Players →
          </button>
        </div>
      </div>
    </section>
  );
}
