import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 via-[var(--background)] to-[#3B82F6]/10 animate-gradient-shift"></div>

      {/* Gradient animation styles will be added to globals.css */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
          Build. Measure. Grow.<br />
        </h1>

        <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Production-grade software, real analytics, and growth systems that actually work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/work"
            className="bg-[#6366F1] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20 w-full sm:w-auto"
          >
            View Our Work
          </Link>
          <Link
            href="/contact"
            className="border-2 border-[var(--border)] text-[var(--text-primary)] px-8 py-4 rounded-lg text-lg font-medium hover:border-[#6366F1] hover:text-[#6366F1] transition-all w-full sm:w-auto"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-[var(--text-secondary)]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
