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
                <header className="border-b border-fg-faint pb-3">
                    <div className="flex flex-wrap gap-x-4 text-xs uppercase text-fg-muted">
                        <span>YEAR: {project.year}</span>
                        {project.tags.length > 0 ? (
                            <span>TAGS: {project.tags.join(", ")}</span>
                        ) : null}
                    </div>
                    <h1 className="mt-2 text-lg text-fg">
                        <span className="text-fg-muted">&gt; </span>
                        {project.name}
                    </h1>
                    {project.description ? (
                        <p className="mt-1 text-sm text-fg-dim">{project.description}</p>
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

                <footer className="mt-8 border-t border-fg-faint pt-3 text-xs text-fg-muted">
                    <Link href="/work" className="text-fg-muted hover:text-red">
                        ← back to /work
                    </Link>
                </footer>
            </article>
        </Box>
    );
}
