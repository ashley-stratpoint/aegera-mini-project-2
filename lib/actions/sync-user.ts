import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function syncUser() {
    const user = await currentUser();
    if (!user) return null;

    let dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser) {
        const [newUser] = await db.insert(users).values({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
        }).returning();
        
        dbUser = newUser;
    }

    return dbUser;
}