import Link from "next/link";
import type { ReactNode } from "react";
import { ClickableRow } from "@/components/ClickableRow";
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
    href: `/work/${p.slug}`,
  }));
  return [...postItems, ...projectItems].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function RecentList({
  posts,
  projects,
  limit = 5,
}: RecentListProps): ReactNode {
  const items = mergeFeed(posts, projects).slice(0, limit);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-fg-dim text-left">
            <th className="w-col-date border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Date
            </th>
            <th className="w-col-type border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Kind
            </th>
            <th className="border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Name
            </th>
            <th className="border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Tags
            </th>
            <th className="border-fg-faint border-b pb-1 text-right font-normal uppercase">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ClickableRow key={`${item.kind}:${item.href}`} href={item.href}>
              <td className="text-fg-dim py-1 pr-2">{item.date}</td>
              <td className="text-fg-muted py-1 pr-2">{item.kind}</td>
              <td className="py-1 pr-2">
                <Link href={item.href}>{item.name}</Link>
              </td>
              <td className="text-fg-dim py-1 pr-2">{item.tags.join(", ")}</td>
              <td className="text-fg-dim py-1 text-right">→</td>
            </ClickableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
