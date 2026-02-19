import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params } : { params: Promise<{ blogId: string }> }
) {
    try {
        const { blogId } = await params;
        const decodedBlogId = decodeURIComponent(blogId);

        const post = await db.query.posts.findFirst({
            where: eq(posts.blogId, decodedBlogId),
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
                    with: {
                        author: {
                            columns: {
                                firstName: true,
                                lastName: true, 
                                imageUrl: true
                            }
                        }
                    },
                    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
                }
            },
        });

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