'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createImageUrlBuilder } from '@sanity/image-url';
import { Project, ProjectCategory, projectCategoryLabels, SanityImage } from '@/types';

const builder = createImageUrlBuilder({
  projectId: '0r5zwpua',
  dataset: 'fellows',
});

function getSanityImageUrl(image: SanityImage, width: number = 800): string {
  return builder.image(image).width(width).quality(90).fit('crop').auto('format').url();
}

interface ProjectsGridProps {
  projects: Project[];
}

const categories: ProjectCategory[] = [
  'community-partnerships',
  'fellow-led',
  'outreach-education',
  'core-programs',
];

const PAGE_SIZE = 12;

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const availableCategories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.projectCategory).filter(Boolean));
    return categories.filter((c) => cats.has(c));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    setVisibleCount(PAGE_SIZE);
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.projectCategory === selectedCategory);
  }, [projects, selectedCategory]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div>
      {/* Category Filters */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
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
              {projectCategoryLabels[category]}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="font-jakarta text-xs tracking-wider text-charcoal/40 mb-8">
        Showing {visibleProjects.length} of {filteredProjects.length} projects
      </p>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
            {visibleProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
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
                  ({filteredProjects.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12">
          <p className="font-jakarta text-charcoal/40">No projects found in this category.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 font-jakarta text-sm text-tree-leaf hover:underline"
          >
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const imageUrl = project.mainImage?.asset?._ref ? getSanityImageUrl(project.mainImage) : null;

  return (
    <Link href={`/projects/${project.slug.current}`} className="group flex flex-col">
      {imageUrl ? (
        <div className="aspect-[16/10] relative overflow-hidden bg-charcoal/5 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover sepia-[.3] saturate-[.7] brightness-[.85] group-hover:sepia-0 group-hover:saturate-100 group-hover:brightness-100 scale-105 group-hover:scale-100 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] flex-shrink-0 bg-gradient-to-br from-tree-leaf/10 to-high-tide/10" />
      )}
      <div className="mt-5 flex flex-col flex-1">
        <h3 className="font-barlow font-bold text-[1.35rem] md:text-[1.6rem] uppercase text-charcoal leading-[1.15] tracking-tight group-hover:text-tree-leaf transition-colors duration-300">
          {project.title}
        </h3>
        <div className="flex-1" />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-charcoal/10">
          <p className="font-jakarta text-xs tracking-wider text-charcoal/40">
            {project.year || ''}
          </p>
          {project.projectCategory && (
            <span className="font-jakarta text-xs font-medium uppercase tracking-wider text-charcoal/40">
              {projectCategoryLabels[project.projectCategory]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
