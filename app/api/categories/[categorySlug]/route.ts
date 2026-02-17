import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = await params;
        const categoryData = await db.query.categories.findFirst({
            where: eq(categories.slug, slug),
            with: {
                posts: {
                    with: {
                        author: {
                            columns: {
                                firstName: true, 
                                lastName: true, 
                                imageUrl: true 
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
                        `.as("commentCount")
                    },
                    orderBy: (posts, { desc }) => [
                        desc(posts.updatedAt),
                        desc(posts.createdAt)
                    ],
                }
            }
        });

        if (!categoryData) {
            return NextResponse.json(
                { error: "Category not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(categoryData);

    } catch (error) {
        console.error("Category fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}