import type { Project } from "@/lib/types";

export const projects: Project[] = [
    {
        year: 2025,
        name: "cuelock",
        tags: ["nextjs", "python", "ai", "integrations"],
        links: [{ href: "https://cuelock.com" }],
        description: "Current main project. Expansion based NRR software for CSMs.",
    },
    {
        year: 2025,
        name: "harloop",
        tags: ["martech", "nextjs", "postgres"],
        links: [{ href: "https://harloop.com" }, { href: "https://github.com/james-j-dong/app-harloop" }],
        description: "Add short form content to your site with one click",
    },
    {
        year: 2024,
        name: "etsy dropshipper",
        tags: ["chromium", "dropship", "vite"],
        links: [{ href: "https://github.com/james-j-dong/Etsy-Chrome-Extension" }],
        description: "Automated dropshipping tool with gpt 3.5, net 200k. Got banned.",
    },
    {
        year: 2022,
        name: "sprout",
        tags: ["machine learning", "UT", "XGBoost"],
        links: [{ href: "https://github.com/james-j-dong/sprout-food-solutions" }],
        description: "Using machine learning to predict food consumption in restaurants",
    },
];
