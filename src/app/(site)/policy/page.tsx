import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity';
import { allPoliciesQuery } from '@/lib/queries';
import type { Policy } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Policy | CDLS',
  description: 'Policy resources from the Consortium for Developing Leadership in Science.',
};

export default async function PolicyPage() {
  const policies = (await sanityFetch<Policy[]>(allPoliciesQuery)) ?? [];

  if (policies.length === 0) {
    return (
      <section className="bg-charcoal text-ivory min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-jakarta font-medium text-[11px] uppercase tracking-[3px] text-golden-hour mb-6">
            Policy
          </p>
          <h1 className="font-barlow font-bold text-4xl md:text-5xl uppercase tracking-tight mb-6">
            Coming Soon
          </h1>
          <p className="font-jakarta text-lg text-ivory/60 max-w-md mx-auto">
            We're working on bringing you policy resources and updates. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
          Policy
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
          {policies.map((policy) => (
            <Link
              key={policy._id}
              href={`/policy/${policy.slug.current}`}
              className="group flex flex-col"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-golden-hour/10 to-tree-leaf/10 flex-shrink-0 flex items-center justify-center">
                <span className="font-barlow font-bold text-2xl text-charcoal/20 uppercase tracking-wider">
                  Policy
                </span>
              </div>
              <div className="mt-5 flex flex-col flex-1">
                <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-charcoal leading-[1.15] tracking-tight group-hover:text-[#d97519] transition-colors duration-300">
                  {policy.title}
                </h3>
                {policy.excerpt && (
                  <p className="font-jakarta text-sm text-charcoal/60 mt-2 line-clamp-3">
                    {policy.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
