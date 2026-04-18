import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parseFrontmatter, renderBlocks } from "@/lib/markdown";
import type { Post, PostFrontmatter } from "@/lib/types";

const LOG_DIR = path.join(process.cwd(), "src", "content", "log");

function toPostFrontmatter(data: Record<string, string | string[]>): PostFrontmatter {
    return {
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags : [],
        summary: String(data.summary ?? ""),
    };
}

function filenameToSlug(filename: string): string {
    return filename
        .replace(/\.md$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export const listPosts = cache(async (): Promise<Post[]> => {
    let entries: string[];
    try {
        entries = await fs.readdir(LOG_DIR);
    } catch {
        return [];
    }
    const files = entries.filter((f) => f.endsWith(".md"));
    const posts = await Promise.all(
        files.map(async (filename): Promise<Post> => {
            const raw = await fs.readFile(path.join(LOG_DIR, filename), "utf8");
            const { data, body } = parseFrontmatter(raw);
            return {
                slug: filenameToSlug(filename),
                frontmatter: toPostFrontmatter(data),
                html: renderBlocks(body),
            };
        }),
    );
    return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
    const posts = await listPosts();
    return posts.find((p) => p.slug === slug) ?? null;
});
