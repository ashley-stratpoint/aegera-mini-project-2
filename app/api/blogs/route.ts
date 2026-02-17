import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allPosts = await db.query.posts.findMany({
            columns: {
                id: true,
                title: true,
                blogId: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            },
            with: {
                author: {
                    columns: {
                        firstName: true,
                        lastName: true, 
                        imageUrl: true
                    }
                },
                category: {
                    columns: {
                        name: true,
                        slug: true,
                        color: true
                    }
                }
            },
            extras: {
                likeCount: sql<number> `
                    cast((SELECT COUNT(*) 
                    FROM likes
                    WHERE likes.post_id = posts.id) as int)
                `.as("likeCount"),

                commentCount: sql<number>`
                    cast((SELECT COUNT(*)
                    FROM comments
                    WHERE comments.post_id = posts.id) as int)
                `.as("commentCount"),
            },
            orderBy: (posts, { desc }) => [
                desc(posts.updatedAt),
                desc(posts.createdAt)
            ],
        });
        return NextResponse.json(allPosts);
        
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch blog posts." },
            { status: 500 }
        );
    }
}