"use client";

import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

// Case study data
const caseStudies: { [key: string]: any } = {
  "saferoute": {
    name: "SafeRoute",
    tagline: "Building a scalable education platform for workforce development",
    category: "Products",
    tags: ["Web App", "Product", "EdTech"],
    image: "/saferoutepic.png",
    challenge: "Organizations needed a comprehensive platform to manage employee onboarding, compliance training, and professional certifications across multiple industries. Existing solutions were fragmented, expensive, and lacked the flexibility to support both universities and businesses.",
    solution: "We built SafeRoute as a full-scale education and training platform that handles everything from onboarding programs to accredited certifications. The platform provides real-time visibility into learner progress, automated compliance tracking, and supports multiple credential types across industries.",
    results: [
      { metric: "Platform Uptime", value: "99.9%" },
      { metric: "Active Organizations", value: "50+" },
      { metric: "Courses Delivered", value: "500+" },
      { metric: "User Satisfaction", value: "4.8/5" },
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    features: [
      {
        title: "Multi-Industry Training",
        description: "Support for compliance training, onboarding programs, and professional certifications across various industries with customizable course structures.",
      },
      {
        title: "Accredited Certifications",
        description: "Job-ready courses that provide real-world credentials recognized by employers, with built-in assessment and verification systems.",
      },
      {
        title: "Admin Dashboard",
        description: "Comprehensive reporting and analytics for organizations to track learner progress, completion rates, and compliance status in real-time.",
      },
      {
        title: "Scholarship Programs",
        description: "Built-in scholarship management system to support community access and workforce development initiatives.",
      },
    ],
  },
  "ecommerce-platform": {
    name: "E-Commerce Platform",
    tagline: "High-conversion shopping experience with real-time inventory",
    category: "Web Applications",
    tags: ["Web App", "Growth", "E-Commerce"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    challenge: "A growing retail business needed a modern e-commerce platform that could handle high traffic, provide real-time inventory updates, and optimize for conversions without sacrificing performance.",
    solution: "We developed a custom e-commerce platform built on a headless architecture, enabling lightning-fast page loads, real-time inventory sync across multiple warehouses, and a conversion-optimized checkout flow.",
    results: [
      { metric: "Conversion Rate", value: "+127%" },
      { metric: "Page Load Time", value: "1.2s" },
      { metric: "Cart Abandonment", value: "-45%" },
      { metric: "Mobile Sales", value: "+89%" },
    ],
    technologies: ["React", "Next.js", "Shopify API", "Stripe", "Redis"],
    features: [
      {
        title: "Real-Time Inventory",
        description: "Live inventory sync across multiple warehouses and fulfillment centers, preventing overselling and improving customer experience.",
      },
      {
        title: "Optimized Checkout",
        description: "Streamlined checkout process with guest checkout, saved payment methods, and one-click purchasing for returning customers.",
      },
      {
        title: "Performance Analytics",
        description: "Deep analytics integration tracking user behavior, conversion funnels, and revenue attribution across marketing channels.",
      },
      {
        title: "Mobile-First Design",
        description: "Responsive design optimized for mobile shopping, with touch-friendly interfaces and fast mobile performance.",
      },
    ],
  },
  "healthcare-dashboard": {
    name: "Healthcare Dashboard",
    tagline: "Patient management system built for scalability and compliance",
    category: "Web Applications",
    tags: ["Web App", "Healthcare", "HIPAA"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    challenge: "A healthcare provider needed a secure, HIPAA-compliant patient management system that could scale with their growing practice while maintaining strict data security standards.",
    solution: "We built a comprehensive healthcare dashboard with end-to-end encryption, role-based access control, and automated compliance monitoring. The system handles patient records, appointment scheduling, and billing in one integrated platform.",
    results: [
      { metric: "Patient Capacity", value: "+200%" },
      { metric: "Administrative Time", value: "-60%" },
      { metric: "Security Incidents", value: "0" },
      { metric: "Provider Satisfaction", value: "4.9/5" },
    ],
    technologies: ["React", "Node.js", "MongoDB", "AWS", "HIPAA Compliance"],
    features: [
      {
        title: "HIPAA Compliance",
        description: "Built-in compliance monitoring, encrypted data storage, audit logging, and role-based access control to meet healthcare regulations.",
      },
      {
        title: "Patient Portal",
        description: "Secure patient portal for appointment scheduling, medical records access, and secure messaging with healthcare providers.",
      },
      {
        title: "Integrated Billing",
        description: "Automated billing and insurance claims processing with real-time verification and payment tracking.",
      },
      {
        title: "Analytics Dashboard",
        description: "Practice analytics for patient flow, revenue tracking, and operational efficiency insights.",
      },
    ],
  },
};

export default function CaseStudy() {
  const params = useParams();
  const slug = params?.slug as string;
  const caseStudy = caseStudies[slug];

  if (!caseStudy) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[var(--background)]">
          <Navigation />
          <div className="pt-32 pb-16 px-6 text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Case Study Not Found</h1>
            <Link href="/work" className="text-[#6366F1] hover:underline">
              ← Back to Work
            </Link>
          </div>
          <Footer />
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-[var(--background)]">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 bg-[var(--background)]">
          <div className="max-w-4xl mx-auto">
            <Link href="/work" className="inline-flex items-center gap-2 bg-[var(--card-bg)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--card-bg)]/80 transition-all border border-[var(--border)] mb-6">
              <span>←</span>
              <span>Back to Work</span>
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {caseStudy.tags.map((tag: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              {caseStudy.name}
            </h1>
            <p className="text-2xl text-[var(--text-secondary)]">
              {caseStudy.tagline}
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl">
              <img src={caseStudy.image} alt={caseStudy.name} className="w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Challenge & Solution */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">The Challenge</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Our Solution</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-6 bg-[var(--card-bg)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-12 text-center">Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudy.results.map((result: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-bold text-[#6366F1] mb-2">{result.value}</div>
                  <div className="text-[var(--text-secondary)]">{result.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudy.features.map((feature: any, i: number) => (
                <div key={i} className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)]">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Technologies Used</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {caseStudy.technologies.map((tech: string, i: number) => (
                <span key={i} className="px-6 py-3 bg-[var(--card-bg)] rounded-lg text-[var(--text-primary)] border border-[var(--border)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gradient-to-b from-[var(--background)] via-[var(--card-bg)]/30 to-[var(--background)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Ready to Build Something Similar?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Let's discuss how we can help bring your project to life.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
            >
              Start a Conversation
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}
