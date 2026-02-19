"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
        revalidatePath(`/blogs/${finalBlogId}`);
        
        return { success: true, slug: finalBlogId };
    } catch (error: any) {
        console.error("Database Insertion Error:", error);
        return { 
            success: false, 
            error: error.message || "An unexpected error occurred." 
        };
    }
}

export async function updatePost(
    postId: number, 
    newBlogId: string,
    newCategoryId: number, 
    newContent: string, 
    newImageUrl: string, 
    newTitle: string
) {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    try {
        await db.update(posts)
            .set({ 
                blogId: newBlogId,
                title: newTitle,
                content: newContent,
                categoryId: newCategoryId,
                imageUrl: newImageUrl,
                updatedAt: new Date()
            })
            .where(eq(posts.id, postId));

        revalidatePath("/blogs");
        revalidatePath(`/blogs/${newBlogId}`);
        return { success: true, slug: newBlogId };
    } catch (error) {
        return { success: false, error: "Failed to update." };
    }
}

export async function deletePost(postId: number, blogId: string) {
    let isSuccessful = false;
    try {
        await db.delete(posts).where(eq(posts.id, postId));
        revalidatePath("/blogs");
        revalidatePath(`/blogs/${blogId}`);
        isSuccessful = true;
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, error: "Failed to delete post." };
    }

    if (isSuccessful) {
        redirect("/blogs");
    }
}