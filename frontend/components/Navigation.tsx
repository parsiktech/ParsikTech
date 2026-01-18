"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      // Show mobile nav after scrolling 50vh
      setShowMobileNav(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[var(--background)]/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      } ${
        showMobileNav ? "translate-y-0 opacity-100" : "md:translate-y-0 md:opacity-100 -translate-y-full opacity-0"
      }`}
    >
      <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] hover:text-[#6366F1] transition-colors">
          Parsik Tech
        </Link>

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

        {/* Mobile menu button - we'll add this later if needed */}
      </div>
    </nav>
  );
}
