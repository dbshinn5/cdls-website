'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BlurRevealTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  isTriggered?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
}

export default function LineRevealText({
  text,
  className = '',
  style,
  isTriggered = false,
  duration = 0.8,
  delay = 0,
  stagger = 0.03,
}: BlurRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  // Split text into lines, then words
  const lines = text.split('\n');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordElements = container.querySelectorAll('.blur-word');

    // Set initial state - blurred and transparent
    gsap.set(wordElements, {
      filter: 'blur(8px)',
      opacity: 0,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isTriggered || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    const wordElements = container.querySelectorAll('.blur-word');

    // Animate each word with stagger
    gsap.to(wordElements, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: duration,
      delay: delay,
      stagger: stagger,
      ease: 'power2.out',
    });
  }, [isTriggered, duration, delay, stagger]);

  return (
    <p ref={containerRef} className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {line.split(' ').map((word, wordIndex, arr) => (
            <span key={wordIndex} className="blur-word">
              {word}{wordIndex < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}
