'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  title: string;
  date: string;
  image: string | null;
  href: string;
}

export default function LatestNews({ items }: { items?: NewsItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const newsItems: NewsItem[] = items && items.length > 0 ? items : [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (newsItems.length === 0) return null;

  return (
    <section className="bg-[#fdf0e2] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-barlow font-bold text-[clamp(2.5rem,5vw,4rem)] uppercase text-[#d97519] leading-none">
            Latest News
          </h2>
          <Link
            href="/news"
            className="group flex items-center gap-3 bg-charcoal hover:bg-charcoal/90 rounded-full pl-6 pr-2 py-2 transition-all"
          >
            <span className="font-barlow font-bold text-base uppercase tracking-[0.08em] text-ivory">
              All News
            </span>
            <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center group-hover:bg-[#d97519] transition-colors">
              <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-[#d97519]/40 mb-12" />

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto scrollbar-hide py-4 -my-4 -ml-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {newsItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex-shrink-0 w-[calc((100%-96px)/3.15)] min-w-[280px] self-stretch"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Card wrapper - orange bg on hover wraps entire card */}
              <div className="h-full p-4 bg-transparent group-hover:bg-[#d97519] transition-colors duration-300 flex flex-col">
                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden flex-shrink-0 bg-gray-200">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col pt-5">
                  {/* Title */}
                  <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-[#d97519] leading-[1.15] tracking-tight group-hover:text-charcoal transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Spacer to push divider and date to bottom */}
                  <div className="flex-1 min-h-6" />

                  {/* Divider */}
                  <div className="w-full h-px bg-[#d97519]/30 group-hover:bg-charcoal/30 transition-colors duration-300" />

                  {/* Date and label */}
                  <div className="flex items-center justify-between pt-4">
                    <p className="font-jakarta text-xs tracking-wider text-[#d97519]/70 group-hover:text-charcoal/70 transition-colors duration-300">
                      {item.date}
                    </p>
                    <p className="font-jakarta text-xs font-medium uppercase tracking-wider text-[#d97519]/70 group-hover:text-charcoal/70 transition-colors duration-300">
                      News
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Progress Bar and Navigation */}
        <div className="flex items-center justify-end gap-6 mt-8">
          {/* Progress Bar */}
          <div className="w-48 h-1 bg-charcoal/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d97519] rounded-full transition-all duration-150"
              style={{ width: `${Math.max(20, scrollProgress * 100)}%` }}
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:border-[#d97519] hover:bg-[#d97519]/10 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 text-charcoal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border-2 border-[#d97519] bg-[#d97519] flex items-center justify-center hover:bg-[#d97519]/90 transition-colors"
              aria-label="Next"
            >
              <svg className="w-4 h-4 text-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
