"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import WorkCarousel from "@/components/WorkCarousel";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Topology SVG ──────────────────────────────────────────────────────────────

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

function TopologyBg({ uid }: { uid: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1440 680"
      preserveAspectRatio="xMidYMid slice"
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
        return <rect key={ci} x={mx - 4} y={my - 4} width={8} height={8} fill="#5A5AFF" transform={`rotate(45 ${mx} ${my})`} />;
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Work() {
  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden">

          {/* ── HERO ────────────────────────────────────────────────── */}
          <section className="relative pt-20 md:pt-40 pb-28 px-6 overflow-hidden">

            {/* Gradient blobs */}
            <div className="absolute pointer-events-none overflow-hidden inset-0">
              <div className="animate-blob-1 absolute w-[700px] h-[700px] rounded-full blur-[140px]"
                style={{ top: "-10%", left: "20%", background: "radial-gradient(circle, rgba(90,90,255,0.1) 0%, transparent 70%)" }} />
              <div className="animate-blob-2 absolute w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ top: "30%", right: "5%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }} />
              <div className="animate-blob-3 absolute w-[400px] h-[400px] rounded-full blur-[110px]"
                style={{ top: "10%", right: "30%", background: "radial-gradient(circle, rgba(123,47,255,0.07) 0%, transparent 70%)" }} />
            </div>

            {/* Topology blueprint */}
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.04 }}>
              <TopologyBg uid="work-hero" />
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            <div className="max-w-7xl mx-auto relative z-10">

              {/* Marquee eyebrow */}
              <div className="flex items-center gap-3 mb-10 overflow-hidden max-w-xl">
                <div className="h-px w-8 bg-[#5A5AFF] flex-shrink-0" />
                <div className="overflow-hidden flex-1">
                  <div className="animate-marquee flex gap-10 whitespace-nowrap"
                    style={{ "--marquee-speed": "20s", width: "max-content" } as React.CSSProperties}>
                    {Array(8).fill(null).map((_, i) => (
                      <span key={i} className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                        <span>Built</span>
                        <span className="text-[#00D4FF]">◆</span>
                        <span>Shipped</span>
                        <span className="text-[#00D4FF]">◆</span>
                        <span>In Production</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.02] tracking-tight mb-6 text-[#F0F0FF]">
                What We&apos;ve<br />
                <span className="shimmer-text">Shipped.</span>
              </h1>

              <p className="text-[1.25rem] text-[#9090B0] mb-10 leading-relaxed max-w-2xl">
                Software products and platforms we&apos;ve designed, built, and delivered —
                operating in production for real companies.
              </p>

              {/* Status chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Systems",   val: "Live",           green: true  },
                  { label: "Clients",   val: "Active",         green: true  },
                  { label: "Projects",  val: `${workCards.length} Shown`,  green: false },
                  { label: "Access",    val: "Selective",      green: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)" }}>
                    <span className="relative flex w-2 h-2 flex-shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${s.green ? "bg-[#00E676]" : "bg-[#5A5AFF]"}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${s.green ? "bg-[#00E676]" : "bg-[#5A5AFF]"}`} />
                    </span>
                    <span className="font-mono text-[11px] font-medium text-[#7A7A9A]">{s.label}</span>
                    <span className={`font-mono text-[11px] font-bold ${s.green ? "text-[#00E676]" : "text-[#00D4FF]"}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WORK CAROUSEL ───────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-20 px-6 lg:px-12 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(90,90,255,0.25) 1px, transparent 1px)",
              backgroundSize: "32px 32px", opacity: 0.025,
            }} />

            <div className="max-w-[90rem] mx-auto relative z-10">
              {/* Section label */}
              <div className="flex items-center gap-4 mb-12">
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">Selected Work</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="font-mono text-[11px] text-white/20 hidden sm:block">Drag or use arrows to explore</span>
              </div>

              <WorkCarousel cards={workCards} />

              {/* Restricted note */}
              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-white/[0.06]" />
                <span className="font-mono text-[11px] text-white/25 tracking-widest uppercase">
                  Additional projects are client-restricted or under NDA
                </span>
                <div className="h-px w-12 bg-white/[0.06]" />
              </div>
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            {/* Background topology */}
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.025 }}>
              <TopologyBg uid="work-cta" />
            </div>

            {/* Ambient blobs */}
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[110px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(90,90,255,0.12) 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full blur-[100px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)" }} />

            {/* Rotating aurora ring behind card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="animate-aurora-spin w-[900px] h-[900px] rounded-full opacity-[0.07]"
                style={{ background: "conic-gradient(from 0deg, #5A5AFF, #00D4FF, #7B2FFF, #5A5AFF)", filter: "blur(60px)" }} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
              <div className="rounded-2xl p-10 md:p-14 text-center"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 80px rgba(90,90,255,0.1)",
                }}>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 font-mono text-[11px] font-bold tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.08))",
                    border: "1px solid rgba(255,107,53,0.3)",
                  }}>
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B35]" />
                  </span>
                  <span className="text-[#FF6B35]">Limited Availability</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-[#F0F0FF] mb-5 leading-tight">
                  Looking to build something<br className="hidden md:block" /> like this?
                </h2>
                <p className="text-lg text-[#7A7A9A] mb-3 max-w-xl mx-auto leading-relaxed">
                  We take on new partners selectively.
                </p>
                <p className="text-base text-[#5A5AFF] font-semibold mb-10">
                  If the fit is right, we move fast.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="btn-shimmer flex items-center gap-2 text-white px-9 py-4 rounded-full text-base font-bold transition-all"
                    style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}
                  >
                    Start a Conversation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/services"
                    className="text-[#F0F0FF] px-9 py-4 rounded-full text-base font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  >
                    View Services
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
