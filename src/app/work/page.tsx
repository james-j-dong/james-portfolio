import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { ProjectsTable } from "@/components/ProjectsTable";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
    title: "Work",
};

export default function WorkPage(): ReactNode {
    return (
        <div className="flex flex-col gap-6">
            <Box title="WORK/PROJECTS">
                <ProjectsTable projects={projects} />
            </Box>
            <p className="text-xs text-fg-muted">
                {projects.length} record(s). Sorted by year, descending.
            </p>
        </div>
    );
}
