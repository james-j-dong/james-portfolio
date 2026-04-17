import type { ReactNode } from "react";
import type { Project } from "@/lib/types";

type ProjectsTableProps = {
    projects: Project[];
};

function linkLabel(href: string | undefined): string {
    if (!href) return "—";
    try {
        const url = new URL(href);
        return url.hostname.replace(/^www\./, "");
    } catch {
        return href;
    }
}

export function ProjectsTable({ projects }: ProjectsTableProps): ReactNode {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="text-left text-fg-dim">
                        <th className="w-col-year border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Year</th>
                        <th className="border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Name</th>
                        <th className="w-col-tags border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Tags</th>
                        <th className="border-b border-fg-faint pb-1 text-right font-normal uppercase">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                        <tr key={`${p.year}-${p.name}`} className="align-top hover:bg-bg-raised">
                            <td className="py-1 pr-2 text-fg-dim">{p.year}</td>
                            <td className="py-1 pr-2">
                                <div className="text-fg">{p.name}</div>
                                {p.description ? (
                                    <div className="text-fg-dim">{p.description}</div>
                                ) : null}
                            </td>
                            <td className="py-1 pr-2 text-fg-dim">{p.tags.join(", ")}</td>
                            <td className="py-1 text-right">
                                {p.link ? (
                                    <a href={p.link} target="_blank" rel="noreferrer noopener">
                                        {linkLabel(p.link)} ↗
                                    </a>
                                ) : (
                                    <span className="text-fg-muted">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
