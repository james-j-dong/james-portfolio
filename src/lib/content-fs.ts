import path from "node:path";

export const LOG_DIR: string = path.join(
  process.cwd(),
  "src",
  "content",
  "log",
);

export const PROJECTS_DIR: string = path.join(
  process.cwd(),
  "src",
  "content",
  "projects",
);

export const PORTRAIT_FILE: string = path.join(
  process.cwd(),
  "src",
  "content",
  "portrait.txt",
);

export const ME_FILE: string = path.join(
  process.cwd(),
  "src",
  "content",
  "me.txt",
);

export function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function isEnoent(error: unknown): boolean {
  return (
    error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
