'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTextRevealProps {
  text: string;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  onComplete?: () => void;
}

export default function ScrollTextReveal({ text, className = '', colorFrom = '#d4d4d4', colorTo = '#212121', onComplete }: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.scroll-word');

    gsap.set(words, { color: colorFrom });

    gsap.to(words, {
      color: colorTo,
      stagger: 0.05,
      scrollTrigger: {
        trigger: container,
        start: 'top 95%',
        end: 'top 45%',
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress >= 0.7 && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
          }
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [onComplete]);

  const lines = text.split('\n');

  return (
    <p ref={containerRef} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {line.split(' ').map((word, wordIndex, arr) => (
            <span key={wordIndex} className="scroll-word" style={{ color: colorFrom }}>
              {word}{wordIndex < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
          {lineIndex < lines.length - 1 && <>{' '}<br /></>}
        </span>
      ))}
    </p>
  );
}
