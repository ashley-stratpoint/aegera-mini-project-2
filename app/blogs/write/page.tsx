import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import WriteBlogPost from "@/components/write-blog-post";

export default async function UserCreateBlog() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return <div>Unauthorized. Please sign in.</div>;
    }

    const blogUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId), 
    });

    if (!blogUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-zinc-500 font-medium">Account not synced.</p>
                <p className="text-zinc-400 text-sm">Please visit your profile or refresh the page.</p>
            </div>
        );
    }

    return <WriteBlogPost userId={blogUser.id} />;
}