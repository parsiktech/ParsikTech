"use client";

import Link from "next/link";
import s from "./page.module.css";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="4.5"/>
    <path d="M21 2l-9.6 9.6M15.5 7.5l2 2"/>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconMessageSquare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    day: "Now",
    title: "Complete Your Intake Form",
    desc: "Use the button above to fill out your intake form. It takes about 10 minutes and covers your website, tools, goals, and biggest frustrations. The more detail you give us, the sharper the audit.",
  },
  {
    day: "Days 2–5",
    title: "We Do the Work",
    desc: "PTG conducts the full audit across all five areas. No back-and-forth needed. You run your business — we dig in.",
  },
  {
    day: "Day 6",
    title: "Report Delivered",
    desc: "You'll receive your written audit report in PDF format, with an optional Loom walkthrough. Everything organized by priority — no jargon, no filler.",
  },
  {
    day: "Day 7",
    title: "Strategy Call",
    desc: "We hop on a 60-minute call to walk through every finding together, answer your questions, and map out what to do next. You leave with a clear plan.",
  },
];

const prepCards = [
  {
    icon: <IconKey />,
    title: "Gather Your Tools List",
    desc: "Think through what platforms you're currently using — CMS, CRM, booking system, ad accounts. You won't need to share credentials, just a general list.",
  },
  {
    icon: <IconMessageSquare />,
    title: "Note Your Biggest Frustration",
    desc: "What's the one thing online that's been bothering you most? Slow site? Leads going quiet? Having it top of mind will sharpen the intake form answers.",
  },
  {
    icon: <IconTarget />,
    title: "Think About Your 90-Day Goal",
    desc: "More leads, a cleaner system, a site you're proud of? Knowing this shapes how we prioritize findings — so you leave with a plan that actually fits your business.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThankYouPage() {
  return (
    <>
      <title>You&apos;re In — Next Steps | PTG</title>

      {/* ── NAV ── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>PTG<span>.</span></Link>
        <Link
          href="/"
          className={s.navBack}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to site
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className={s.hero}>
        {/* Grid */}
        <svg className={s.heroGrid} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="tpg" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tpg)"/>
        </svg>
        {/* Blobs */}
        <div className={`${s.blob} ${s.blob1}`} aria-hidden="true"/>
        <div className={`${s.blob} ${s.blob2}`} aria-hidden="true"/>
        <div className={`${s.blob} ${s.blob3}`} aria-hidden="true"/>

        <div className={s.heroInner}>
          {/* Animated checkmark */}
          <div className={s.checkWrap} aria-hidden="true">
            <div className={s.checkGlow}/>
            <svg className={s.checkSvg} viewBox="0 0 80 80">
              <defs>
                <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5A5AFF"/>
                  <stop offset="100%" stopColor="#00D4FF"/>
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="36" stroke="url(#cg)" strokeWidth="1.5" fill="rgba(90,90,255,0.06)" className={s.checkRing}/>
              <polyline
                points="24,42 35,53 57,30"
                stroke="#00D4FF"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={s.checkMark}
              />
            </svg>
          </div>

          <div className={s.badge}>
            <span className={s.badgeDot} aria-hidden="true"/>
            Payment Confirmed
          </div>

          <h1 className={s.h1}>
            You&rsquo;re <span className="shimmer-text">In.</span>
          </h1>

          <p className={s.heroSub}>
            Your Business Systems Audit is booked. Here&rsquo;s exactly what happens next — and what to expect from us.
          </p>

          {/* Order summary card */}
          <div className={s.orderCard}>
            <div className={s.orderRow}>
              <span className={s.orderLabel}>Service</span>
              <span className={s.orderVal}>Business Systems Audit</span>
            </div>
            <div className={s.orderDivider}/>
            <div className={s.orderRow}>
              <span className={s.orderLabel}>Amount paid</span>
              <span className={s.orderValAccent}>$750</span>
            </div>
            <div className={s.orderDivider}/>
            <div className={s.orderRow}>
              <span className={s.orderLabel}>Timeline</span>
              <span className={s.orderVal}>5–7 business days</span>
            </div>
            <div className={s.orderDivider}/>
            <div className={s.orderRow}>
              <span className={s.orderLabel}>Confirmation</span>
              <span className={s.orderVal}>Sent to your email</span>
            </div>
          </div>

          {/* Intake CTA */}
          <div className={s.intakeCta}>
            <p className={s.intakeCtaLabel}>Ready to get started?</p>
            <Link
              href="/audit/intake"
              className={`btn-shimmer ${s.intakeBtn}`}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(90,90,255,0.4)")}
            >
              Fill Out Your Intake Form <IconArrow />
            </Link>
            <p className={s.intakeNote}>Takes about 10 minutes. The more detail, the sharper the audit.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT ── */}
      <section className={s.section}>
        <div className={s.container}>
          <p className={s.label}>What&rsquo;s Next</p>
          <h2 className={s.heading}>Your <span className="shimmer-text">roadmap</span> from here.</h2>
          <p className={s.sub}>From today to your strategy call — the full process, step by step.</p>
          <div className={s.stepsWrap}>
            <div className={s.stepsLine} aria-hidden="true"/>
            {steps.map((step, i) => (
              <div key={i} className={s.step}>
                <div className={s.stepLeft}>
                  <div className={s.stepNum}>{i + 1}</div>
                </div>
                <div className={s.stepBody}>
                  <span className={s.stepDay}>{step.day}</span>
                  <div className={s.stepTitle}>{step.title}</div>
                  <div className={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHILE YOU WAIT ── */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <p className={s.label}>While You Wait</p>
          <h2 className={s.heading}>Three things to think about.</h2>
          <p className={s.sub}>You don&rsquo;t have to do anything right now — but if you want to hit the ground running, these help.</p>
          <div className={s.prepGrid}>
            {prepCards.map((card, i) => (
              <div key={i} className={s.prepCard}>
                <div className={s.prepIcon}>{card.icon}</div>
                <div className={s.prepTitle}>{card.title}</div>
                <div className={s.prepDesc}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUESTIONS CTA ── */}
      <section className={s.ctaSection}>
        {/* Grid */}
        <svg className={s.heroGrid} viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="cpg" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cpg)"/>
        </svg>
        <div className={`${s.blob} ${s.ctaBlob}`} aria-hidden="true"/>
        <div className={s.container} style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <p className={s.label}>Questions?</p>
          <h2 className={s.heading} style={{ margin: "0 auto 16px" }}>
            We&rsquo;re a message <span className="shimmer-text">away.</span>
          </h2>
          <p className={s.sub} style={{ margin: "0 auto 44px", textAlign: "center" }}>
            If anything comes up before we kick off — reach out. We actually respond.
          </p>
          <div className={s.ctaActions}>
            <a
              href="mailto:support@parsiktechgroup.com"
              className={`btn-shimmer ${s.ctaBtn}`}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(90,90,255,0.4)")}
            >
              <IconMail />
              support@parsiktechgroup.com
            </a>
            <Link href="/audit/intake" className={s.ctaSecondary}>
              Fill Out Your Intake Form
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <span>© 2026 Parsik Tech Group</span>
        <Link href="/audit/intake" className={s.footerLink}>Fill Out Your Intake Form →</Link>
      </footer>
    </>
  );
}
