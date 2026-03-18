"use client";

import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://github.com",
    label: "GitHub",
    hoverColor: "rgba(255,255,255,0.25)",
    hoverBorder: "rgba(255,255,255,0.3)",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    hoverColor: "rgba(0,119,181,0.25)",
    hoverBorder: "rgba(0,119,181,0.5)",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "X / Twitter",
    hoverColor: "rgba(255,255,255,0.15)",
    hoverBorder: "rgba(255,255,255,0.3)",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const quickLinks = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[var(--background)]">
      {/* Gradient top border */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #5A5AFF 35%, #00D4FF 65%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Brand Column */}
          <div>
            <div className="mb-2">
              <Image
                src="/PTG LOGOS/WhitePTnoBG.png"
                alt="Parsik Tech Group"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p
              className="text-[10px] font-mono tracking-[0.22em] uppercase mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Software · Systems · Execution
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Software that works. Systems that scale.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[11px] font-mono uppercase tracking-[0.18em] mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm transition-colors duration-200 w-fit"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4
              className="text-[11px] font-mono uppercase tracking-[0.18em] mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Connect
            </h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ href, label, hoverColor, hoverBorder, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-250"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = hoverColor;
                    el.style.borderColor = hoverBorder;
                    el.style.color = "#fff";
                    el.style.boxShadow = `0 0 16px ${hoverColor}`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.color = "var(--text-secondary)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Built with Next.js, deployed on Vercel.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            &copy; {new Date().getFullYear()} Parsik Tech Group. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--success)" }}
            />
            <span className="text-xs font-mono" style={{ color: "var(--success)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
