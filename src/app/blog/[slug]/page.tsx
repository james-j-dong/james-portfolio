import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { Article } from "@/components/Article";
import { getPost, listPostMeta } from "@/lib/posts";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await listPostMeta();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
}

export default async function BlogPostPage(
  props: PageProps<"/blog/[slug]">,
): Promise<ReactNode> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <Box title={`BLOG/${post.slug.toUpperCase()}`}>
      <Article post={post} />
    </Box>
  );
}
