import type { ReactNode } from "react";
import type { Project } from "@/lib/types";

type ProjectsTableProps = {
    projects: Project[];
};

function hostnameLabel(href: string): string {
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
                                {p.links && p.links.length > 0 ? (
                                    p.links.map((link, index) => (
                                        <div key={link.href + index}>
                                            <a 
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="whitespace-nowrap"
                                            >
                                                {link.label ?? hostnameLabel(link.href)}
                                                <span aria-hidden="true" className="ml-1">↗</span>
                                            </a>
                                        </div>
                                    ))
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
