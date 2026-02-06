import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function ClientOperations() {
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
                <img src="/ClientPanel/ClientPanel (1).png" alt="Client Operations Platforms" className="w-full h-full object-cover object-top blur-[2px]" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                Client Management &amp; Operations Platforms
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Custom client portals that bring communication, documents, billing workflows, and service requests into a single operational interface.
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
                A secure, centralized business operations platform designed to help companies manage everything in one place. It functions as an operational control center for communication, documents, workflows, and day-to-day operations. The system replaces fragmented tools with a single, reliable interface and can integrate with or migrate data from existing platforms, allowing businesses to consolidate systems without losing historical information. Additional features can be introduced as needed, including document organization, reporting, and custom process management.
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
                  "Lack of a centralized system to manage ongoing client operations",
                  "Disconnected tools for communication, documents, and workflow management",
                  "Manual effort required to track progress, deliverables, and responsibilities",
                  "Poor document organization, version control issues, and scattered file storage",
                  "Unstructured handling of client requests, updates, and approvals",
                  "Limited operational visibility for teams and stakeholders across active work",
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
                  "Centralized client operations platforms",
                  "Secure dashboards for managing work, documents, and communication",
                  "Document management systems with structured organization and version control",
                  "Operational reporting and progress tracking tools",
                  "Role-based access and permission management",
                  "Request intake, tracking, and approval workflows",
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
                These systems operate as live business operations platforms used daily in production environments. They are designed to support ongoing work by centralizing workflows, data, and documentation into a single system. Teams and clients use them to manage active engagements, track progress, access documents, submit requests, and maintain operational visibility without relying on email, spreadsheets, or disconnected tools.
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
                {["Client Operations Dashboard", "Secure Document Hub", "Update & Reporting Platform"].map((name, i) => (
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
