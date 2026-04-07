const players = [
  {
    name: "LeBron James",
    team: "LAL",
    pos: "SF",
    pts: 25.7,
    reb: 7.3,
    ast: 8.3,
    fg: "50.4%",
    trend: "up",
  },
  {
    name: "Stephen Curry",
    team: "GSW",
    pos: "PG",
    pts: 26.4,
    reb: 4.5,
    ast: 5.1,
    fg: "45.2%",
    trend: "up",
  },
  {
    name: "Nikola Jokić",
    team: "DEN",
    pos: "C",
    pts: 26.4,
    reb: 12.4,
    ast: 9.0,
    fg: "58.3%",
    trend: "up",
  },
  {
    name: "Luka Dončić",
    team: "DAL",
    pos: "PG",
    pts: 33.9,
    reb: 9.2,
    ast: 9.8,
    fg: "47.5%",
    trend: "down",
  },
  {
    name: "Giannis Antetokounmpo",
    team: "MIL",
    pos: "PF",
    pts: 30.4,
    reb: 11.5,
    ast: 6.5,
    fg: "61.0%",
    trend: "up",
  },
];

export default function StatsPreview() {
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
            A snapshot of top performers this season. Explore full stats on
            every player.
          </p>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
            <span className="col-span-3">Player</span>
            <span className="text-center">PTS</span>
            <span className="text-center">REB</span>
            <span className="text-center">AST</span>
            <span className="text-center">FG%</span>
            <span className="text-center">Trend</span>
          </div>

          {/* Rows */}
          {players.map((p, i) => (
            <div
              key={p.name}
              className={`grid grid-cols-8 gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer ${
                i !== players.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="col-span-3 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{p.name}</p>
                  <p className="text-slate-500 text-xs">
                    {p.team} · {p.pos}
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
                {p.fg}
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
