import Link from 'next/link';
import Image from 'next/image';
import { sanityFetch, urlFor } from '@/lib/sanity';
import { allNewsPostsQuery } from '@/lib/queries';
import type { NewsPost } from '@/types';

export const metadata = {
  title: 'News | CDLS',
  description: 'Latest news from the Center for Developing Leadership in Science.',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function NewsPage() {
  const newsPosts = await sanityFetch<NewsPost[]>(allNewsPostsQuery) ?? [];

  if (newsPosts.length === 0) {
    return (
      <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-8 md:px-16">
          <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
            News
          </h1>
          <p className="font-jakarta text-charcoal/50 text-lg">No news articles yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        {/* Title */}
        <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
          News
        </h1>

        {/* Pill filter bar */}
        <div className="inline-flex items-center gap-2 bg-[#e6e5dd]/60 rounded-full p-1.5 mb-16">
          {['All', 'Research', 'Community', 'Awards', 'Events'].map((filter, i) => (
            <button
              key={filter}
              className={`font-jakarta text-xs font-medium uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors ${
                i === 0
                  ? 'bg-charcoal text-ivory'
                  : 'text-charcoal/60 hover:text-charcoal hover:bg-[#e6e5dd]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
          {newsPosts.map((post) => {
            const imgUrl = post.mainImage
              ? urlFor(post.mainImage)?.width(800).quality(90).fit('crop').auto('format').url()
              : null;
            return (
              <Link
                key={post._id}
                href={`/news/${post.slug.current}`}
                className="group flex flex-col"
              >
                {imgUrl ? (
                  <div className="aspect-[16/10] relative overflow-hidden bg-charcoal/5 flex-shrink-0">
                    <Image
                      src={imgUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-golden-hour/10 to-tree-leaf/10 flex-shrink-0" />
                )}
                <div className="mt-5 flex flex-col flex-1">
                  <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-charcoal leading-[1.15] tracking-tight group-hover:text-[#d97519] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <div className="flex-1" />
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-charcoal/10">
                    <p className="font-jakarta text-xs tracking-wider text-charcoal/40">
                      {formatDate(post.publishedAt)}
                    </p>
                    <p className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal/40">
                      News
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
