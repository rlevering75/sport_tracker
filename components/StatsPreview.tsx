import { db } from "@/lib/db";
import { allstarPer100 } from "@/lib/schema";
import { asc } from "drizzle-orm";

async function getTopAllStars() {
  try {
    return await db
      .select({
        rank:          allstarPer100.rank,
        name:          allstarPer100.name,
        yearsActive:   allstarPer100.yearsActive,
        allstarSeasons: allstarPer100.allstarSeasons,
        pts100:        allstarPer100.pts100,
        ast100:        allstarPer100.ast100,
        reb100:        allstarPer100.reb100,
        stl100:        allstarPer100.stl100,
        blk100:        allstarPer100.blk100,
        ptsCreated100: allstarPer100.ptsCreated100,
        bpm:           allstarPer100.bpm,
        dbpm:          allstarPer100.dbpm,
        mvps:          allstarPer100.mvps,
        championships: allstarPer100.championships,
        allNbaTotal:   allstarPer100.allNbaTotal,
        dpoy:          allstarPer100.dpoy,
      })
      .from(allstarPer100)
      .orderBy(asc(allstarPer100.rank))
      .limit(10);
  } catch {
    return null;
  }
}

// Fallback while DB seeds
const FALLBACK = [
  { rank: 1,  name: "Michael Jordan",       yearsActive: "1984-2003", allstarSeasons: 14, pts100: 37.9, ast100: 6.1, reb100: 8.0,  stl100: 3.4, blk100: 1.5, ptsCreated100: 47.1, bpm: 9.2,  dbpm: 3.0, mvps: 5, championships: 6, allNbaTotal: 11, dpoy: 1 },
  { rank: 2,  name: "LeBron James",         yearsActive: "2003-",     allstarSeasons: 21, pts100: 30.1, ast100: 9.3, reb100: 9.4,  stl100: 1.7, blk100: 0.9, ptsCreated100: 44.0, bpm: 9.0,  dbpm: 1.6, mvps: 4, championships: 4, allNbaTotal: 20, dpoy: 0 },
  { rank: 3,  name: "Magic Johnson",        yearsActive: "1979-1996", allstarSeasons: 12, pts100: 25.8, ast100: 13.4, reb100: 8.7, stl100: 2.3, blk100: 0.4, ptsCreated100: 45.9, bpm: 7.5,  dbpm: 0.5, mvps: 3, championships: 5, allNbaTotal: 10, dpoy: 0 },
  { rank: 4,  name: "Wilt Chamberlain",     yearsActive: "1959-1973", allstarSeasons: 13, pts100: 38.4, ast100: 5.4, reb100: 26.5, stl100: 0.0, blk100: 0.0, ptsCreated100: 46.5, bpm: 10.7, dbpm: 5.0, mvps: 4, championships: 2, allNbaTotal: 7,  dpoy: 0 },
  { rank: 5,  name: "Oscar Robertson",      yearsActive: "1960-1974", allstarSeasons: 12, pts100: 31.3, ast100: 11.2, reb100: 9.5, stl100: 0.0, blk100: 0.0, ptsCreated100: 48.1, bpm: 8.2,  dbpm: 0.7, mvps: 1, championships: 1, allNbaTotal: 12, dpoy: 0 },
  { rank: 6,  name: "Nikola Jokić",         yearsActive: "2015-",     allstarSeasons: 6,  pts100: 28.0, ast100: 11.1, reb100: 15.4, stl100: 1.7, blk100: 0.9, ptsCreated100: 44.7, bpm: 11.3, dbpm: 1.7, mvps: 3, championships: 1, allNbaTotal: 6,  dpoy: 0 },
  { rank: 7,  name: "Stephen Curry",        yearsActive: "2009-",     allstarSeasons: 10, pts100: 35.8, ast100: 7.8, reb100: 5.7,  stl100: 1.7, blk100: 0.3, ptsCreated100: 47.5, bpm: 7.4,  dbpm: 0.4, mvps: 2, championships: 4, allNbaTotal: 8,  dpoy: 0 },
  { rank: 8,  name: "Kevin Durant",         yearsActive: "2007-",     allstarSeasons: 14, pts100: 35.2, ast100: 5.5, reb100: 8.2,  stl100: 1.1, blk100: 1.5, ptsCreated100: 43.5, bpm: 8.4,  dbpm: 0.6, mvps: 1, championships: 2, allNbaTotal: 13, dpoy: 0 },
  { rank: 9,  name: "Larry Bird",           yearsActive: "1979-1992", allstarSeasons: 12, pts100: 31.5, ast100: 7.7, reb100: 12.1, stl100: 2.1, blk100: 0.9, ptsCreated100: 43.1, bpm: 8.4,  dbpm: 0.9, mvps: 3, championships: 3, allNbaTotal: 9,  dpoy: 0 },
  { rank: 10, name: "Kareem Abdul-Jabbar",  yearsActive: "1969-1989", allstarSeasons: 19, pts100: 29.5, ast100: 4.2, reb100: 14.0, stl100: 0.9, blk100: 3.4, ptsCreated100: 35.8, bpm: 9.0,  dbpm: 3.7, mvps: 6, championships: 6, allNbaTotal: 15, dpoy: 0 },
];

