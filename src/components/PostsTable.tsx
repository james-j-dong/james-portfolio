import Link from "next/link";
import type { ReactNode } from "react";
import { ClickableRow } from "@/components/ClickableRow";
import type { PostMeta } from "@/lib/types";

type PostsTableProps = {
  posts: PostMeta[];
};

export function PostsTable({ posts }: PostsTableProps): ReactNode {
  if (posts.length === 0) {
    return <p className="text-fg-dim">No posts yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-fg-dim text-left">
            <th className="w-col-date border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Date
            </th>
            <th className="border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Title
            </th>
            <th className="border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Tags
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <ClickableRow
              key={post.slug}
              href={`/log/${post.slug}`}
              className="align-top"
            >
              <td className="text-fg-dim py-1 pr-2">{post.frontmatter.date}</td>
              <td className="py-1 pr-2">
                <Link
                  href={`/log/${post.slug}`}
                  className="text-blue hover:text-red"
                >
                  {post.frontmatter.title}
                </Link>
                {post.frontmatter.summary ? (
                  <div className="text-fg-dim">{post.frontmatter.summary}</div>
                ) : null}
              </td>
              <td className="text-fg-dim py-1 pr-2">
                {post.frontmatter.tags.join(", ")}
              </td>
            </ClickableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
