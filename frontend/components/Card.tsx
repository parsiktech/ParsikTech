import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href?: string;
  image?: string;
  isBlurred?: boolean;
}

export default function Card({ title, description, icon, href, image, isBlurred = false }: CardProps) {
  const content = (
    <div
      className={`
        bg-[var(--card-bg)] rounded-xl p-6
        transition-all duration-300
        border border-[var(--border)]
        ${isBlurred ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-[#6366F1]/10'}
      `}
    >
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden relative h-48">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}

      {icon && <div className="mb-4 text-[#6366F1]">{icon}</div>}

      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>

      {!isBlurred && href && (
        <div className="mt-4 flex items-center text-[#6366F1] hover:text-[#5558E3] transition-colors">
          <span className="text-sm font-medium">Learn more</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  if (isBlurred || !href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
