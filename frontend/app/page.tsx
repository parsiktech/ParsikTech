"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const clientPanelImages = [
  { src: '/ClientPanel/ClientPanel (1).png', label: 'Overview' },
  { src: '/ClientPanel/ClientPanel (2).png', label: 'Requests' },
  { src: '/ClientPanel/ClientPanel (3).png', label: 'Billing' },
  { src: '/ClientPanel/ClientPanel (4).png', label: 'Documents' },
  { src: '/ClientPanel/ClientPanel (5).png', label: 'Content' },
  { src: '/ClientPanel/ClientPanel (6).png', label: 'Forecasting' },
  { src: '/ClientPanel/ClientPanel (7).png', label: 'Training' },
  { src: '/ClientPanel/ClientPanel (8).png', label: 'Support' }
];

export default function Home() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({ revenue: 0, adSpend: 0, leads: 0, costs: 0, efficiency: 0 });
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle images every 4 seconds
  useEffect(() => {
    imageIntervalRef.current = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % clientPanelImages.length);
    }, 4000);

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }
    };
  }, []);

  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
    // Reset the interval when manually changing
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current);
      imageIntervalRef.current = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % clientPanelImages.length);
      }, 4000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Count up animations with smooth easing
            const duration = 2000; // 2000ms for slower, smoother animation
            const fps = 60;
            const totalFrames = (duration / 1000) * fps;

            const targets = {
              revenue: 400,
              adSpend: 50,
              leads: 600,
              costs: 350,
              efficiency: 75
            };

            let frame = 0;
            const interval = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;

              if (progress >= 1) {
                setCounts(targets);
                clearInterval(interval);
              } else {
                // Apply ease-out for smoother animation
                const eased = 1 - Math.pow(1 - progress, 2);
                setCounts({
                  revenue: Math.floor(targets.revenue * eased),
                  adSpend: Math.floor(targets.adSpend * eased),
                  leads: Math.floor(targets.leads * eased),
                  costs: Math.floor(targets.costs * eased),
                  efficiency: Math.floor(targets.efficiency * eased)
                });
              }
            }, 1000 / fps);

            return () => clearInterval(interval);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LDX1BJYQ47');
            `,
          }}
        />
      </head>
      <PageTransition>
        <main className="min-h-screen bg-[#0A0A0A] relative">
        <Navigation />

        {/* HERO SECTION — OG SIMPLICITY, MODERN CONTENT */}
        <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden md:pt-20 lg:pt-0">
          {/* Deep vignette background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          {/* Subtle blue/purple ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,107,255,0.05)_0%,transparent_50%)]"></div>
          {/* Spotlight effect shining down on hero text */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_1400px_550px_at_50%_45%,rgba(99,102,241,0.09)_0%,transparent_65%)]"></div>
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>

          <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              Where software, strategy, and execution come together.
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
              Software, infrastructure, and growth solutions designed to perform and scale.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/services"
                className="bg-[#6366F1] text-white px-10 py-5 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="bg-[var(--card-bg)] text-[var(--text-primary)] px-10 py-5 rounded-lg text-lg font-medium hover:bg-[var(--background)] transition-all border border-[var(--border)]"
              >
                Contact Us
              </Link>
            </div>

            {/* Feature Status Row */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border)] flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">Servers</span>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border)] flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">Devs</span>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border)] flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">Support</span>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur border border-[var(--border)] flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">Response Time</span>
                <span className="text-xs text-[#6366F1]">&lt; 24 hrs</span>
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIAL IMPACT - AT A GLANCE */}
        <section ref={sectionRef} className="py-16 px-6 relative overflow-hidden">
          {/* Deep vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          {/* Subtle blue ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,107,255,0.04)_0%,transparent_60%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-[90rem] mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">AT A GLANCE</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">Real Financial Impact</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                The scale behind the systems we build and operate.
              </p>
            </div>

            {/* Scoreboard Layout - Single Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-16 lg:gap-20">
              {/* Revenue Generated */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                  ${hasAnimated ? counts.revenue : 0}k+
                </div>
                <div className="text-base md:text-lg font-medium text-[var(--text-primary)] mb-1">
                  Revenue Generated
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                  Across client systems
                </div>
              </div>

              {/* Ad Spend Managed */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                  ${hasAnimated ? counts.adSpend : 0}k+
                </div>
                <div className="text-base md:text-lg font-medium text-[var(--text-primary)] mb-1">
                  Ad Spend Managed
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                  In production
                </div>
              </div>

              {/* Leads Captured */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                  {hasAnimated ? counts.leads : 0}k+
                </div>
                <div className="text-base md:text-lg font-medium text-[var(--text-primary)] mb-1">
                  Leads Captured
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                  Automated pipelines
                </div>
              </div>

              {/* Costs Replaced */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                  ${hasAnimated ? counts.costs : 0}k+
                </div>
                <div className="text-base md:text-lg font-medium text-[var(--text-primary)] mb-1">
                  Costs Replaced
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                  Operational systems
                </div>
              </div>

              {/* Efficiency Gained */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                  {hasAnimated ? counts.efficiency : 0}%+
                </div>
                <div className="text-base md:text-lg font-medium text-[var(--text-primary)] mb-1">
                  Efficiency Gained
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                  Sustained impact
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLIENT DASHBOARD SHOWCASE */}
        <section className="py-24 px-6 relative">
          {/* Deep vignette with purple glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(122,92,255,0.04)_0%,transparent_60%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Product Info */}
              <div>
                <div className="inline-block px-4 py-2 rounded-full bg-[#6366F1]/20 text-[#6366F1] text-base font-bold mb-6 border border-[#6366F1]/40 shadow-lg shadow-[#6366F1]/10 uppercase tracking-wide">
                  Included With Every Service
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                  Operations Hub
                </h2>
                <p className="text-xl text-[#6366F1] mb-6">
                  Full visibility into your engagement — no guessing, no chasing.
                </p>
                <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Every client gets access to a dedicated operations dashboard. Track requests, review billing, approve deliverables, and reach support — all from one interface built for clarity and accountability.
                </p>

                {/* Key Capabilities */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">What You Get</h3>
                  <ul className="space-y-3">
                    {[
                      "Real-time request tracking & status updates",
                      "Transparent billing & usage reporting",
                      "Content review & approval workflows",
                      "Priority support access & escalation",
                      "Full project history & documentation"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-[#6366F1] mt-0.5 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--text-secondary)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/services"
                    className="inline-block bg-[#6366F1] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
                  >
                    View Services
                  </Link>
                  <Link
                    href="/login"
                    className="inline-block bg-[var(--card-bg)] text-[var(--text-primary)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--card-bg)]/80 transition-all border border-[var(--border)]"
                  >
                    Client Login
                  </Link>
                </div>
              </div>

              {/* Right: Dashboard Preview */}
              <div className="relative space-y-4">
                <div
                  className="bg-[#0A0A0A] rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => setIsImageExpanded(true)}
                >
                  <div className="relative aspect-[16/10]">
                    {clientPanelImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={`Operations Dashboard - ${image.label}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                          activeImageIndex === index
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-95'
                        }`}
                      />
                    ))}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Click to expand
                      </div>
                    </div>
                    {/* Active image label */}
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-sm text-white/90 font-medium">
                      {clientPanelImages[activeImageIndex].label}
                    </div>
                  </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2">
                  {clientPanelImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        activeImageIndex === index
                          ? 'bg-[#6366F1] scale-110 shadow-lg shadow-[#6366F1]/40'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`View ${clientPanelImages[index].label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE'RE BUILT FOR */}
        <section className="py-20 px-6 relative">
          {/* Deep vignette with subtle blue glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(79,107,255,0.03)_0%,transparent_60%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4 text-center">Built for teams that need systems, not experiments.</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12 text-center max-w-3xl mx-auto">
              We work best with businesses that value reliability, transparency, and long-term results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[var(--card-bg)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Founder-Led Companies</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  That need reliable execution without managing vendors.
                </p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Multi-Location Businesses</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  That require consistency, reporting, and scale.
                </p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">High-Value Service Providers</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Where conversions matter more than traffic.
                </p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Internal Teams</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  That need engineering and marketing to work together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT CLIENTS ACTUALLY GET */}
        <section className="py-20 px-6 relative">
          {/* Deep vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4 text-center">What working with us looks like</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12 text-center">
              Transparency, ownership, and systems-first execution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Dedicated client dashboard</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Real-time access to requests, billing, and reporting.</p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Clear timelines & ownership</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Every request has an owner, timeline, and status.</p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Request and revision tracking</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Structured process for changes, updates, and new work.</p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Transparent billing & reporting</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Know exactly what you're paying for and why.</p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Priority support options</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Emergency escalation and SLA-backed response times.</p>
                </div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Long-term system ownership</h3>
                  <p className="text-sm text-[var(--text-secondary)]">We maintain, optimize, and evolve what we build.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLS & INFRASTRUCTURE */}
        <section className="py-20 px-6 relative">
          {/* Deep vignette with subtle purple glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(122,92,255,0.03)_0%,transparent_70%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">Built with modern tools</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12">
              Enterprise-grade infrastructure and tooling for production environments.
            </p>

            {/* Engineering */}
            <div className="mb-10">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Engineering</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["React", "Next.js", "Node", "TypeScript", "PostgreSQL", "Docker"].map((tool, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{tool}</span>
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">production</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing */}
            <div className="mb-10">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Marketing</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["Google Ads", "Meta Ads", "LinkedIn", "GA4", "GTM"].map((tool, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{tool}</span>
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">enterprise</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics & Infrastructure */}
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Infrastructure</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["AWS", "Vercel", "Cloudflare", "Stripe", "Notion", "Linear", "Figma", "GitHub"].map((tool, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{tool}</span>
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">scalable</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ENGAGEMENT MODELS */}
        <section className="py-20 px-6 relative">
          {/* Deep vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4 text-center">How engagements typically work</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12 text-center">
              Flexible models designed for different stages and needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--background)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ongoing Partnership</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Monthly systems, optimization, and support.
                </p>
                <Link href="/services" className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm">
                  View Services →
                </Link>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Project-Based Builds</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Clearly scoped, production-ready delivery.
                </p>
                <Link href="/services" className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm">
                  View Services →
                </Link>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-8 border border-[var(--border)] hover:border-[#6366F1]/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Advisory & Optimization</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Targeted improvements to existing systems.
                </p>
                <Link href="/services" className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm">
                  View Services →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 px-6 relative">
          {/* Deep vignette with blue glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0E0E0E_0%,#0A0A0A_100%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,107,255,0.05)_0%,transparent_70%)]"></div>
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-gradient-to-br from-[#6366F1]/10 to-[#3B82F6]/5 rounded-lg p-12 border border-[#6366F1]/20 text-center">
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                Let's see if there's alignment.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                We partner with a limited number of clients at a time.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
                >
                  Start a Conversation
                </Link>
                <Link
                  href="/services"
                  className="bg-[var(--card-bg)] text-[var(--text-primary)] px-10 py-4 rounded-lg text-lg font-medium hover:bg-[var(--background)] transition-all border border-[var(--border)]"
                >
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        {/* Expanded Image Modal */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
            isImageExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsImageExpanded(false)}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${
            isImageExpanded ? 'opacity-100' : 'opacity-0'
          }`}></div>

          {/* Image Container */}
          <div
            className={`relative w-[95vw] max-w-[1400px] transition-all duration-300 ease-out ${
              isImageExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 inline-block">
              <img
                src={clientPanelImages[activeImageIndex].src}
                alt={`Operations Hub Dashboard - ${clientPanelImages[activeImageIndex].label}`}
                className="max-w-full max-h-[92vh] object-contain"
              />
            </div>
            {/* Label */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white font-medium">
              {clientPanelImages[activeImageIndex].label}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--card-bg)] rounded-full flex items-center justify-center border border-[var(--border)] hover:bg-[#6366F1] hover:border-[#6366F1] transition-all group"
            >
              <svg className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Removed old gradient animation - no longer needed */
      `}</style>
      </PageTransition>
    </>
  );
}
