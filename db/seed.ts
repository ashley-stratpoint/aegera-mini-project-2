import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, categories, posts, comments, likes } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is missing from .env.local");
}

const sql = neon(dbUrl);

const db = drizzle(sql, {
    schema,
});

const main = async () => {
    try {
        console.log("Emptying existing data...");
        await db.delete(likes);
        await db.delete(comments);
        await db.delete(posts);
        await db.delete(categories);
        await db.delete(users);

        console.log("Seeding users...");
        const [user1] = await db.insert(users).values([
            {
                clerkId: "user_2P6k...",
                email: "alex@example.com",
                firstName: "Alex",
                lastName: "Rivera",
                imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            },
            {
                clerkId: "user_8J9l...",
                email: "sam@example.com",
                firstName: "Sam",
                lastName: "Tech",
                imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
            }
        ]).returning();

        console.log("Seeding categories...");
        const [catSi, catMu, catLa, catDesign, catDev] = await db.insert(categories).values([
            { name: "Sining (Arts & Crafts)", slug: "sining", color: "#3b82f6" },
            { name: "Musika (Music)", slug: "musika", color: "#ec4899" },
            { name: "Poems (Tula)", slug: "tula", color: "#10b981" },
            { name: "Design", slug: "design", color: "#10b981" },
            { name: "Development", slug: "development", color: "#10b981" },
        ]).returning();

        console.log("Seeding posts...");
        const [post1, post2] = await db.insert(posts).values([
            {
                title: "Mastering the Art of Glassmorphism in Modern Web Design",
                blogId: "mastering-glassmorphism-2026",
                categoryId: catDesign.id,
                content: "<p>Glassmorphism is more than just a trend; it's a way to create depth and hierarchy using transparency and blur...</p>",
                imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
                authorId: user1.id.toString(),
            },
            {
                title: "The Future of Full-Stack: Next.js 15 and Drizzle ORM",
                blogId: "future-of-fullstack-drizzle",
                categoryId: catDev.id,
                content: "<p>The developer experience has never been better. With typesafe ORMs like Drizzle, we can build robust apps faster...</p>",
                imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
                authorId: user1.id.toString(),
            }
        ]).returning();

        console.log("Seeding interactions...");
        await db.insert(comments).values([
            {
                content: "This is exactly what I was looking for! The blur effect is stunning.",
                authorId: user1.id.toString(),
                postId: post1.id,
            }
        ]);

        await db.insert(likes).values([
            { userId: user1.id.toString(), postId: post1.id },
            { userId: user1.id.toString(), postId: post2.id },
        ]);

        console.log("Seeding completed successfully!");
    } catch(err) {
        console.error("Seeding failed!");
        console.error(err);
        process.exit(1);
    }
};

main();