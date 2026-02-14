import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { eventBySlugQuery } from '@/lib/queries';
import type { Event } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await sanityFetch<Event>(eventBySlugQuery, { slug });
  if (!event) return { title: 'Event Not Found | CDLS' };
  return {
    title: `${event.title} | CDLS Events`,
    description: event.description || 'An event from the Center for Developing Leadership in Science.',
  };
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const eventTypeLabels: Record<string, string> = {
  'lecture-series': 'Lecture Series',
  workshop: 'Workshop',
  community: 'Community',
  other: 'Event',
};

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await sanityFetch<Event>(eventBySlugQuery, { slug });

  if (!event) notFound();

  const heroImageUrl = event.mainImage ? urlFor(event.mainImage)?.width(1600).quality(90).auto('format').url() : null;

  return (
    <>
      {/* Header */}
      <section className="bg-charcoal text-ivory pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className={heroImageUrl ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''}>
            <div>
              <h1 className="text-3xl md:text-5xl font-barlow font-bold normal-case mb-4">{event.title}</h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {event.eventType && (
                  <span className="font-jakarta text-sm font-medium px-3 py-1 rounded-full bg-high-tide/20 text-high-tide">
                    {eventTypeLabels[event.eventType] || event.eventType}
                  </span>
                )}
                {event.program && (
                  <span className="font-jakarta text-sm font-medium px-3 py-1 rounded-full bg-ivory/10 text-ivory/70">
                    {event.program}
                  </span>
                )}
              </div>
            </div>

            {heroImageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={heroImageUrl} alt={event.title} fill className="object-cover" sizes="50vw" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Date & Location */}
          <div className="space-y-3 mb-8 font-jakarta text-sm">
            <div>
              <span className="font-medium text-gray-400">When </span>
              <span className="text-charcoal">
                {formatDateTime(event.startDateTime)}
                {event.endDateTime && (
                  <>
                    {' – '}
                    {new Date(event.startDateTime).toDateString() === new Date(event.endDateTime).toDateString()
                      ? new Date(event.endDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                      : formatDateTime(event.endDateTime)}
                  </>
                )}
              </span>
            </div>
            {event.locations && event.locations.length > 0 && (
              <div>
                <span className="font-medium text-gray-400">Where </span>
                <span className="text-charcoal">
                  {event.locations.map((loc, i) => (
                    <span key={i}>
                      {i > 0 && ' · '}
                      {loc.name}
                      {loc.address && ` (${loc.address})`}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Registration Button */}
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 mb-10 bg-tree-leaf-dark text-white font-jakarta font-semibold text-sm hover:bg-tree-leaf transition-colors"
            >
              Register for this Event
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* Body */}
          {event.body && event.body.length > 0 ? (
            <div className="prose prose-lg max-w-none font-jakarta text-charcoal/90">
              <PortableText
                value={event.body}
                components={{
                  block: {
                    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-barlow font-bold text-charcoal mt-10 mb-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-barlow font-bold text-charcoal mt-8 mb-3">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg md:text-xl font-barlow font-semibold text-charcoal mt-6 mb-2">{children}</h4>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-tree-leaf pl-4 my-6 italic text-charcoal/70">{children}</blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  },
                  marks: {
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em>{children}</em>,
                    link: ({ value, children }) => (
                      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-tree-leaf hover:underline">
                        {children}
                      </a>
                    ),
                  },
                  types: {
                    image: ({ value }) => {
                      const imgUrl = urlFor(value)?.width(800).url();
                      if (!imgUrl) return null;
                      return (
                        <div className="my-8">
                          <Image src={imgUrl} alt={value.alt || ''} width={800} height={450} />
                        </div>
                      );
                    },
                  },
                }}
              />
            </div>
          ) : event.description ? (
            <p className="font-jakarta text-charcoal/80 leading-relaxed">{event.description}</p>
          ) : (
            <p className="font-jakarta text-gray-500">Details coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
