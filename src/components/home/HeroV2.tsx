'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Each row is a diagonal strip of images. `span` controls relative width (flex-grow).
const rows = [
  [
    { src: '/images/hero/group-outdoors.jpeg', alt: 'CDLS fellows outdoors', w: 1017, h: 640, span: 3 },
    { src: '/images/hero/three-women.jpeg', alt: 'Three CDLS leaders', w: 422, h: 393, span: 1.5 },
    { src: '/images/hero/lab-coats-chemistry.jpeg', alt: 'Researchers in chemistry lab', w: 682, h: 453, span: 2.5 },
    { src: '/images/hero/fieldwork-boat.jpeg', alt: 'Researcher doing fieldwork on boat', w: 567, h: 570, span: 1.5 },
    { src: '/images/hero/group-steps.jpeg', alt: 'Fellows group on steps', w: 1024, h: 593, span: 2.5 },
  ],
  [
    { src: '/images/hero/mentor-student.jpeg', alt: 'Mentor talking with student', w: 1126, h: 721, span: 2.5 },
    { src: '/images/hero/students-conference.jpeg', alt: 'Students at science conference', w: 566, h: 422, span: 2 },
    { src: '/images/hero/researcher-lab.jpeg', alt: 'Researcher in blue lab coat', w: 771, h: 539, span: 2 },
    { src: '/images/hero/scientist-computer.jpeg', alt: 'Scientist at computer in lab', w: 674, h: 680, span: 1.5 },
    { src: '/images/hero/students-project.jpeg', alt: 'Students with science project', w: 800, h: 539, span: 2.5 },
  ],
  [
    { src: '/images/hero/students-laptops-lab.jpeg', alt: 'Students on laptops in lab', w: 971, h: 639, span: 2.5 },
    { src: '/images/hero/lab-discussion.jpeg', alt: 'Students in lab discussion', w: 662, h: 456, span: 2 },
    { src: '/images/hero/women-outdoors.jpeg', alt: 'Women fellows laughing outdoors', w: 876, h: 584, span: 2.5 },
    { src: '/images/hero/group-agu.jpeg', alt: 'Group at AGU conference', w: 946, h: 594, span: 2 },
    { src: '/images/hero/group-with-sign.jpeg', alt: 'Students with environmental justice sign', w: 1017, h: 625, span: 2.5 },
  ],
];

const TILT = -5; // degrees
const GAP = '0.75rem';
const ROW_HEIGHT = '14rem';

export default function HeroV2() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen h-[100dvh] overflow-hidden bg-charcoal flex items-center justify-center">
      {/* Diagonal rows background */}
      <div
        className="absolute z-[1] flex flex-col"
        style={{
          transform: `rotate(${TILT}deg) scale(1.4)`,
          gap: GAP,
          top: '-20%',
          left: '-15%',
          right: '-15%',
          bottom: '-20%',
          justifyContent: 'center',
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex ${mounted ? (rowIndex % 2 === 0 ? 'animate-slide-from-left' : 'animate-slide-from-right') : 'opacity-0'}`}
            style={{
              gap: GAP,
              height: ROW_HEIGHT,
              animationDelay: `${rowIndex * 0.15}s`,
            }}
          >
            {row.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="relative overflow-hidden rounded-lg flex-shrink-0"
                style={{
                  flex: `${img.span} 0 0%`,
                  height: ROW_HEIGHT,
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  className="w-full h-full object-cover"
                  sizes="30vw"
                  priority={rowIndex === 0}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `radial-gradient(ellipse at center, rgba(33,33,33,0.5) 0%, rgba(33,33,33,0.85) 55%, rgba(33,33,33,0.97) 100%)`
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 text-center px-[2rem] md:px-[4rem] max-w-7xl">
        <p
          className={`font-jakarta font-medium text-[0.6875rem] uppercase tracking-[0.25rem] text-high-tide mb-8 ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.6s' }}
        >
          Center for Developing Leadership in Science
        </p>
        <h1
          className={`font-barlow font-bold text-[clamp(4.8rem,17.6vw,9.6rem)] leading-[0.85] tracking-[-0.03em] uppercase mb-8 ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.8s' }}
        >
          <span className="text-white">Reimagining</span>
          <br />
          <span className="text-white">Research</span>
        </h1>
      </main>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 ${
          mounted ? 'animate-fade-in' : 'opacity-0'
        }`}
        style={{ animationDelay: '1.5s' }}
      >
        <div className="flex flex-col items-center gap-2 text-ivory/40">
          <span className="font-jakarta text-[0.625rem] uppercase tracking-[0.125rem]">Scroll</span>
          <div className="w-px h-8 bg-ivory/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-ivory/60 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
