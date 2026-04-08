import { db } from "@/lib/db";
import { allstarPer100 } from "@/lib/schema";
import { asc, sql } from "drizzle-orm";
import AllStarTable from "./AllStarTable";

async function getTopAllStars() {
  try {
    const [rows, [{ count }]] = await Promise.all([
      db
        .select({
          rank:           allstarPer100.rank,
          name:           allstarPer100.name,
          yearsActive:    allstarPer100.yearsActive,
          allstarSeasons: allstarPer100.allstarSeasons,
          pts100:         allstarPer100.pts100,
          ast100:         allstarPer100.ast100,
          reb100:         allstarPer100.reb100,
          orb100:         allstarPer100.orb100,
          drb100:         allstarPer100.drb100,
          stl100:         allstarPer100.stl100,
          blk100:         allstarPer100.blk100,
          ptsCreated100:  allstarPer100.ptsCreated100,
          tsPct:          allstarPer100.tsPct,
          bpm:            allstarPer100.bpm,
          dbpm:           allstarPer100.dbpm,
          mvps:           allstarPer100.mvps,
          finalsMvps:     allstarPer100.finalsMvps,
          championships:  allstarPer100.championships,
          allNbaTotal:    allstarPer100.allNbaTotal,
          allNba1st:      allstarPer100.allNba1st,
          allNba2nd:      allstarPer100.allNba2nd,
          dpoy:           allstarPer100.dpoy,
        })
        .from(allstarPer100)
        .orderBy(asc(allstarPer100.rank))
        .limit(50),
      db.select({ count: sql<number>`count(*)` }).from(allstarPer100),
    ]);
    return { rows, total: Number(count) };
  } catch {
    return null;
  }
}

