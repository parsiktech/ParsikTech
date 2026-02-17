"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor: string;
  fullDescription: string;
  includes: string[];
  bestFor: string[];
  pricingStarting: string;
  pricingNote: string;
  pairedWith: string[];
  cta: string;
}

export default function Services() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: "website-development",
      name: "Website Development",
      description: "Fast, conversion-focused websites",
      category: "Development",
      categoryColor: "blue",
      fullDescription: "Fast, conversion-focused websites.",
      includes: [
        "UX & structure",
        "Custom design & build",
        "Performance optimization",
        "CMS setup",
        "Analytics integration"
      ],
      bestFor: [
        "Businesses that need a site that works"
      ],
      pricingStarting: "From $500",
      pricingNote: "Project-based.",
      pairedWith: ["Performance Marketing", "Web Hosting & Infrastructure", "Internal Dashboards"],
      cta: "Discuss Project"
    },
    {
      id: "web-app-development",
      name: "Web App Development",
      description: "Custom internal or customer-facing tools",
      category: "Development",
      categoryColor: "blue",
      fullDescription: "Custom internal or customer-facing tools.",
      includes: [
        "System architecture",
        "Frontend & backend dev",
        "Integrations & automation",
        "Auth & permissions"
      ],
      bestFor: [
        "Replacing manual processes"
      ],
      pricingStarting: "From $1,000",
      pricingNote: "Depends on complexity.",
      pairedWith: ["Web Hosting & Infrastructure", "Internal Dashboards", "Technical Support & Maintenance"],
      cta: "Discuss Project"
    },
    {
      id: "performance-marketing",
      name: "Performance Marketing",
      description: "High-intent acquisition focused on ROI",
      category: "Growth",
      categoryColor: "green",
      fullDescription: "High-intent acquisition focused on ROI.",
      includes: [
        "Campaign strategy",
        "Paid search & social",
        "Ad creation & testing",
        "Funnel & landing optimization",
        "Conversion tracking",
        "Reporting & optimization"
      ],
      bestFor: [
        "High-value offers",
        "ROI-driven teams"
      ],
      pricingStarting: "From $4,500/month",
      pricingNote: "Scales with spend & scope.",
      pairedWith: ["Website Development", "Internal Dashboards", "Business Strategy & Systems"],
      cta: "Request This Service"
    },
    {
      id: "web-hosting",
      name: "Web Hosting & Infrastructure",
      description: "Managed hosting for sites & apps",
      category: "Infrastructure",
      categoryColor: "purple",
      fullDescription: "Managed hosting for sites & apps.",
      includes: [
        "Deployment & hosting",
        "Monitoring & backups",
        "Security & updates"
      ],
      bestFor: [
        "Production websites & apps"
      ],
      pricingStarting: "From $30/month",
      pricingNote: "Scales with usage.",
      pairedWith: ["Website Development", "Web App Development", "Technical Support & Maintenance"],
      cta: "Get Started"
    },
    {
      id: "business-strategy",
      name: "Business Strategy & Systems",
      description: "Operational clarity + execution",
      category: "Strategy",
      categoryColor: "orange",
      fullDescription: "Operational clarity + execution.",
      includes: [
        "Business analysis",
        "System design",
        "Tool selection",
        "Implementation support"
      ],
      bestFor: [
        "Teams scaling without systems"
      ],
      pricingStarting: "From $500",
      pricingNote: "Project-based.",
      pairedWith: ["Internal Dashboards", "Web App Development", "Performance Marketing"],
      cta: "Request Consultation"
    },
    {
      id: "internal-dashboards",
      name: "Internal Dashboards",
      description: "One place to see everything",
      category: "Infrastructure",
      categoryColor: "purple",
      fullDescription: "One place to see everything.",
      includes: [
        "KPI definitions",
        "Custom dashboards",
        "Data connections",
        "Ongoing sync"
      ],
      bestFor: [
        "Operators & founders"
      ],
      pricingStarting: "From $1,500 (setup)",
      pricingNote: "Ongoing sync available.",
      pairedWith: ["Business Strategy & Systems", "Performance Marketing", "Web App Development"],
      cta: "Discuss Project"
    },
    {
      id: "technical-support",
      name: "Technical Support & Maintenance",
      description: "Keep production stable",
      category: "Support",
      categoryColor: "teal",
      fullDescription: "Keep production stable.",
      includes: [
        "Bug fixes",
        "Updates",
        "Monitoring",
        "Priority support"
      ],
      bestFor: [
        "Live products & platforms"
      ],
      pricingStarting: "From $500",
      pricingNote: "OR included w/ any month-month service.",
      pairedWith: ["Web Hosting & Infrastructure", "Web App Development", "Website Development"],
      cta: "Get Support"
    },
    {
      id: "system-audit",
      name: "System Audit",
      description: "Find what's broken fast",
      category: "Premium",
      categoryColor: "gold",
      fullDescription: "Find what's broken fast.",
      includes: [
        "Tech stack review",
        "Funnel & data audit",
        "Clear action plan"
      ],
      bestFor: [
        "Businesses unsure what to fix"
      ],
      pricingStarting: "From $750 (one-time)",
      pricingNote: "High-trust / premium offer.",
      pairedWith: ["Business Strategy & Systems", "Performance Marketing", "Website Development"],
      cta: "Request Audit"
    }
  ];

  const categories = ["All", "Growth", "Development", "Infrastructure", "Strategy", "Support", "Premium"];

  const filteredServices = activeFilter === "All"
    ? services
    : services.filter(s => s.category === activeFilter);

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      green: "bg-green-500/10 text-green-500 border-green-500/20",
      blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      teal: "bg-teal-500/10 text-teal-500 border-teal-500/20",
      gold: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <PageTransition>
        <main className="min-h-screen bg-[var(--background)]">
        <Navigation />

        {/* Hero Header */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Services & Capabilities
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-2">
              Modular systems designed to scale revenue, operations, and visibility.
            </p>
            <p className="text-[var(--text-secondary)]">
              Select a service to view scope, pricing, and implementation details.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === cat
                      ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20"
                      : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] border border-[var(--border)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Card Grid */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)] hover:border-[#6366F1] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6366F1]/10 text-left group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(service.categoryColor)}`}>
                      {service.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[var(--background)] group-hover:bg-[#6366F1]/10 flex items-center justify-center transition-all duration-200">
                      <svg className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#6366F1] transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#6366F1]">
                    <span className="group-hover:underline">Learn More</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Detail Slide-over */}
        {selectedService && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={() => setSelectedService(null)}
            />

            {/* Slide-over Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-[var(--card-bg)] z-50 overflow-y-auto shadow-2xl animate-slide-in">
              <div className="p-8">
                {/* Close button */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Category badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getCategoryColor(selectedService.categoryColor)}`}>
                  {selectedService.category}
                </span>

                {/* Service name */}
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                  {selectedService.name}
                </h2>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-8">
                  {selectedService.fullDescription}
                </p>

                {/* What's Included */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {selectedService.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--text-secondary)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Best For</h3>
                  <ul className="space-y-2">
                    {selectedService.bestFor.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-8 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    {selectedService.pricingStarting}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {selectedService.pricingNote}
                  </div>
                </div>

                {/* Pairs Well With */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pairs Well With</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.pairedWith.map((item, index) => (
                      <span key={index} className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button - Links to Contact Page */}
                <Link
                  href={`/contact?service=${encodeURIComponent(selectedService.name)}`}
                  className="w-full bg-[#6366F1] text-white py-4 rounded-lg font-semibold hover:bg-[#5558E3] transition-colors flex items-center justify-center gap-2"
                >
                  {selectedService.cta}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        )}

        <Footer />
      </main>
      </PageTransition>
    </>
  );
}
