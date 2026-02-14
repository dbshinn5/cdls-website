import { sanityFetch, isSanityConfigured } from '@/lib/sanity';
import { allFellowsQuery } from '@/lib/queries';
import { Fellow } from '@/types';
import PeopleGrid from './PeopleGrid';

export const metadata = {
  title: 'People | CDLS',
  description: 'Meet the fellows, staff, and community members of the Center for Developing Leadership in Science.',
};

export default async function PeoplePage() {
  let fellows: Fellow[] = [];

  if (isSanityConfigured()) {
    try {
      const fetchedFellows = await sanityFetch<Fellow[]>(allFellowsQuery);
      if (fetchedFellows && fetchedFellows.length > 0) {
        fellows = fetchedFellows;
      }
    } catch (error) {
      console.log('Sanity fetch error:', error);
    }
  }

  return (
    <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
          People
        </h1>
        <PeopleGrid fellows={fellows} />
      </div>
    </section>
  );
}
