export default function Services() {
  const techStack = [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
  ];

  return (
    <section id="services" className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-16 text-center">What We Do</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)]">
            <div className="mb-6 text-[#6366F1]">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Web Applications</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Custom web applications built with modern frameworks and best practices.
              Scalable, secure, and designed to solve your business challenges.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)]">
            <div className="mb-6 text-[#6366F1]">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Websites</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Professional websites that convert visitors into customers.
              Fast, responsive, and optimized for search engines.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">Our Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-[var(--card-bg)] text-[#6366F1] px-6 py-3 rounded-lg border border-[#6366F1]/20 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
