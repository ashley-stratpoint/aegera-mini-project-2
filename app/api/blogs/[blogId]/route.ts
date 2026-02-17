import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params } : { params: {blogId: string } }
) {
    try {
        const { blogId } = await params;
        const post = await db.query.posts.findFirst({
            where: eq(posts.blogId, blogId),
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
                },
                likes: {
                    columns: {
                        userId: true
                    }
                },
                comments: {
                    columns: {
                        id: true,
                        content: true,
                        authorId: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },
            extras: {
                likeCount: sql<number>`
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
        });

        // If blog post does not exist
        if (!post) {
            return NextResponse.json(
                { error: "Post not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(post);

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}