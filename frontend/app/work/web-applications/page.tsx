import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function WebApplications() {
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
                <img src="/ClientPanel/ClientPanel (2).png" alt="Custom Web Applications" className="w-full h-full object-cover object-top blur-[2px]" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                Custom Web Applications
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Production-grade web apps designed around real operational needs.
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
                Purpose-built web applications designed from the ground up to solve specific business problems. These aren't templates or off-the-shelf tools — they're fully custom platforms with authentication, APIs, databases, and user interfaces tailored to the exact workflows and requirements of the organization using them.
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
                  "Off-the-shelf tools that don't fit the actual workflow",
                  "Scaling limitations with no-code or low-code platforms",
                  "Security and data ownership concerns with third-party SaaS",
                  "Fragmented user experiences across multiple tools",
                  "Need for custom logic, roles, and integrations",
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
                  "Full-stack web applications with custom backends",
                  "Authenticated platforms with role-based access",
                  "API-driven systems with third-party integrations",
                  "Real-time dashboards and data-driven interfaces",
                  "Multi-tenant applications with isolated environments",
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
                These applications run in production with real users depending on them daily. They handle authentication, data processing, and complex business logic at scale. They're built for long-term operation with ongoing maintenance and iteration — not projects that get handed off and forgotten.
              </p>
            </div>
          </section>

          {/* Example Systems */}
          <section className="py-16 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                Example Systems
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Multi-Tenant SaaS Platform", "Custom Operations Portal", "API-Driven Web Application"].map((name, i) => (
                  <span key={i} className="px-4 py-2 text-sm rounded-lg bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border)]">
                    {name}
                  </span>
                ))}
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
