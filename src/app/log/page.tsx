import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { PostsTable } from "@/components/PostsTable";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = {
    title: "Log",
};

export default async function LogPage(): Promise<ReactNode> {
    const posts = await listPosts();
    return (
        <div className="flex flex-col gap-6">
            <Box title="LOG/INDEX">
                <PostsTable posts={posts} />
            </Box>
            <p className="text-xs text-fg-muted">
                {posts.length} entry(s). Sorted newest first.
            </p>
        </div>
    );
}
