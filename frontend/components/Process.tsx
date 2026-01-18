export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Build",
      description: "Production-grade software, platforms, and websites built with modern frameworks and engineering best practices.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Measure",
      description: "Analytics infrastructure, tracking systems, and performance monitoring to understand what works and what doesn't.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Grow",
      description: "Data-driven digital marketing, funnel optimization, and growth systems that drive real business results.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">
            Build. Measure. Grow.
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            A connected system for creating products that perform and businesses that scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)] h-full">
                <div className="text-[#6366F1] mb-6">{step.icon}</div>
                <div className="text-[#6366F1] text-sm font-bold mb-2">{step.number}</div>
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{step.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <svg className="w-12 h-12 text-[#6366F1]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
