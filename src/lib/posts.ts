import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Post, PostFrontmatter } from "@/lib/types";

const LOG_DIR = path.join(process.cwd(), "src", "content", "log");

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function safeUrl(url: string): string {
    if (/^(https?:|mailto:|\/|#)/.test(url)) return url;
    return "#";
}

function renderInline(text: string): string {
    let out = escapeHtml(text);
    out = out.replace(/`([^`]+)`/g, (_, code: string) => `<code>${code}</code>`);
    out = out.replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_, label: string, url: string) => `<a href="${safeUrl(url)}">${label}</a>`,
    );
    out = out.replace(/\*\*([^*]+)\*\*/g, (_, s: string) => `<strong>${s}</strong>`);
    return out;
}

function renderBlocks(md: string): string {
    const lines = md.split("\n");
    const blocks: string[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.trim() === "") {
            i++;
            continue;
        }
        if (line.startsWith("```")) {
            const buf: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                buf.push(lines[i]);
                i++;
            }
            i++;
            blocks.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
            continue;
        }
        const hMatch = /^(#{1,4})\s+(.*)$/.exec(line);
        if (hMatch) {
            const level = hMatch[1].length;
            const text = renderInline(hMatch[2]);
            blocks.push(`<h${level}>${text}</h${level}>`);
            i++;
            continue;
        }
        if (/^-\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^-\s+/.test(lines[i])) {
                items.push(`<li>${renderInline(lines[i].replace(/^-\s+/, ""))}</li>`);
                i++;
            }
            blocks.push(`<ul>${items.join("")}</ul>`);
            continue;
        }
        const buf: string[] = [line];
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !lines[i].startsWith("```") &&
            !/^#{1,4}\s/.test(lines[i]) &&
            !/^-\s+/.test(lines[i])
        ) {
            buf.push(lines[i]);
            i++;
        }
        blocks.push(`<p>${renderInline(buf.join(" "))}</p>`);
    }
    return blocks.join("\n");
}

function parseFrontmatter(raw: string): { frontmatter: PostFrontmatter; body: string } {
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
    if (!m) {
        throw new Error("Missing frontmatter");
    }
    const data: Record<string, string | string[]> = {};
    for (const line of m[1].split(/\r?\n/)) {
        const kv = /^(\w+):\s*(.*)$/.exec(line);
        if (!kv) continue;
        const [, key, value] = kv;
        if (value.startsWith("[") && value.endsWith("]")) {
            data[key] = value
                .slice(1, -1)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        } else {
            data[key] = value;
        }
    }
    return {
        frontmatter: {
            title: String(data.title ?? ""),
            date: String(data.date ?? ""),
            tags: Array.isArray(data.tags) ? data.tags : [],
            summary: String(data.summary ?? ""),
        },
        body: m[2],
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
            const { frontmatter, body } = parseFrontmatter(raw);
            return {
                slug: filenameToSlug(filename),
                frontmatter,
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
