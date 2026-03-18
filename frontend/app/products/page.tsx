"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: "hawkeye",
    badge: "In Development",
    badgeColor: "#00D4FF",
    name: "HawkEye",
    logo: "/hawkeye/hawkeye-logo.png",
    tagline: "System visibility, done right.",
    description:
      "HawkEye is a local-first system monitoring and optimization tool that shows you what your computer is doing and gives you instant control when something needs fixing. It runs entirely on your machine, provides clear insight without technical complexity, and includes one-click actions and performance boosting tools to keep your system stable and responsive.",
    capabilities: [
      "Fully local — no data ever leaves your machine",
      "Quick Actions for instant system issue recovery",
      "Dynamic themes that reflect real-time system status",
      "Boost Mode for temporary performance prioritization",
      "Clear system insight without technical expertise",
      "Real-time monitoring of performance, processes, and network",
    ],
    primaryCta: null,
    secondaryCta: null,
    images: [
      { src: "/hawkeye/Hawkeye Dashboard.png", label: "Dashboard" },
      { src: "/hawkeye/hawkeyecpu.png", label: "CPU" },
      { src: "/hawkeye/hawkeyemem.png", label: "Memory" },
      { src: "/hawkeye/hawkeyedisk.png", label: "Disk" },
      { src: "/hawkeye/hawkeyenet.png", label: "Network" },
      { src: "/hawkeye/hawkeyegpu.png", label: "GPU" },
      { src: "/hawkeye/gputhreatsig.png", label: "Threat Signal" },
      { src: "/hawkeye/Hawkeyeboost.png", label: "Boost" },
    ],
  },
  {
    id: "lockshore",
    badge: "Internal System",
    badgeColor: "#7B2FFF",
    name: "Lockshore",
    logo: "/Lockshore/LockLogo.png",
    tagline: "Operate and scale private server infrastructure.",
    description:
      "Lockshore is an in-house infrastructure management platform built to monitor, manage, and secure private server farms. Originally developed to operate our own infrastructure, Lockshore is also used by other private server hosting providers to maintain full control over their environments.",
    capabilities: [
      "Private server farm monitoring",
      "Infrastructure health & uptime tracking",
      "Service and resource management",
      "Secure internal access controls",
      "Run pre-configured or custom scripts",
    ],
    primaryCta: { label: "Request Access", href: "/contact", external: false },
    secondaryCta: null,
    images: [
      { src: "/Lockshore/lockshore (2).png", label: "Overview" },
      { src: "/Lockshore/lockshore (1).png", label: "Scripts" },
      { src: "/Lockshore/lockshore (3).png", label: "Monitoring" },
    ],
  },
  {
    id: "dashboard",
    badge: "Client Platform",
    badgeColor: "#5A5AFF",
    name: "Operations Hub",
    logo: null,
    tagline: "Full visibility into requests, billing, and deliverables.",
    description:
      "A centralized platform built to give clients complete transparency and control over their engagement with us. Track active requests, review billing and usage, approve content deliverables, and access priority support — all from a single interface designed for clarity and efficiency.",
    capabilities: [
      "Real-time request tracking",
      "Billing & usage visibility",
      "Content approvals & delivery",
      "Priority support access",
    ],
    primaryCta: { label: "View Platform", href: "/login", external: false },
    secondaryCta: { label: "Contact Us", href: "/contact", external: false },
    images: [
      { src: "/ClientPanel/ClientPanel (1).png", label: "Overview" },
      { src: "/ClientPanel/ClientPanel (2).png", label: "Requests" },
      { src: "/ClientPanel/ClientPanel (3).png", label: "Billing" },
      { src: "/ClientPanel/ClientPanel (4).png", label: "Documents" },
      { src: "/ClientPanel/ClientPanel (5).png", label: "Content" },
      { src: "/ClientPanel/ClientPanel (6).png", label: "Forecasting" },
      { src: "/ClientPanel/ClientPanel (7).png", label: "Training" },
      { src: "/ClientPanel/ClientPanel (8).png", label: "Support" },
    ],
  },
  {
    id: "saferoute",
    badge: "Education & Success",
    badgeColor: "#00E676",
    name: "SafeRoute™",
    logo: null,
    tagline: "Education and training that scales — built for real results.",
    description:
      "SafeRoute is a comprehensive education and training platform offering both individual, job-ready courses and enterprise learning solutions for businesses and universities. Organizations leverage SafeRoute as a full-scale training platform for onboarding, compliance, and required certifications across multiple industries.",
    capabilities: [
      "Onboarding programs and compliance training",
      "Accredited, job-ready certification courses",
      "Multi-industry training and credentialing",
      "Full admin visibility and reporting",
      "Community scholarships and access programs",
      "Dynamic site-wide themes",
    ],
    primaryCta: { label: "View Product", href: "https://saferoute.com", external: true },
    secondaryCta: { label: "Request Demo", href: "/contact", external: false },
    images: [
      { src: "/Saferoute/saferoute (1).png", label: "Overview" },
      { src: "/Saferoute/saferoute (2).png", label: "Courses" },
      { src: "/Saferoute/saferoute (3).png", label: "Learning" },
      { src: "/Saferoute/saferoute (5).png", label: "Progress" },
      { src: "/Saferoute/saferoute (6).png", label: "Certifications" },
      { src: "/Saferoute/saferoute (8).png", label: "Dashboard" },
      { src: "/Saferoute/saferoute (10).png", label: "Analytics" },
      { src: "/Saferoute/saferoute (9).png", label: "Reports" },
      { src: "/Saferoute/saferoute (7).png", label: "Settings" },
      { src: "/Saferoute/saferoute (4).png", label: "Admin" },
    ],
  },
];

