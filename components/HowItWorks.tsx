const steps = [
  {
    number: "01",
    title: "Search Any Player",
    description:
      "Type a name or browse by team, position, or season. Our database covers every NBA player from 1946 to today.",
    color: "blue",
  },
  {
    number: "02",
    title: "Explore the Data",
    description:
      "View per-game stats, advanced metrics, shooting zones, and career timelines — all visualized in clean, readable charts.",
    color: "purple",
  },
  {
    number: "03",
    title: "Join the Conversation",
    description:
      "Drop a comment, share your analysis, or start a debate. Our community is built around data-backed basketball discussion.",
    color: "red",
  },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-700 shadow-blue-500/30",
  purple: "from-purple-500 to-purple-700 shadow-purple-500/30",
  red: "from-red-500 to-red-700 shadow-red-500/30",
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple. Powerful. Data-driven.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get from zero to deep-dive in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop) */}
              {step.number !== "03" && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[step.color]} shadow-lg flex items-center justify-center text-white font-extrabold text-xl mb-6`}
                >
                  {step.number}
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
