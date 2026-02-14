import Link from 'next/link';
import Image from 'next/image';
import { sanityFetch, isSanityConfigured, urlFor } from '@/lib/sanity';
import { allFellowsQuery, allNewsPostsQuery } from '@/lib/queries';
import { Fellow, NewsPost } from '@/types';
import { createImageUrlBuilder } from '@sanity/image-url';
import HeroV2 from '@/components/home/HeroV2';
import ParallaxGallery from '@/components/home/ParallaxGallery';
import ScrollTextSection from '@/components/home/ScrollTextSection';
import ScrollTextSectionLight from '@/components/home/ScrollTextSectionLight';
import SnapshotsGreenGlow from '@/components/home/snapshots/SnapshotsGreenGlow';
import LatestNews from '@/components/home/LatestNews';
import CTAPhotoCollage from '@/components/home/CTAPhotoCollage';
import FeaturedFellows from '@/components/home/FeaturedFellows';

const builder = createImageUrlBuilder({
  projectId: '0r5zwpua',
  dataset: 'fellows',
});

function getSanityImageUrl(image: Fellow['image'], width: number, height: number): string {
  if (!image?.asset?._ref) return '';
  return builder.image(image).width(width).height(height).fit('crop').url();
}

export default async function HomeV2() {
  let fellows: Fellow[] = [];
  let newsPosts: NewsPost[] = [];

  if (isSanityConfigured()) {
    try {
      const [fetchedFellows, fetchedNews] = await Promise.all([
        sanityFetch<Fellow[]>(allFellowsQuery),
        sanityFetch<NewsPost[]>(allNewsPostsQuery),
      ]);
      if (fetchedFellows) fellows = fetchedFellows;
      if (fetchedNews) newsPosts = fetchedNews;
    } catch (error) {
      console.log('Sanity fetch error:', error);
    }
  }

  // Prepare fellows for different sections
  const galleryFellows = fellows.slice(0, 7);
  const featuredFellows = fellows.slice(0, 4);
  const fellowsWithImages = fellows.filter(f => f.image?.asset?._ref);

  // Prepare news items for LatestNews component (serialize for client component)
  const latestNewsItems = newsPosts.slice(0, 6).map((post) => ({
    title: post.title,
    date: new Date(post.publishedAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    image: post.mainImage ? urlFor(post.mainImage)?.width(600).quality(90).auto('format').url() ?? null : null,
    href: `/news/${post.slug.current}`,
  }));

  return (
    <>
      {/* Hero - Full viewport with photo grid background */}
      <div className="relative">
        <HeroV2 />
      </div>

      {/* HIDDEN-SECTION: Scroll Text Section - Dark - Uncomment to restore
      <div className="relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">2. Scroll Text (Dark)</div>
        <ScrollTextSection />
      </div>
      END-HIDDEN-SECTION */}

      {/* Scroll Text Section - Light */}
      <div className="relative">
        <ScrollTextSectionLight />
      </div>

      {/* HIDDEN-SECTION: Featured Projects (Full) - Uncomment to restore
      <section className="bg-charcoal min-h-screen py-16 md:py-24 overflow-hidden relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">3. Featured Projects</div>
        <div className="mx-auto w-full max-w-[2000px] px-8 md:px-16">
          <div className="flex items-center gap-8 mb-16">
            <div className="w-24 h-[2px] bg-golden-hour" />
            <p className="font-jakarta font-medium text-[11px] uppercase tracking-[4px] text-ivory/60">
              Featured Projects
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {[
              { title: 'Fellowships', image: '/images/cdls-ioes/fellowships.jpg', accent: 'bg-golden-hour', href: '/programs#fellowships' },
              { title: 'Research', image: '/images/cdls-ioes/research.jpg', accent: 'bg-tree-leaf', href: '/programs#research' },
              { title: 'Community Outreach', image: '/images/cdls-ioes/community-outreach.jpg', accent: 'bg-high-tide', href: '/programs#community' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative flex-1"
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] lg:aspect-[2/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-high-tide/40 via-charcoal to-tree-leaf/30" />
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                    <div className={`w-12 h-1 ${item.accent} mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                    <h3 className="font-barlow font-black text-4xl md:text-5xl lg:text-6xl uppercase text-ivory leading-none tracking-tight">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-sm text-ivory/50 mt-4 max-w-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      Explore our {item.title.toLowerCase()} program →
                    </p>
                  </div>

                  <div className="absolute top-6 right-6 font-barlow font-bold text-8xl text-ivory/5 group-hover:text-ivory/10 transition-colors">
                    0{index + 1}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      END-HIDDEN-SECTION */}

      {/* Featured Projects - Half Viewport Version */}
      <section className="bg-ivory min-h-[50vh] py-10 md:py-14 overflow-hidden relative">
        <div className="mx-auto w-full max-w-[2000px] px-8 md:px-16">
          {/* Section header with accent line */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-[2px] bg-tree-leaf" />
            <p className="font-jakarta font-medium text-[10px] uppercase tracking-[3px] text-charcoal/60">
              Featured Projects
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            {[
              { title: 'Fellowships', image: '/images/cdls-ioes/fellowships.jpg', accent: 'bg-golden-hour', href: '/projects' },
              { title: 'Research', image: '/images/cdls-ioes/research.jpg', accent: 'bg-tree-leaf', href: '/projects' },
              { title: 'Community Outreach', image: '/images/cdls-ioes/community-outreach.jpg', accent: 'bg-high-tide', href: '/projects' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative flex-1"
              >
                {/* Card with clip-path reveal on hover */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] lg:aspect-[3/2] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-high-tide/40 via-charcoal to-tree-leaf/30" />
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover sepia-[.3] saturate-[.7] brightness-[.85] group-hover:sepia-0 group-hover:saturate-100 group-hover:brightness-100 scale-105 group-hover:scale-100 transition-all duration-700"
                    />
                    {/* Dramatic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>

                  {/* Large typography overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <div className={`w-8 h-0.5 ${item.accent} mb-2 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                    <h3 className="font-barlow font-black text-2xl md:text-3xl lg:text-4xl uppercase text-ivory leading-none tracking-tight">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-xs text-ivory/50 mt-2 max-w-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      Explore our {item.title.toLowerCase()} program →
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HIDDEN-SECTION: Featured Projects - Square Cards with Titles Below - Uncomment to restore
      <section className="bg-charcoal py-16 md:py-20 overflow-hidden relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">3b. Featured Projects (Square)</div>
        <div className="mx-auto w-full max-w-[1600px] px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Fellowships', image: '/images/cdls-ioes/fellowships.jpg', href: '/projects' },
              { title: 'Research', image: '/images/cdls-ioes/research.jpg', href: '/projects' },
              { title: 'Community Outreach', image: '/images/cdls-ioes/community-outreach.jpg', href: '/projects' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group"
              >
                <div className="aspect-square overflow-hidden relative mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-barlow font-bold text-2xl md:text-3xl uppercase text-ivory leading-none tracking-tight group-hover:text-golden-hour transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      END-HIDDEN-SECTION */}

      {/* Featured Fellows — Type Over Image */}
      <FeaturedFellows fellows={fellowsWithImages} />

      {/* HIDDEN-SECTION: Snapshots of Innovation - Uncomment to restore
      <div className="relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">4. Snapshots of Innovation</div>
        <SnapshotsGreenGlow />
      </div>
      END-HIDDEN-SECTION */}

      {/* Latest News */}
      <div className="relative">
        <LatestNews items={latestNewsItems} />
      </div>

      {/* HIDDEN-SECTION: CTA Section - Photo Collage - Uncomment to restore
      <div className="relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">6. CDLS in Action</div>
        <CTAPhotoCollage />
      </div>
      END-HIDDEN-SECTION */}

      {/* HIDDEN-SECTION: Programs Grid - Dark - Uncomment to restore
      <section className="bg-charcoal py-24 md:py-32 relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">7. Programs Grid</div>
        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="text-center mb-16">
            <p className="font-jakarta font-medium text-[11px] uppercase tracking-[3px] text-golden-hour mb-6">
              What We Do
            </p>
            <h2 className="text-ivory">Our Programs</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Fellowships',
                description: 'Supporting emerging leaders across early career, faculty, and community pathways.',
                image: featuredFellows[0],
                href: '/projects',
              },
              {
                title: 'Training & Workshops',
                description: 'Professional development rooted in equity and environmental justice.',
                image: featuredFellows[1],
                href: '/projects',
              },
              {
                title: 'Community Initiatives',
                description: 'Intergenerational programs connecting research with lived experience.',
                image: featuredFellows[2],
                href: '/projects',
              },
            ].map((program, index) => (
              <Link
                key={index}
                href={program.href}
                className="group relative aspect-[4/5] rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-charcoal">
                  {program.image?.image?.asset?._ref && (
                    <Image
                      src={getSanityImageUrl(program.image.image, 400, 500)}
                      alt={program.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h4 className="text-ivory mb-2 group-hover:text-tree-leaf transition-colors">
                    {program.title}
                  </h4>
                  <p className="font-jakarta text-sm text-ivory/70 mb-4">
                    {program.description}
                  </p>
                  <span className="font-jakarta font-medium text-sm text-tree-leaf inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      END-HIDDEN-SECTION */}

      {/* HIDDEN-SECTION: Parallax Gallery - "CDLS in Action" - Uncomment to restore
      <div className="relative">
        <div className="section-label absolute top-4 left-4 z-[100] px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg">8. Parallax Gallery</div>
        <ParallaxGallery fellows={galleryFellows} />
      </div>
      END-HIDDEN-SECTION */}
    </>
  );
}
