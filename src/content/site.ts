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
  handle: "vistor",
  hostname: "jamesdong.dev",
  bio: [
    "Software engineer based in Austin, TX.",
    "Building calm, fast software — tools that get out of the way.",
  ],
  location: "Austin, TX",
  timezone: "America/Chicago",
  email: "jamesdong00@gmail.com",
  socials: [
    {
      label: "GITHUB",
      value: "/james-j-dong",
      href: "https://github.com/james-j-dong",
    },
    {
      label: "LINKEDIN",
      value: "/in/james-dong-1024",
      href: "https://www.linkedin.com/in/james-dong-1024",
    },
  ],
};
