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
  // 11
  "Bill Russell": 11,
  // 10
  "Sam Jones": 10,
  // 8
  "Tom Heinsohn": 8,
  "John Havlicek": 8,
  // 6
  "Bob Cousy": 6,
  "Kareem Abdul-Jabbar": 6,     // 1971 MIL + 1980/82/85/87/88 LAL
  "Michael Jordan": 6,           // 1991-93, 1996-98 CHI
  "Scottie Pippen": 6,
  // 5
  "Magic Johnson": 5,            // 1980/82/85/87/88 LAL
  "Kobe Bryant": 5,              // 2000/01/02/09/10 LAL
  "Tim Duncan": 5,               // 1999/03/05/07/14 SAS
  "Dennis Rodman": 5,            // 1989/90 DET + 1996/97/98 CHI
  "Michael Cooper": 5,           // 1980/82/85/87/88 LAL
  // 4
  "LeBron James": 4,             // 2012/13 MIA, 2016 CLE, 2020 LAL
  "Stephen Curry": 4,            // 2015/17/18/22 GSW
  "Shaquille O'Neal": 4,         // 2000/01/02 LAL + 2006 MIA
  "Tony Parker": 4,              // 2003/05/07/14 SAS
  "Manu Ginóbili": 4,            // 2003/05/07/14 SAS
  "Draymond Green": 4,           // 2015/17/18/22 GSW
  "Klay Thompson": 4,            // 2015/17/18/22 GSW
  "Andre Iguodala": 4,           // 2015/17/18/22 GSW
  "Robert Parish": 4,            // 1981/84/86 BOS + 1997 CHI
  "A.C. Green": 4,               // 1985/87/88 LAL + 2000 LAL
  "Horace Grant": 4,             // 1991/92/93 CHI + 2001 LAL
  // 3
  "Larry Bird": 3,
  "Kevin McHale": 3,
  "Dennis Johnson": 3,           // 1979 SEA + 1984/86 BOS
  "James Worthy": 3,             // 1985/87/88 LAL
  "Byron Scott": 3,              // 1985/87/88 LAL
  "Paul Silas": 3,               // 1974/76 BOS + 1979 SEA
  "Dwyane Wade": 3,              // 2006/12/13 MIA
  // 2
  "Kevin Durant": 2,             // 2017/18 GSW
  "Kawhi Leonard": 2,            // 2014 SAS + 2019 TOR
  "Hakeem Olajuwon": 2,          // 1994/95 HOU
  "Isiah Thomas": 2,             // 1989/90 DET
  "Joe Dumars": 2,               // 1989/90 DET
  "David Robinson": 2,           // 1999/03 SAS
  "Willis Reed": 2,              // 1970/73 NYK
  "Walt Frazier": 2,             // 1970/73 NYK
  "Dave DeBusschere": 2,         // 1970/73 NYK
  "Bill Bradley": 2,             // 1970/73 NYK
  "Dave Cowens": 2,              // 1974/76 BOS
  "Jo Jo White": 2,              // 1974/76 BOS
  "Ray Allen": 2,                // 2008 BOS + 2013 MIA
  "Wilt Chamberlain": 2,         // 1967 PHI + 1972 LAL
  "Danny Ainge": 2,              // 1984/86 BOS
  "Pau Gasol": 2,                // 2009/10 LAL
  "Chris Bosh": 2,               // 2012/13 MIA
  "Bill Walton": 2,              // 1977 POR + 1986 BOS
  // 1
  "Giannis Antetokounmpo": 1,    // 2021 MIL
  "Nikola Jokić": 1,             // 2023 DEN
  "Dirk Nowitzki": 1,            // 2011 DAL
  "Chauncey Billups": 1,         // 2004 DET
  "Paul Pierce": 1,              // 2008 BOS
  "Kevin Garnett": 1,            // 2008 BOS
  "Clyde Drexler": 1,            // 1995 HOU
  "Oscar Robertson": 1,          // 1971 MIL
  "Julius Erving": 1,            // 1983 PHI
  "Moses Malone": 1,             // 1983 PHI
  "Bob Pettit": 1,               // 1958 STL Hawks
  "Jerry West": 1,               // 1972 LAL
  "Rick Barry": 1,               // 1975 GSW
  "Wes Unseld": 1,               // 1978 WAS
  "Elvin Hayes": 1,              // 1978 WAS
  "Kyrie Irving": 1,             // 2016 CLE
  "Anthony Davis": 1,            // 2020 LAL
  "Jason Kidd": 1,               // 2011 DAL
  "Metta World Peace": 1,        // 2010 LAL (as Ron Artest)
  "Ron Artest": 1,
  "Shai Gilgeous-Alexander": 1,  // 2025 OKC
  "Jaylen Brown": 1,             // 2024 BOS
  // 0 — famously never won
  "Elgin Baylor": 0,
  "Charles Barkley": 0,
  "Patrick Ewing": 0,
  "Reggie Miller": 0,
  "John Stockton": 0,
  "Karl Malone": 0,
  "Chris Paul": 0,
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

