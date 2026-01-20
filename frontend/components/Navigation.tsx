"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Primary pages with icons and descriptions
const primaryPages = [
  {
    href: "/",
    title: "Home",
    description: "Back to the beginning",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/services",
    title: "Services",
    description: "What we build",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/products",
    title: "Products",
    description: "Our solutions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Get in touch",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// Secondary pages
const secondaryPages = [
  { href: "/work", title: "Work" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're on the homepage
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      // Show mobile nav after scrolling 20vh (only for homepage)
      setShowMobileNav(window.scrollY > window.innerHeight * 0.2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when selector is open
  useEffect(() => {
    if (isSelectorOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSelectorOpen]);

  const handleNavClick = () => {
    setIsSelectorOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomepage ? "bg-[var(--background)]/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        } ${
          // On homepage: hide mobile nav until scroll, on other pages: always show
          isHomepage
            ? (showMobileNav ? "translate-y-0 opacity-100" : "md:translate-y-0 md:opacity-100 -translate-y-full opacity-0")
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/PTG LOGOS/WhitePTnoBG.png"
              alt="Parsik Tech"
              width={200}
              height={60}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {pathname !== "/products" && (
              <Link href="/products" className="text-lg text-[var(--text-primary)] hover:text-[#6366F1] transition-colors">
                Products
              </Link>
            )}
            {pathname !== "/services" && (
              <Link href="/services" className="text-lg text-[var(--text-primary)] hover:text-[#6366F1] transition-colors">
                Services
              </Link>
            )}
            {pathname !== "/work" && (
              <Link href="/work" className="text-lg text-[var(--text-primary)] hover:text-[#6366F1] transition-colors">
                Work
              </Link>
            )}
            {pathname !== "/contact" && (
              <Link href="/contact" className="text-lg text-[var(--text-primary)] hover:text-[#6366F1] transition-colors">
                Contact
              </Link>
            )}
            <Link
              href="/login"
              className="bg-[#6366F1] text-white px-8 py-3 rounded-lg hover:bg-[#5558E3] transition-colors text-lg"
            >
              Client Login
            </Link>
          </div>

          {/* Mobile Menu Trigger - 2x2 Grid Icon */}
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--card-bg)] transition-colors"
            aria-label="Open navigation"
          >
            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Page Selector Overlay */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-200 ${
          isSelectorOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsSelectorOpen(false)}
        />

        {/* Selector Panel */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f] transition-transform duration-200 ${
            isSelectorOpen ? "translate-y-0" : "translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              Navigate
            </span>
            <button
              onClick={() => setIsSelectorOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close navigation"
            >
              <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto h-[calc(100vh-80px)]">
            {/* Primary Pages */}
            <div className="space-y-3 mb-8">
              {primaryPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={handleNavClick}
                  className={`block w-full p-4 rounded-xl border transition-all duration-150 active:scale-[0.98] ${
                    pathname === page.href
                      ? "bg-[#6366F1]/10 border-[#6366F1]/30 shadow-lg shadow-[#6366F1]/5"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${
                        pathname === page.href
                          ? "bg-[#6366F1]/20 text-[#6366F1]"
                          : "bg-white/5 text-[var(--text-secondary)]"
                      }`}
                    >
                      {page.icon}
                    </div>
                    <div>
                      <div
                        className={`font-semibold ${
                          pathname === page.href ? "text-[#6366F1]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        {page.title}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">{page.description}</div>
                    </div>
                    {pathname === page.href && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Secondary Pages */}
            <div className="mb-8">
              <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-1">
                More
              </div>
              <div className="space-y-2">
                {secondaryPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={handleNavClick}
                    className={`block w-full px-4 py-3 rounded-lg transition-all duration-150 active:scale-[0.98] ${
                      pathname === page.href
                        ? "bg-[#6366F1]/10 text-[#6366F1]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Utility Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/login"
                onClick={handleNavClick}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#6366F1] text-white font-semibold transition-all duration-150 hover:bg-[#5558E3] active:scale-[0.98] shadow-lg shadow-[#6366F1]/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Client Login
              </Link>
              <Link
                href="/contact"
                onClick={handleNavClick}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] font-semibold transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
