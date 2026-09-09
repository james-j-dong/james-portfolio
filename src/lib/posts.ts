import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { BLOG_DIR, filenameToSlug, isEnoent } from "@/lib/content-fs";
import {
  type FrontmatterData,
  parseFrontmatter,
  renderMarkdown,
} from "@/lib/markdown";
import type { Post, PostFrontmatter, PostMeta } from "@/lib/types";

/** A blog markdown file, read and parsed once per request. */
export type BlogFile = {
  filename: string;
  slug: string;
  /** Full file text, including frontmatter (used by the terminal `cat`). */
  raw: string;
  data: FrontmatterData;
  body: string;
};

/** Drafts are visible in `next dev` and hidden in production builds. */
function showDrafts(): boolean {
  return process.env.NODE_ENV !== "production";
}

function isDraft(data: FrontmatterData): boolean {
  return data.draft === "true";
}

function toPostFrontmatter(data: FrontmatterData): PostFrontmatter {
  return {
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: String(data.summary ?? ""),
    draft: isDraft(data),
  };
}

const listBlogFilenames = cache(async (): Promise<string[]> => {
  let entries: string[];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch (error) {
    if (isEnoent(error)) return [];
    throw error;
  }
  return entries.filter((f) => f.endsWith(".md"));
});

/**
 * Every blog file that should be visible in the current environment.
 * This is the single place the draft filter is applied; all consumers
 * (index, post page, sitemap, home feed, terminal) go through it.
 */
export const listVisibleBlogFiles = cache(async (): Promise<BlogFile[]> => {
  const filenames = await listBlogFilenames();
  const files = await Promise.all(
    filenames.map(async (filename): Promise<BlogFile> => {
      const filePath = path.join(BLOG_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const { data, body } = parseFrontmatter(raw, filePath);
      return { filename, slug: filenameToSlug(filename), raw, data, body };
    }),
  );
  return files.filter((file) => showDrafts() || !isDraft(file.data));
});

export const listPostMeta = cache(async (): Promise<PostMeta[]> => {
  const files = await listVisibleBlogFiles();
  const posts = files.map((file): PostMeta => ({
    slug: file.slug,
    frontmatter: toPostFrontmatter(file.data),
  }));
  return posts.sort((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1,
  );
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const files = await listVisibleBlogFiles();
  const file = files.find((f) => f.slug === slug);
  if (!file) return null;
  return {
    slug,
    frontmatter: toPostFrontmatter(file.data),
    html: await renderMarkdown(file.body),
  };
});
