import Link from "next/link";
import type { ReactNode } from "react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";

type ArticleProps = {
    post: Post;
};

export function Article({ post }: ArticleProps): ReactNode {
    const { frontmatter, html } = post;
    return (
        <article>
            <header className="border-b border-fg-faint pb-3">
                <div className="flex flex-wrap gap-x-4 text-xs uppercase text-fg-muted">
                    <span>LOG/{post.slug}</span>
                    <span>{formatDate(frontmatter.date).toUpperCase()}</span>
                    {frontmatter.tags.length > 0 ? (
                        <span>TAGS: {frontmatter.tags.join(", ")}</span>
                    ) : null}
                </div>
                <h1 className="mt-2 text-lg text-fg">
                    <span className="text-fg-muted">&gt; </span>
                    {frontmatter.title}
                </h1>
                {frontmatter.summary ? (
                    <p className="mt-1 text-sm text-fg-dim">{frontmatter.summary}</p>
                ) : null}
            </header>
            <div
                className="prose-terminal mt-4"
                dangerouslySetInnerHTML={{ __html: html }}
            />
            <footer className="mt-8 border-t border-fg-faint pt-3 text-xs text-fg-muted">
                <Link href="/log" className="text-fg-muted hover:text-red">
                    ← back to /log
                </Link>
            </footer>
        </article>
    );
}
