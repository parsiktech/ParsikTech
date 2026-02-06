import Card from "./Card";
import Link from "next/link";

export default function FeaturedWork() {
  const projects = [
    {
      title: "SafeRoute",
      description: "Education and training platform for universities and businesses",
      image: "/saferoutepic.png",
      slug: "saferoute",
    },
    {
      title: "E-Commerce Platform",
      description: "Modern shopping experience with real-time inventory",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      slug: "ecommerce-platform",
    },
    {
      title: "Healthcare Dashboard",
      description: "Patient management system for medical practices",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      slug: "healthcare-dashboard",
    },
  ];

  return (
    <section id="work" className="py-24 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-16 text-center">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              href="/products"
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-[#6366F1] hover:text-[#5558E3] transition-colors text-lg font-medium"
          >
            View All Products
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
