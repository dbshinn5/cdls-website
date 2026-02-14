'use client';

import { useState } from 'react';
import GoogleCalendar from './GoogleCalendar';

export default function CalendarToggle({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-12">
      {open && (
        <div className="mb-8 max-w-4xl">
          <GoogleCalendar />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-colors ${
            open
              ? 'bg-charcoal text-ivory'
              : 'bg-[#e6e5dd]/60 text-charcoal hover:bg-[#e6e5dd]'
          }`}
        >
          <span className="font-jakarta text-xs font-medium uppercase tracking-wider">
            Events Calendar
          </span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
