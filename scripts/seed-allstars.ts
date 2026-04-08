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

// ─── Authoritative award counts (hardcoded from official records) ─────────────

const MVP_WINS: Record<string, number> = {
  "Kareem Abdul-Jabbar": 6,
  "Michael Jordan": 5,
  "Bill Russell": 5,
  "LeBron James": 4,
  "Wilt Chamberlain": 4,
  "Nikola Jokić": 3,
  "Magic Johnson": 3,
  "Larry Bird": 3,
  "Moses Malone": 3,
  "Giannis Antetokounmpo": 2,
  "Stephen Curry": 2,
  "Steve Nash": 2,
  "Tim Duncan": 2,
  "Karl Malone": 2,
  "Bob Pettit": 2,
  "Shai Gilgeous-Alexander": 1,
  "Joel Embiid": 1,
  "James Harden": 1,
  "Russell Westbrook": 1,
  "Kevin Durant": 1,
  "Derrick Rose": 1,
  "Kobe Bryant": 1,
  "Dirk Nowitzki": 1,
  "Kevin Garnett": 1,
  "Allen Iverson": 1,
  "Shaquille O'Neal": 1,
  "David Robinson": 1,
  "Hakeem Olajuwon": 1,
  "Charles Barkley": 1,
  "Julius Erving": 1,
  "Bill Walton": 1,
  "Bob McAdoo": 1,
  "Dave Cowens": 1,
  "Willis Reed": 1,
  "Wes Unseld": 1,
  "Oscar Robertson": 1,
  "Bob Cousy": 1,
};

const CHAMPIONSHIPS: Record<string, number> = {
  "Bill Russell": 11,
  "Sam Jones": 10,
  "Tom Heinsohn": 8,
  "John Havlicek": 8,
  "Bob Cousy": 6,
  "Kareem Abdul-Jabbar": 6,
  "Michael Jordan": 6,
  "Scottie Pippen": 6,
  "Magic Johnson": 5,
  "Kobe Bryant": 5,
  "Tim Duncan": 5,
  "LeBron James": 4,
  "Stephen Curry": 4,
  "Shaquille O'Neal": 4,
  "Bob Pettit": 3,
  "Larry Bird": 3,
  "Dwyane Wade": 3,
  "Isiah Thomas": 2,
  "Hakeem Olajuwon": 2,
  "Wilt Chamberlain": 2,
  "Kevin Durant": 2,
  "Giannis Antetokounmpo": 1,
  "Nikola Jokić": 1,
  "Dirk Nowitzki": 1,
  "Chauncey Billups": 1,
  "Dennis Rodman": 1,
  "Elgin Baylor": 0, // famously never won
  "Jerry West": 1,
  "Willis Reed": 2,
  "Walt Frazier": 2,
  "Dave DeBusschere": 2,
  "Bill Bradley": 2,
  "Dave Cowens": 2,
  "Jo Jo White": 2,
  "Paul Pierce": 1,
  "Ray Allen": 2,
  "Kevin Garnett": 1,
  "Paul Silas": 3,
  "Kawhi Leonard": 2,
  "Andre Iguodala": 4,
  "Draymond Green": 4,
  "Klay Thompson": 4,
  "James Worthy": 3,
  "Byron Scott": 3,
  "A.C. Green": 3,
  "Horace Grant": 1,
  "Robert Parish": 4,
  "Kevin McHale": 3,
  "Dennis Johnson": 3,
  "Danny Ainge": 2,
  "Clyde Drexler": 1,
  "Charles Barkley": 0,
  "Patrick Ewing": 0,
  "Reggie Miller": 0,
  "John Stockton": 0,
  "Karl Malone": 0,
  "Chris Paul": 0,
  "Tony Parker": 4,
  "Manu Ginóbili": 4,
  "David Robinson": 2,
  "Joe Dumars": 2,
  "Shai Gilgeous-Alexander": 1,
  "Jaylen Brown": 1,
  "Julius Erving": 0,
};

