"use server";

import { db } from "@/db";
import { likes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleLike(postId: number, userId: number, blogId: string) {
    try {
        const existingLike = await db.query.likes.findFirst({
            where: and(
                eq(likes.postId, postId), 
                eq(likes.userId, userId)
            ),
        });

        if (existingLike) {
            await db.delete(likes).where(
                and(
                    eq(likes.postId, postId), 
                    eq(likes.userId, userId)
                )
            );
        } else {
            await db.insert(likes).values({
                postId,
                userId,
            });
        }

        revalidatePath("/blog");
        revalidatePath(`/blog/${blogId}`);
        
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}