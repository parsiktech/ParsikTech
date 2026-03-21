"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

// ─── Topology Data ─────────────────────────────────────────────────────────────

const TOPO_NODES = [
  { x: 80,   y: 80,  hub: true  }, { x: 320,  y: 60,  hub: true  },
  { x: 560,  y: 180, hub: true  }, { x: 820,  y: 120, hub: true  },
  { x: 1060, y: 200, hub: false }, { x: 1300, y: 80,  hub: false },
  { x: 200,  y: 260, hub: false }, { x: 440,  y: 340, hub: false },
  { x: 560,  y: 360, hub: true  }, { x: 820,  y: 300, hub: true  },
  { x: 1060, y: 380, hub: false }, { x: 1300, y: 280, hub: false },
  { x: 100,  y: 440, hub: false }, { x: 340,  y: 460, hub: false },
  { x: 700,  y: 500, hub: false }, { x: 940,  y: 500, hub: true  },
  { x: 1180, y: 500, hub: false }, { x: 460,  y: 580, hub: false },
  { x: 700,  y: 620, hub: false }, { x: 1060, y: 620, hub: false },
];

const TOPO_CONNS: [number, number, boolean][] = [
  [0,1,false],[1,2,false],[2,3,false],[3,4,false],[4,5,false],
  [0,6,false],[6,7,false],[7,8,false],
  [1,6,false],[2,8,false],[3,9,false],[4,10,false],[5,11,false],
  [8,9,false],[9,10,false],[10,11,false],
  [6,12,true],[8,13,false],[9,14,false],[10,15,false],[11,16,true],
  [13,17,true],[14,18,true],[15,19,true],
  [13,14,false],[14,15,false],[15,16,false],[9,15,true],
];

const DIAMOND_CONNS = [0, 2, 8, 14];

function TopologyBg({ uid, style }: { uid: string; style?: React.CSSProperties }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1440 680"
      preserveAspectRatio="xMidYMid slice"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <pattern id={`g-${uid}`} width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#g-${uid})`} />
      {TOPO_CONNS.map(([ai, bi, dashed], i) => {
        const a = TOPO_NODES[ai], b = TOPO_NODES[bi];
        return (
          <path key={i} d={`M ${a.x} ${a.y} H ${b.x} V ${b.y}`}
            stroke="#5A5AFF" strokeWidth={dashed ? 0.6 : 1} fill="none"
            strokeDasharray={dashed ? "3 7" : undefined} />
        );
      })}
      {DIAMOND_CONNS.map((ci) => {
        const [ai, bi] = TOPO_CONNS[ci];
        const a = TOPO_NODES[ai], b = TOPO_NODES[bi];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        return <rect key={ci} x={mx-4} y={my-4} width={8} height={8} fill="#5A5AFF" transform={`rotate(45 ${mx} ${my})`} />;
      })}
      {TOPO_NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.hub ? 5 : 3} fill="#5A5AFF" />
          <circle cx={n.x} cy={n.y} r={n.hub ? 11 : 7} fill="none" stroke="#5A5AFF" strokeWidth="0.5" />
          {n.hub && <circle cx={n.x} cy={n.y} r={18} fill="none" stroke="#5A5AFF" strokeWidth="0.3" />}
        </g>
      ))}
    </svg>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
  fullDescription: string;
  includes: string[];
  bestFor: string[];
  pricingStarting: string;
  pricingNote: string;
  pairedWith: string[];
  cta: string;
}

