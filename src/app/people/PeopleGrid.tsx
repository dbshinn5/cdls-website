'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createImageUrlBuilder } from '@sanity/image-url';
import { Fellow, FellowCategory, FellowTag, categoryLabels, tagLabels, SanityImage } from '@/types';

const builder = createImageUrlBuilder({
  projectId: '0r5zwpua',
  dataset: 'fellows',
});

function getSanityImageUrl(image: SanityImage, width: number = 400, height: number = 400): string {
  return builder.image(image).width(width).height(height).fit('crop').url();
}

interface PeopleGridProps {
  fellows: Fellow[];
}

const categories: FellowCategory[] = [
  'fellows',
  'community-fellows',
  'early-career-fellows',
  'faculty-fellows',
  'pilot',
  'veterans',
];

const tags: FellowTag[] = [
  'staff',
  'leadership',
  'technical-experts',
  'students',
  'board-of-advisors',
  'affiliates',
  'past-community-members',
];

const PAGE_SIZE = 24;

export default function PeopleGrid({ fellows }: PeopleGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<FellowCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<FellowTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const availableCategories = useMemo(() => {
    const cats = new Set(fellows.map((f) => f.category).filter(Boolean));
    return categories.filter((c) => cats.has(c));
  }, [fellows]);

  const availableTags = useMemo(() => {
    const allTags = new Set(fellows.flatMap((f) => f.tags || []));
    return tags.filter((t) => allTags.has(t));
  }, [fellows]);

  const filteredFellows = useMemo(() => {
    setVisibleCount(PAGE_SIZE);
    return fellows.filter((fellow) => {
      if (selectedCategory !== 'all' && fellow.category !== selectedCategory) return false;
      if (selectedTag !== 'all' && !fellow.tags?.includes(selectedTag)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = fellow.name.toLowerCase().includes(query);
        const matchesPosition = fellow.position?.toLowerCase().includes(query);
        const matchesInstitution = fellow.academicUnit?.toLowerCase().includes(query);
        if (!matchesName && !matchesPosition && !matchesInstitution) return false;
      }
      return true;
    });
  }, [fellows, selectedCategory, selectedTag, searchQuery]);

  const visibleFellows = filteredFellows.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFellows.length;

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, position, or institution..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-5 py-2.5 border border-charcoal/15 bg-white font-jakarta text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal/40 transition-colors"
        />
      </div>

      {/* Category Filters */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`inline-flex items-center rounded-full px-5 py-2.5 transition-colors font-jakarta text-xs font-medium uppercase tracking-wider ${
              selectedCategory === 'all'
                ? 'bg-charcoal text-ivory'
                : 'bg-[#e6e5dd]/60 text-charcoal hover:bg-[#e6e5dd]'
            }`}
          >
            All
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center rounded-full px-5 py-2.5 transition-colors font-jakarta text-xs font-medium uppercase tracking-wider ${
                selectedCategory === category
                  ? 'bg-charcoal text-ivory'
                  : 'bg-[#e6e5dd]/60 text-charcoal hover:bg-[#e6e5dd]'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      )}

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag('all')}
            className={`inline-flex items-center rounded-full px-4 py-1.5 transition-colors font-jakarta text-[11px] font-medium uppercase tracking-wider ${
              selectedTag === 'all'
                ? 'bg-tree-leaf text-white'
                : 'bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10'
            }`}
          >
            All Roles
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`inline-flex items-center rounded-full px-4 py-1.5 transition-colors font-jakarta text-[11px] font-medium uppercase tracking-wider ${
                selectedTag === tag
                  ? 'bg-tree-leaf text-white'
                  : 'bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10'
              }`}
            >
              {tagLabels[tag]}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="font-jakarta text-xs tracking-wider text-charcoal/40 mb-8">
        Showing {visibleFellows.length} of {filteredFellows.length} people
      </p>

      {/* People Grid */}
      {filteredFellows.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
            {visibleFellows.map((fellow) => (
              <FellowCard key={fellow._id} fellow={fellow} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-[#e6e5dd]/60 text-charcoal hover:bg-[#e6e5dd] transition-colors font-jakarta text-xs font-medium uppercase tracking-wider"
              >
                Load more
                <span className="text-charcoal/40">
                  ({filteredFellows.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12">
          <p className="font-jakarta text-charcoal/40">No people found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
              setSearchQuery('');
            }}
            className="mt-4 font-jakarta text-sm text-tree-leaf hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function FellowCard({ fellow }: { fellow: Fellow }) {
  const imageUrl = fellow.image?.asset?._ref ? getSanityImageUrl(fellow.image, 600, 600) : null;

  return (
    <Link href={`/people/${fellow.slug.current}`} className="group flex flex-col">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-charcoal/5 flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={fellow.name}
            fill
            className="object-cover sepia-[.3] saturate-[.7] brightness-[.85] group-hover:sepia-0 group-hover:saturate-100 group-hover:brightness-100 scale-105 group-hover:scale-100 transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-tree-leaf/10 to-high-tide/10 flex items-center justify-center">
            <span className="text-5xl font-barlow font-bold text-charcoal/10">
              {fellow.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col flex-1">
        <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-charcoal leading-[1.15] tracking-tight group-hover:text-tree-leaf transition-colors duration-300">
          {fellow.name}
        </h3>
        {fellow.position && (
          <p className="font-jakarta text-sm text-charcoal/50 mt-1">{fellow.position}</p>
        )}
        {fellow.academicUnit && (
          <p className="font-jakarta text-xs text-charcoal/40 mt-0.5">{fellow.academicUnit}</p>
        )}
        <div className="flex-1" />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-charcoal/10">
          {fellow.category && (
            <p className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal/40">
              {categoryLabels[fellow.category]}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
