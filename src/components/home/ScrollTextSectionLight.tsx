'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ScrollTextReveal from './ScrollTextReveal';
import LineRevealText from './LineRevealText';

const bodyText = "We're building a culture of science where everyone belongs, where scientists build bridges, and where research and education spark joy, inspiration, and real-world solutions that improve lives, from climate change to ocean stewardship and health.";

export default function ScrollTextSectionLight() {
  const [sectionInView, setSectionInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionInView(true);
        }
      },
      { threshold: 0.9 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-ivory min-h-screen h-[100dvh] flex flex-col justify-center items-center px-4"
    >
      <div className="max-w-6xl text-center">
        <ScrollTextReveal
          text={"We believe science is strongest\nwhen it serves the world that shapes it."}
          className="font-barlow font-bold text-[clamp(2.5rem,8vw,6rem)] leading-[1] tracking-[-0.03em] uppercase text-center mb-16 [&_br]:hidden md:[&_br]:inline"
          style={{ textWrap: 'balance' } as React.CSSProperties}
          colorFrom="#d4d4d4"
          colorTo="#212121"
        />
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-tree-leaf to-transparent mx-auto mb-12" />
        <div className="max-w-2xl mx-auto">
          <LineRevealText
            text={bodyText}
            className="font-jakarta text-[clamp(1rem,2vw,1.25rem)] leading-loose text-charcoal/70 text-center"
            isTriggered={sectionInView}
            duration={0.4}
            delay={0}
            stagger={0.015}
          />
        </div>
        <div
          className={`mt-12 transition-all duration-700 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '0.8s' }}
        >
          <Link
            href="https://giving.ucla.edu/campaign/donate.aspx?Fund=64061o" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-charcoal hover:bg-charcoal/90 rounded-full pl-6 pr-2 py-2 transition-all"
          >
            <span className="font-jakarta text-[13px] font-medium uppercase tracking-[0.08em] text-ivory">
              Support Our Center
            </span>
            <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center group-hover:bg-golden-hour transition-colors">
              <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
