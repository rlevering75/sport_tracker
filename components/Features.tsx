const features = [
  {
    icon: "🔍",
    title: "Player Search",
    description:
      "Instantly look up any active or historical NBA player. Filter by team, position, draft year, and more.",
  },
  {
    icon: "📊",
    title: "Advanced Metrics",
    description:
      "Go beyond points and rebounds. Explore PER, True Shooting %, Win Shares, VORP, and Box Plus/Minus.",
  },
  {
    icon: "⚖️",
    title: "Player Comparison",
    description:
      "Head-to-head stat comparisons across any season or career span. Settle debates with data.",
  },
  {
    icon: "📈",
    title: "Career Trends",
    description:
      "Visualize how a player's performance evolves year over year with interactive charts.",
  },
  {
    icon: "💬",
    title: "Community Discussion",
    description:
      "Share takes, debate stats, and learn from other fans. Every player profile has a discussion thread.",
  },
  {
    icon: "🏆",
    title: "Season Leaders",
    description:
      "Real-time leaderboards for every major statistical category — updated after each game.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to{" "}
            <span className="text-gradient">understand the game</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From casual fans to hardcore analysts — we have the tools to help
            you dig into the numbers that matter.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
