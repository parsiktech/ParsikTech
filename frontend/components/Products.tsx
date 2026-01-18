import Card from "./Card";

export default function Products() {
  return (
    <section id="products" className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-4">Products</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Real software solving real problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="SafeRoute"
            description="Professional driver tracking and safety compliance platform"
            icon={
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            }
            href="/products/saferoute"
          />

          <Card
            title="Coming Soon"
            description="Exciting new products in development"
            isBlurred={true}
          />

          <Card
            title="Coming Soon"
            description="Exciting new products in development"
            isBlurred={true}
          />
        </div>
      </div>
    </section>
  );
}
