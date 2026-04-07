export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏀</span>
            <span className="font-bold text-lg">
              <span className="text-blue-400">NBA</span>
              <span className="text-white">Tracker</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#stats" className="hover:text-white transition-colors">
              Stats
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} NBATracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
