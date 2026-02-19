import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, categories, posts, comments, likes } from "./schema";
import { FIXED_CATEGORIES } from "../lib/constants";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Sample realistic data
const FIRST_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];
const SAMPLE_CONTENT = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
  "Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum."
];
const SAMPLE_COMMENTS = [
  "This really resonated with me!",
  "Amazing insight, thank you for sharing.",
  "I learned something new today, appreciate it.",
  "Such a detailed post, well done!",
  "Interesting perspective, I hadn’t thought of that.",
  "Looking forward to more posts like this!"
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomParagraphs(count: number) {
  let paragraphs = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(getRandom(SAMPLE_CONTENT));
  }
  return `<p>${paragraphs.join("</p><p>")}</p>`;
}

const main = async () => {
  try {
    console.log("Emptying database...");
    await db.delete(likes);
    await db.delete(comments);
    await db.delete(posts);
    await db.delete(users);
    await db.delete(categories);

    // Users
    console.log("Seeding 10 users...");
    const seededUsers = await db.insert(users).values(
      Array.from({ length: 10 }).map((_, i) => {
        const firstName = getRandom(FIRST_NAMES);
        const lastName = getRandom(LAST_NAMES);
        return {
          clerkId: `user_${firstName}_${lastName}_${i}_${uuidv4()}`, // guaranteed unique
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          firstName,
          lastName,
          imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
        };
      })
    ).returning();

    // Categories
    console.log("Seeding fixed categories...");
    const dbCategories: (typeof categories.$inferSelect)[] = [];
    for (const cat of FIXED_CATEGORIES) {
        const [inserted] = await db.insert(categories)
            .values(cat)
            .onConflictDoUpdate({
                target: categories.id,
                set: { name: cat.name, color: cat.color, slug: cat.slug }
            })
            .returning();
        dbCategories.push(inserted);
    }

    // Posts
    console.log("Seeding 10 posts...");
    const seededPosts = await db.insert(posts).values(
      seededUsers.map((user, i) => {
        const category = dbCategories[i % dbCategories.length];
        return {
          title: `${getRandom(FIRST_NAMES)}'s Journey`,
          blogId: `post-${i + 1}-${category.slug}`,
          categoryId: category.id,
          content: getRandomParagraphs(3), // 3 paragraphs
          imageUrl: `https://picsum.photos/seed/${i + 200}/1000/600`,
          authorId: user.id,
        };
      })
    ).returning();

    // Likes & Comments
    console.log("Seeding interactions...");
    const allLikes = [];
    const allComments = [];

    for (const post of seededPosts) {
      // Random number of likes (1-10)
      const likeCount = Math.floor(Math.random() * seededUsers.length) + 1;
      const likedUsers = seededUsers.sort(() => 0.5 - Math.random()).slice(0, likeCount);
      for (const user of likedUsers) {
        allLikes.push({ userId: user.id, postId: post.id });
      }

      // Random number of comments (1-5)
      const commentCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < commentCount; i++) {
        const commenter = getRandom(seededUsers);
        allComments.push({
          content: getRandom(SAMPLE_COMMENTS),
          authorId: commenter.id,
          postId: post.id,
        });
      }
    }

    await db.insert(likes).values(allLikes);
    await db.insert(comments).values(allComments);

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed!", err);
    process.exit(1);
  }
};

main();