import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { projectBySlugQuery, allProjectsQuery } from '@/lib/queries';
import type { Project } from '@/types';

export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await sanityFetch<Project[]>(allProjectsQuery);
  return (projects ?? [])
    .filter((p) => p.slug?.current)
    .map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityFetch<Project>(projectBySlugQuery, { slug });
  if (!project) return { title: 'Project Not Found | CDLS' };
  return {
    title: `${project.title} | CDLS Projects`,
    description: project.description || 'A project from the Center for Developing Leadership in Science.',
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityFetch<Project>(projectBySlugQuery, { slug });

  if (!project) notFound();

  const heroImageUrl = project.mainImage ? urlFor(project.mainImage)?.width(1600).quality(90).auto('format').url() : null;

  return (
    <>
      {/* Header */}
      <section className="bg-charcoal text-ivory pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className={heroImageUrl ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''}>
            <div>
              <h1 className="text-3xl md:text-5xl font-barlow font-bold normal-case mb-4">{project.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {project.year && (
                  <span className="font-jakarta text-sm text-ivory/50">
                    {project.year}
                  </span>
                )}
                {project.status && (
                  <span className={`font-jakarta text-sm font-medium px-3 py-1 rounded-full ${
                    project.status === 'ongoing'
                      ? 'bg-tree-leaf/20 text-tree-leaf'
                      : 'bg-ivory/10 text-ivory/50'
                  }`}>
                    {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                  </span>
                )}
              </div>
            </div>

            {heroImageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={heroImageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {(project.facultyAdvisor || project.client) && (
            <div className="flex flex-wrap gap-8 mb-8 font-jakarta text-sm">
              {project.facultyAdvisor && (
                <div>
                  <span className="font-medium text-gray-400">Faculty Advisor </span>
                  <span className="text-charcoal">{project.facultyAdvisor}</span>
                </div>
              )}
              {project.client && (
                <div>
                  <span className="font-medium text-gray-400">Partner </span>
                  <span className="text-charcoal">{project.client}</span>
                </div>
              )}
            </div>
          )}

          {/* Body */}
          {project.body && project.body.length > 0 && (
            <div className="prose prose-lg max-w-none font-jakarta text-charcoal/90 mb-12">
              <PortableText
                value={project.body}
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
          )}

          {/* Fellows Behind the Program */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="border-t border-charcoal/10 pt-10 mb-10">
              <h2 className="font-barlow font-bold text-xl uppercase tracking-tight text-charcoal mb-8">Fellows Behind the Program</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {project.teamMembers.map((member) => {
                  const memberImgUrl = member.image ? urlFor(member.image)?.width(200).height(200).fit('crop').url() : null;
                  return (
                    <Link
                      key={member._id}
                      href={`/people/${member.slug?.current}`}
                      className="group flex flex-col items-center text-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-charcoal/5 flex-shrink-0 overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-tree-leaf transition-all">
                        {memberImgUrl ? (
                          <Image src={memberImgUrl} alt={member.name} width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-2xl font-semibold text-charcoal/20">
                            {member.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <p className="font-jakarta text-sm font-medium text-charcoal group-hover:text-tree-leaf transition-colors">{member.name}</p>
                      {member.position && (
                        <p className="font-jakarta text-xs text-charcoal/40 mt-0.5">{member.position}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resources */}
          {project.resources && project.resources.length > 0 && (
            <div className="border-t border-charcoal/10 pt-10">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Resources</h2>
              <ul className="space-y-3">
                {project.resources.map((resource, i) => (
                  <li key={i}>
                    {resource.fileUrl ? (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-jakarta text-tree-leaf hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {resource.title || 'Download'}
                      </a>
                    ) : (
                      <span className="font-jakarta text-gray-600">{resource.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
