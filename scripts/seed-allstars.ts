/**
 * Seed the allstar_per100 table from the scraped CSV.
 * Run: npm run db:seed-allstars
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { allstarPer100 } from "../lib/schema";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CSV_PATH = path.resolve(
  process.env.ALLSTAR_CSV ?? "C:/Users/rleve/nba_allstar_per100.csv"
);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

function parseNum(v: string | undefined): string | null {
  if (!v || v.trim() === "" || v.trim() === "nan" || v.trim() === "NaN") return null;
  const n = parseFloat(v.trim());
  return isNaN(n) ? null : String(n);
}

function parseInt2(v: string | undefined): number {
  if (!v || v.trim() === "" || v.trim() === "nan") return 0;
  const n = parseInt(v.trim(), 10);
  return isNaN(n) ? 0 : n;
}

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    // Handle quoted fields with commas inside
    const values: string[] = [];
    let cur = "";
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { values.push(cur); cur = ""; }
      else { cur += ch; }
    }
    values.push(cur);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? "").trim().replace(/^"|"$/g, ""); });
    return row;
  });
}

async function seed() {
  console.log(`Reading CSV: ${CSV_PATH}`);
  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV not found. Run the Python scraper first.");
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} rows from CSV.`);

  // Clear existing data
  console.log("Clearing existing allstar_per100 rows...");
  await sql`TRUNCATE TABLE allstar_per100 RESTART IDENTITY`;

  // Batch insert in chunks of 50
  const CHUNK = 50;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const values = chunk.map((r, idx) => ({
      rank:           parseInt2(r["Rank"]) || (i + idx + 1),
      name:           r["Player"] || "Unknown",
      yearsActive:    r["Years Active"] || null,
      allstarSeasons: parseInt2(r["All-Star Seasons"]),
      asYears:        r["AS Years"] || null,
      gamesPlayed:    parseInt2(r["G"]),

      pts100:         parseNum(r["PTS/100"]),
      ast100:         parseNum(r["AST/100"]),
      reb100:         parseNum(r["REB/100"]),
      orb100:         parseNum(r["ORB/100"]),
      drb100:         parseNum(r["DRB/100"]),
      threepm100:     parseNum(r["3PM/100"]),
      fgPct:          parseNum(r["FG%"]),
      tov100:         parseNum(r["TOV/100"]),

      stl100:         parseNum(r["STL/100"]),
      blk100:         parseNum(r["BLK/100"]),

      ptsCreated100:  parseNum(r["PTS_Created/100"]),

      per:            parseNum(r["PER"]),
      tsPct:          parseNum(r["TS%"]),
      ws:             parseNum(r["WS"]),
      bpm:            parseNum(r["BPM"]),
      obpm:           parseNum(r["OBPM"]),
      dbpm:           parseNum(r["DBPM"]),
      vorp:           parseNum(r["VORP"]),

      mvps:           parseInt2(r["MVPs"]),
      finalsMvps:     parseInt2(r["Finals_MVPs"]),
      championships:  parseInt2(r["Championships"]),
      allNbaTotal:    parseInt2(r["All-NBA (Total)"]),
      allNba1st:      parseInt2(r["All-NBA 1st"]),
      allNba2nd:      parseInt2(r["All-NBA 2nd"]),
      allNba3rd:      parseInt2(r["All-NBA 3rd"]),
      allDef1st:      parseInt2(r["All-Def 1st"]),
      allDef2nd:      parseInt2(r["All-Def 2nd"]),
      dpoy:           parseInt2(r["DPOY"]),
    }));

    await db.insert(allstarPer100).values(values);
    inserted += values.length;
    console.log(`  Inserted ${inserted}/${rows.length}...`);
  }

  console.log(`\nDone! ${inserted} All-Star records seeded into Neon.`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
