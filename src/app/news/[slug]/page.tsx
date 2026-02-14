import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { newsPostBySlugQuery, allNewsPostsQuery } from '@/lib/queries';
import type { NewsPost } from '@/types';

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await sanityFetch<NewsPost[]>(allNewsPostsQuery);
  return (posts ?? [])
    .filter((p) => p.slug?.current)
    .map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<NewsPost>(newsPostBySlugQuery, { slug });
  if (!post) return { title: 'Article Not Found | CDLS' };
  return {
    title: `${post.title} | CDLS News`,
    description: post.excerpt || 'News from the Center for Developing Leadership in Science.',
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<NewsPost>(newsPostBySlugQuery, { slug });

  if (!post) notFound();

  const heroImageUrl = post.mainImage ? urlFor(post.mainImage)?.width(1600).quality(90).auto('format').url() : null;

  return (
    <>
      {/* Header */}
      <section className="bg-charcoal text-ivory pt-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className={heroImageUrl ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''}>
            <div>
              <h1 className="text-3xl md:text-5xl font-barlow font-bold normal-case mb-4">{post.title}</h1>
              <div className="flex items-center gap-3 font-jakarta text-sm text-ivory/50">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {post.author && (
                  <>
                    <span>·</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>
            </div>

            {heroImageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={heroImageUrl} alt={post.title} fill className="object-cover" sizes="50vw" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {post.body && post.body.length > 0 ? (
            <div className="prose prose-lg max-w-none font-jakarta text-charcoal/90">
              <PortableText
                value={post.body}
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
