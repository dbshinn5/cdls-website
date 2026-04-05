import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { fellowBySlugQuery, allFellowsQuery, projectsByFellowQuery } from '@/lib/queries';
import type { Fellow, Project } from '@/types';

export const dynamicParams = true;

export async function generateStaticParams() {
  const fellows = await sanityFetch<Fellow[]>(allFellowsQuery);
  return (fellows ?? [])
    .filter((f) => f.slug?.current)
    .map((f) => ({ slug: f.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fellow = await sanityFetch<Fellow>(fellowBySlugQuery, { slug });
  if (!fellow) return { title: 'Person Not Found | CDLS' };
  return {
    title: `${fellow.name} | CDLS`,
    description: fellow.position
      ? `${fellow.name} — ${fellow.position}${fellow.academicUnit ? `, ${fellow.academicUnit}` : ''}`
      : `${fellow.name} — CDLS Fellow`,
  };
}

const categoryLabels: Record<string, string> = {
  'early-career-fellows': 'Early Career Fellow',
  'faculty-fellows': 'Faculty Fellow',
  'community-fellows': 'Community Fellow',
  'climate-resilience-fellows': 'Climate Resilience Fellow',
  fellows: 'Fellow',
  veterans: 'Veteran Fellow',
};

export default async function FellowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fellow = await sanityFetch<Fellow>(fellowBySlugQuery, { slug });

  if (!fellow) notFound();

  const projects = await sanityFetch<Project[]>(projectsByFellowQuery, { fellowId: fellow._id });

  const imageUrl = fellow.image
    ? urlFor(fellow.image)?.width(400).height(400).fit('crop').auto('format').url()
    : fellow.imageUrl || null;

  const categoryLabel = fellow.category ? categoryLabels[fellow.category] || 'Fellow' : null;

  return (
    <>
      {/* Header */}
      <section className="bg-charcoal text-ivory pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className={imageUrl ? 'grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center' : ''}>
            {imageUrl && (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mx-auto md:mx-0 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={fellow.name}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-barlow font-bold normal-case mb-3">{fellow.name}</h1>
              {fellow.position && (
                <p className="font-jakarta text-lg text-ivory/70 mb-1">{fellow.position}</p>
              )}
              {fellow.academicUnit && (
                <p className="font-jakarta text-sm text-ivory/50 mb-4">{fellow.academicUnit}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {categoryLabel && (
                  <span className="inline-flex items-center bg-tree-leaf/20 text-tree-leaf rounded-full px-3 py-1 font-jakarta text-xs font-medium uppercase tracking-wider">
                    {categoryLabel}
                  </span>
                )}
                {fellow.email && (
                  <a
                    href={`mailto:${fellow.email}`}
                    className="font-jakarta text-sm text-ivory/50 hover:text-tree-leaf transition-colors"
                  >
                    {fellow.email}
                  </a>
                )}
                {fellow.website?.url && (
                  <a
                    href={fellow.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-jakarta text-sm text-ivory/50 hover:text-tree-leaf transition-colors"
                  >
                    {fellow.website.title || 'Website'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#faf9f2] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Bio content from PortableText */}
          {fellow.content && fellow.content.length > 0 ? (
            <div className="prose prose-lg max-w-none font-jakarta text-charcoal/90">
              <PortableText
                value={fellow.content}
                components={{
                  block: {
                    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    h2: ({ children }) => (
                      <h2 className="text-2xl md:text-3xl font-barlow font-bold text-charcoal mt-10 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl md:text-2xl font-barlow font-bold text-charcoal mt-8 mb-3">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg md:text-xl font-barlow font-semibold text-charcoal mt-6 mb-2">{children}</h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-tree-leaf pl-4 my-6 italic text-charcoal/70">
                        {children}
                      </blockquote>
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
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tree-leaf hover:underline"
                      >
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
          ) : fellow.htmlContent ? (
            <div
              className="prose prose-lg max-w-none font-jakarta text-charcoal/90"
              dangerouslySetInnerHTML={{ __html: fellow.htmlContent }}
            />
          ) : (
            <p className="font-jakarta text-charcoal/40">Bio coming soon.</p>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="border-t border-charcoal/10 pt-10 mt-12">
              <h2 className="font-barlow font-bold text-xl uppercase tracking-tight text-charcoal mb-6">
                Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project) => {
                  const projImgUrl = project.mainImage
                    ? urlFor(project.mainImage)?.width(800).quality(85).fit('crop').auto('format').url()
                    : null;
                  return (
                    <Link
                      key={project._id}
                      href={`/projects/${project.slug.current}`}
                      className="group flex flex-col"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-charcoal/5">
                        {projImgUrl ? (
                          <Image
                            src={projImgUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-tree-leaf/10 to-high-tide/10" />
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="font-barlow font-bold text-base uppercase text-charcoal group-hover:text-tree-leaf transition-colors leading-tight">
                          {project.title}
                        </p>
                        <p className="font-jakarta text-xs text-charcoal/40 mt-1">
                          {project.year && `${project.year} · `}
                          {project.status === 'ongoing' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Project'}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
