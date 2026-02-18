"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createComment(postId: number, authorId: number, blogId: string, content: string) {
    if (!content.trim()) {
        return { error: "Content is required." };
    }

    try {
        await db.insert(comments).values({
            postId,
            authorId,
            content,
        });

        revalidatePath(`/blog/${blogId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to post comment." };
    }
}

export async function updateComment(commentId: number, blogId: string, newContent: string) {
    try {
        await db.update(comments)
            .set({ 
                content: newContent,
                updatedAt: new Date()
            })
            .where(eq(comments.id, commentId));

        revalidatePath(`/blog/${blogId}`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteComment(commentId: number, blogId: string) {
    try {
        await db.delete(comments).where(eq(comments.id, commentId));

        revalidatePath(`/blog/${blogId}`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}