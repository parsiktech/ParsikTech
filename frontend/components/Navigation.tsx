"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/components/ui/use-scroll";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/work",     label: "Work"     },
  { href: "/contact",  label: "Contact"  },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full md:transition-all md:ease-out",
        scrolled && !open
          ? [
              "bg-[rgba(4,4,10,0.82)] backdrop-blur-[24px]",
              "border-b border-white/[0.06]",
              "shadow-[0_1px_0_rgba(90,90,255,0.2),0_12px_48px_rgba(0,0,0,0.6)]",
              // floating pill on desktop
              "md:top-4 md:max-w-4xl md:mx-auto md:rounded-2xl",
              "md:border md:border-white/[0.1]",
            ].join(" ")
          : open
          ? "bg-[rgba(4,4,10,0.98)]"
          : "bg-transparent",
      )}
    >
      {/* Main nav bar */}
      <nav
        className={cn(
          "flex h-16 w-full items-center justify-between px-5 md:px-6 md:transition-all md:ease-out",
          scrolled && "md:h-14",
        )}
      >
        {/* Logo + live status */}
        <div className="flex items-center gap-3">
          <Link href="/" onClick={close} className="hover:opacity-75 transition-opacity">
            <Image
              src="/PTG LOGOS/WhitePTnoBG.png"
              alt="Parsik Tech Group"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 ml-1">
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]" />
            </div>
            <span className="text-[10px] font-mono text-[var(--success)] tracking-[0.12em]">
              Systems Active
            </span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) =>
            pathname !== href ? (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {label}
              </Link>
            ) : null,
          )}
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-white text-sm font-semibold btn-shimmer transition-shadow duration-200"
            style={{
              background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
              boxShadow: "0 0 20px rgba(90,90,255,0.4)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 35px rgba(90,90,255,0.7)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(90,90,255,0.4)")
            }
          >
            Client Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-primary)]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-16 right-0 bottom-0 left-0 z-50 flex-col border-t border-white/[0.06] md:hidden",
          open ? "flex" : "hidden",
        )}
        style={{ background: "rgba(4,4,10,0.98)", backdropFilter: "blur(24px)" }}
      >
        <div
          data-slot={open ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95",
            "data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95",
            "ease-out flex h-full w-full flex-col justify-between p-6",
          )}
        >
          {/* Links */}
          <div className="flex flex-col gap-2 mt-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="w-full px-5 py-4 rounded-xl text-base font-semibold"
                style={{
                  background:
                    pathname === href
                      ? "rgba(90,90,255,0.1)"
                      : "rgba(255,255,255,0.025)",
                  border: `1px solid ${
                    pathname === href
                      ? "rgba(90,90,255,0.25)"
                      : "rgba(255,255,255,0.05)"
                  }`,
                  color:
                    pathname === href
                      ? "var(--accent)"
                      : "var(--text-primary)",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pb-8">
            <div className="flex items-center gap-2 justify-center mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse inline-block" />
              <span className="text-[10px] font-mono text-[var(--success)] tracking-widest">
                Systems Active
              </span>
            </div>
            <Link
              href="/login"
              onClick={close}
              className="flex items-center justify-center w-full py-4 rounded-full text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #5A5AFF, #00D4FF)",
                boxShadow: "0 0 24px rgba(90,90,255,0.4)",
              }}
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              onClick={close}
              className="flex items-center justify-center w-full py-4 rounded-xl text-[var(--text-primary)] font-semibold"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