// Fallback while DB is empty
const FALLBACK_ROWS = [
  { rank: 1,  name: "Oscar Robertson",     yearsActive: "1960-1974", allstarSeasons: 12, pts100: "31.3", ast100: "11.2", reb100: "9.5",  orb100: null, drb100: null, stl100: null,  blk100: null,  ptsCreated100: "48.1", tsPct: null, bpm: "8.2",  dbpm: "0.7", mvps: 1, finalsMvps: 0, championships: 1, allNbaTotal: 11, allNba1st: 9, allNba2nd: 2, dpoy: 0 },
  { rank: 2,  name: "Magic Johnson",       yearsActive: "1979-1996", allstarSeasons: 12, pts100: "25.8", ast100: "13.4", reb100: "8.7",  orb100: null, drb100: null, stl100: "2.3", blk100: "0.4", ptsCreated100: "45.9", tsPct: null, bpm: "7.5",  dbpm: "0.5", mvps: 3, finalsMvps: 3, championships: 5, allNbaTotal: 10, allNba1st: 9, allNba2nd: 1, dpoy: 0 },
  { rank: 3,  name: "Stephen Curry",       yearsActive: "2009-",     allstarSeasons: 10, pts100: "35.8", ast100: "7.8",  reb100: "5.7",  orb100: null, drb100: null, stl100: "1.7", blk100: "0.3", ptsCreated100: "47.5", tsPct: null, bpm: "7.4",  dbpm: "0.4", mvps: 2, finalsMvps: 1, championships: 4, allNbaTotal: 9, allNba1st: 4, allNba2nd: 5, dpoy: 0 },
  { rank: 4,  name: "Michael Jordan",      yearsActive: "1984-2003", allstarSeasons: 14, pts100: "37.9", ast100: "6.1",  reb100: "8.0",  orb100: null, drb100: null, stl100: "3.4", blk100: "1.5", ptsCreated100: "47.1", tsPct: null, bpm: "9.2",  dbpm: "3.0", mvps: 5, finalsMvps: 6, championships: 6, allNbaTotal: 11, allNba1st: 10, allNba2nd: 1, dpoy: 1 },
  { rank: 5,  name: "LeBron James",        yearsActive: "2003-",     allstarSeasons: 21, pts100: "30.1", ast100: "9.3",  reb100: "9.4",  orb100: null, drb100: null, stl100: "1.7", blk100: "0.9", ptsCreated100: "44.0", tsPct: null, bpm: "9.0",  dbpm: "1.6", mvps: 4, finalsMvps: 4, championships: 4, allNbaTotal: 21, allNba1st: 13, allNba2nd: 4, dpoy: 0 },
  { rank: 6,  name: "Nikola Jokić",        yearsActive: "2015-",     allstarSeasons: 6,  pts100: "28.0", ast100: "11.1", reb100: "15.4", orb100: null, drb100: null, stl100: "1.7", blk100: "0.9", ptsCreated100: "44.7", tsPct: null, bpm: "11.3", dbpm: "1.7", mvps: 3, finalsMvps: 1, championships: 1, allNbaTotal: 7, allNba1st: 5, allNba2nd: 2, dpoy: 0 },
  { rank: 7,  name: "Wilt Chamberlain",    yearsActive: "1959-1973", allstarSeasons: 13, pts100: "38.4", ast100: "5.4",  reb100: "26.5", orb100: null, drb100: null, stl100: null,  blk100: null,  ptsCreated100: "46.5", tsPct: null, bpm: "10.7", dbpm: "5.0", mvps: 4, finalsMvps: 0, championships: 2, allNbaTotal: 10, allNba1st: 7, allNba2nd: 3, dpoy: 0 },
  { rank: 8,  name: "Kevin Durant",        yearsActive: "2007-",     allstarSeasons: 14, pts100: "35.2", ast100: "5.5",  reb100: "8.2",  orb100: null, drb100: null, stl100: "1.1", blk100: "1.5", ptsCreated100: "43.5", tsPct: null, bpm: "8.4",  dbpm: "0.6", mvps: 1, finalsMvps: 2, championships: 2, allNbaTotal: 11, allNba1st: 6, allNba2nd: 5, dpoy: 0 },
  { rank: 9,  name: "Larry Bird",          yearsActive: "1979-1992", allstarSeasons: 12, pts100: "31.5", ast100: "7.7",  reb100: "12.1", orb100: null, drb100: null, stl100: "2.1", blk100: "0.9", ptsCreated100: "43.1", tsPct: null, bpm: "8.4",  dbpm: "0.9", mvps: 3, finalsMvps: 2, championships: 3, allNbaTotal: 10, allNba1st: 9, allNba2nd: 1, dpoy: 0 },
  { rank: 10, name: "Kareem Abdul-Jabbar", yearsActive: "1969-1989", allstarSeasons: 19, pts100: "29.5", ast100: "4.2",  reb100: "14.0", orb100: null, drb100: null, stl100: "0.9", blk100: "3.4", ptsCreated100: "35.8", tsPct: null, bpm: "9.0",  dbpm: "3.7", mvps: 6, finalsMvps: 2, championships: 6, allNbaTotal: 15, allNba1st: 10, allNba2nd: 5, dpoy: 0 },
];

export default async function StatsPreview() {
  const result = await getTopAllStars();
  const rows = (result?.rows && result.rows.length > 0 ? result.rows : FALLBACK_ROWS) as Parameters<typeof AllStarTable>[0]["initialRows"];
  const total = result?.total ?? 533;

  return (
    <section id="stats" className="pt-8 pb-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-red-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Pace-Adjusted · All-Star Era 1970–2025
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All-Time All-Star Rankings
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Career per-100 possession stats for every NBA All-Star. Click any column to re-rank. Search to compare players.
          </p>
        </div>

        <AllStarTable initialRows={rows} initialTotal={total} />

        <p className="text-center text-slate-500 text-xs mt-5">
          Per-100 possessions normalizes for pace across all eras. Points Created = PTS/100 + AST/100 × 1.5.
          Pre-1974 defensive stats (STL/BLK) not tracked.
        </p>
      </div>
    </section>
  );
}
