import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { ProjectLinks } from "@/components/ProjectLinks";
import { projects } from "@/content/projects";
import { getProjectContent } from "@/lib/project-content";

export function generateStaticParams(): Array<{ slug: string }> {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectPage(
  props: PageProps<"/work/[slug]">,
): Promise<ReactNode> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const content = await getProjectContent(slug);
  return (
    <Box title={`WORK/${project.slug.toUpperCase()}`}>
      <article>
        <header className="border-fg-faint border-b pb-3">
          <div className="text-fg-muted flex flex-wrap gap-x-4 text-xs uppercase">
            <span>YEAR: {project.year}</span>
            {project.tags.length > 0 ? (
              <span>TAGS: {project.tags.join(", ")}</span>
            ) : null}
          </div>
          <h1 className="text-fg mt-2 text-lg">
            <span className="text-fg-muted">&gt; </span>
            {project.name}
          </h1>
          {project.description ? (
            <p className="text-fg-dim mt-1 text-sm">{project.description}</p>
          ) : null}
        </header>

        {project.links && project.links.length > 0 ? (
          <div className="mt-4 flex flex-col gap-1 text-sm">
            <ProjectLinks links={project.links} align="left" />
          </div>
        ) : null}

        {content ? (
          <div
            className="prose-terminal mt-6"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        ) : null}

        <footer className="border-fg-faint text-fg-muted mt-8 border-t pt-3 text-xs">
          <Link href="/work" className="text-fg-muted hover:text-red">
            ← back to /work
          </Link>
        </footer>
      </article>
    </Box>
  );
}
