import type { Project } from "@/lib/types";

export const projects: Project[] = [
    {
        year: 2026,
        name: "project-alpha",
        tags: ["ts", "infra"],
        link: "https://example.com/alpha",
        description: "Placeholder for a recent project.",
    },
    {
        year: 2025,
        name: "thinkpad-mod",
        tags: ["hardware", "firmware"],
        link: "https://example.com/thinkpad",
        description: "Custom firmware notes and patches.",
    },
    {
        year: 2025,
        name: "foo-compiler",
        tags: ["rust", "wasm"],
        link: "https://example.com/foo",
        description: "Small compiler experiment.",
    },
    {
        year: 2024,
        name: "dotfiles",
        tags: ["shell", "config"],
        link: "https://github.com/jamesdong/dotfiles",
        description: "Personal dev environment.",
    },
];
