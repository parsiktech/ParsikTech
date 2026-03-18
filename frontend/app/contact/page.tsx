"use client";

import { useState, useEffect, useRef } from "react";
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

// ─── TopologyBg SVG ────────────────────────────────────────────────────────────

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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const formRef = useRef<HTMLDivElement>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setFormVisible(true); }); },
      { threshold: 0.1 }
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => { if (formRef.current) observer.unobserve(formRef.current); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-200 disabled:opacity-50 focus:ring-0";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(8px)",
  };
  const inputFocusStyle = {
    border: "1px solid #5A5AFF",
    boxShadow: "0 0 0 3px rgba(90,90,255,0.12)",
  };

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <section className="min-h-[60vh] flex items-center px-6 relative overflow-hidden">

            {/* Gradient mesh blobs */}
            <div className="absolute pointer-events-none overflow-hidden inset-0">
              <div className="animate-blob-1 absolute w-[600px] h-[600px] rounded-full blur-[130px]"
                style={{ top: "5%", left: "15%", background: "radial-gradient(circle, rgba(90,90,255,0.12) 0%, transparent 70%)" }} />
              <div className="animate-blob-2 absolute w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ top: "45%", right: "8%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }} />
              <div className="animate-blob-3 absolute w-[420px] h-[420px] rounded-full blur-[110px]"
                style={{ top: "15%", right: "25%", background: "radial-gradient(circle, rgba(123,47,255,0.08) 0%, transparent 70%)" }} />
            </div>

            {/* Topology blueprint */}
            <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.045 }}>
              <TopologyBg uid="contact-hero" />
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            {/* Content */}
            <div className="max-w-7xl mx-auto w-full relative z-10 pt-20 md:pt-36 pb-20">
              <div className="max-w-3xl">

                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-8 bg-[#5A5AFF] flex-shrink-0" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                    Let&rsquo;s Build Together
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.02] tracking-tight mb-6 text-[#F0F0FF]">
                  Start a&nbsp;
                  <span className="shimmer-text">Conversation.</span>
                </h1>

                <p className="text-[1.2rem] text-[#9090B0] mb-10 leading-relaxed max-w-2xl">
                  Tell us about your project. We respond within 24 hours and are ready to move fast.
                </p>

                {/* Status indicators */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Team",     val: "Available", green: true  },
                    { label: "Support",  val: "Online",    green: true  },
                    { label: "Response", val: "< 24 hrs",  green: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        backdropFilter: "blur(10px)",
                      }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.green ? "bg-[#00E676]" : "bg-[#00D4FF]"}`}
                        style={{ boxShadow: s.green ? "0 0 6px rgba(0,230,118,0.7)" : "0 0 6px rgba(0,212,255,0.7)" }} />
                      <span className="font-mono text-[11px] text-[#5A5A7A]">{s.label}</span>
                      <span className="font-mono text-[11px] text-[#9090B0] font-semibold">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FORM SECTION ─────────────────────────────────────── */}
          <section className="py-16 px-6 relative" ref={formRef}>

            {/* Subtle section separator glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, rgba(90,90,255,0.4), transparent)" }} />

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* ── Contact Form (3/5) ── */}
                <div
                  className={`lg:col-span-3 transition-all duration-700 ${formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "0ms" }}
                >
                  <div className="rounded-2xl p-8"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
                    }}>

                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-7">
                      <div className="h-px w-5 bg-[#5A5AFF] flex-shrink-0" />
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">
                        Send a Message
                      </span>
                    </div>

                    {/* Status messages */}
                    {submitStatus.type && (
                      <div
                        className="mb-6 p-4 rounded-xl flex items-center gap-3"
                        style={{
                          background: submitStatus.type === "success"
                            ? "rgba(0,230,118,0.08)"
                            : "rgba(255,107,53,0.08)",
                          border: submitStatus.type === "success"
                            ? "1px solid rgba(0,230,118,0.2)"
                            : "1px solid rgba(255,107,53,0.2)",
                        }}
                      >
                        {submitStatus.type === "success" ? (
                          <svg className="w-5 h-5 text-[#00E676] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#FF6B35] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <p className={`text-sm font-medium ${submitStatus.type === "success" ? "text-[#00E676]" : "text-[#FF6B35]"}`}>
                          {submitStatus.message}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-[#9090B0] text-sm font-medium mb-2">
                            Full Name <span className="text-[#5A5AFF]">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            required
                            disabled={isSubmitting}
                            placeholder="Jane Smith"
                            className={inputClass}
                            style={inputStyle}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                            onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-[#9090B0] text-sm font-medium mb-2">
                            Email Address <span className="text-[#5A5AFF]">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            disabled={isSubmitting}
                            placeholder="jane@company.com"
                            className={inputClass}
                            style={inputStyle}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                            onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-[#9090B0] text-sm font-medium mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          disabled={isSubmitting}
                          placeholder="What can we help you with?"
                          className={inputClass}
                          style={inputStyle}
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                          onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-[#9090B0] text-sm font-medium mb-2">
                          Message <span className="text-[#5A5AFF]">*</span>
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={6}
                          disabled={isSubmitting}
                          placeholder="Tell us about your project, goals, or questions..."
                          className={`${inputClass} resize-none`}
                          style={inputStyle}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                          onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-shimmer w-full flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full text-base font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                          boxShadow: "0 0 20px rgba(90,90,255,0.4)",
                        }}
                        onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)"; }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* ── Contact Info (2/5) ── */}
                <div
                  className={`lg:col-span-2 space-y-5 transition-all duration-700 ${formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "120ms" }}
                >

                  {/* Info Card */}
                  <div className="rounded-2xl p-7"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
                    }}>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-5 bg-[#5A5AFF] flex-shrink-0" />
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#5A5AFF]">
                        Contact Info
                      </span>
                    </div>

                    <div className="space-y-5">

                      {/* Phone */}
                      <a href="tel:+17866967762"
                        className="flex items-start gap-4 group cursor-pointer"
                        aria-label="Call Parsik Tech">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                          style={{
                            background: "rgba(90,90,255,0.12)",
                            border: "1px solid rgba(90,90,255,0.22)",
                          }}>
                          <svg className="w-5 h-5 text-[#5A5AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#5A5A7A] text-xs font-mono uppercase tracking-wider mb-0.5">Phone</p>
                          <p className="text-[#F0F0FF] font-medium group-hover:text-[#818CF8] transition-colors duration-200">
                            +1 (786) 696-7762
                          </p>
                        </div>
                      </a>

                      {/* Email */}
                      <a href="mailto:support@parsiktechgroup.com"
                        className="flex items-start gap-4 group cursor-pointer"
                        aria-label="Email Parsik Tech">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                          style={{
                            background: "rgba(90,90,255,0.12)",
                            border: "1px solid rgba(90,90,255,0.22)",
                          }}>
                          <svg className="w-5 h-5 text-[#5A5AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#5A5A7A] text-xs font-mono uppercase tracking-wider mb-0.5">Email</p>
                          <p className="text-[#F0F0FF] font-medium group-hover:text-[#818CF8] transition-colors duration-200 break-all">
                            support@parsiktechgroup.com
                          </p>
                        </div>
                      </a>

                      {/* Location */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(90,90,255,0.12)",
                            border: "1px solid rgba(90,90,255,0.22)",
                          }}>
                          <svg className="w-5 h-5 text-[#5A5AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#5A5A7A] text-xs font-mono uppercase tracking-wider mb-0.5">Location</p>
                          <p className="text-[#F0F0FF] font-medium">Remote & On-site</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="my-7" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

                    {/* Social */}
                    <div>
                      <p className="text-[#5A5A7A] text-xs font-mono uppercase tracking-wider mb-4">Follow Us</p>
                      <div className="flex gap-3">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7A7A9A] transition-all duration-200 cursor-pointer hover:text-[#F0F0FF]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.4)"; e.currentTarget.style.background = "rgba(90,90,255,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7A7A9A] transition-all duration-200 cursor-pointer hover:text-[#F0F0FF]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.4)"; e.currentTarget.style.background = "rgba(90,90,255,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                          aria-label="Twitter / X"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#7A7A9A] transition-all duration-200 cursor-pointer hover:text-[#F0F0FF]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(90,90,255,0.4)"; e.currentTarget.style.background = "rgba(90,90,255,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CTA Card */}
                  <div
                    className={`rounded-2xl p-7 relative overflow-hidden transition-all duration-700 ${formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{
                      transitionDelay: "220ms",
                      background: "rgba(90,90,255,0.07)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(90,90,255,0.22)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 60px rgba(90,90,255,0.14)",
                    }}>
                    {/* Subtle glow accent */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                      style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)" }} />
                    <div className="relative z-10">
                      <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#00D4FF] mb-3">
                        Ready to start?
                      </p>
                      <p className="text-[#F0F0FF] font-semibold text-lg leading-snug mb-2">
                        We turn ideas into systems that scale.
                      </p>
                      <p className="text-[#7A7A9A] text-sm leading-relaxed">
                        From strategy to deployment — we handle the full stack so you can focus on growth.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <div className="pb-8" />
          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
