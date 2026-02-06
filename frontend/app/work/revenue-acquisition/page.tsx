import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const buildSections = [
  {
    title: "Acquisition Strategy",
    description:
      "We start by understanding how revenue is generated, what qualifies a real lead, and where intent actually forms. Strategy is built around buyer behavior, deal size, and conversion timelines.",
  },
  {
    title: "Traffic & Demand Channels",
    description:
      "We implement and manage acquisition channels that match intent level and sales complexity. The focus is always on quality over volume.",
  },
  {
    title: "Funnels & Conversion Paths",
    description:
      "Landing experiences, forms, and flows are designed to reduce friction and move users toward meaningful actions — not vanity clicks.",
  },
  {
    title: "Tracking & Attribution",
    description:
      "We implement conversion tracking and attribution infrastructure so performance can be measured accurately across channels. Decisions are made from real data, not assumptions.",
  },
  {
    title: "Optimization & Iteration",
    description:
      "Systems are continuously refined based on performance signals. What converts is scaled. What doesn't is removed.",
  },
];

export default function RevenueAcquisition() {
  return (
    <>
      <PageTransition>
        <main className="min-h-screen bg-[var(--background)]">
          <Navigation />

          {/* Hero */}
          <section className="relative pt-32 pb-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#6366F1] transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Systems
              </Link>
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10">
                <img src="/ClientPanel/ClientPanel (3).png" alt="Revenue & Lead Acquisition Systems" className="w-full h-full object-cover object-top blur-[2px]" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                Revenue &amp; Lead Acquisition Systems
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed mb-4">
                We design and operate end-to-end acquisition systems that help companies consistently generate, qualify, and convert high-intent demand.
              </p>
              <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                This isn't about running ads in isolation. It's about building a revenue system that connects traffic, tracking, conversion, and follow-up into something reliable and measurable.
              </p>
            </div>
          </section>

          {/* What This System Does */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                What This System Does
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                Revenue &amp; Lead Acquisition Systems are built to:
              </p>
              <ul className="space-y-4">
                {[
                  "Attract qualified demand",
                  "Capture and track intent accurately",
                  "Route leads into the right workflows",
                  "Optimize performance based on real conversion data",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-[var(--text-secondary)]">
                    <svg className="w-5 h-5 text-[#6366F1] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-8">
                Every system is designed around how the business actually sells, not generic funnels.
              </p>
            </div>
          </section>

          {/* How We Build These Systems */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-10">
                How We Build These Systems
              </h2>
              <div className="space-y-10">
                {buildSections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                      {section.title}
                    </h3>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What Companies Use This For */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                What Companies Use This For
              </h2>
              <ul className="space-y-3">
                {[
                  "Generating consistent, high-intent leads",
                  "Supporting high-value or long sales cycles",
                  "Scaling paid acquisition responsibly",
                  "Replacing disconnected tools with one system",
                  "Making marketing spend accountable to revenue",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-[var(--text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What Makes This Different */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                What Makes This Different
              </h2>
              <ul className="space-y-4">
                {[
                  "Built as a system, not a campaign",
                  "Designed for long-term operation, not short tests",
                  "Tied to real business outcomes",
                  "Maintained and optimized over time",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-[var(--text-secondary)]">
                    <svg className="w-5 h-5 text-[#6366F1] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-8">
                We don't hand over plans and walk away. These systems are actively operated, improved, and aligned with how the business grows.
              </p>
            </div>
          </section>

          {/* Status */}
          <section className="py-10 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                <span className="text-sm text-[var(--text-secondary)] tracking-wide">
                  In Production &middot; Actively Maintained
                </span>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-2xl md:text-3xl text-[var(--text-primary)] font-medium mb-8">
                Looking to build or replace a system like this?
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
              >
                Start a Conversation
              </Link>
            </div>
          </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
