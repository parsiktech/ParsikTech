"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

// ─── Data ────────────────────────────────────────────────────────────────────


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

const ENGINEERING   = ["React","Next.js","Node","TypeScript","PostgreSQL","Docker","Redis","GraphQL"];
const MARKETING     = ["Google Ads","Meta Ads","LinkedIn Ads","GA4","GTM","HubSpot","Klaviyo","SEMrush"];
const INFRA         = ["AWS","Vercel","Cloudflare","Stripe","Notion","Linear","Figma","GitHub","Terraform","Datadog"];

// ─── Topology SVG ─────────────────────────────────────────────────────────────

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

// ─── Marquee Row ──────────────────────────────────────────────────────────────

function MarqueeRow({ items, speed, reverse = false, label }: {
  items: string[];
  speed: string;
  reverse?: boolean;
  label: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="flex items-center gap-6">
      <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-[#5A5AFF] w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 overflow-hidden">
        <div
          className={reverse ? "animate-marquee-reverse" : "animate-marquee"}
          style={{ "--marquee-speed": speed, display: "flex", gap: "8px", width: "max-content" } as React.CSSProperties}
        >
          {doubled.map((tool, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-md font-mono text-[13px] font-medium text-[#7A7A9A] whitespace-nowrap
                bg-white/[0.04] border border-white/[0.07] backdrop-blur-md
                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                hover:text-[#F0F0FF] hover:border-[#5A5AFF]/35 hover:bg-[#5A5AFF]/[0.07]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(90,90,255,0.15)]
                transition-all cursor-default"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({ revenue: 0, adSpend: 0, leads: 0, costs: 0, efficiency: 0, retention: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const targets = { revenue: 400, adSpend: 50, leads: 850, costs: 350, efficiency: 100, retention: 94 };
          const fps = 60, totalFrames = (2000 / 1000) * fps;
          let frame = 0;
          const iv = setInterval(() => {
            frame++;
            const p = frame / totalFrames;
            if (p >= 1) { setCounts(targets); clearInterval(iv); }
            else {
              const e = 1 - Math.pow(1 - p, 2);
              setCounts({
                revenue:   Math.floor(targets.revenue   * e),
                adSpend:   Math.floor(targets.adSpend   * e),
                leads:     Math.floor(targets.leads     * e),
                costs:     Math.floor(targets.costs     * e),
                efficiency:Math.floor(targets.efficiency* e),
                retention: Math.floor(targets.retention * e),
              });
            }
          }, 1000 / fps);
        }
      });
    }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, [hasAnimated]);

  const ha = hasAnimated;

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden">

          {/* ── HERO ──────────────────────────────────────────────── */}
          <section className="min-h-screen flex items-center px-6 relative overflow-hidden">

            {/* Gradient mesh blobs */}
            <div className="absolute pointer-events-none overflow-hidden inset-0">
              <div className="animate-blob-1 absolute w-[600px] h-[600px] rounded-full blur-[130px]"
                style={{ top: "5%", left: "15%", background: "radial-gradient(circle, rgba(90,90,255,0.12) 0%, transparent 70%)" }} />
              <div className="animate-blob-2 absolute w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ top: "45%", right: "8%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }} />
              <div className="animate-blob-3 absolute w-[420px] h-[420px] rounded-full blur-[110px]"
                style={{ top: "15%", right: "25%", background: "radial-gradient(circle, rgba(123,47,255,0.08) 0%, transparent 70%)" }} />
            </div>

            {/* Blueprint — slow parallax */}
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.045 }}>
              <TopologyBg uid="hero" />
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            {/* Content */}
            <div className="max-w-7xl mx-auto w-full relative z-10 pt-16 md:pt-32 pb-24">
              <div className="max-w-3xl">

                  {/* Scrolling marquee eyebrow */}
                  <div className="flex items-center gap-3 mb-10 overflow-hidden">
                    <div className="h-px w-8 bg-[#5A5AFF] flex-shrink-0" />
                    <div className="overflow-hidden flex-1">
                      <div className="animate-marquee flex gap-10 whitespace-nowrap"
                        style={{ "--marquee-speed": "18s", width: "max-content" } as React.CSSProperties}>
                        {Array(8).fill(null).map((_, i) => (
                          <span key={i} className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                            <span>Software</span>
                            <span className="text-[#00D4FF]">◆</span>
                            <span>Strategy</span>
                            <span className="text-[#00D4FF]">◆</span>
                            <span>Execution</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <h1 className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[1.02] tracking-tight mb-6 text-[#F0F0FF]">
                    We Build the Systems<br />
                    <span className="shimmer-text">Your Business Runs On.</span>
                  </h1>

                  <p className="text-[1.35rem] text-[#9090B0] mb-10 leading-relaxed max-w-2xl">
                    Production-grade software, infrastructure, and growth — built to perform.
                  </p>

                  {/* Glass CTA panel */}
                  <div className="inline-block rounded-2xl p-5 mb-0"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
                    }}>
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <Link href="/services"
                        className="btn-shimmer flex items-center gap-2 text-white px-8 py-4 rounded-full text-base font-semibold transition-all"
                        style={{
                          background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                          boxShadow: "0 0 20px rgba(90,90,255,0.4)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}
                      >
                        Our Services
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link href="/contact"
                        className="text-[#F0F0FF] px-8 py-4 rounded-full text-base font-semibold transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          backdropFilter: "blur(10px)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      >
                        Contact Us
                      </Link>
                    </div>

                    {/* Terminal status */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Servers",  val: "Online",   green: true  },
                        { label: "Devs",     val: "Online",   green: true  },
                        { label: "Support",  val: "Online",   green: true  },
                        { label: "Response", val: "< 24 hrs", green: false },
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
              </div>
            </div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────── */}
          <section ref={sectionRef} className="relative border-t border-white/[0.05]">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(90,90,255,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px", opacity: 0.025,
            }} />

            <div className="max-w-[90rem] mx-auto px-6 py-20 relative z-10">
              <div className="flex items-center gap-4 mb-14">
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">At a Glance</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="font-mono text-[11px] text-white/20 hidden sm:block">Real numbers. Real impact.</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { v: `$${ha?counts.revenue:0}k+`,    l: "Client Revenue Driven",      s: "Across client systems"    },
                  { v: `$${ha?counts.adSpend:0}k+`,    l: "Paid Media Deployed",         s: "In production"            },
                  { v:  `${ha?counts.leads:0}k+`,      l: "Pipeline Entries Automated",  s: "Automated pipelines"      },
                  { v: `$${ha?counts.costs:0}k+`,      l: "Operational Cost Eliminated", s: "Operational systems"      },
                  { v:  `${ha?counts.efficiency:0}%+`, l: "Sustained Efficiency Uplift", s: "Sustained impact"         },
                  { v:  `${ha?counts.retention:0}%`,   l: "Avg. Client Retention",       s: "Long-term partnerships"   },
                ].map((stat, i) => (
                  <div key={i} className="p-px rounded-xl group cursor-default"
                    style={{
                      background: "linear-gradient(135deg, rgba(90,90,255,0.2), rgba(0,212,255,0.08))",
                      transition: "background 0.35s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, rgba(90,90,255,0.65), rgba(0,212,255,0.35))";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, rgba(90,90,255,0.2), rgba(0,212,255,0.08))";
                    }}>
                    <div className="rounded-[11px] px-5 py-7 h-full relative"
                      style={{
                        background: "#0D0D1A",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-10px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.1), 0 28px 56px rgba(90,90,255,0.3), 0 8px 20px rgba(0,0,0,0.5)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                      }}>
                      {/* Inner top glow that fades in on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-[11px]"
                        style={{
                          background: "radial-gradient(ellipse at 50% -10%, rgba(90,90,255,0.18) 0%, transparent 65%)",
                          transition: "opacity 0.35s ease",
                        }} />
                      <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-bold mb-2 tracking-tight tabular-nums gradient-text">
                          {stat.v}
                        </div>
                        <div className="font-mono text-[11px] font-semibold text-[#7A7A9A] mb-1 leading-tight">{stat.l}</div>
                        <div className="font-mono text-[10px] text-white/25">{stat.s}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WHAT WE DO ────────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.03 }}>
              <TopologyBg uid="dash" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[640px] h-[700px] rounded-full blur-[150px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(90,90,255,0.09) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative z-10">

              {/* Header */}
              <div className="max-w-2xl mb-16">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-[#5A5AFF]" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">What We Do</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-5 leading-tight">
                  Web. Marketing. Systems.
                </h2>
                <p className="text-base text-[#7A7A9A] leading-relaxed">
                  PTG builds websites, runs paid acquisition, and sets up the operational systems that keep businesses running. We cover the full stack — from your first impression online to the tools running your back office.
                </p>
              </div>

              {/* Service cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
                {([
                  { name: "Website Development",          desc: "Fast, conversion-focused websites built to perform.",               category: "Development",    color: "#5A5AFF", price: "From $1,500"          },
                  { name: "Web App Development",           desc: "Custom tools that replace manual processes end-to-end.",            category: "Development",    color: "#5A5AFF", price: "From $5,000"          },
                  { name: "Performance Marketing",         desc: "Paid search & social built around ROI, not vanity metrics.",        category: "Growth",         color: "#00E676", price: "From $4,500/mo"       },
                  { name: "Technical Support",             desc: "Keep production stable with priority maintenance and monitoring.",   category: "Support",        color: "#00D4FF", price: "From $2,500/mo"       },
                  { name: "System Audit",                  desc: "Find what's broken fast. Written report + strategy call.",          category: "Premium",        color: "#F59E0B", price: "$750 flat"            },
                ] as const).map((svc) => (
                  <Link
                    key={svc.name}
                    href="/services"
                    className="group flex flex-col p-5 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = `${svc.color}40`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${svc.color}18`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Category badge */}
                    <span className="inline-block self-start font-mono text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4"
                      style={{ background: `${svc.color}18`, color: svc.color, border: `1px solid ${svc.color}30` }}>
                      {svc.category}
                    </span>

                    <h3 className="text-sm font-bold text-[#F0F0FF] mb-2 leading-snug group-hover:text-white transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-[#7A7A9A] leading-relaxed flex-1 mb-4">
                      {svc.desc}
                    </p>

                    {/* Price + arrow */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono text-[11px] font-semibold" style={{ color: svc.color }}>
                        {svc.price}
                      </span>
                      <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A7A9A] hover:text-[#F0F0FF] transition-colors">
                  Talk to us first
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

            </div>
          </section>

          {/* ── BUILT FOR ─────────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="max-w-2xl mb-16">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-[#5A5AFF]" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">Built For</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-4 leading-tight">
                  Teams that need systems,<br />not experiments.
                </h2>
                <p className="text-base text-[#7A7A9A]">
                  We work best with businesses that value reliability, transparency, and long-term results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { num: "01", title: "Founder-Led Companies",       desc: "That need reliable execution without managing vendors.", why: "We become your dedicated engineering team.", accent: "#00E676" },
                  { num: "02", title: "Multi-Location Businesses",   desc: "That require consistency, reporting, and scale.",        why: "Unified systems across every location.",    accent: "#00D4FF" },
                  { num: "03", title: "High-Value Service Providers",desc: "Where conversions matter more than traffic.",           why: "We optimize for revenue, not vanity.",      accent: "#818CF8" },
                  { num: "04", title: "Internal Teams",              desc: "That need engineering and marketing to work together.", why: "Full-stack support, one cohesive team.",    accent: "#FF6B35" },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl p-8 group cursor-default relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.045)";
                      el.style.borderColor = `${c.accent}33`;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.025)";
                      el.style.borderColor = "rgba(255,255,255,0.06)";
                    }}>
                    <div className="text-5xl font-black mb-6" style={{ color: c.accent, opacity: 0.2 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "0.2")}>
                      {c.num}
                    </div>
                    <h3 className="text-base font-bold text-[#F0F0FF] mb-2 leading-snug">{c.title}</h3>
                    <p className="text-sm text-[#7A7A9A] leading-relaxed mb-3">{c.desc}</p>
                    <p className="text-xs font-semibold opacity-0 group-hover:opacity-100" style={{ color: c.accent }}>
                      → {c.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WHAT YOU GET — BENTO ──────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(90,90,255,0.07) 0%, transparent 70%)" }} />

            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#5A5AFF]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">What You Get</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-3 leading-tight">What working with us looks like</h2>
              <p className="text-base text-[#7A7A9A] mb-14 max-w-lg">Transparency, ownership, and systems-first execution.</p>

              {/* Bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-auto">

                {/* Card 0 — Dashboard (col-span-2, featured) */}
                <div className="md:col-span-2 rounded-xl p-7 group relative overflow-hidden"
                  style={{
                    background: "rgba(90,90,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(90,90,255,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(90,90,255,0.08)",
                  }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(90,90,255,0.2)", border: "1px solid rgba(90,90,255,0.3)" }}>
                      <svg className="w-4 h-4 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#F0F0FF] mb-1">Dedicated client dashboard</h3>
                      <p className="text-sm text-[#7A7A9A]">Real-time access to requests, billing, and reporting.</p>
                    </div>
                  </div>
                  {/* Mini pulsing node graph */}
                  <svg viewBox="0 0 300 80" className="w-full opacity-30 group-hover:opacity-50 transition-opacity">
                    <line x1="20" y1="40" x2="80" y2="20" stroke="#5A5AFF" strokeWidth="1" />
                    <line x1="80" y1="20" x2="160" y2="50" stroke="#5A5AFF" strokeWidth="1" />
                    <line x1="160" y1="50" x2="220" y2="25" stroke="#00D4FF" strokeWidth="1" />
                    <line x1="220" y1="25" x2="280" y2="40" stroke="#00D4FF" strokeWidth="1" />
                    <circle cx="20"  cy="40" r="4" fill="#5A5AFF"><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" /></circle>
                    <circle cx="80"  cy="20" r="4" fill="#5A5AFF"><animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite" /></circle>
                    <circle cx="160" cy="50" r="5" fill="#818CF8"><animate attributeName="r" values="5;7;5" dur="1.8s" repeatCount="indefinite" /></circle>
                    <circle cx="220" cy="25" r="4" fill="#00D4FF"><animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite" /></circle>
                    <circle cx="280" cy="40" r="4" fill="#00D4FF"><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" /></circle>
                  </svg>
                </div>

                {/* Card 1 */}
                <BentoCard
                  title="Clear timelines & ownership"
                  desc="Every request has an owner, timeline, and status."
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                />

                {/* Card 2 */}
                <BentoCard
                  title="Request & revision tracking"
                  desc="Structured process for changes, updates, and new work."
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                />

                {/* Card 3 — featured/highlighted */}
                <div className="rounded-xl p-7 group relative overflow-hidden md:col-span-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(90,90,255,0.07))",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(0,212,255,0.22)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 40px rgba(0,212,255,0.08)",
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mb-4"
                    style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}>
                    <svg className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-[#F0F0FF] mb-1">Transparent billing</h3>
                  <p className="text-sm text-[#7A7A9A]">Know exactly what you're paying for and why.</p>
                </div>

                {/* Card 4 */}
                <BentoCard
                  title="Priority support options"
                  desc="Emergency escalation and SLA-backed response times."
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />}
                />

                {/* Card 5 — full width */}
                <div className="md:col-span-3 rounded-xl p-7 group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(90,90,255,0.15)", border: "1px solid rgba(90,90,255,0.25)" }}>
                      <svg className="w-4 h-4 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#F0F0FF] mb-1">Long-term system ownership</h3>
                      <p className="text-sm text-[#7A7A9A]">We maintain, optimize, and evolve what we build. You own it — we keep it running at peak performance indefinitely.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── TECH STACK — MARQUEE ──────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6">
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#5A5AFF]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">Tech Stack</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-3 leading-tight">Built with modern tools</h2>
              <p className="text-base text-[#7A7A9A] mb-14 max-w-lg">Enterprise-grade infrastructure and tooling for production environments.</p>

              <div className="space-y-5">
                <MarqueeRow items={ENGINEERING} speed="28s" label="Engineering" />
                <MarqueeRow items={MARKETING}   speed="22s" label="Marketing"   reverse />
                <MarqueeRow items={INFRA}        speed="36s" label="Infra"       />
              </div>
            </div>
          </section>

          {/* ── ENGAGEMENTS ───────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.025 }}>
              <TopologyBg uid="eng" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-[120px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(90,90,255,0.06) 0%, transparent 70%)" }} />

            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#5A5AFF]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">Engagements</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-3 leading-tight">How we work together</h2>
              <p className="text-base text-[#7A7A9A] mb-14 max-w-lg">Flexible models designed for different stages and needs.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EngagementCard
                  title="Ongoing Partnership"
                  desc="Monthly systems, optimization, and support for long-term operational excellence."
                  meta="Starting from a monthly retainer"
                  iconPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  accent="#5A5AFF"
                />
                <EngagementCard
                  title="Project-Based Builds"
                  desc="Clearly scoped, production-ready delivery for specific systems or products."
                  meta="Most clients go live in 3–6 weeks"
                  iconPath="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  accent="#00D4FF"
                />
                <EngagementCard
                  title="Advisory & Optimization"
                  desc="Targeted improvements and strategic direction for existing systems."
                  meta="Available for select existing systems"
                  iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  accent="#7B2FFF"
                />
              </div>

              {/* 4th card — Custom Enterprise (greyed out) */}
              <div className="mt-4 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 opacity-50"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}>
                <div>
                  <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#7A7A9A] mb-1">Enterprise</div>
                  <h4 className="text-lg font-bold text-[#F0F0FF]">Custom Enterprise</h4>
                  <p className="text-sm text-[#7A7A9A]">Fully custom scope, dedicated team, SLA guarantees. For serious scale.</p>
                </div>
                <Link href="/contact" className="flex-shrink-0 text-sm font-semibold px-6 py-3 rounded-full transition-all text-[#F0F0FF]"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}>
                  Let's Talk →
                </Link>
              </div>
            </div>
          </section>

          {/* ── FINAL CTA ─────────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-32 px-6 overflow-hidden">
            {/* Blueprint */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.05 }}>
              <TopologyBg uid="cta" />
            </div>

            {/* Aurora rotating conic gradient */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="animate-aurora-spin w-[700px] h-[700px] rounded-full"
                style={{ background: "conic-gradient(from 0deg, #5A5AFF, #00D4FF, #7B2FFF, #5A5AFF)", filter: "blur(80px)", opacity: 0.12 }} />
            </div>

            {/* Secondary orbs */}
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[110px] pointer-events-none"
              style={{ background: "rgba(0,212,255,0.06)" }} />

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            <div className="max-w-3xl mx-auto relative z-10 text-center">
              {/* Max intensity glass card */}
              <div className="rounded-3xl p-10 md:p-14"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 80px rgba(90,90,255,0.15), 0 0 120px rgba(90,90,255,0.1)",
                }}>

                {/* Orange "Limited Availability" badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase mb-6"
                  style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)", color: "#FF6B35" }}>
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
                  </span>
                  OPEN · Limited Availability
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-[#F0F0FF] mb-5 leading-tight">
                  Let's see if there's<br />
                  <span className="gradient-text">alignment.</span>
                </h2>
                <p className="text-lg text-[#7A7A9A] mb-3 max-w-md mx-auto leading-relaxed">
                  We take on new partners selectively.
                </p>
                <p className="text-base text-[#7A7A9A] mb-10 max-w-md mx-auto leading-relaxed">
                  If the fit is right, we move fast.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="btn-shimmer flex items-center gap-2 text-white px-9 py-4 rounded-full text-base font-bold transition-all"
                    style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
                    Start a Conversation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/services" className="text-[#F0F0FF] px-9 py-4 rounded-full text-base font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function BentoCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl p-7 group"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(90,90,255,0.2)"; el.style.background = "rgba(90,90,255,0.04)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.background = "rgba(255,255,255,0.025)"; }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mb-4"
        style={{ background: "rgba(90,90,255,0.15)", border: "1px solid rgba(90,90,255,0.25)" }}>
        <svg className="w-4 h-4 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
      <h3 className="text-base font-bold text-[#F0F0FF] mb-1 group-hover:text-[#818CF8]">{title}</h3>
      <p className="text-sm text-[#7A7A9A] leading-relaxed">{desc}</p>
    </div>
  );
}

function EngagementCard({ title, desc, meta, iconPath, accent }: {
  title: string; desc: string; meta: string; iconPath: string; accent: string;
}) {
  return (
    <div className="rounded-xl p-8 group relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${accent}55`; el.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.background = "rgba(255,255,255,0.025)"; }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}99, transparent)` }} />
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
        style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        <svg className="w-5 h-5" style={{ color: accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white/80 group-hover:text-white mb-3 transition-colors">{title}</h3>
      <p className="text-sm text-[#7A7A9A] leading-relaxed mb-2">{desc}</p>
      <p className="font-mono text-[11px] mb-6" style={{ color: accent }}>{meta}</p>
      <Link href="/services" className="text-sm font-bold flex items-center gap-1 transition-colors"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={e => (e.currentTarget.style.color = accent)}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
        View Services
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
