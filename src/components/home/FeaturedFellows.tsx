'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Fellow } from '@/types';
import { createImageUrlBuilder } from '@sanity/image-url';

const builder = createImageUrlBuilder({
  projectId: '0r5zwpua',
  dataset: 'fellows',
});

function getImageUrl(image: Fellow['image'], width: number, height: number): string {
  if (!image?.asset?._ref) return '';
  return builder.image(image).width(width).height(height).fit('crop').url();
}

interface FeaturedFellowsProps {
  fellows: Fellow[];
}

const BANNER_SPEED = 80;

export default function FeaturedFellows({ fellows }: FeaturedFellowsProps) {
  const [spotlightFellow, setSpotlightFellow] = useState<Fellow | null>(null);
  const [spotlightVisible, setSpotlightVisible] = useState(false);

  function openSpotlight(fellow: Fellow) {
    setSpotlightFellow(fellow);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSpotlightVisible(true));
    });
  }

  function closeSpotlight() {
    setSpotlightVisible(false);
    setTimeout(() => setSpotlightFellow(null), 500);
  }

  if (fellows.length === 0) return null;

  const bannerFellows = [...fellows, ...fellows];
  const collageFellows = fellows.slice(0, 6);
  const uniqueUnits = new Set(fellows.map(f => f.academicUnit).filter(Boolean)).size;

  return (
    <section className="relative bg-charcoal overflow-hidden">

      {/* ========== DESKTOP: Animated scrolling banner ========== */}
      <div className="hidden md:block" style={{ height: 'clamp(300px, 50vh, 500px)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex gap-4 h-full animate-banner-scroll"
            style={{ animationDuration: `${BANNER_SPEED}s` }}
          >
            {bannerFellows.map((fellow, i) => (
              <button
                key={`banner-${fellow._id}-${i}`}
                onClick={() => openSpotlight(fellow)}
                className="group relative flex-shrink-0 h-full aspect-[3/4] overflow-hidden cursor-pointer"
              >
                <Image
                  src={getImageUrl(fellow.image, 400, 530)}
                  alt={fellow.name}
                  fill
                  className="object-cover grayscale brightness-[0.35] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                  sizes="45vh"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========== MOBILE: Static collage grid ========== */}
      <div className="md:hidden py-16 px-4">
        <div className="grid grid-cols-3 gap-2">
          {collageFellows.map((fellow) => (
            <button
              key={`collage-${fellow._id}`}
              onClick={() => openSpotlight(fellow)}
              className="relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={getImageUrl(fellow.image, 300, 400)}
                alt={fellow.name}
                fill
                className="object-cover grayscale brightness-[0.4]"
                sizes="33vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Centered title + stats + button overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="font-barlow font-bold text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[0.85] tracking-tight text-ivory text-center select-none">
          Featured Fellows
        </h2>

        {/* Stats */}
        <div className="flex items-center gap-6 md:gap-10 mt-4 md:mt-5">
          <div className="text-center">
            <p className="font-barlow font-bold text-2xl md:text-3xl text-golden-hour leading-none">{fellows.length}+</p>
            <p className="font-jakarta text-[10px] md:text-xs text-ivory/40 uppercase tracking-wider mt-1">Fellows</p>
          </div>
          <div className="w-px h-8 bg-ivory/15" />
          <div className="text-center">
            <p className="font-barlow font-bold text-2xl md:text-3xl text-golden-hour leading-none">{uniqueUnits}</p>
            <p className="font-jakarta text-[10px] md:text-xs text-ivory/40 uppercase tracking-wider mt-1">Departments</p>
          </div>
        </div>

        <Link
          href="/people"
          className="group flex items-center gap-2 bg-ivory/10 hover:bg-ivory/20 rounded-full pl-4 pr-1.5 py-1 transition-all mt-5 pointer-events-auto"
        >
          <span className="font-barlow font-bold text-[13px] uppercase tracking-[0.08em] text-ivory">
            View All
          </span>
          <div className="w-6 h-6 rounded-full bg-ivory flex items-center justify-center group-hover:bg-golden-hour transition-colors">
            <svg className="w-3 h-3 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Vignette for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at center, rgba(33,33,33,0.7) 0%, rgba(33,33,33,0.2) 70%, transparent 100%)',
        }}
      />

      {/* Spotlight overlay */}
      {spotlightFellow && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center px-6"
          onClick={closeSpotlight}
        >
          <div
            className={`absolute inset-0 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-500 ${
              spotlightVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-14 max-w-3xl w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              spotlightVisible
                ? 'opacity-100 scale-100 rotate-0 translate-y-0'
                : 'opacity-0 scale-[0.7] -rotate-[4deg] translate-y-8'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-64 md:w-80 aspect-[3/4] overflow-hidden flex-shrink-0 shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              <Image
                src={getImageUrl(spotlightFellow.image, 600, 800)}
                alt={spotlightFellow.name}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div
              className={`flex flex-col items-center md:items-start text-center md:text-left transition-all duration-700 delay-100 ${
                spotlightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="font-barlow font-bold text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-ivory">
                {spotlightFellow.name}
              </p>
              {spotlightFellow.position && (
                <p className="font-jakarta text-sm md:text-base text-ivory/50 mt-3">
                  {spotlightFellow.position}
                </p>
              )}
              {spotlightFellow.academicUnit && (
                <p className="font-jakarta text-xs md:text-sm text-ivory/35 mt-1">
                  {spotlightFellow.academicUnit}
                </p>
              )}
              <div className="flex gap-6 mt-8">
                <Link
                  href={`/people/${spotlightFellow.slug.current}`}
                  className="inline-flex items-center gap-2 font-jakarta text-sm font-medium text-golden-hour hover:text-ivory transition-colors"
                >
                  <span>View Profile</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button
                  onClick={closeSpotlight}
                  className="font-jakarta text-sm text-ivory/40 hover:text-ivory/70 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes banner-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-banner-scroll {
          animation: banner-scroll linear infinite;
        }
      `}</style>
    </section>
  );
}
