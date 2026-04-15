import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { policyBySlugQuery, allPoliciesQuery } from '@/lib/queries';
import type { Policy } from '@/types';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const policies = await sanityFetch<Policy[]>(allPoliciesQuery);
  return (policies ?? [])
    .filter((p) => p.slug?.current)
    .map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = await sanityFetch<Policy>(policyBySlugQuery, { slug });
  if (!policy) return { title: 'Policy Not Found | CDLS' };
  return {
    title: `${policy.title} | CDLS Policy`,
    description: policy.excerpt || 'Policy from the Consortium for Developing Leadership in Science.',
  };
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = await sanityFetch<Policy>(policyBySlugQuery, { slug });

  if (!policy) notFound();

  return (
    <>
      <section className="bg-charcoal text-ivory pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-barlow font-bold normal-case mb-4">{policy.title}</h1>
          {policy.excerpt && (
            <p className="font-jakarta text-ivory/60 text-lg max-w-2xl">{policy.excerpt}</p>
          )}
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {policy.body && policy.body.length > 0 ? (
            <div className="prose prose-lg max-w-none font-jakarta text-charcoal/90">
              <PortableText
                value={policy.body}
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
          ) : (
            <p className="font-jakarta text-gray-500">Content coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
