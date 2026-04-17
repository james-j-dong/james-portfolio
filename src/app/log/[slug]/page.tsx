import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { Article } from "@/components/Article";
import { getPost, listPosts } from "@/lib/posts";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const posts = await listPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
    props: PageProps<"/log/[slug]">,
): Promise<Metadata> {
    const { slug } = await props.params;
    const post = await getPost(slug);
    if (!post) return { title: "Not found" };
    return {
        title: post.frontmatter.title,
        description: post.frontmatter.summary,
    };
}

export default async function LogPostPage(
    props: PageProps<"/log/[slug]">,
): Promise<ReactNode> {
    const { slug } = await props.params;
    const post = await getPost(slug);
    if (!post) notFound();
    return (
        <Box title={`LOG/${post.slug.toUpperCase()}`}>
            <Article post={post} />
        </Box>
    );
}
