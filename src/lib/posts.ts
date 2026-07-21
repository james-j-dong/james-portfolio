import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { LOG_DIR, filenameToSlug, isEnoent } from "@/lib/content-fs";
import { parseFrontmatter, renderMarkdown } from "@/lib/markdown";
import type { Post, PostFrontmatter, PostMeta } from "@/lib/types";

function toPostFrontmatter(
  data: Record<string, string | string[]>,
): PostFrontmatter {
  return {
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: String(data.summary ?? ""),
  };
}

const listLogFiles = cache(async (): Promise<string[]> => {
  let entries: string[];
  try {
    entries = await fs.readdir(LOG_DIR);
  } catch (error) {
    if (isEnoent(error)) return [];
    throw error;
  }
  return entries.filter((f) => f.endsWith(".md"));
});

export const listPostMeta = cache(async (): Promise<PostMeta[]> => {
  const files = await listLogFiles();
  const posts = await Promise.all(
    files.map(async (filename): Promise<PostMeta> => {
      const filePath = path.join(LOG_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = parseFrontmatter(raw, filePath);
      return {
        slug: filenameToSlug(filename),
        frontmatter: toPostFrontmatter(data),
      };
    }),
  );
  return posts.sort((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1,
  );
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const files = await listLogFiles();
  const filename = files.find((f) => filenameToSlug(f) === slug);
  if (!filename) return null;
  const filePath = path.join(LOG_DIR, filename);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw, filePath);
  return {
    slug,
    frontmatter: toPostFrontmatter(data),
    html: await renderMarkdown(body),
  };
});
