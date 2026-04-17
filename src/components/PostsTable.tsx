import Link from "next/link";
import type { ReactNode } from "react";
import type { Post } from "@/lib/types";

type PostsTableProps = {
    posts: Post[];
};

export function PostsTable({ posts }: PostsTableProps): ReactNode {
    if (posts.length === 0) {
        return <p className="text-fg-dim">No posts yet.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="text-left text-fg-dim">
                        <th className="w-col-date border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Date</th>
                        <th className="border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Title</th>
                        <th className="border-b border-fg-faint pb-1 pr-2 font-normal uppercase">Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.slug} className="align-top hover:bg-bg-raised">
                            <td className="py-1 pr-2 text-fg-dim">{post.frontmatter.date}</td>
                            <td className="py-1 pr-2">
                                <Link href={`/log/${post.slug}`} className="text-blue hover:text-red">
                                    {post.frontmatter.title}
                                </Link>
                                {post.frontmatter.summary ? (
                                    <div className="text-fg-dim">{post.frontmatter.summary}</div>
                                ) : null}
                            </td>
                            <td className="py-1 pr-2 text-fg-dim">
                                {post.frontmatter.tags.join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
