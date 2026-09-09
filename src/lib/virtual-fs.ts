import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { projects } from "@/content/projects";
import { ME_FILE, PROJECTS_DIR, isEnoent } from "@/lib/content-fs";
import { listVisibleBlogFiles } from "@/lib/posts";
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

async function readBlogChildren(): Promise<VFile[]> {
  const files = await listVisibleBlogFiles();
  const out = files.map((file): VFile => ({
    type: "file",
    name: `${file.slug}.md`,
    content: file.raw,
  }));
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
  const [blogChildren, workChildren, meFile] = await Promise.all([
    readBlogChildren(),
    readWorkChildren(),
    readMeFile(),
  ]);
  const children: VEntry[] = [
    { type: "dir", name: "blog", children: blogChildren },
    { type: "dir", name: "work", children: workChildren },
  ];
  if (meFile) children.push(meFile);
  return { type: "dir", name: "", children };
});