const FINALS_MVP: Record<string, number> = {
  "Michael Jordan": 6,
  "LeBron James": 4,
  "Tim Duncan": 3,
  "Shaquille O'Neal": 3,
  "Magic Johnson": 3,
  "Kawhi Leonard": 2,
  "Kevin Durant": 2,
  "Kobe Bryant": 2,
  "Hakeem Olajuwon": 2,
  "Larry Bird": 2,
  "Kareem Abdul-Jabbar": 2,
  "Willis Reed": 2,
  "Shai Gilgeous-Alexander": 1,
  "Jaylen Brown": 1,
  "Nikola Jokić": 1,
  "Stephen Curry": 1,
  "Giannis Antetokounmpo": 1,
  "Dwyane Wade": 1,
  "Dirk Nowitzki": 1,
  "Chauncey Billups": 1,
  "James Worthy": 1,
  "Isiah Thomas": 1,
  "Joe Dumars": 1,
  "Moses Malone": 1,
  "Paul Pierce": 1,
  "Dennis Johnson": 1,
  "Jo Jo White": 1,
  "Rick Barry": 1,
  "Jerry West": 1,
};

function getMvps(name: string): number {
  return MVP_WINS[name] ?? 0;
}

function getChampionships(name: string): number {
  return CHAMPIONSHIPS[name] ?? 0;
}

function getFinalsMvps(name: string): number {
  return FINALS_MVP[name] ?? 0;
}

// ─── DPOY winners (1982-83 through 2024-25, official NBA records) ─────────────

const DPOY_WINS: Record<string, number> = {
  "Rudy Gobert":              4, // 2017-18, 2018-19, 2020-21, 2023-24
  "Ben Wallace":              4, // 2001-02, 2002-03, 2004-05, 2005-06
  "Dikembe Mutombo":          4, // 1994-95, 1996-97, 1997-98, 2000-01
  "Dwight Howard":            3, // 2008-09, 2009-10, 2010-11
  "Kawhi Leonard":            2, // 2014-15, 2015-16
  "Hakeem Olajuwon":          2, // 1992-93, 1993-94
  "Dennis Rodman":            2, // 1989-90, 1990-91
  "Alonzo Mourning":          2, // 1998-99, 1999-00
  "Mark Eaton":               2, // 1984-85, 1988-89
  "Sidney Moncrief":          2, // 1982-83, 1983-84
  "Giannis Antetokounmpo":    1, // 2019-20
  "Draymond Green":           1, // 2016-17
  "Joakim Noah":              1, // 2013-14
  "Marc Gasol":               1, // 2012-13
  "Tyson Chandler":           1, // 2011-12
  "Kevin Garnett":            1, // 2007-08
  "Marcus Camby":             1, // 2006-07
  "Metta World Peace":        1, // 2003-04 (as Ron Artest)
  "Ron Artest":               1, // same player, alternate name in data
  "Gary Payton":              1, // 1995-96
  "David Robinson":           1, // 1991-92
  "Michael Jordan":           1, // 1987-88
  "Evan Mobley":              1, // 2024-25
  "Jaren Jackson Jr.":        1, // 2022-23
};

function getDpoy(name: string): number {
  return DPOY_WINS[name] ?? 0;
}

// ──────────────────────────────────────────────────────────────────────────────

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

      mvps:           getMvps(r["Player"]),
      finalsMvps:     getFinalsMvps(r["Player"]),
      championships:  getChampionships(r["Player"]),
      allNbaTotal:    parseInt2(r["All-NBA (Total)"]),
      allNba1st:      parseInt2(r["All-NBA 1st"]),
      allNba2nd:      parseInt2(r["All-NBA 2nd"]),
      allNba3rd:      parseInt2(r["All-NBA 3rd"]),
      allDef1st:      parseInt2(r["All-Def 1st"]),
      allDef2nd:      parseInt2(r["All-Def 2nd"]),
      dpoy:           getDpoy(r["Player"]),
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
