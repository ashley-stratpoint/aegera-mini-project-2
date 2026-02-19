"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createPost(
    authorId: number,
    blogId: string,
    imageUrl: string,
    title: string,
    content: string,
    categoryId: number, 
) {

    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized access" };
    }

    if (!title || !content || content === '<p></p>' || !authorId) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.blogId, blogId)
        });

        let finalBlogId = blogId;
        if (existingPost) {
            const shortId = Math.random().toString(36).substring(2, 6);
            finalBlogId = `${blogId}-${shortId}`;
        }

        await db.insert(posts).values({
            blogId: finalBlogId,
            categoryId,
            content,
            imageUrl,
            authorId,
            title,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        revalidatePath("/blogs");
        revalidatePath(`/blog/${finalBlogId}`);
        
        return { success: true, slug: finalBlogId };
    } catch (error: any) {
        console.error("Database Insertion Error:", error);
        return { 
            success: false, 
            error: error.message || "An unexpected error occurred." 
        };
    }
}

export async function updatePost(id: number, blogId: string, newCategoryId: number, newContent: string, newImageUrl: string, newTitle: string) {
    try {
        await db.update(posts)
            .set({ 
                title: newTitle,
                content: newContent,
                categoryId: newCategoryId,
                imageUrl: newImageUrl,
                updatedAt: new Date()
            })
            .where(eq(posts.id, id));

        revalidatePath("/blog");
        revalidatePath(`/blog/${blogId}`);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update post." };
    }
}

export async function deletePost(postId: number, blogId: string) {
    try {
        await db.delete(posts).where(eq(posts.id, postId));

        revalidatePath("/blog");
        revalidatePath(`/blog/${blogId}`);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete post." };
    }
}