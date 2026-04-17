import Link from "next/link";
import type { ReactNode } from "react";
import type { FeedItem, Post, Project } from "@/lib/types";

type RecentListProps = {
    posts: Post[];
    projects: Project[];
    limit?: number;
};

function mergeFeed(posts: Post[], projects: Project[]): FeedItem[] {
    const postItems: FeedItem[] = posts.map((p) => ({
        date: p.frontmatter.date,
        kind: "POST",
        name: p.frontmatter.title,
        tags: p.frontmatter.tags,
        href: `/log/${p.slug}`,
    }));
    const projectItems: FeedItem[] = projects.map((p) => ({
        date: `${p.year}-01-01`,
        kind: "PROJ",
        name: p.name,
        tags: p.tags,
        href: p.link ?? "/work",
    }));
    return [...postItems, ...projectItems].sort((a, b) =>
        a.date < b.date ? 1 : -1,
    );
}

export function RecentList({ posts, projects, limit = 5 }: RecentListProps): ReactNode {
    const items = mergeFeed(posts, projects).slice(0, limit);
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="text-left text-fg-dim">
                        <th className="w-col-date border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Date</th>
                        <th className="w-col-type border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Kind</th>
                        <th className="border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Name</th>
                        <th className="border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Tags</th>
                        <th className="border-b border-fg-faint pb-1 text-right font-normal uppercase">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={`${item.kind}:${item.href}`} className="hover:bg-bg-raised">
                            <td className="py-1 pr-2 text-fg-dim">{item.date}</td>
                            <td className="py-1 pr-2 text-fg-muted">{item.kind}</td>
                            <td className="py-1 pr-2">
                                <Link href={item.href}>{item.name}</Link>
                            </td>
                            <td className="py-1 pr-2 text-fg-dim">{item.tags.join(", ")}</td>
                            <td className="py-1 text-right text-fg-dim">→</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
