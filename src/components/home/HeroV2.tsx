'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Typewriter } from '@/components/ui/Typewriter';

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

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const solidBgRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);

  const hasPlayed = typeof window !== 'undefined' && sessionStorage.getItem('heroAnimationPlayed') === 'true';

  const [showTypewriter, setShowTypewriter] = useState(false);

  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => {
      revealTlRef.current?.play();
    }, 300);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = document.querySelector('header');

      if (hasPlayed) {
        // --- Skip animation: set everything to final state ---
        if (solidBgRef.current) gsap.set(solidBgRef.current, { opacity: 0 });
        if (photoContainerRef.current) gsap.set(photoContainerRef.current, { opacity: 1 });
        if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 1 });
        if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 1 });
        if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 1 });
        if (header) gsap.set(header, { yPercent: 0 });
        rowRefs.current.forEach((row) => {
          if (!row) return;
          gsap.set(row, { x: '0%', opacity: 1 });
        });
        return;
      }

      // --- First visit: full animation ---
      if (photoContainerRef.current) gsap.set(photoContainerRef.current, { opacity: 0 });
      if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 0 });
      if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 0 });
      if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 0 });

      if (header) gsap.set(header, { yPercent: -100 });

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.set(row, { x: i % 2 === 0 ? '-35%' : '35%', opacity: 0 });
      });

      // Start typewriter immediately
      setShowTypewriter(true);

      // === Reveal timeline (paused — triggered when typewriter finishes) ===
      const reveal = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          sessionStorage.setItem('heroAnimationPlayed', 'true');
        },
      });
      revealTlRef.current = reveal;

      // Fade out solid background to reveal photos
      reveal.to(solidBgRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0);

      // Photos slide in
      reveal.to(photoContainerRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.in',
      }, 0.1);

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        reveal.to(row, {
          x: '0%',
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
        }, 0.1 + i * 0.08);
      });

      // Vignette
      reveal.to(vignetteRef.current, {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0.2);

      // Tagline
      reveal.to(taglineRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, 0.4);

      // Navbar + scroll
      if (header) {
        reveal.to(header, {
          yPercent: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, 0.5);
      }

      reveal.to(scrollRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power1.inOut',
      }, 0.7);

    }, sectionRef);

    return () => ctx.revert();
  }, [hasPlayed]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen h-[100dvh] overflow-hidden bg-charcoal flex items-center justify-center"
    >
      {/* Solid background that fades away to reveal photos */}
      <div ref={solidBgRef} className="absolute inset-0 z-[3] bg-charcoal" />

      {/* Photo grid background */}
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

      {/* Headline + tagline — stays visible throughout */}
      <main className="relative z-10 px-[2rem] md:px-[4rem] w-full max-w-7xl mx-auto">
        <h1 className="font-barlow font-bold text-[clamp(1.8rem,4.5vw,5rem)] leading-[1] tracking-[-0.03em] uppercase text-white text-center whitespace-nowrap">
          We are reimagining{' '}
          {hasPlayed ? (
            <span>Research.</span>
          ) : showTypewriter ? (
            <Typewriter
              words={cycleWords}
              speed={30}
              delayBetweenWords={100}
              cursor={true}
              cursorChar="|"
              loop={false}
              onComplete={handleTypewriterComplete}
            />
          ) : (
            <span className="invisible">Research.</span>
          )}
        </h1>

        <p
          ref={taglineRef}
          className="font-jakarta font-medium text-[clamp(0.75rem,1.2vw,1rem)] text-ivory/70 text-center mt-6 opacity-0"
        >
          The Consortium for Developing Leadership in Science cultivates the next generation of scientists, leaders, and changemakers.
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
