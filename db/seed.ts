import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, categories, posts, comments, likes } from "./schema";
import { FIXED_CATEGORIES } from "../lib/constants";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Emptying interactions and posts...");
        await db.delete(likes);
        await db.delete(comments);
        await db.delete(posts);
        await db.delete(users);
        await db.delete(categories);

        console.log("Seeding 10 users...");
        const seededUsers = await db.insert(users).values(
            Array.from({ length: 10 }).map((_, i) => ({
                clerkId: `user_clerk_${i}`,
                email: `user${i}@example.com`,
                firstName: `User${i}`,
                lastName: `Tester`,
                imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`,
            }))
        ).returning();

        console.log("Seeding fixed categories...");
        const dbCategories = await db.insert(categories)
            .values(FIXED_CATEGORIES)
            .returning();

        console.log("Seeding 10 posts (1 per user)...");
        const seededPosts = await db.insert(posts).values(
            seededUsers.map((user, i) => {
                const category = dbCategories[i % dbCategories.length];
                return {
                    title: `${category.name} Journey by ${user.firstName}`,
                    blogId: `post-${i + 1}-${category.slug}`,
                    categoryId: category.id,
                    content: `<p>Testing content for ${category.name}.</p>`,
                    imageUrl: `https://picsum.photos/seed/${i + 200}/1000/600`,
                    authorId: user.id,
                };
            })
        ).returning();

        console.log("Seeding interactions...");
        const allLikes = [];
        const allComments = [];

        for (const post of seededPosts) {
            // All 10 users like every post
            for (const user of seededUsers) {
                allLikes.push({ userId: user.id, postId: post.id });
            }
            // 3 comments per post
            for (let i = 0; i < 3; i++) {
                allComments.push({
                    content: `Insightful post about ${dbCategories.find(c => c.id === post.categoryId)?.name}!`,
                    authorId: seededUsers[i].id,
                    postId: post.id,
                });
            }
        }

        await db.insert(likes).values(allLikes);
        await db.insert(comments).values(allComments);

        console.log("Seeding complete with fixed categories.");
    } catch (err) {
        console.error("Seeding failed!", err);
        process.exit(1);
    }
};

main();