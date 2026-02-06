import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import WorkCarousel from "@/components/WorkCarousel";

const workCards = [
  {
    name: "Revenue & Lead Acquisition Systems",
    description:
      "End-to-end systems designed to generate, qualify, and convert high-intent demand.",
    image: "/ClientPanel/ClientPanel (3).png",
    tags: ["Paid Media", "Funnels", "Tracking", "CRO"],
    status: "Actively Maintained",
    statusColor: "#22C55E",
    href: "/work/revenue-acquisition",
  },
  {
    name: "Client Management & Operations Platforms",
    description:
      "Custom portals that centralize communication, documents, billing, and requests.",
    image: "/ClientPanel/ClientPanel (1).png",
    tags: ["Client Portal", "Role-Based Access", "Workflow"],
    status: "In Production",
    statusColor: "#6366F1",
    href: "/work/client-operations",
  },
  {
    name: "Marketing Campaign Systems",
    description:
      "Custom-built marketing campaigns designed to drive measurable results, not generic reach.",
    image: "/ClientPanel/ClientPanel (6).png",
    tags: ["Campaigns", "Landing Pages", "Tracking", "CRO"],
    status: "Shipped",
    statusColor: "#22C55E",
    href: "/work/growth-analytics",
  },
  {
    name: "Education, Training & Certification Platforms",
    description:
      "Scalable platforms for onboarding, compliance, and credential management.",
    image: "/Saferoute/saferoute (1).png",
    tags: ["LMS", "Admin Dashboards", "Multi-Tenant"],
    status: "In Production",
    statusColor: "#6366F1",
    href: "/work/compliance-platforms",
  },
  {
    name: "Server Farm Management Software",
    description:
      "Infrastructure management systems built to monitor, control, and operate server environments reliably at scale.",
    image: "/Lockshore/lockshore (2).png",
    tags: ["Infrastructure", "Monitoring", "Deployment", "Security"],
    status: "In Production",
    statusColor: "#6366F1",
    href: "/work/internal-tools",
  },
  {
    name: "Custom Web Applications",
    description:
      "Production-grade web apps designed around real operational needs.",
    image: "/ClientPanel/ClientPanel (2).png",
    tags: ["Web App", "API", "Auth", "Infrastructure"],
    status: "In Production",
    statusColor: "#6366F1",
    href: "/work/web-applications",
  },
];

export default function Work() {
  return (
    <>
      <PageTransition>
        <main className="min-h-screen bg-[var(--background)]">
          <Navigation />

          {/* Hero */}
          <section className="relative pt-32 pb-20 px-6 bg-[var(--background)]">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
                What We've Shipped
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                Software products and platforms we've designed, built, and delivered for companies operating in production.
              </p>
            </div>
          </section>

          {/* Carousel */}
          <section className="py-16 px-6 lg:px-12 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto">
              <WorkCarousel cards={workCards} />

              <p className="text-center text-sm text-white mt-10">
                Additional products and systems are private or client-restricted.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 px-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-2xl md:text-3xl text-[var(--text-primary)] font-medium mb-8">
                Looking to build something similar or replace a system that's no
                longer working?
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
