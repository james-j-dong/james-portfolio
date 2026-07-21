import Link from "next/link";
import type { ReactNode } from "react";
import type { Post } from "@/lib/types";

type ArticleProps = {
  post: Post;
};

export function Article({ post }: ArticleProps): ReactNode {
  const { frontmatter, html } = post;
  return (
    <article>
      <header className="border-fg-faint border-b pb-3">
        <div className="text-fg-muted flex flex-wrap gap-x-4 text-xs uppercase">
          <span>LOG/{post.slug}</span>
          <span>{frontmatter.date}</span>
          {frontmatter.tags.length > 0 ? (
            <span>TAGS: {frontmatter.tags.join(", ")}</span>
          ) : null}
        </div>
        <h1 className="text-fg mt-2 text-lg">
          <span className="text-fg-muted">&gt; </span>
          {frontmatter.title}
        </h1>
        {frontmatter.summary ? (
          <p className="text-fg-dim mt-1 text-sm">{frontmatter.summary}</p>
        ) : null}
      </header>
      <div
        className="prose-terminal mt-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className="border-fg-faint text-fg-muted mt-8 border-t pt-3 text-xs">
        <Link href="/log" className="text-fg-muted hover:text-red">
          ← back to /log
        </Link>
      </footer>
    </article>
  );
}
