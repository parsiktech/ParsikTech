"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface WorkCard {
  name: string;
  description: string;
  image: string;
  tags: string[];
  status: string;
  statusColor: string;
  href: string;
}

export default function WorkCarousel({ cards }: { cards: WorkCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);

  const GAP = 24;
  const maxIndex = Math.max(0, cards.length - visibleCount);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setVisibleCount(1);
      else if (w < 1280) setVisibleCount(2);
      else setVisibleCount(4);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const cardWidth =
    containerWidth > 0
      ? (containerWidth - (visibleCount - 1) * GAP) / visibleCount
      : 0;
  const step = cardWidth + GAP;
  const translateX = -(currentIndex * step) + dragOffset;

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const goNext = useCallback(
    () => setCurrentIndex((prev) => Math.min(prev + visibleCount, maxIndex)),
    [visibleCount, maxIndex]
  );
  const goPrev = useCallback(
    () => setCurrentIndex((prev) => Math.max(prev - visibleCount, 0)),
    [visibleCount]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - touchStartRef.current;
    const atStart = currentIndex === 0 && delta > 0;
    const atEnd = currentIndex === maxIndex && delta < 0;
    setDragOffset(atStart || atEnd ? delta * 0.3 : delta);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = cardWidth * 0.25;
    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
    setDragOffset(0);
  };

  return (
    <div className="relative group/carousel lg:px-14">
      <div ref={containerRef} className="overflow-hidden py-2">
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${translateX}px)`,
            transition: isDragging
              ? "none"
              : "transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              draggable={false}
              className="group/card relative block rounded-xl bg-[#121212] border border-white/[0.07] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.15] flex-shrink-0"
              style={{
                width: cardWidth > 0 ? `${cardWidth}px` : undefined,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  draggable={false}
                  className="w-full h-full object-cover object-top scale-105 blur-[2px] group-hover/card:blur-[1px] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/60 group-hover/card:bg-black/50 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover/card:text-white transition-colors">
                  {card.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-full text-white/40 border border-white/[0.06]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: card.statusColor }}
                    />
                    <span className="text-xs text-[var(--text-secondary)] tracking-wide">
                      {card.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/50 group-hover/card:text-[#6366F1] transition-colors">
                    <span>View Details</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover/card:translate-x-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      {canPrev && (
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {canNext && (
        <button
          onClick={goNext}
          aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
