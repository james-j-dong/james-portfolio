import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parseFrontmatter, renderBlocks } from "@/lib/markdown";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

export type ProjectContent = {
  html: string;
};

export const getProjectContent = cache(
  async (slug: string): Promise<ProjectContent | null> => {
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
    let raw: string;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch {
      return null;
    }
    const { body } = parseFrontmatter(raw);
    return { html: renderBlocks(body) };
  },
);
