"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(8px)",
  };
  const inputFocusStyle: React.CSSProperties = {
    border: "1px solid #5A5AFF",
    boxShadow: "0 0 0 3px rgba(90,90,255,0.12)",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setIsLoading(true);
    // Simple auth — replace with real auth
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("clientName", email.split("@")[0]);
    router.push("/dashboard");
  };

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="bg-[#04040A] relative overflow-x-hidden min-h-screen">

          {/* Blobs */}
          <div className="absolute pointer-events-none inset-0 overflow-hidden">
            <div className="animate-blob-1 absolute w-[600px] h-[600px] rounded-full blur-[130px]"
              style={{ top: "-5%", left: "5%", background: "radial-gradient(circle, rgba(90,90,255,0.11) 0%, transparent 70%)" }} />
            <div className="animate-blob-2 absolute w-[450px] h-[450px] rounded-full blur-[120px]"
              style={{ top: "30%", right: "0%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
            <div className="animate-blob-3 absolute w-[350px] h-[350px] rounded-full blur-[110px]"
              style={{ bottom: "10%", left: "30%", background: "radial-gradient(circle, rgba(123,47,255,0.07) 0%, transparent 70%)" }} />
          </div>

          {/* Topology */}
          <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.04 }}>
            <TopologyBg uid="login" />
          </div>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          {/* Content */}
          <section className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-16 pb-16">
            <div className="w-full max-w-md">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-8 bg-[#5A5AFF]" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-[#5A5AFF]">
                    Client Portal
                  </span>
                  <div className="h-px w-8 bg-[#5A5AFF]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0FF] mb-3 leading-tight">
                  Welcome <span className="shimmer-text">Back.</span>
                </h1>
                <p className="text-[#9090B0]">Sign in to access your Operations Hub.</p>
              </div>

              {/* Card */}
              <div className="rounded-2xl p-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
                }}>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#9090B0] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-lg text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-200"
                      style={inputStyle}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-[#9090B0]">
                        Password
                      </label>
                      <a href="#" className="text-xs text-[#5A5AFF] hover:text-[#818CF8] transition-colors cursor-pointer">
                        Forgot password?
                      </a>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 rounded-lg text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-200"
                      style={inputStyle}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2.5 p-3 rounded-lg"
                      style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)" }}>
                      <svg className="w-4 h-4 text-[#FF6B35] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-[#FF6B35]">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-shimmer w-full flex items-center justify-center gap-2 text-white py-4 rounded-full font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    style={{
                      background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                      boxShadow: "0 0 20px rgba(90,90,255,0.4)",
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = "0 0 35px rgba(90,90,255,0.7)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(90,90,255,0.4)"; }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-[#5A5A7A] mt-6">
                Need access?{" "}
                <a href="/contact" className="text-[#5A5AFF] hover:text-[#818CF8] transition-colors cursor-pointer">
                  Contact us
                </a>
              </p>

            </div>
          </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
