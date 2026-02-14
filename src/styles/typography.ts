/**
 * CDLS Typography System
 *
 * Fonts:
 * - Barlow Condensed: Headlines and display text
 * - Plus Jakarta Sans: Body text, UI elements
 *
 * Usage: Import these classes or reference this file for consistency
 */

export const typography = {
  // ===================
  // HEADLINES
  // ===================

  // Hero headline (homepage only)
  // Barlow Condensed, Bold (700), Uppercase
  // Size: clamp(48px, 10vw, 120px)
  h1Hero: 'font-barlow font-bold uppercase tracking-[-0.02em] leading-[0.95]',

  // Page titles
  // Barlow Condensed, Bold (700), Uppercase
  // Size: clamp(36px, 6vw, 64px)
  h1: 'font-barlow font-bold uppercase tracking-[-0.02em] leading-[1]',

  // Section headings
  // Barlow Condensed, Bold (700), Uppercase
  // Size: clamp(28px, 4vw, 48px)
  h2: 'font-barlow font-bold uppercase tracking-[-0.01em] leading-[1.1]',

  // Subsection headings
  // Barlow Condensed, Bold (700), Uppercase
  // Size: clamp(20px, 3vw, 32px)
  h3: 'font-barlow font-bold uppercase tracking-[-0.01em] leading-[1.2]',

  // Card titles, smaller headings
  // Barlow Condensed, Semibold (600), Sentence case
  // Size: 18px-24px
  h4: 'font-barlow font-semibold normal-case tracking-normal leading-[1.3]',

  // ===================
  // BODY TEXT
  // ===================

  // Large body (hero descriptions, intros)
  // Plus Jakarta, Regular (400)
  // Size: 18px, Line height: 1.7
  bodyLarge: 'font-jakarta font-normal text-lg leading-relaxed',

  // Default body
  // Plus Jakarta, Regular (400)
  // Size: 16px, Line height: 1.7
  body: 'font-jakarta font-normal text-base leading-relaxed',

  // Small body (captions, metadata)
  // Plus Jakarta, Regular (400)
  // Size: 14px, Line height: 1.6
  bodySmall: 'font-jakarta font-normal text-sm leading-normal',

  // ===================
  // UI ELEMENTS
  // ===================

  // Primary buttons
  // Plus Jakarta, Semibold (600), Sentence case
  // Size: 14px, tracking: normal
  button: 'font-jakarta font-semibold text-sm tracking-normal',

  // Navigation links
  // Plus Jakarta, Medium (500), Sentence case
  // Size: 15px
  nav: 'font-jakarta font-medium text-[15px]',

  // Labels and tags (uppercase)
  // Plus Jakarta, Medium (500), Uppercase
  // Size: 11-12px, tracking: wide
  label: 'font-jakarta font-medium text-[11px] uppercase tracking-[0.1em]',

  // Labels sentence case
  // Plus Jakarta, Medium (500)
  // Size: 12-13px
  labelSentence: 'font-jakarta font-medium text-xs',

  // ===================
  // SPECIAL
  // ===================

  // Eyebrow/tagline above headlines
  // Plus Jakarta, Medium (500), Uppercase
  // Size: 11-12px, tracking: wide
  eyebrow: 'font-jakarta font-medium text-[11px] uppercase tracking-[3px]',

  // Quotes/testimonials
  // Plus Jakarta, Regular (400), Italic
  // Size: 20px
  quote: 'font-jakarta font-normal text-xl italic leading-relaxed',
} as const;

/**
 * Color usage with typography:
 *
 * Headlines on dark bg: text-ivory or text-tree-leaf (accent)
 * Headlines on light bg: text-charcoal
 * Body on dark bg: text-ivory/70 or text-ivory/60
 * Body on light bg: text-gray-700
 * Muted/secondary: text-ivory/50 (dark) or text-gray-500 (light)
 * Accent: text-tree-leaf, text-golden-hour, text-high-tide
 *
 * Button colors (WCAG AA compliant):
 * - Primary: bg-tree-leaf-dark (#4A7A3A) with text-white (5.08:1 contrast)
 * - Use tree-leaf (#5B9146) for hover states or non-text elements
 */
