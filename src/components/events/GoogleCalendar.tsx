'use client';

import { useState, useEffect, useMemo } from 'react';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function GoogleCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_KEY || !CALENDAR_ID) return;

    const timeMin = new Date(currentYear, currentMonth, 1).toISOString();
    const timeMax = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=100`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentMonth, currentYear]);

  // Map dates to events
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const dateStr = event.start.dateTime || event.start.date;
      if (!dateStr) return;
      const key = dateStr.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div className="bg-charcoal/[0.03] border border-charcoal/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
        <h3 className="font-barlow font-bold text-xl uppercase tracking-tight text-charcoal">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center border border-charcoal/15 hover:border-charcoal/30 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center border border-charcoal/15 hover:border-charcoal/30 transition-colors"
            aria-label="Next month"
          >
            <svg className="w-4 h-4 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-charcoal/10">
        {DAYS.map((day) => (
          <div key={day} className="py-3 text-center font-jakarta text-[11px] font-medium uppercase tracking-wider text-charcoal/40">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-charcoal/5 bg-charcoal/[0.02]" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateKey] || [];
          const isToday = dateKey === todayStr;
          const isSelected = dateKey === selectedDate;
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={`min-h-[100px] border-b border-r border-charcoal/5 p-1.5 md:p-2 flex flex-col items-start text-left transition-colors relative ${
                isSelected
                  ? 'bg-tree-leaf/10'
                  : hasEvents
                    ? 'hover:bg-charcoal/[0.04] cursor-pointer'
                    : ''
              }`}
            >
              <span
                className={`text-sm font-jakarta mb-1 ${
                  isToday
                    ? 'w-7 h-7 flex items-center justify-center bg-tree-leaf text-white font-bold'
                    : hasEvents
                      ? 'text-charcoal font-medium'
                      : 'text-charcoal/30'
                }`}
              >
                {day}
              </span>
              {hasEvents && (
                <div className="w-full space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="bg-tree-leaf/10 px-1 py-0.5 truncate"
                    >
                      <span className="font-jakarta text-[10px] leading-tight text-tree-leaf font-medium">
                        {event.summary}
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="font-jakarta text-[10px] text-charcoal/40 px-1">
                      +{dayEvents.length - 2} more
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="border-t border-charcoal/10 px-6 py-5">
          <p className="font-jakarta text-xs uppercase tracking-wider text-charcoal/40 mb-4">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="font-jakarta text-sm text-charcoal/40">No events this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="w-1 flex-shrink-0 bg-tree-leaf mt-1" />
                  <div>
                    <p className="font-barlow font-bold text-charcoal leading-snug">
                      {event.summary}
                    </p>
                    {event.start.dateTime && (
                      <p className="font-jakarta text-xs text-charcoal/50 mt-0.5">
                        {formatTime(event.start.dateTime)}
                        {event.end?.dateTime && ` – ${formatTime(event.end.dateTime)}`}
                      </p>
                    )}
                    {event.location && (
                      <p className="font-jakarta text-xs text-charcoal/40 mt-0.5">
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="px-6 py-3 border-t border-charcoal/10">
          <p className="font-jakarta text-xs text-charcoal/30">Loading events...</p>
        </div>
      )}
    </div>
  );
}
