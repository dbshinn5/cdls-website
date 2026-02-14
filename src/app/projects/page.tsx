import { sanityFetch } from '@/lib/sanity';
import { allProjectsQuery } from '@/lib/queries';
import type { Project } from '@/types';
import ProjectsGrid from './ProjectsGrid';

export const metadata = {
  title: 'Projects | CDLS',
  description: 'Research projects from the Center for Developing Leadership in Science.',
};

export default async function ProjectsPage() {
  const projects = (await sanityFetch<Project[]>(allProjectsQuery)) ?? [];

  return (
    <section className="bg-[#faf9f2] pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-8 md:px-16">
        <h1 className="font-barlow font-extrabold text-[clamp(4rem,10vw,9rem)] text-charcoal leading-[0.85] tracking-[-0.03em] mb-12 normal-case">
          Projects
        </h1>
        {projects.length === 0 ? (
          <p className="font-jakarta text-charcoal/50 text-lg">No projects yet. Check back soon.</p>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </section>
  );
}
