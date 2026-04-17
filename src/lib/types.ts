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

export type Project = {
    year: number;
    name: string;
    tags: string[];
    link?: string;
    description?: string;
};

export type FeedItem = {
    date: string;
    kind: "POST" | "PROJ";
    name: string;
    tags: string[];
    href: string;
};
