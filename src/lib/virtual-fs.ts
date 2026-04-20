import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { projects } from "@/content/projects";
import type { Project } from "@/lib/types";

export type VFile = { type: "file"; name: string; content: string };
export type VDir = { type: "dir"; name: string; children: VEntry[] };
export type VEntry = VFile | VDir;

const LOG_DIR = path.join(process.cwd(), "src", "content", "log");
const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

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
  } catch {
    return [];
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
  } catch {
    return null;
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

export const buildVirtualFs = cache(async (): Promise<VDir> => {
  const [logChildren, workChildren] = await Promise.all([
    readLogChildren(),
    readWorkChildren(),
  ]);
  return {
    type: "dir",
    name: "",
    children: [
      { type: "dir", name: "log", children: logChildren },
      { type: "dir", name: "work", children: workChildren },
    ],
  };
});
