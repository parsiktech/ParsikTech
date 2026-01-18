export default function Capabilities() {
  const capabilities = [
    {
      category: "Engineering",
      items: [
        "Web Applications",
        "SaaS Platforms",
        "API Development",
        "Database Design",
        "Cloud Infrastructure",
      ],
    },
    {
      category: "Performance",
      items: [
        "Analytics Setup",
        "Conversion Tracking",
        "A/B Testing",
        "Performance Monitoring",
        "Data Infrastructure",
      ],
    },
    {
      category: "Growth",
      items: [
        "Paid Acquisition",
        "SEO & Content",
        "Email Marketing",
        "Funnel Optimization",
        "Growth Systems",
      ],
    },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">
            What We Do
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Full-stack capabilities across engineering, analytics, and marketing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <div key={index} className="bg-[var(--background)] rounded-xl p-8 border border-[var(--border)]">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{cap.category}</h3>
              <ul className="space-y-3">
                {cap.items.map((item, i) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