// ─── All-NBA selections (official records, NBA teams only, not ABA) ────────────

const ALL_NBA_1ST: Record<string, number> = {
  "LeBron James": 13,
  "Kareem Abdul-Jabbar": 10,
  "Kobe Bryant": 11,
  "Tim Duncan": 10,
  "Karl Malone": 11,
  "Shaquille O'Neal": 8,
  "Bob Cousy": 10,
  "Julius Erving": 5,
  "Dirk Nowitzki": 4,
  "Hakeem Olajuwon": 6,
  "Dolph Schayes": 6,
  "Jerry West": 10,
  "Charles Barkley": 5,
  "Stephen Curry": 4,
  "Kevin Durant": 6,
  "John Havlicek": 4,
  "Michael Jordan": 10,
  "Chris Paul": 4,
  "Bob Pettit": 10,
  "Oscar Robertson": 9,
  "Bill Russell": 3,
  "John Stockton": 2,
  "Rick Barry": 5,
  "Elgin Baylor": 10,
  "Larry Bird": 9,
  "Wilt Chamberlain": 7,
  "Magic Johnson": 9,
  "David Robinson": 4,
  "Giannis Antetokounmpo": 7,
  "Kevin Garnett": 4,
  "George Gervin": 5,
  "Gary Payton": 2,
  "Russell Westbrook": 2,
  "James Harden": 6,
  "Dwight Howard": 5,
  "Moses Malone": 4,
  "Dwyane Wade": 2,
  "Patrick Ewing": 1,
  "Allen Iverson": 3,
  "Nikola Jokić": 5,
  "Damian Lillard": 1,
  "Tracy McGrady": 2,
  "Steve Nash": 3,
  "Scottie Pippen": 3,
  "Bill Sharman": 4,
  "Dominique Wilkins": 1,
  "Walt Frazier": 4,
  "Paul George": 1,
  "Elvin Hayes": 3,
  "Jason Kidd": 5,
  "Kawhi Leonard": 3,
  "George Mikan": 6,
  "Tiny Archibald": 3,
  "Billy Cunningham": 3,
  "Bob Davies": 4,
  "Anthony Davis": 4,
  "Luka Dončić": 5,
  "Clyde Drexler": 1,
  "Joel Embiid": 1,
  "Spencer Haywood": 2,
  "Neil Johnston": 4,
  "Jerry Lucas": 3,
  "Sidney Moncrief": 1,
  "Willis Reed": 1,
  "Amar'e Stoudemire": 1,
  "Jayson Tatum": 4,
  "Isiah Thomas": 3,
  "Chris Webber": 1,
  "Paul Arizin": 3,
  "Joe Fulks": 3,
  "Bernard King": 2,
  "Ed Macauley": 3,
  "Pete Maravich": 2,
  "Paul Westphal": 3,
  "Max Zaslofsky": 4,
  "Dave Bing": 2,
  "Shai Gilgeous-Alexander": 3,
  "Anfernee Hardaway": 2,
  "Connie Hawkins": 1,
  "Marques Johnson": 1,
  "DeAndre Jordan": 1,
  "David Thompson": 2,
  "Ralph Beard": 1,
  "Devin Booker": 1,
  "Larry Foust": 1,
  "Harry Gallatin": 1,
  "Marc Gasol": 1,
  "Alex Groza": 2,
  "Dennis Johnson": 1,
  "Bob McAdoo": 1,
  "Bones McKinney": 1,
  "Stan Miasek": 1,
  "Donovan Mitchell": 1,
  "Alonzo Mourning": 1,
  "Gene Shue": 1,
  "Bill Walton": 1,
  "Gus Williams": 1,
  "George Yardley": 1,
  "Mark Price": 1,
  "Jim Pollard": 2,
  "Kevin Johnson": 0,
};

