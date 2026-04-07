export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background court lines */}
      <div className="absolute inset-0 bg-court-gradient opacity-90" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(200,16,46,0.3) 0%, transparent 60%),
            repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.03) 80px, rgba(255,255,255,0.03) 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.03) 80px, rgba(255,255,255,0.03) 81px)
          `,
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live NBA Data — Updated Daily
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          Explore NBA Player
          <br />
          <span className="text-gradient">Stats Like a Pro</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Dive deep into player analytics, compare season performance, track
          career trajectories, and join the conversation — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
            Explore Players
          </button>
          <button className="w-full sm:w-auto glass hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
            View Season Stats
          </button>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-slate-500 text-sm">
          Trusted by{" "}
          <span className="text-slate-300 font-medium">10,000+</span> basketball
          fans and analysts
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="text-xs">Scroll to explore</span>
        <svg
          className="w-4 h-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