// ─── Category color map (dark theme) ──────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { pill: React.CSSProperties; dot: string }> = {
  green:  { pill: { background: "rgba(0,230,118,0.08)",  border: "1px solid rgba(0,230,118,0.2)",  color: "#00E676" }, dot: "#00E676" },
  blue:   { pill: { background: "rgba(90,90,255,0.10)",  border: "1px solid rgba(90,90,255,0.25)", color: "#818CF8" }, dot: "#818CF8" },
  purple: { pill: { background: "rgba(123,47,255,0.10)", border: "1px solid rgba(123,47,255,0.25)",color: "#A78BFA" }, dot: "#A78BFA" },
  orange: { pill: { background: "rgba(251,146,60,0.10)", border: "1px solid rgba(251,146,60,0.25)",color: "#FB923C" }, dot: "#FB923C" },
  teal:   { pill: { background: "rgba(0,212,255,0.08)",  border: "1px solid rgba(0,212,255,0.2)",  color: "#00D4FF" }, dot: "#00D4FF" },
  gold:   { pill: { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#FCD34D" }, dot: "#FCD34D" },
};

const glassPanel: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Services() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: "system-audit",
      name: "System Audit",
      description: "Find what's broken fast",
      category: "Premium",
      categoryColor: "gold",
      fullDescription: "Find what's broken fast.",
      includes: ["Tech stack review", "Funnel & data audit", "Clear action plan"],
      bestFor: ["Businesses unsure what to fix"],
      pricingStarting: "From $750 (one-time)",
      pricingNote: "High-trust / premium offer.",
      pairedWith: ["Performance Marketing", "Website Development", "Technical Support & Maintenance"],
      cta: "Request Audit",
    },
    {
      id: "website-development",
      name: "Website Development",
      description: "Fast, conversion-focused websites",
      category: "Development",
      categoryColor: "blue",
      fullDescription: "Fast, conversion-focused websites.",
      includes: ["UX & structure", "Custom design & build", "Performance optimization", "CMS setup", "Analytics integration"],
      bestFor: ["Businesses that need a site that works"],
      pricingStarting: "From $1,500",
      pricingNote: "Project-based.",
      pairedWith: ["Performance Marketing", "Technical Support & Maintenance", "Web App Development"],
      cta: "Discuss Project",
    },
    {
      id: "web-app-development",
      name: "Web App Development",
      description: "Custom internal or customer-facing tools",
      category: "Development",
      categoryColor: "blue",
      fullDescription: "Custom internal or customer-facing tools.",
      includes: ["System architecture", "Frontend & backend dev", "Integrations & automation", "Auth & permissions"],
      bestFor: ["Replacing manual processes"],
      pricingStarting: "From $5,000",
      pricingNote: "Depends on complexity.",
      pairedWith: ["Website Development", "Technical Support & Maintenance", "Performance Marketing"],
      cta: "Discuss Project",
    },
    {
      id: "performance-marketing",
      name: "Performance Marketing",
      description: "High-intent acquisition focused on ROI",
      category: "Growth",
      categoryColor: "green",
      fullDescription: "High-intent acquisition focused on ROI.",
      includes: ["Campaign strategy", "Paid search & social", "Ad creation & testing", "Funnel & landing optimization", "Conversion tracking", "Reporting & optimization"],
      bestFor: ["High-value offers", "ROI-driven teams"],
      pricingStarting: "From $4,500/month",
      pricingNote: "Scales with spend & scope.",
      pairedWith: ["Website Development", "Web App Development", "Technical Support & Maintenance"],
      cta: "Request This Service",
    },
    {
      id: "technical-support",
      name: "Technical Support & Maintenance",
      description: "Keep production stable",
      category: "Support",
      categoryColor: "teal",
      fullDescription: "Keep production stable.",
      includes: ["Bug fixes", "Updates", "Monitoring", "Priority support"],
      bestFor: ["Live products & platforms"],
      pricingStarting: "From $2,500/month",
      pricingNote: "Retainer-based.",
      pairedWith: ["Web App Development", "Website Development", "Performance Marketing"],
      cta: "Get Support",
    },
  ];

  const categories = ["All", "Growth", "Development", "Support", "Premium"];
  const filteredServices = activeFilter === "All" ? services : services.filter(s => s.category === activeFilter);

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <section className="relative overflow-hidden px-6 pt-16 md:pt-32 pb-16">

            {/* Blobs */}
            <div className="absolute pointer-events-none inset-0">
              <div className="animate-blob-1 absolute w-[600px] h-[600px] rounded-full blur-[130px]"
                style={{ top: "0%", left: "10%", background: "radial-gradient(circle, rgba(90,90,255,0.11) 0%, transparent 70%)" }} />
              <div className="animate-blob-2 absolute w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{ top: "20%", right: "5%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
              <div className="animate-blob-3 absolute w-[350px] h-[350px] rounded-full blur-[110px]"
                style={{ top: "10%", right: "30%", background: "radial-gradient(circle, rgba(123,47,255,0.07) 0%, transparent 70%)" }} />
            </div>

            {/* Topology */}
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.04 }}>
              <TopologyBg uid="svc-hero" />
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#5A5AFF] flex-shrink-0" />
                <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                  What We Do
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight mb-5 text-[#F0F0FF]">
                Services &{" "}
                <span className="shimmer-text">Capabilities.</span>
              </h1>
              <p className="text-[1.2rem] text-[#9090B0] leading-relaxed max-w-2xl">
                Modular systems designed to scale revenue, operations, and visibility.
                Select a service to view scope, pricing, and details.
              </p>
            </div>
          </section>

          {/* ── FILTERS ──────────────────────────────────────────── */}
          <section className="pb-10 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className="px-5 py-2.5 rounded-full font-mono text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={activeFilter === cat ? {
                      background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                      color: "#fff",
                      boxShadow: "0 0 18px rgba(90,90,255,0.4)",
                    } : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#7A7A9A",
                    }}
                    onMouseEnter={e => { if (activeFilter !== cat) { e.currentTarget.style.borderColor = "rgba(90,90,255,0.35)"; e.currentTarget.style.color = "#F0F0FF"; } }}
                    onMouseLeave={e => { if (activeFilter !== cat) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#7A7A9A"; } }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── CARD GRID ─────────────────────────────────────────── */}
          <section className="pb-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((service) => {
                  const cs = CATEGORY_STYLES[service.categoryColor] ?? CATEGORY_STYLES.blue;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="rounded-2xl p-6 text-left group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                      style={glassPanel}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.3)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px rgba(90,90,255,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)"; }}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-5">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
                          style={cs.pill}
                        >
                          {service.category}
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <svg className="w-3.5 h-3.5 text-[#5A5A7A] group-hover:text-[#5A5AFF] group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#F0F0FF] mb-2 group-hover:text-[#818CF8] transition-colors duration-200 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-sm text-[#7A7A9A] mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold" style={{ color: cs.dot }}>
                          {service.pricingStarting}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#5A5AFF] group-hover:text-[#818CF8] transition-colors duration-200">
                          Details
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── SLIDE-OVER ────────────────────────────────────────── */}
          {selectedService && (() => {
            const cs = CATEGORY_STYLES[selectedService.categoryColor] ?? CATEGORY_STYLES.blue;
            return (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40 transition-opacity"
                  style={{ background: "rgba(4,4,10,0.75)", backdropFilter: "blur(6px)" }}
                  onClick={() => setSelectedService(null)}
                />

                {/* Panel */}
                <div
                  className="fixed right-0 top-0 h-full w-full max-w-lg z-50 overflow-y-auto animate-slide-in"
                  style={{
                    background: "#0A0A14",
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "-24px 0 80px rgba(0,0,0,0.7)",
                  }}
                >
                  {/* Subtle glow at top */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(90,90,255,0.5), transparent)" }} />

                  <div className="p-8">
                    {/* Close */}
                    <button
                      onClick={() => setSelectedService(null)}
                      aria-label="Close panel"
                      className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#7A7A9A] hover:text-[#F0F0FF] transition-colors cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Badge */}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold mb-5" style={cs.pill}>
                      {selectedService.category}
                    </span>

                    {/* Name */}
                    <h2 className="text-3xl font-bold text-[#F0F0FF] mb-3 leading-tight">
                      {selectedService.name}
                    </h2>
                    <p className="text-[#9090B0] mb-8 leading-relaxed">
                      {selectedService.fullDescription}
                    </p>

                    {/* Pricing callout */}
                    <div className="rounded-xl p-5 mb-8"
                      style={{
                        background: "rgba(90,90,255,0.07)",
                        border: "1px solid rgba(90,90,255,0.2)",
                      }}>
                      <div className="text-2xl font-bold text-[#F0F0FF] mb-1">
                        {selectedService.pricingStarting}
                      </div>
                      <div className="text-sm text-[#7A7A9A]">
                        {selectedService.pricingNote}
                      </div>
                    </div>

                    {/* What's Included */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-4 bg-[#5A5AFF] flex-shrink-0" />
                        <h3 className="text-xs font-mono font-bold tracking-[0.18em] uppercase text-[#5A5AFF]">
                          What&rsquo;s Included
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {selectedService.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ color: cs.dot }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-[#C0C0D8]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Best For */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-4 bg-[#5A5AFF] flex-shrink-0" />
                        <h3 className="text-xs font-mono font-bold tracking-[0.18em] uppercase text-[#5A5AFF]">
                          Best For
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedService.bestFor.map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-[#C0C0D8]">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cs.dot }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pairs Well With */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-4 bg-[#5A5AFF] flex-shrink-0" />
                        <h3 className="text-xs font-mono font-bold tracking-[0.18em] uppercase text-[#5A5AFF]">
                          Pairs Well With
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.pairedWith.map((item, i) => (
                          <span key={i}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#9090B0]"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/contact?service=${encodeURIComponent(selectedService.name)}`}
                      className="btn-shimmer w-full flex items-center justify-center gap-2 text-white py-4 rounded-full font-semibold transition-all cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                        boxShadow: "0 0 20px rgba(90,90,255,0.4)",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}
                    >
                      {selectedService.cta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </>
            );
          })()}

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
