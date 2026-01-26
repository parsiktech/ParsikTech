"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

// Product data for the switcher
const products = [
  {
    id: 'saferoute',
    badge: 'Primary Product',
    name: 'SafeRoute™',
    tagline: 'Education and training that scales — built for real results.',
    description: 'SafeRoute is a comprehensive education and training platform offering both individual, job ready courses and enterprise learning solutions for businesses and universities. Individuals can enroll in accredited courses that deliver real world credentials and industry recognized certifications. Organizations leverage SafeRoute as a full scale training platform for onboarding, compliance, and required certifications across multiple industries—complete with centralized management, progress tracking, and completion reporting for full visibility and accountability.',
    capabilities: [
      'Onboarding programs and compliance training',
      'Accredited, job-ready certification courses',
      'Multi-industry training and credentialing',
      'Full admin visibility and reporting',
      'Community scholarships and access programs',
      'Dynamic site-wide themes'
    ],
    primaryCta: { label: 'View Product', href: 'https://saferoute.com', external: true },
    secondaryCta: { label: 'Request Demo', href: '/contact', external: false },
    images: [
      { src: '/Saferoute/saferoute (1).png', label: 'Overview' },
      { src: '/Saferoute/saferoute (2).png', label: 'Courses' },
      { src: '/Saferoute/saferoute (3).png', label: 'Learning' },
      { src: '/Saferoute/saferoute (5).png', label: 'Progress' },
      { src: '/Saferoute/saferoute (6).png', label: 'Certifications' },
      { src: '/Saferoute/saferoute (8).png', label: 'Dashboard' },
      { src: '/Saferoute/saferoute (10).png', label: 'Analytics' },
      { src: '/Saferoute/saferoute (9).png', label: 'Reports' },
      { src: '/Saferoute/saferoute (7).png', label: 'Settings' },
      { src: '/Saferoute/saferoute (4).png', label: 'Admin' }
    ]
  },
  {
    id: 'dashboard',
    badge: 'Client Platform',
    name: 'Operations Hub',
    tagline: 'Full visibility into requests, billing, and deliverables.',
    description: 'A centralized platform built to give clients complete transparency and control over their engagement with us. Track active requests, review billing and usage, approve content deliverables, and access priority support — all from a single interface designed for clarity and efficiency.',
    capabilities: [
      'Real-time request tracking',
      'Billing & usage visibility',
      'Content approvals & delivery',
      'Priority support access'
    ],
    primaryCta: { label: 'View Platform', href: '/login', external: false },
    secondaryCta: { label: 'Contact Us', href: '/contact', external: false },
    images: [
      { src: '/ClientPanel/ClientPanel (1).png', label: 'Overview' },
      { src: '/ClientPanel/ClientPanel (2).png', label: 'Requests' },
      { src: '/ClientPanel/ClientPanel (3).png', label: 'Billing' },
      { src: '/ClientPanel/ClientPanel (4).png', label: 'Documents' },
      { src: '/ClientPanel/ClientPanel (5).png', label: 'Content' },
      { src: '/ClientPanel/ClientPanel (6).png', label: 'Forecasting' },
      { src: '/ClientPanel/ClientPanel (7).png', label: 'Training' },
      { src: '/ClientPanel/ClientPanel (8).png', label: 'Support' }
    ]
  },
  {
    id: 'lockshore',
    badge: 'Internal System',
    name: 'Lockshore',
    tagline: 'Operate and scale private server infrastructure.',
    description: 'Lockshore is an in-house infrastructure management platform built to monitor, manage, and secure private server farms. Originally developed to operate our own infrastructure, Lockshore is also used by other private server hosting providers to maintain full control over their environments. It delivers centralized visibility into hardware, services, and system health—enabling reliable, secure, and fully self-hosted operations without dependence on third-party cloud providers.',
    capabilities: [
      'Private server farm monitoring',
      'Infrastructure health & uptime tracking',
      'Service and resource management',
      'Secure internal access controls',
      'Run pre-configured or custom scripts'
    ],
    primaryCta: { label: 'Request a Demo', href: '/contact', external: false },
    secondaryCta: null,
    images: [
      { src: '/Lockshore/lockshore (2).png', label: 'Overview' },
      { src: '/Lockshore/lockshore (1).png', label: 'Scripts' },
      { src: '/Lockshore/lockshore (3).png', label: 'Monitoring' }
    ]
  }
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});
  const [expandedImage, setExpandedImage] = useState<{ src: string; label: string } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentProduct = products[activeProduct];

  // Auto-cycle images every 2.5 seconds
  useEffect(() => {
    const product = currentProduct;
    if (product.images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveImageIndex(prev => {
        const currentIndex = prev[product.id] || 0;
        const nextIndex = (currentIndex + 1) % product.images.length;
        return { ...prev, [product.id]: nextIndex };
      });
    }, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeProduct, currentProduct]);

  const handleProductChange = (index: number) => {
    if (index === activeProduct) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveProduct(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 100);
  };

  const handleImageChange = (productId: string, imageIndex: number) => {
    setActiveImageIndex(prev => ({ ...prev, [productId]: imageIndex }));
    // Reset the interval when manually changing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActiveImageIndex(prev => {
          const currentIndex = prev[productId] || 0;
          const nextIndex = (currentIndex + 1) % products.find(p => p.id === productId)!.images.length;
          return { ...prev, [productId]: nextIndex };
        });
      }, 2500);
    }
  };

  const getActiveImageIndex = (productId: string) => {
    return activeImageIndex[productId] || 0;
  };

  return (
    <PageTransition>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47" strategy="beforeInteractive" />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LDX1BJYQ47');
        `}
      </Script>
      <main className="min-h-screen bg-[var(--background)]">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 bg-[var(--background)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 via-[var(--background)] to-[#3B82F6]/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              Products We Build and Scale
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-4 max-w-3xl mx-auto">
              Purpose-built platforms designed to solve real operational problems — engineered for performance, reliability, and growth.
            </p>
            <p className="text-[var(--text-secondary)]">Built in-house. Actively maintained.</p>
          </div>
        </section>

        {/* Product Spotlight with Switcher */}
        <section className="py-24 px-6 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto">
            {/* Product Switcher Tabs */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-8 mb-3">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductChange(index)}
                    className={`text-lg font-medium pb-2 border-b-2 transition-all duration-150 ${
                      activeProduct === index
                        ? 'text-[var(--text-primary)] border-[#6366F1]'
                        : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {product.name.replace('™', '')}
                  </button>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                All platforms are built, operated, and maintained in-house.
              </p>
            </div>

            {/* Product Display - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Product Info */}
              <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="inline-block px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-sm font-medium mb-4 border border-[#6366F1]/20">
                  {currentProduct.badge}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                  {currentProduct.name}
                </h2>
                <p className="text-xl text-[#6366F1] mb-6">
                  {currentProduct.tagline}
                </p>
                <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                  {currentProduct.description}
                </p>

                {/* Key Capabilities */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Key Capabilities</h3>
                  <ul className="space-y-3">
                    {currentProduct.capabilities.map((item, i) => (
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
                  {currentProduct.primaryCta.external ? (
                    <a
                      href={currentProduct.primaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#6366F1] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
                    >
                      {currentProduct.primaryCta.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={currentProduct.primaryCta.href}
                      className="inline-block bg-[#6366F1] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
                    >
                      {currentProduct.primaryCta.label}
                    </Link>
                  )}
                  {currentProduct.secondaryCta && (
                    <Link
                      href={currentProduct.secondaryCta.href}
                      className="inline-block bg-[var(--card-bg)] text-[var(--text-primary)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--card-bg)]/80 transition-all border border-[var(--border)]"
                    >
                      {currentProduct.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>

              {/* Right: Product Image Showcase */}
              <div className={`relative transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentProduct.images && currentProduct.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Primary Hero Frame */}
                    <button
                      onClick={() => setExpandedImage(currentProduct.images[getActiveImageIndex(currentProduct.id)])}
                      className="relative w-full bg-[#0A0A0A] rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl cursor-zoom-in group"
                    >
                      <div className="relative aspect-[16/10]">
                        {currentProduct.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.src}
                            alt={`${currentProduct.name} - ${image.label}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-250 ease-out ${
                              getActiveImageIndex(currentProduct.id) === index
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-95'
                            }`}
                          />
                        ))}
                        {/* Expand hint overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            <span className="text-white text-sm font-medium">Click to expand</span>
                          </div>
                        </div>
                      </div>
                      {/* Active image label */}
                      {currentProduct.images[getActiveImageIndex(currentProduct.id)]?.label && (
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-sm text-white/90 font-medium">
                          {currentProduct.images[getActiveImageIndex(currentProduct.id)].label}
                        </div>
                      )}
                    </button>

                    {/* Dot Indicators */}
                    {currentProduct.images.length > 1 && (
                      <div className="flex justify-center gap-2 pt-2">
                        {currentProduct.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageChange(currentProduct.id, index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              getActiveImageIndex(currentProduct.id) === index
                                ? 'bg-[#6366F1] scale-110 shadow-lg shadow-[#6366F1]/40'
                                : 'bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Placeholder UI Preview for products without images */
                  <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="bg-[#0A0A0A] aspect-[16/10] flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full p-6 flex flex-col">
                        {/* Mock window controls */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                          <div className="flex-1 mx-4">
                            <div className="h-6 bg-[var(--card-bg)] rounded-md"></div>
                          </div>
                        </div>
                        {/* Mock content area */}
                        <div className="flex-1 grid grid-cols-4 gap-3">
                          <div className="col-span-1 space-y-2">
                            <div className="h-8 bg-[var(--card-bg)] rounded"></div>
                            <div className="h-6 bg-[var(--card-bg)]/60 rounded"></div>
                            <div className="h-6 bg-[var(--card-bg)]/60 rounded"></div>
                            <div className="h-6 bg-[var(--card-bg)]/60 rounded"></div>
                            <div className="h-6 bg-[var(--card-bg)]/60 rounded"></div>
                          </div>
                          <div className="col-span-3 space-y-3">
                            <div className="h-10 bg-[var(--card-bg)] rounded"></div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="h-20 bg-[#6366F1]/20 rounded border border-[#6366F1]/30"></div>
                              <div className="h-20 bg-[var(--card-bg)] rounded"></div>
                              <div className="h-20 bg-[var(--card-bg)] rounded"></div>
                            </div>
                            <div className="h-24 bg-[var(--card-bg)] rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Philosophy */}
        <section className="py-24 px-6 bg-[var(--background)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-16">
              How We Build Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  Built for Real Use
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Every product solves a real operational problem — not a pitch deck idea.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  Engineered to Scale
                </h3>
                <p className="text-[var(--text-secondary)]">
                  We design systems that grow with the business, not break under pressure.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  Maintained Long-Term
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Our products aren't shipped and abandoned. We maintain, improve, and evolve them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-[var(--background)] via-[var(--card-bg)]/30 to-[var(--background)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Interested in Our Products?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Whether you're looking to use one of our platforms or explore a custom-built solution, we're happy to talk.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block bg-[#6366F1] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
              >
                Contact Us
              </Link>
              <Link
                href="/work"
                className="inline-block bg-[var(--card-bg)] text-[var(--text-primary)] px-10 py-4 rounded-lg text-lg font-medium hover:bg-[var(--card-bg)]/80 transition-all border border-[var(--border)]"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </section>

        <Footer />

        {/* Expanded Image Modal */}
        {expandedImage && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/90 z-50 animate-fade-in"
              onClick={() => setExpandedImage(null)}
            />
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
              <div className="relative w-[95vw] max-w-[1400px] pointer-events-auto animate-scale-in">
                {/* Close button */}
                <button
                  onClick={() => setExpandedImage(null)}
                  className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 z-10"
                >
                  <span className="text-sm">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Image */}
                <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 inline-block">
                  <img
                    src={expandedImage.src}
                    alt={expandedImage.label}
                    className="max-w-full max-h-[92vh] object-contain"
                  />
                </div>
                {/* Label */}
                {expandedImage.label && (
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white font-medium">
                    {expandedImage.label}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </PageTransition>
  );
}
