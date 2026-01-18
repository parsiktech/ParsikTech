import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[var(--background)] via-[var(--card-bg)]/30 to-[var(--background)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Ready to Build Something That Works?
        </h2>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          No fluff. No experiments. Just production-grade systems built to perform and grow.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  );
}
