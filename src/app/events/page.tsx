import Link from 'next/link';
import Image from 'next/image';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { upcomingEventsQuery, pastEventsQuery } from '@/lib/queries';
import type { Event } from '@/types';
import CalendarToggle from '@/components/events/CalendarToggle';

export const metadata = {
  title: 'Events | CDLS',
  description: 'Upcoming and past events from the Center for Developing Leadership in Science.',
};

function formatEventDate(startDateTime: string, endDateTime?: string) {
  const start = new Date(startDateTime);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  let result = start.toLocaleDateString('en-US', options);
  if (endDateTime) {
    const end = new Date(endDateTime);
    const sameDay = start.toDateString() === end.toDateString();
    if (!sameDay) {
      result += ` – ${end.toLocaleDateString('en-US', options)}`;
    }
  }
  return result;
}

const eventTypeLabels: Record<string, string> = {
  'lecture-series': 'Lecture Series',
  workshop: 'Workshop',
  community: 'Community',
  other: 'Event',
};

function EventCard({ event, isPast }: { event: Event; isPast?: boolean }) {
  const imgUrl = event.mainImage
    ? urlFor(event.mainImage)?.width(800).quality(90).fit('crop').auto('format').url()
    : null;

  return (
    <Link
      href={`/events/${event.slug.current}`}
      className={`group flex flex-col ${isPast ? 'opacity-75 hover:opacity-100 transition-opacity' : ''}`}
    >
      {imgUrl ? (
        <div className="aspect-[16/10] relative overflow-hidden bg-charcoal/5 flex-shrink-0">
          <Image
            src={imgUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className={`aspect-[16/10] flex-shrink-0 ${isPast ? 'bg-gradient-to-br from-charcoal/5 to-charcoal/10' : 'bg-gradient-to-br from-tree-leaf/10 to-high-tide/10'}`} />
      )}
      <div className="mt-5 flex flex-col flex-1">
        <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-charcoal leading-[1.15] tracking-tight group-hover:text-tree-leaf transition-colors duration-300">
          {event.title}
        </h3>
        <div className="flex-1" />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-charcoal/10">
          <p className="font-jakarta text-xs tracking-wider text-charcoal/40">
            {formatEventDate(event.startDateTime, event.endDateTime)}
          </p>
          <p className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal/40">
            {(event.eventType && eventTypeLabels[event.eventType]) || 'Event'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    sanityFetch<Event[]>(upcomingEventsQuery).then((r) => r ?? []),
    sanityFetch<Event[]>(pastEventsQuery).then((r) => r ?? []),
  ]);

  const hasNoEvents = upcomingEvents.length === 0 && pastEvents.length === 0;

  return (
    <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        {/* Title */}
        <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
          Events
        </h1>

        {hasNoEvents ? (
          <p className="font-jakarta text-charcoal/50 text-lg">No events yet. Check back soon.</p>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-20">
                <div className="inline-flex items-center gap-2 bg-[#e6e5dd]/60 rounded-full px-5 py-2.5 mb-12">
                  <span className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal">Upcoming</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Toggle + Past Events */}
            <div>
              <CalendarToggle>
                {pastEvents.length > 0 && (
                  <div className="inline-flex items-center gap-2 bg-[#e6e5dd]/60 rounded-full px-5 py-2.5">
                    <span className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal/60">Past Events</span>
                  </div>
                )}
              </CalendarToggle>
              {pastEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
                  {pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} isPast />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
