'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'People', href: '/people' },
  {
    name: 'Resources',
    children: [
      { name: 'Events', href: '/events' },
      { name: 'News', href: '/news' },
      { name: 'Policy', href: '/policy' },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav
        className={`inline-flex items-center rounded-full px-3 py-1.5 border transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-charcoal/8 shadow-lg shadow-black/5'
            : 'bg-white/70 backdrop-blur-lg border-charcoal/5 shadow-sm'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 pl-2 pr-3">
          <Image
            src="/images/cdls-logo.png"
            alt="Center for Developing Leadership in Science"
            width={240}
            height={60}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Separator */}
        <div className="hidden lg:block w-px h-5 bg-charcoal/15 mx-1" />

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.name} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="font-barlow font-bold text-[13px] uppercase tracking-[0.08em] text-charcoal hover:text-tree-leaf-dark transition-colors duration-200 px-2.5 py-1.5 inline-flex items-center gap-1"
                >
                  {item.name}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md border border-charcoal/8 rounded-xl shadow-lg shadow-black/5 py-1.5 min-w-[140px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block font-barlow font-bold text-[13px] uppercase tracking-[0.06em] text-charcoal hover:text-tree-leaf-dark hover:bg-charcoal/5 px-4 py-2 transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href!}
                className="font-barlow font-bold text-[13px] uppercase tracking-[0.08em] text-charcoal hover:text-tree-leaf-dark transition-colors duration-200 px-2.5 py-1.5"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-5 bg-charcoal/15 mx-1" />

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            href="https://giving.ucla.edu/campaign/donate.aspx?Fund=64061o" target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-charcoal hover:bg-charcoal/90 rounded-full pl-4 pr-1.5 py-1 transition-all ml-1"
          >
            <span className="font-barlow font-bold text-[13px] uppercase tracking-[0.08em] text-ivory">
              Support Us
            </span>
            <div className="w-6 h-6 rounded-full bg-ivory flex items-center justify-center group-hover:bg-golden-hour transition-colors">
              <svg className="w-3 h-3 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden pl-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-charcoal p-1.5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu — drops below pill */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl border border-charcoal/8 shadow-lg shadow-black/5 p-4">
          <div className="flex flex-col gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    className="w-full flex items-center justify-between font-barlow font-bold text-[14px] uppercase tracking-[0.06em] text-charcoal hover:text-tree-leaf-dark px-3 py-2.5 transition-colors"
                  >
                    {item.name}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileResourcesOpen && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => { setMobileMenuOpen(false); setMobileResourcesOpen(false); }}
                          className="block font-barlow font-bold text-[13px] uppercase tracking-[0.06em] text-charcoal/70 hover:text-tree-leaf-dark px-3 py-2 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-barlow font-bold text-[14px] uppercase tracking-[0.06em] text-charcoal hover:text-tree-leaf-dark px-3 py-2.5 transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
            <Link
              href="https://giving.ucla.edu/campaign/donate.aspx?Fund=64061o" target="_blank" rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 bg-charcoal rounded-full px-5 py-2.5"
            >
              <span className="font-barlow font-bold text-[13px] uppercase tracking-[0.08em] text-ivory">
                Support Us
              </span>
              <svg className="w-4 h-4 text-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
