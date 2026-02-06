import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function InternalTools() {
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
                <img src="/Lockshore/lockshore (2).png" alt="Server Farm Management Software" className="w-full h-full object-cover object-top blur-[2px]" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                Server Farm Management Software
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Infrastructure management systems built to monitor, control, and operate server environments reliably at scale.
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
                A centralized server farm management platform designed to oversee infrastructure, deployments, resources, and system health from a single control layer. This software provides visibility and operational control across servers, services, and environments, allowing teams to manage uptime, performance, and configuration without relying on fragmented tooling or manual intervention. It serves as the operational backbone for managing production infrastructure.
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
                  "Limited visibility into server health, performance, and resource usage",
                  "Manual infrastructure management that does not scale reliably",
                  "Disconnected tools for monitoring, deployment, and configuration",
                  "Difficulty tracking system status across multiple environments",
                  "Reactive incident response instead of proactive infrastructure oversight",
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
                  "Centralized server and infrastructure dashboards",
                  "Resource monitoring and performance tracking systems",
                  "Deployment and environment management tools",
                  "Alerting, logging, and system health reporting",
                  "Secure access controls and operational permissions",
                  "Integration with hosting providers and infrastructure services",
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
                These platforms operate continuously in production environments, managing live server infrastructure and critical services. They are used to monitor system health, manage deployments, allocate resources, and maintain uptime across environments. Built for long-term operation, the software evolves alongside infrastructure needs, supporting growth without introducing operational complexity or instability.
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
