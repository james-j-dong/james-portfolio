import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { PROJECTS_DIR, isEnoent } from "@/lib/content-fs";
import { parseFrontmatter, renderMarkdown } from "@/lib/markdown";

export type ProjectContent = {
  html: string;
};

export const getProjectContent = cache(
  async (slug: string): Promise<ProjectContent | null> => {
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
    let raw: string;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch (error) {
      // Projects without a write-up are expected; anything else is a bug.
      if (isEnoent(error)) return null;
      throw error;
    }
    const { body } = parseFrontmatter(raw, filePath);
    return { html: await renderMarkdown(body) };
  },
);
