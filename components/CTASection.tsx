export default function CTASection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="text-5xl mb-6">🏀</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to level up your{" "}
              <span className="text-gradient">NBA IQ?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of basketball fans who use NBATracker to stay
              sharp, win arguments, and understand the game at a deeper level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
                Get Started — It&apos;s Free
              </button>
              <button className="glass hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all">
                Browse Without Signing Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
