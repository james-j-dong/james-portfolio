import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { projects } from "@/content/projects";
import {
  LOG_DIR,
  ME_FILE,
  PROJECTS_DIR,
  filenameToSlug,
  isEnoent,
} from "@/lib/content-fs";
import type { Project } from "@/lib/types";

export type VFile = { type: "file"; name: string; content: string };
export type VDir = { type: "dir"; name: string; children: VEntry[] };
export type VEntry = VFile | VDir;

function synthesizeProjectMarkdown(project: Project): string {
  const tagLine =
    project.tags.length > 0 ? `tags: [${project.tags.join(", ")}]` : "";
  const links =
    project.links && project.links.length > 0
      ? project.links.map((l) => `- ${l.href}`).join("\n")
      : "";
  const header = ["---", `title: ${project.name}`, `year: ${project.year}`];
  if (tagLine) header.push(tagLine);
  header.push("---", "");
  const parts = [header.join("\n"), `# ${project.name}`, ""];
  if (project.description) parts.push(project.description, "");
  if (links) parts.push("## links", "", links, "");
  return parts.join("\n");
}

async function readLogChildren(): Promise<VFile[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(LOG_DIR);
  } catch (error) {
    if (isEnoent(error)) return [];
    throw error;
  }
  const files = entries.filter((f) => f.endsWith(".md"));
  const out = await Promise.all(
    files.map(async (filename): Promise<VFile> => {
      const raw = await fs.readFile(path.join(LOG_DIR, filename), "utf8");
      return {
        type: "file",
        name: `${filenameToSlug(filename)}.md`,
        content: raw,
      };
    }),
  );
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function readProjectFile(slug: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(PROJECTS_DIR, `${slug}.md`), "utf8");
  } catch (error) {
    // Projects without a write-up are expected; anything else is a bug.
    if (isEnoent(error)) return null;
    throw error;
  }
}

async function readWorkChildren(): Promise<VFile[]> {
  const out = await Promise.all(
    projects.map(async (project): Promise<VFile> => {
      const raw = await readProjectFile(project.slug);
      return {
        type: "file",
        name: `${project.slug}.md`,
        content: raw ?? synthesizeProjectMarkdown(project),
      };
    }),
  );
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function readMeFile(): Promise<VFile | null> {
  try {
    const raw = await fs.readFile(ME_FILE, "utf8");
    return { type: "file", name: "me.txt", content: raw };
  } catch (error) {
    if (isEnoent(error)) return null;
    throw error;
  }
}

export const buildVirtualFs = cache(async (): Promise<VDir> => {
  const [logChildren, workChildren, meFile] = await Promise.all([
    readLogChildren(),
    readWorkChildren(),
    readMeFile(),
  ]);
  const children: VEntry[] = [
    { type: "dir", name: "log", children: logChildren },
    { type: "dir", name: "work", children: workChildren },
  ];
  if (meFile) children.push(meFile);
  return { type: "dir", name: "", children };
});
