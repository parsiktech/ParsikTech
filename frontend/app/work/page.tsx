"use client";

import { useState } from "react";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default function Work() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Web Applications", "Websites", "Products", "Growth & Marketing"];

  const projects = [
    {
      name: "SafeRoute",
      description: "Education and training platform for universities and businesses",
      category: "Products",
      tags: ["Web App", "Product"],
      image: "/Saferoute/saferoute (1).png",
      slug: "saferoute",
    },
    {
      name: "E-Commerce Platform",
      description: "High-conversion shopping experience with real-time inventory sync",
      category: "Web Applications",
      tags: ["Web App", "Growth"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      slug: "ecommerce-platform",
    },
    {
      name: "Healthcare Dashboard",
      description: "Patient management system built for scalability and compliance",
      category: "Web Applications",
      tags: ["Web App"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      slug: "healthcare-dashboard",
    },
  ];

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <PageTransition>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LDX1BJYQ47');
        `}
      </Script>
      <main className="min-h-screen bg-[var(--background)]">
        <Navigation />

        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 via-[var(--background)] to-[#3B82F6]/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              Work That Speaks for Itself
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-4 max-w-3xl mx-auto">
              A selection of products, platforms, and growth systems we've built for real businesses.
            </p>
            <p className="text-[var(--text-secondary)]">Software • Web • Growth</p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-6 border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    activeFilter === filter
                      ? "bg-[#6366F1] text-white"
                      : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Link
                  key={index}
                  href={project.slug ? `/work/${project.slug}` : "#"}
                  className="group relative bg-[var(--card-bg)] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[#6366F1]/50 transition-all block"
                >
                  <div className="relative h-64 overflow-hidden bg-[var(--card-bg)]">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">View Case Study →</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{project.name}</h3>
                    <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Capability Callouts */}
        <section className="py-16 px-6 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">
              More Than Deliverables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Engineering-first systems</h3>
                <p className="text-[var(--text-secondary)]">Built to scale, maintain, and last</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Performance & analytics baked in</h3>
                <p className="text-[var(--text-secondary)]">Measure what matters from day one</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Built for scale and longevity</h3>
                <p className="text-[var(--text-secondary)]">Not just MVP, but production-grade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Integration */}
        <section className="py-16 px-6 bg-[var(--background)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Growth Is Part of the Work
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Many of our projects include analytics, conversion optimization, and performance marketing alongside development.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[var(--text-secondary)]">
              <span>Funnels</span>
              <span>•</span>
              <span>Tracking</span>
              <span>•</span>
              <span>Optimization</span>
              <span>•</span>
              <span>Paid acquisition</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-gradient-to-b from-[var(--background)] via-[var(--card-bg)] to-[var(--card-bg)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Let's build something that works — and grows.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
            >
              Start a Project
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}
