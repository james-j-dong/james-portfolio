import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { listPostMeta } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPostMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/work",
    "/log",
    "/contact",
  ].map((route) => ({
    url: `${site.url}${route}`,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/work/${project.slug}`,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/log/${post.slug}`,
    lastModified: post.frontmatter.date,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