type Row = {
  rank: number | null;
  name: string;
  yearsActive: string | null;
  allstarSeasons: number | null;
  pts100: string | null;
  ast100: string | null;
  reb100: string | null;
  stl100: string | null;
  blk100: string | null;
  ptsCreated100: string | null;
  bpm: string | null;
  dbpm: string | null;
  mvps: number | null;
  championships: number | null;
  allNbaTotal: number | null;
  dpoy: number | null;
};

function fmt(v: string | number | null, decimals = 1) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  return isNaN(n) ? "—" : n.toFixed(decimals);
}

function badges(row: Row) {
  const b: string[] = [];
  if ((row.mvps ?? 0) > 0)          b.push(`${row.mvps}× MVP`);
  if ((row.championships ?? 0) > 0) b.push(`${row.championships}× Champ`);
  if ((row.dpoy ?? 0) > 0)          b.push(`${row.dpoy}× DPOY`);
  return b;
}

export default async function StatsPreview() {
  const data = await getTopAllStars();
  const rows = (data && data.length > 0 ? data : FALLBACK) as Row[];

  return (
    <section id="stats" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-red-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Pace-Adjusted · All-Star Era 1970–2025
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All-Time All-Star Rankings
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Career per-100 possession stats for every NBA All-Star since 1970, normalized
            for pace. Ranked by <span className="text-blue-400 font-semibold">Points Created</span> (PTS + AST×1.5 per 100 possessions).
          </p>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-x-auto">
          {/* Header */}
          <div className="min-w-[900px] grid grid-cols-12 gap-2 px-5 py-3 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-3">Player</span>
            <span className="col-span-1 text-center">PTS</span>
            <span className="col-span-1 text-center">AST</span>
            <span className="col-span-1 text-center">REB</span>
            <span className="col-span-1 text-center">STL</span>
            <span className="col-span-1 text-center">BLK</span>
            <span className="col-span-1 text-center text-blue-400">PTS+</span>
            <span className="col-span-1 text-center">BPM</span>
            <span className="col-span-1 text-center">Awards</span>
          </div>

          <div className="min-w-[900px]">
            {rows.map((p, i) => {
              const badgeList = badges(p);
              return (
                <div
                  key={p.name}
                  className={`grid grid-cols-12 gap-2 px-5 py-4 hover:bg-white/5 transition-colors ${
                    i !== rows.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  {/* Rank */}
                  <span className="col-span-1 text-center text-slate-500 font-mono text-sm self-center">
                    {p.rank ?? i + 1}
                  </span>

                  {/* Player info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm leading-tight">{p.name}</p>
                      <p className="text-slate-500 text-xs">
                        {p.yearsActive} · {p.allstarSeasons}× AS
                      </p>
                    </div>
                  </div>

                  {/* Per-100 stats */}
                  <span className="col-span-1 text-center text-slate-200 text-sm self-center font-mono">{fmt(p.pts100)}</span>
                  <span className="col-span-1 text-center text-slate-200 text-sm self-center font-mono">{fmt(p.ast100)}</span>
                  <span className="col-span-1 text-center text-slate-200 text-sm self-center font-mono">{fmt(p.reb100)}</span>
                  <span className="col-span-1 text-center text-slate-200 text-sm self-center font-mono">{fmt(p.stl100)}</span>
                  <span className="col-span-1 text-center text-slate-200 text-sm self-center font-mono">{fmt(p.blk100)}</span>

                  {/* Points Created — highlighted */}
                  <span className="col-span-1 text-center self-center">
                    <span className="bg-blue-600/20 text-blue-300 font-bold text-sm px-2 py-0.5 rounded font-mono">
                      {fmt(p.ptsCreated100)}
                    </span>
                  </span>

                  {/* BPM */}
                  <span className={`col-span-1 text-center text-sm self-center font-mono ${Number(p.bpm) >= 5 ? "text-green-400" : Number(p.bpm) >= 0 ? "text-slate-300" : "text-red-400"}`}>
                    {Number(p.bpm) > 0 ? "+" : ""}{fmt(p.bpm)}
                  </span>

                  {/* Awards badges */}
                  <div className="col-span-1 flex flex-wrap gap-1 self-center justify-center">
                    {badgeList.slice(0, 2).map((b) => (
                      <span key={b} className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                        {b}
                      </span>
                    ))}
                    {(p.allNbaTotal ?? 0) > 0 && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium">
                        {p.allNbaTotal}× All-NBA
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-slate-500 text-xs mt-5">
          Per-100 possessions normalizes for pace across all eras. Points Created = PTS/100 + AST/100 × 1.5.
          Pre-1974 defensive stats (STL/BLK) not tracked.
        </p>

        <div className="text-center mt-6">
          <a
            href="/api/allstars?limit=636"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-105 inline-block"
          >
            Download Full Dataset (JSON) →
          </a>
        </div>
      </div>
    </section>
  );
}
