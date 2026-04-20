import Link from "next/link";
import type { ReactNode } from "react";
import { ClickableRow } from "@/components/ClickableRow";
import { ProjectLinks } from "@/components/ProjectLinks";
import type { Project } from "@/lib/types";

type ProjectsTableProps = {
  projects: Project[];
};

export function ProjectsTable({ projects }: ProjectsTableProps): ReactNode {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-fg-dim text-left">
            <th className="w-col-year border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Year
            </th>
            <th className="border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Name
            </th>
            <th className="w-col-tags border-fg-faint border-b pr-2 pb-1 font-normal uppercase">
              Tags
            </th>
            <th className="border-fg-faint border-b pb-1 text-right font-normal uppercase">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <ClickableRow
              key={`${p.year}-${p.slug}`}
              href={`/work/${p.slug}`}
              className="align-top"
            >
              <td className="text-fg-dim py-1 pr-2">{p.year}</td>
              <td className="py-1 pr-2">
                <Link href={`/work/${p.slug}`} className="text-fg">
                  {p.name}
                </Link>
                {p.description ? (
                  <div className="text-fg-dim">{p.description}</div>
                ) : null}
              </td>
              <td className="text-fg-dim py-1 pr-2">{p.tags.join(", ")}</td>
              <td className="py-1 text-right">
                <ProjectLinks links={p.links ?? []} align="right" />
              </td>
            </ClickableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
