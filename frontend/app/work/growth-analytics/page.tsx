import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function GrowthAnalytics() {
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
                <img src="/ClientPanel/ClientPanel (6).png" alt="Marketing Campaign Systems" className="w-full h-full object-cover object-top blur-[2px]" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                Marketing Campaign Systems
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Custom-built marketing campaigns designed to drive measurable results, not generic reach.
              </p>
            </div>
          </section>

          {/* What the System Is */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                What the System Is
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                A fully managed marketing campaign system built around custom assets, infrastructure, and execution. These campaigns go beyond standard ads by incorporating custom HTML landing pages, tailored funnels, conversion tracking, and campaign-specific logic designed to support real business goals. Each system is engineered to align messaging, delivery, and measurement into a cohesive campaign experience.
              </p>
            </div>
          </section>

          {/* Problems It Solves */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                Problems It Solves
              </h2>
              <ul className="space-y-4">
                {[
                  "Generic marketing campaigns that lack differentiation",
                  "Reliance on templated landing pages that don't convert",
                  "Limited control over campaign structure and user flow",
                  "Poor alignment between ads, landing experiences, and tracking",
                  "Inability to adapt campaigns to complex offers or sales cycles",
                ].map((problem, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-[var(--text-secondary)]">
                    <svg className="w-5 h-5 text-[#6366F1] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What We Build */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                What We Build in This Category
              </h2>
              <ul className="space-y-3">
                {[
                  "Custom-built marketing campaigns and funnels",
                  "HTML landing pages and campaign-specific web experiences",
                  "Campaign tracking and performance measurement",
                  "Conversion optimization and flow design",
                  "Integration with analytics, CRM, and lead systems",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-[var(--text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* How These Systems Are Used */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                How These Systems Are Used
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                These marketing campaign systems are deployed in active production environments and operated continuously throughout a campaign's lifecycle. They are used to launch, manage, and optimize campaigns with full control over user experience, tracking, and performance. Built to adapt, these systems allow campaigns to evolve as data is collected and results are measured, rather than being locked into rigid templates.
              </p>
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