const ALL_NBA_2ND: Record<string, number> = {
  "LeBron James": 4,
  "Kareem Abdul-Jabbar": 5,
  "Kobe Bryant": 2,
  "Tim Duncan": 3,
  "Karl Malone": 2,
  "Shaquille O'Neal": 2,
  "Bob Cousy": 2,
  "Julius Erving": 2,
  "Dirk Nowitzki": 5,
  "Hakeem Olajuwon": 3,
  "Dolph Schayes": 6,
  "Jerry West": 2,
  "Charles Barkley": 5,
  "Stephen Curry": 5,
  "Kevin Durant": 5,
  "John Havlicek": 7,
  "Michael Jordan": 1,
  "Chris Paul": 5,
  "Bob Pettit": 1,
  "Oscar Robertson": 2,
  "Bill Russell": 8,
  "John Stockton": 6,
  "Rick Barry": 1,
  "Larry Bird": 1,
  "Wilt Chamberlain": 3,
  "Magic Johnson": 1,
  "David Robinson": 2,
  "Giannis Antetokounmpo": 2,
  "Kevin Garnett": 3,
  "George Gervin": 2,
  "Gary Payton": 5,
  "Russell Westbrook": 5,
  "Dwight Howard": 1,
  "Moses Malone": 4,
  "Dwyane Wade": 3,
  "Patrick Ewing": 6,
  "Hal Greer": 7,
  "Allen Iverson": 3,
  "Nikola Jokić": 2,
  "Damian Lillard": 4,
  "Tracy McGrady": 3,
  "Steve Nash": 2,
  "Scottie Pippen": 2,
  "Bill Sharman": 3,
  "Dominique Wilkins": 4,
  "Carmelo Anthony": 2,
  "Walt Frazier": 2,
  "Elvin Hayes": 3,
  "Jason Kidd": 1,
  "Kawhi Leonard": 3,
  "LaMarcus Aldridge": 2,
  "Tiny Archibald": 2,
  "Jimmy Butler": 1,
  "Billy Cunningham": 1,
  "Anthony Davis": 1,
  "Joel Embiid": 4,
  "Blake Griffin": 3,
  "Tim Hardaway": 3,
  "Spencer Haywood": 2,
  "Grant Hill": 4,
  "Kevin Johnson": 4,
  "Jerry Lucas": 2,
  "Slater Martin": 5,
  "Yao Ming": 2,
  "Sidney Moncrief": 4,
  "Willis Reed": 4,
  "Mitch Richmond": 3,
  "Amar'e Stoudemire": 4,
  "Ben Wallace": 3,
  "Chris Webber": 3,
  "Paul Arizin": 1,
  "Joe Fulks": 1,
  "Pau Gasol": 2,
  "Tom Heinsohn": 4,
  "Gus Johnson": 4,
  "Bernard King": 1,
  "Ed Macauley": 1,
  "Pete Maravich": 2,
  "Vern Mikkelsen": 4,
  "Chris Mullin": 2,
  "Tony Parker": 3,
  "Paul Pierce": 1,
  "Jim Pollard": 2,
  "Paul Westphal": 1,
  "Chauncey Billups": 1,
  "Dave Bing": 1,
  "Dave Cowens": 3,
  "DeMar DeRozan": 2,
  "Joe Dumars": 1,
  "Alex English": 3,
  "Bob Feerick": 1,
  "Richie Guerin": 3,
  "Kyrie Irving": 1,
  "Marques Johnson": 2,
  "Sam Jones": 3,
  "Shawn Kemp": 3,
  "John Logan": 3,
  "Dikembe Mutombo": 1,
  "Jermaine O'Neal": 1,
  "Maurice Stokes": 3,
  "Bobby Wanzer": 3,
  "Ray Allen": 1,
  "Vin Baker": 1,
  "Ralph Beard": 1,
  "Carl Braun": 2,
  "Frankie Brian": 2,
  "Jalen Brunson": 2,
  "Vince Carter": 1,
  "Tom Chambers": 2,
  "DeMarcus Cousins": 2,
  "Terry Cummings": 1,
  "Adrian Dantley": 2,
  "Walter Davis": 2,
  "Anthony Edwards": 2,
  "Larry Foust": 1,
  "Harry Gallatin": 1,
  "Marc Gasol": 1,
  "Rudy Gobert": 1,
  "Draymond Green": 1,
  "Cliff Hagan": 2,
  "Dennis Johnson": 1,
  "Bob Love": 2,
  "Kevin Love": 2,
  "Bob McAdoo": 1,
  "Bones McKinney": 1,
  "Stan Miasek": 1,
  "Donovan Mitchell": 1,
  "Alonzo Mourning": 1,
  "Robert Parish": 1,
  "Andy Phillip": 2,
  "Julius Randle": 1,
  "Glen Rice": 1,
  "Brandon Roy": 1,
  "Fred Scolari": 2,
  "Paul Seymour": 2,
  "Gene Shue": 1,
  "Pascal Siakam": 1,
  "Bill Walton": 1,
  "Jo Jo White": 2,
  "Deron Williams": 2,
  "Gus Williams": 1,
  "George Yardley": 1,
};

function getAllNba1st(name: string): number {
  return ALL_NBA_1ST[name] ?? 0;
}

function getAllNba2nd(name: string): number {
  return ALL_NBA_2ND[name] ?? 0;
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
      allNba1st:      getAllNba1st(r["Player"]),
      allNba2nd:      getAllNba2nd(r["Player"]),
      allNba3rd:      parseInt2(r["All-NBA 3rd"]),
      allNbaTotal:    getAllNba1st(r["Player"]) + getAllNba2nd(r["Player"]) + parseInt2(r["All-NBA 3rd"]),
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
