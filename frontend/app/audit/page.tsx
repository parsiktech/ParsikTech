"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./page.module.css";

// ─── Topology Data (matches home page) ───────────────────────────────────────

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
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`g-${uid}`} width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#g-${uid})`}/>
      {TOPO_CONNS.map(([ai, bi, dashed], i) => {
        const a = TOPO_NODES[ai], b = TOPO_NODES[bi];
        return <path key={i} d={`M ${a.x} ${a.y} H ${b.x} V ${b.y}`}
          stroke="#5A5AFF" strokeWidth={dashed ? 0.6 : 1} fill="none"
          strokeDasharray={dashed ? "3 7" : undefined}/>;
      })}
      {DIAMOND_CONNS.map((ci) => {
        const [ai, bi] = TOPO_CONNS[ci];
        const a = TOPO_NODES[ai], b = TOPO_NODES[bi];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        return <rect key={ci} x={mx-4} y={my-4} width={8} height={8} fill="#5A5AFF" transform={`rotate(45 ${mx} ${my})`}/>;
      })}
      {TOPO_NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.hub ? 5 : 3} fill="#5A5AFF"/>
          <circle cx={n.x} cy={n.y} r={n.hub ? 11 : 7} fill="none" stroke="#5A5AFF" strokeWidth="0.5"/>
          {n.hub && <circle cx={n.x} cy={n.y} r={18} fill="none" stroke="#5A5AFF" strokeWidth="0.3"/>}
        </g>
      ))}
    </svg>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg className={`${s.faqChev} ${open ? s.faqChevOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Is this just a pitch for your other services?",
    a: "No. The audit is a standalone deliverable. We're not going to spend your strategy call trying to sell you something — we'll spend it walking through findings. If PTG can help with the next steps, we'll mention it once. No pressure.",
  },
  {
    q: "What if I already have an agency or someone managing my website?",
    a: "Even better. The audit gives you an independent, outside view of what's actually happening. A lot of our clients use it to evaluate current vendors or decide what to keep vs. change.",
  },
  {
    q: "How much time does this take on my end?",
    a: "About 10 minutes for the intake form, and one hour for the strategy call. That's it. We handle the rest.",
  },
  {
    q: "Is $750 actually worth it?",
    a: "Most businesses we audit have at least one fixable issue that's costing them more than $750/month — a broken contact form, a weak Google listing, leads not being followed up automatically. The audit finds it. What you do with that is up to you.",
  },
  {
    q: "What if I'm not ready to make any changes right now?",
    a: "That's fine. The report doesn't expire. A lot of clients get the audit, file the findings, and come back when the timing is right. You'll know exactly where to start when you're ready.",
  },
];

const painPoints = [
  "I know we're losing leads somewhere but I have no idea where they're dropping off.",
  "Our website is embarrassing but I don't know if a redesign is actually the fix.",
  "I've paid for SEO and marketing before and have nothing to show for it.",
  "Everything is duct-taped together and I don't know what we actually need to fix first.",
  "We look smaller online than we are — and I think it's costing us clients.",
  "I don't know if the money I'm spending on ads and tools is actually working.",
];

const features = [
  {
    title: "Website",
    desc: "Speed, mobile performance, UX gaps, call-to-action clarity, broken elements, and technical health.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    ),
  },
  {
    title: "Digital Presence",
    desc: "Google Business Profile, local SEO signals, online directories, reviews, and social media consistency.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
    ),
  },
  {
    title: "Tech Stack",
    desc: "CRM, booking tools, email automation, integrations — what's missing, what's redundant, what's costing you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
    ),
  },
  {
    title: "Competitor Snapshot",
    desc: "Side-by-side look at 2–3 of your direct local competitors and where you're losing ground.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    ),
  },
  {
    title: "Operations",
    desc: "Manual processes that should be automated, client experience friction points, and underused tools.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
    ),
  },
  {
    title: "Prioritized Action Plan",
    desc: "Quick wins, 30-day fixes, and 60–90 day projects — ranked by impact so you know exactly what to do first.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    ),
  },
];

const deliverables = [
  { title: "Written audit report (PDF)", desc: "Findings organized by priority: Critical, Important, and Nice-to-Have." },
  { title: "60-minute strategy call", desc: "Walk through every finding together — no fluff, no pitch." },
  { title: "Prioritized action list", desc: "Quick wins you can execute this week, plus a 30/60/90-day roadmap." },
  { title: "Loom walkthrough", desc: "Optional recorded video walkthrough of your report for your team." },
];

const steps = [
  { day: "Day 0", title: "Pay & Fill Out Intake", desc: "Secure your spot for $750. Fill out a short intake form — your website, the tools you use, your goals, and your biggest frustrations. Takes about 10 minutes." },
  { day: "Days 2–5", title: "We Do the Work", desc: "PTG conducts the full audit across all five areas. No meetings needed. No back-and-forth. You run your business — we dig in." },
  { day: "Day 6", title: "Report Delivered", desc: "You receive your written audit report in PDF format, with an optional Loom walkthrough. Everything organized by priority — no jargon, no filler." },
  { day: "Day 7", title: "Strategy Call", desc: "We hop on a 60-minute call to walk through findings together, answer any questions, and talk through what to do next. You leave with a clear plan." },
];

const whoCards = [
  {
    title: "Law Firms", sub: "Attorneys & managing partners",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M12 2L2 8h20L12 2z"/><line x1="7" y1="10" x2="7" y2="20"/><line x1="12" y1="10" x2="12" y2="20"/><line x1="17" y1="10" x2="17" y2="20"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  },
  {
    title: "Medical & Dental", sub: "Practices & clinic owners",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    title: "Real Estate", sub: "Brokerages & agents",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    title: "Restaurants", sub: "Owners & operators",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>,
  },
  {
    title: "Gyms & Fitness", sub: "Studio & gym owners",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="6" y1="12" x2="18" y2="12"/><rect x="3" y="9" width="3" height="6" rx="1"/><rect x="18" y="9" width="3" height="6" rx="1"/><rect x="6" y="10.5" width="3" height="3" rx=".5"/><rect x="15" y="10.5" width="3" height="3" rx=".5"/></svg>,
  },
  {
    title: "Retail", sub: "Shop owners & boutiques",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    title: "Startups", sub: "Founders & early-stage teams",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  },
  {
    title: "Professional Services", sub: "Consultants & agencies",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(3);

  const toggleFaq = (i: number) => setOpenFaq(prev => prev === i ? null : i);

  return (
    <>
      <title>Business Systems Audit – $750 Flat | PTG</title>

      {/* ── NAV ── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>PTG<span>.</span></Link>
        <a href="#cta"
          className="btn-shimmer flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-shadow"
          style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)", fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
          Get Your Audit <IconArrow />
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className={s.hero}>
        <svg className={s.heroGrid} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="pg" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
        <div className={`${s.blob} ${s.blob1}`} aria-hidden="true"/>
        <div className={`${s.blob} ${s.blob2}`} aria-hidden="true"/>
        <div className={`${s.blob} ${s.blob3}`} aria-hidden="true"/>

        <div className={s.heroInner}>
          <div className={s.badge}>
            <span className={s.badgeDot} aria-hidden="true"/>
            Limited Availability
          </div>
          <h1 className={s.h1}>
            Find Out Exactly What <span className="shimmer-text">Your Business</span> Is Losing Online
          </h1>
          <p className={s.heroSub}>
            A full review of your website, digital presence, and business tech — delivered in one week with a clear action plan.
          </p>
          <div className={s.priceRow} aria-label="Price: $750 flat, no surprises">
            <span className={s.priceBig}>$750</span>
            <span className={s.priceNote}>flat. No surprises.</span>
          </div>
          <p className={s.delivery}>5–7 business days &nbsp;·&nbsp; Written report + 60-min strategy call</p>
          <a href="https://buy.stripe.com/14A3cwfoG6Uq1r4aTo67S00"
            target="_blank" rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-2 text-white px-8 py-4 rounded-full text-base font-semibold transition-shadow"
            style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)", fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
            Book Your Audit <IconArrow />
          </a>
          <p className={s.trust}>No agency retainer. No long-term commitment. Just answers.</p>
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(135deg, rgba(90,90,255,0.22) 0%, rgba(0,212,255,0.08) 50%, rgba(90,90,255,0.18) 100%)",
        backdropFilter: "blur(16px)",
        padding: "18px 24px",
        textAlign: "center",
      }}>
        {/* Left glow blob */}
        <div style={{
          position: "absolute", top: "-40px", left: "10%", width: "200px", height: "120px",
          background: "radial-gradient(ellipse, rgba(90,90,255,0.35) 0%, transparent 70%)",
          filter: "blur(24px)", pointerEvents: "none",
        }}/>
        {/* Right glow blob */}
        <div style={{
          position: "absolute", top: "-40px", right: "10%", width: "200px", height: "120px",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.2) 0%, transparent 70%)",
          filter: "blur(24px)", pointerEvents: "none",
        }}/>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(90,90,255,0.8) 30%, rgba(0,212,255,0.5) 70%, transparent 100%)",
        }}/>
        <span style={{
          fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif",
          fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em",
          color: "#ffffff",
        }}>
          Law firms &nbsp;·&nbsp; Medical practices &nbsp;·&nbsp; Restaurants &nbsp;·&nbsp; Gyms &nbsp;·&nbsp; Retail &nbsp;·&nbsp; Startups &amp; more
        </span>
      </div>

      {/* ── PROBLEM ── */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <p className={s.label}>The Problem</p>
          <h2 className={s.heading}>You&apos;ve built a solid business.<br/>But something&apos;s not clicking online.</h2>
          <p className={s.sub}>Most local business owners we talk to can feel it — they&apos;re just not sure where the leak is.</p>
          <div className={s.painGrid}>
            {painPoints.map((pt, i) => (
              <div key={i} className={s.painCard}><p>{pt}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className={s.section}>
        <div className={s.container}>
          <p className={s.label}>What Clients Say</p>
          <div className={s.testimonialGrid}>
            <div className={s.testimonialCard}>
              <p className={s.testimonialQuote}>&ldquo;We had no idea our Google listing was completely unoptimized. The report was eye-opening.&rdquo;</p>
              <div className={s.testimonialAuthor}>
                <span className={s.testimonialName}>Marcus T.</span>
                <span className={s.testimonialRole}>Restaurant Owner</span>
              </div>
            </div>
            <div className={s.testimonialCard}>
              <p className={s.testimonialQuote}>&ldquo;Worth every dollar. Found three things in the first week that we fixed immediately.&rdquo;</p>
              <div className={s.testimonialAuthor}>
                <span className={s.testimonialName}>Daniela R.</span>
                <span className={s.testimonialRole}>Law Firm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className={s.section}>
        <div className={s.container}>
          <p className={s.label}>What We Review</p>
          <h2 className={s.heading}>Five areas. One clear picture.</h2>
          <p className={s.sub}>We go through every part of your digital presence and business systems — then tell you exactly what we found.</p>
          <div className={s.featGrid}>
            {features.map((f) => (
              <div key={f.title} className={s.featCard}>
                <div className={s.featIcon}>{f.icon}</div>
                <div className={s.featTitle}>{f.title}</div>
                <div className={s.featDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section className={s.sectionCard} style={{ position: "relative", overflow: "hidden" }}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}/>
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: "600px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(90,90,255,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}/>
        </div>
        <div className={s.container} style={{ position: "relative", zIndex: 2 }}>
          <div className={s.delivInner}>
            <h2 className={s.heading}>What you walk away with</h2>
            <ul className={s.delivList} aria-label="Deliverables">
              {deliverables.map((d) => (
                <li key={d.title} className={s.delivItem}>
                  <div className={s.delivCheck}><IconCheck /></div>
                  <div>
                    <div className={s.delivTitle}>{d.title}</div>
                    <div className={s.delivDesc}>{d.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <p className={s.label}>The Process</p>
          <h2 className={s.heading}>Simple. Fast. No heavy lifting on your end.</h2>
          <p className={s.sub}>The whole thing takes one week. You fill out a 10-minute intake form — we handle the rest.</p>
          <div className={s.stepsWrap}>
            <div className={s.stepsLine} aria-hidden="true"/>
            {steps.map((step, i) => (
              <div key={i} className={s.step}>
                <div className={s.stepNum} aria-hidden="true">{i + 1}</div>
                <div className={s.stepBody}>
                  <span className={s.stepTag}>{step.day}</span>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className={s.section}>
        <div className={s.container}>
          <p className={s.label}>Who It&apos;s For</p>
          <h2 className={s.heading}>Built for local business owners.</h2>
          <p className={s.sub}>If you&apos;re running a real business and something about your digital setup doesn&apos;t feel right — this is for you.</p>
          <div className={s.whoGrid}>
            {whoCards.map((c) => (
              <div key={c.title} className={s.whoCard}>
                <div className={s.whoIcon}>{c.icon}</div>
                <div className={s.whoTitle}>{c.title}</div>
                <div className={s.whoSub}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO'S BEHIND THIS ── */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.aboutBlock}>
            <p className={s.label}>About PTG</p>
            <p className={s.aboutText}>
              PTG is a Miami-based agency founded to help local businesses compete online. We work with owners across South Florida on web, marketing, and business systems. This audit is how we start most of our best client relationships — you get a clear picture first, and we earn the right to do more.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <p className={s.label}>Common Questions</p>
          <h2 className={s.heading}>Straight answers.</h2>
          <div className={s.faqList} role="list">
            {faqs.map((faq, i) => (
              <div key={i} className={s.faqItem} role="listitem">
                <button
                  className={s.faqQ}
                  aria-expanded={openFaq === i}
                  onClick={() => toggleFaq(i)}
                >
                  {faq.q}
                  <IconChevron open={openFaq === i} />
                </button>
                {openFaq === i && <div className={s.faqA}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative border-t border-white/[0.05] py-32 px-6 overflow-hidden" style={{ background: "#050508" }}>
        {/* Topology blueprint */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.05 }}>
          <TopologyBg uid="audit-cta"/>
        </div>

        {/* Aurora rotating conic gradient */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="animate-aurora-spin w-[700px] h-[700px] rounded-full"
            style={{ background: "conic-gradient(from 0deg, #5A5AFF, #00D4FF, #7B2FFF, #5A5AFF)", filter: "blur(80px)", opacity: 0.12 }}/>
        </div>

        {/* Secondary orb */}
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[110px] pointer-events-none"
          style={{ background: "rgba(0,212,255,0.06)" }}/>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}/>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="rounded-3xl p-10 md:p-14" style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 80px rgba(90,90,255,0.15), 0 0 120px rgba(90,90,255,0.1)",
          }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase mb-6"
              style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)", color: "#FF6B35" }}>
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-60"/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]"/>
              </span>
              Limited Spots Available
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-[#F0F0FF] mb-5 leading-tight"
              style={{ fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}>
              Ready to see what&apos;s<br/>
              <span className="gradient-text">actually going on?</span>
            </h2>

            <p className="text-lg text-[#7A7A9A] mb-3 max-w-md mx-auto leading-relaxed">
              One week. One flat fee.
            </p>
            <p className="text-base text-[#7A7A9A] mb-10 max-w-md mx-auto leading-relaxed">
              A clear picture of your digital systems — and exactly what to do about them.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://buy.stripe.com/14A3cwfoG6Uq1r4aTo67S00" target="_blank" rel="noopener noreferrer" className="btn-shimmer flex items-center gap-2 text-white px-9 py-4 rounded-full text-base font-bold transition-all"
                style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)",
                  fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
                Book Your $750 Audit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="mailto:support@parsiktechgroup.com" className="text-[#F0F0FF] px-9 py-4 rounded-full text-base font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)", fontFamily: "var(--font-display), 'Plus Jakarta Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                Ask a Question
              </a>
            </div>

            <p className="mt-8 text-sm font-mono" style={{ color: "#40405A" }}>
              $750 flat &nbsp;·&nbsp; 5–7 business days &nbsp;·&nbsp; Written report + strategy call
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <p className={s.footerCopy}>© 2026 Parsik Tech Group</p>
        <a href="https://parsiktechgroup.com" className={s.footerLink} target="_blank" rel="noopener noreferrer">
          parsiktechgroup.com
        </a>
      </footer>
    </>
  );
}
