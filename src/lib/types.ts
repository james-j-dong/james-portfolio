export type PostFrontmatter = {
    title: string;
    date: string;
    tags: string[];
    summary: string;
};

export type Post = {
    slug: string;
    frontmatter: PostFrontmatter;
    html: string;
};

export type ProjectLink = {
    href: string;
    label?: string;
};

export type Project = {
    slug: string;
    year: number;
    name: string;
    tags: string[];
    links?: ProjectLink[];
    description?: string;
};

export type FeedItem = {
    date: string;
    kind: "POST" | "PROJ";
    name: string;
    tags: string[];
    href: string;
};
