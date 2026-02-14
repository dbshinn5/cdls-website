'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

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

const cycleWords = ['Science.', 'Leadership.', 'Community.', 'Discovery.', 'Research.'];

const TILT = -5;
const GAP = '0.75rem';
const ROW_HEIGHT = '14rem';
const EXPAND_EASE = 'power2.out';

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const fixedTextRef = useRef<HTMLDivElement>(null);
  const cycleContainerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure natural widths before GSAP collapses them
    const wordWidths: number[] = [];
    wordRefs.current.forEach((wordEl) => {
      if (!wordEl) return;
      wordWidths.push(wordEl.offsetWidth);
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // --- Initial state: blank screen ---
      if (photoContainerRef.current) gsap.set(photoContainerRef.current, { opacity: 0 });
      if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 0 });
      // tagline chars start hidden via CSS opacity-0
      if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 0 });

      // Hide navbar
      const header = document.querySelector('header');
      if (header) gsap.set(header, { yPercent: -100 });

      // Offset vertically only — text stays at final x position
      if (fixedTextRef.current) {
        gsap.set(fixedTextRef.current, { y: -(vh * 0.15) });
      }
      if (cycleContainerRef.current) {
        gsap.set(cycleContainerRef.current, { y: vh * 0.15 });
      }

      // Photo rows initial state
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.set(row, { x: i % 2 === 0 ? '-35%' : '35%', opacity: 0 });
      });

      // Collapse all words, make visible
      wordRefs.current.forEach((wordEl) => {
        if (!wordEl) return;
        gsap.set(wordEl, { width: 0, opacity: 1 });
      });

      // === Phase 1: "We are reimagining" typewriter — letter by letter ===
      if (fixedTextRef.current) {
        const fixedChars = fixedTextRef.current.querySelectorAll('.fixed-char');
        tl.to(fixedChars, {
          opacity: 1,
          duration: 0.01,
          stagger: 0.04,
        }, 0.3);
      }

      // === Phase 2: Cycle words — expand in, backspace out ===
      const CYCLE_START = 1.4;
      const WORD_EXPAND = 0.4;
      const WORD_HOLD = 0.35;
      const CHAR_DELETE = 0.03;
      const GAP_BETWEEN = 0.1;

      let currentTime = CYCLE_START;

      wordRefs.current.forEach((wordEl, i) => {
        if (!wordEl) return;
        const chars = wordEl.querySelectorAll('.cycle-char');
        const isLast = i === cycleWords.length - 1;
        const backspaceDur = chars.length * CHAR_DELETE;

        // Expand width
        tl.to(wordEl, {
          width: wordWidths[i] || 'auto',
          duration: WORD_EXPAND,
          ease: EXPAND_EASE,
        }, currentTime);

        currentTime += WORD_EXPAND + WORD_HOLD;

        if (!isLast) {
          // Backspace: characters vanish right-to-left
          tl.to(chars, {
            opacity: 0,
            duration: 0.01,
            stagger: { each: CHAR_DELETE, from: 'end' },
          }, currentTime);

          tl.set(wordEl, { width: 0 }, currentTime + backspaceDur + 0.03);

          currentTime += backspaceDur + GAP_BETWEEN;
        }
      });

      // === Phase 3: Vertical convergence to center ===
      const vSlideStart = currentTime + 0.3;

      if (fixedTextRef.current) {
        tl.to(fixedTextRef.current, {
          y: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, vSlideStart);
      }
      if (cycleContainerRef.current) {
        tl.to(cycleContainerRef.current, {
          y: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, vSlideStart);
      }

      // === Phase 4: Tagline typewriter ===
      const taglineStart = vSlideStart + 0.5;

      if (taglineRef.current) {
        const taglineChars = taglineRef.current.querySelectorAll('.tagline-char');
        tl.to(taglineChars, {
          opacity: 1,
          duration: 0.01,
          stagger: 0.008,
        }, taglineStart);
      }

      // === Phase 5: Photos slide in ===
      const photoStart = taglineStart + 0.6;

      if (photoContainerRef.current) {
        tl.to(photoContainerRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power1.in',
        }, photoStart);
      }

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        tl.to(row, {
          x: '0%',
          opacity: 1,
          duration: 1.6,
          ease: 'power4.out',
        }, photoStart + i * 0.1);
      });

      if (vignetteRef.current) {
        tl.to(vignetteRef.current, {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.inOut',
        }, photoStart + 0.2);
      }

      if (scrollRef.current) {
        tl.to(scrollRef.current, {
          opacity: 1,
          duration: 1.0,
          ease: 'power1.inOut',
        }, photoStart + 1.0);
      }

      if (header) {
        tl.to(header, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, photoStart + 0.8);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen h-[100dvh] overflow-hidden bg-charcoal flex items-center justify-center"
    >
      {/* Diagonal rows background */}
      <div
        ref={photoContainerRef}
        className="absolute z-[1] flex flex-col"
        style={{
          transform: `rotate(${TILT}deg) scale(1.4)`,
          gap: GAP,
          top: '-20%',
          left: '-15%',
          right: '-15%',
          bottom: '-20%',
          justifyContent: 'center',
          opacity: 0,
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            ref={(el) => { rowRefs.current[rowIndex] = el; }}
            className="flex opacity-0"
            style={{ gap: GAP, height: ROW_HEIGHT }}
          >
            {row.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="relative overflow-hidden rounded-lg flex-shrink-0"
                style={{ flex: `${img.span} 0 0%`, height: ROW_HEIGHT }}
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
        ref={vignetteRef}
        className="absolute inset-0 z-[2]"
        style={{
          background: `radial-gradient(ellipse at center, rgba(33,33,33,0.5) 0%, rgba(33,33,33,0.85) 55%, rgba(33,33,33,0.97) 100%)`,
          opacity: 0,
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-[2rem] md:px-[4rem] w-full max-w-7xl mx-auto">
        {/* Headline — final state is one centered row, baseline-aligned */}
        <div className="flex flex-row items-baseline justify-center gap-[0.3em] font-barlow font-bold text-[clamp(3rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.03em] uppercase">
          {/* "We are reimagining" — typewriter letter by letter */}
          <div ref={fixedTextRef} className="pb-[0.08em] flex-shrink-0 whitespace-nowrap">
            {'We are reimagining'.split('').map((char, ci) => (
              <span key={ci} className="fixed-char inline-block text-white opacity-0">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Cycling word container — invisible sizer sets baseline */}
          <div
            ref={cycleContainerRef}
            className="relative pb-[0.08em] flex-shrink-0 overflow-hidden"
          >
            {/* Invisible sizer — establishes height and baseline for flex alignment */}
            <span className="invisible whitespace-nowrap block" aria-hidden="true">
              Leadership.
            </span>
            {cycleWords.map((word, i) => (
              <div
                key={word}
                ref={(el) => { wordRefs.current[i] = el; }}
                className="absolute inset-0 overflow-hidden opacity-0"
              >
                <div className="cycle-word-inner text-white whitespace-nowrap">
                  {word.split('').map((char, ci) => (
                    <span key={ci} className="cycle-char inline-block">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tagline — appears with photos */}
        <p
          ref={taglineRef}
          className="font-jakarta font-medium text-[clamp(0.75rem,1.2vw,1rem)] text-ivory/70 text-center mt-6"
        >
          {'The Center for Developing Leadership in Science cultivates the next generation of scientists, leaders, and changemakers.'.split('').map((char, ci) => (
            <span key={ci} className="tagline-char inline-block opacity-0">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </main>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
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