const philosophyCards = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    ),
    title: "Built for Real Use",
    desc: "Every product solves a real operational problem — not a pitch deck idea. We use them ourselves first.",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    title: "Engineered to Scale",
    desc: "We design systems that grow with the business, not break under pressure. Architecture-first, always.",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    ),
    title: "Maintained Long-Term",
    desc: "Our products aren't shipped and abandoned. We maintain, improve, and evolve them continuously.",
  },
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});
  const [expandedImage, setExpandedImage] = useState<{ src: string; label: string } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const current = products[activeProduct];
  const imgIdx = activeImageIndex[current.id] || 0;

  useEffect(() => {
    if (current.images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveImageIndex(prev => {
        const i = (prev[current.id] || 0);
        return { ...prev, [current.id]: (i + 1) % current.images.length };
      });
    }, 2500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeProduct, current]);

  const handleProductChange = (index: number) => {
    if (index === activeProduct) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveProduct(index); setTimeout(() => setIsTransitioning(false), 50); }, 120);
  };

  const handleImageChange = (productId: string, i: number) => {
    setActiveImageIndex(prev => ({ ...prev, [productId]: i }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      const p = products.find(p => p.id === productId)!;
      intervalRef.current = setInterval(() => {
        setActiveImageIndex(prev => ({ ...prev, [productId]: ((prev[productId] || 0) + 1) % p.images.length }));
      }, 2500);
    }
  };

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <section className="relative pt-16 md:pt-28 pb-20 px-6 overflow-hidden">
            {/* Gradient blobs */}
            <div className="absolute pointer-events-none inset-0 overflow-hidden">
              <div className="animate-blob-1 absolute w-[550px] h-[550px] rounded-full blur-[130px]"
                style={{ top: "0%", left: "10%", background: "radial-gradient(circle, rgba(90,90,255,0.10) 0%, transparent 70%)" }} />
              <div className="animate-blob-2 absolute w-[450px] h-[450px] rounded-full blur-[120px]"
                style={{ top: "30%", right: "5%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#5A5AFF]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                  Our Products
                </span>
                <div className="h-px w-8 bg-[#5A5AFF]" />
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.06] tracking-tight mb-6 text-[#F0F0FF]">
                Purpose-Built.<br />
                <span className="shimmer-text">Production-Ready.</span>
              </h1>
              <p className="text-lg text-[#9090B0] max-w-2xl mx-auto leading-relaxed">
                In-house platforms engineered to solve real operational problems — actively maintained and built to scale.
              </p>
            </div>
          </section>

          {/* ── PRODUCT SWITCHER + DISPLAY ────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-20 px-6">
            <div className="max-w-7xl mx-auto">

              {/* Tab selector */}
              <div className="flex flex-wrap gap-2 mb-14 p-1.5 rounded-2xl w-fit"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => handleProductChange(i)}
                    className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={
                      activeProduct === i
                        ? {
                            background: "linear-gradient(135deg, rgba(90,90,255,0.25), rgba(0,212,255,0.12))",
                            border: "1px solid rgba(90,90,255,0.35)",
                            color: "#F0F0FF",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid transparent",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {activeProduct === i && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5A5AFF]" />
                    )}
                    <span className={activeProduct === i ? "ml-3" : ""}>{p.name.replace("™", "")}</span>
                  </button>
                ))}
              </div>

              {/* Product content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                {/* Left — info */}
                <div className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                        style={{ background: current.badgeColor }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ background: current.badgeColor }} />
                    </div>
                    <span className="font-mono text-[11px] font-semibold tracking-[0.16em] uppercase"
                      style={{ color: current.badgeColor }}>
                      {current.badge}
                    </span>
                  </div>

                  {/* Name + logo */}
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] tracking-tight">
                      {current.name}
                    </h2>
                    {current.logo && (
                      <Image src={current.logo} alt={current.name} width={52} height={52}
                        className="w-12 h-12 object-contain" />
                    )}
                  </div>

                  <p className="text-lg font-semibold mb-5" style={{ color: current.badgeColor }}>
                    {current.tagline}
                  </p>

                  <p className="text-base text-[#9090B0] mb-8 leading-relaxed">
                    {current.description}
                  </p>

                  {/* Capabilities */}
                  <div className="rounded-2xl p-6 mb-8"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}>
                    <p className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A7A9A] mb-4">
                      Key Capabilities
                    </p>
                    <ul className="space-y-3">
                      {current.capabilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="#5A5AFF" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-[#B0B0C8] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    {!current.primaryCta ? (
                      <div className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-mono text-sm font-semibold text-[#F0F0FF]"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse inline-block" />
                        Coming Soon
                      </div>
                    ) : current.primaryCta.external ? (
                      <a href={current.primaryCta.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold btn-shimmer"
                        style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
                        {current.primaryCta.label}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link href={current.primaryCta.href}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold btn-shimmer"
                        style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 20px rgba(90,90,255,0.4)" }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")}>
                        {current.primaryCta.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {current.secondaryCta && (
                      <Link href={current.secondaryCta.href}
                        className="px-7 py-3 rounded-full text-[#F0F0FF] text-sm font-semibold"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(90,90,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>
                        {current.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right — image showcase */}
                <div className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                  {/* 3D card frame */}
                  <div style={{ perspective: "1200px" }}>
                    <div className="relative" style={{ transform: "rotateY(-8deg) rotateX(3deg)", transformStyle: "preserve-3d" }}>
                      {/* Glow halo */}
                      <div className="absolute inset-6 rounded-2xl blur-3xl pointer-events-none"
                        style={{ background: "rgba(90,90,255,0.2)" }} />

                      {/* Frame */}
                      <div className="relative rounded-2xl overflow-hidden"
                        style={{ border: "1px solid rgba(90,90,255,0.25)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>

                        {/* Browser chrome */}
                        <div className="flex items-center gap-1.5 px-4 py-3"
                          style={{ background: "#0D0D1A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                          <div className="flex-1 mx-4">
                            <div className="h-5 rounded-md text-center font-mono text-[10px] text-white/20 flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
                              {current.name.toLowerCase().replace(" ", "")}.parsiktechgroup.com
                            </div>
                          </div>
                        </div>

                        {/* Image area */}
                        <button
                          onClick={() => setExpandedImage(current.images[imgIdx])}
                          className="relative w-full bg-[#070710] aspect-[16/10] block cursor-zoom-in overflow-hidden group"
                        >
                          {current.images.map((img, i) => (
                            <img key={i} src={img.src} alt={img.label}
                              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-250 ${imgIdx === i ? "opacity-100" : "opacity-0"}`} />
                          ))}
                          {/* Scan line */}
                          <div className="animate-scan-line pointer-events-none" />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Expand
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Live badge */}
                      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: "#0D0D1A", border: "1px solid rgba(90,90,255,0.3)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                        <span className="relative flex w-1.5 h-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
                        </span>
                        <span className="font-mono text-[10px] text-[#00E676] tracking-widest">
                          {current.images[imgIdx]?.label ?? "Live"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dot nav */}
                  {current.images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {current.images.map((_, i) => (
                        <button key={i} onClick={() => handleImageChange(current.id, i)}
                          className="rounded-full transition-all"
                          style={{
                            width: imgIdx === i ? "20px" : "8px",
                            height: "8px",
                            background: imgIdx === i
                              ? "linear-gradient(90deg, #5A5AFF, #00D4FF)"
                              : "rgba(255,255,255,0.15)",
                          }}
                          aria-label={`Image ${i + 1}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── PHILOSOPHY ───────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="animate-blob-3 absolute w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{ bottom: "0%", left: "30%", background: "radial-gradient(circle, rgba(123,47,255,0.06) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-14">
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF] mb-3 block">
                  Our Approach
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] tracking-tight">
                  How We Build Products
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {philosophyCards.map((c, i) => (
                  <div key={i} className="rounded-2xl p-8"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(90,90,255,0.2)"; el.style.background = "rgba(90,90,255,0.04)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.background = "rgba(255,255,255,0.025)"; }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                      style={{ background: "rgba(90,90,255,0.12)", border: "1px solid rgba(90,90,255,0.22)" }}>
                      <svg className="w-5 h-5 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {c.icon}
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#F0F0FF] mb-3">{c.title}</h3>
                    <p className="text-sm text-[#7A7A9A] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ──────────────────────────────────────────────── */}
          <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            {/* Aurora */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-aurora-spin w-[700px] h-[700px] rounded-full opacity-[0.08]"
                style={{ background: "conic-gradient(from 0deg, #5A5AFF, #00D4FF, #7B2FFF, #5A5AFF)", filter: "blur(80px)" }} />
            </div>

            <div className="max-w-3xl mx-auto relative z-10 text-center">
              <div className="rounded-3xl px-10 py-14"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px rgba(90,90,255,0.12)",
                }}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                  style={{ background: "rgba(90,90,255,0.12)", border: "1px solid rgba(90,90,255,0.25)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5AFF] animate-pulse inline-block" />
                  <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-[#818CF8]">
                    Explore More
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-4 leading-tight">
                  Interested in Our <span className="gradient-text">Products?</span>
                </h2>
                <p className="text-base text-[#9090B0] mb-10 leading-relaxed">
                  Whether you're looking to use one of our platforms or explore a custom-built solution, we're ready to talk.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact"
                    className="btn-shimmer flex items-center gap-2 text-white px-9 py-4 rounded-full text-base font-bold"
                    style={{ background: "linear-gradient(135deg, #5A5AFF, #00D4FF)", boxShadow: "0 0 28px rgba(90,90,255,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 45px rgba(90,90,255,0.75)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 28px rgba(90,90,255,0.45)")}>
                    Start a Conversation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/services"
                    className="px-9 py-4 rounded-full text-[#F0F0FF] text-base font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(90,90,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>
                    View Our Services
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Footer />

          {/* ── IMAGE MODAL ───────────────────────────────────────── */}
          {expandedImage && (
            <>
              <div className="fixed inset-0 bg-black/92 backdrop-blur-sm z-[100] animate-fade-in"
                onClick={() => setExpandedImage(null)} />
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                <div className="relative w-[95vw] max-w-[1400px] pointer-events-auto animate-scale-in">
                  <button onClick={() => setExpandedImage(null)}
                    className="absolute -top-10 right-0 text-white/60 hover:text-white flex items-center gap-2 text-sm">
                    Close
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: "#070710", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={expandedImage.src} alt={expandedImage.label}
                      className="max-w-full max-h-[92vh] object-contain" />
                  </div>
                  {expandedImage.label && (
                    <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg font-mono text-sm text-white/80"
                      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {expandedImage.label}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </main>
      </PageTransition>
    </>
  );
}
