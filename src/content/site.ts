export type Social = {
    label: string;
    value: string;
    href: string;
};

export type SiteConfig = {
    name: string;
    handle: string;
    hostname: string;
    bio: string[];
    location: string;
    timezone: string;
    email: string;
    socials: Social[];
};

export const site: SiteConfig = {
    name: "JAMES DONG",
    handle: "jamesdong",
    hostname: "jamesdong.dev",
    bio: [
        "Software engineer.",
        "Based in ___.",
        "Building calm, fast software.",
    ],
    location: "___",
    timezone: "UTC",
    email: "jamesjd1024@gmail.com",
    socials: [
        { label: "GITHUB", value: "/jamesdong", href: "https://github.com/" },
        { label: "X", value: "/jamesdong", href: "https://x.com/" },
        { label: "RSS", value: "/feed.xml", href: "/feed.xml" },
    ],
};
