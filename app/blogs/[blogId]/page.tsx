
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Metadata } from 'next';
import { getBlog } from "@/lib/blogs";
import { syncUser } from "@/lib/actions/sync-user";
import Interactions from "@/components/interactions";
import CommentSection from "@/components/comments-section";

type Props = {
    params: Promise<{ blogId: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { blogId } = await params;
    const post = await getBlog(blogId);
    
    if (!post) {
        return { 
            title: "Post Not Found | SIMULA",
            description: "The requested blog post cannot be found."
        };
    }

    return {
        title: `${post.title} | SIMULA`,
        description: post.content
            ? post.content.replace(/<[^>]*>/g, "").substring(0, 160)
            : "SIMULA Blog",

        openGraph: {
            title: post.title,
            description: post.content
                ? post.content.replace(/<[^>]*>/g, "").substring(0, 160)
                : "SIMULA Blog",
            images: post.imageUrl ? [post.imageUrl]: undefined,
        },
    };
};

export default async function BlogPostDetails({ params }: Props) {
    const { blogId } = await params;
    const post = await getBlog(blogId);

    if (!post) {
        notFound();
    }

    const user = await syncUser();

    return (
        <article className="max-w-3xl mx-auto py-20 px-6">
            <div className="mb-6">
                <Badge 
                    variant="outline" 
                    style={{ 
                        borderColor: post.category.color ?? '#3b82f6',
                        color: post.category.color ?? '#3b82f6' 
                    }}
                >
                    {post.category.name}
                </Badge>
            </div>

            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-10 border border-zinc-200 dark:border-zinc-800">
                <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Title & Meta */}
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {post.title}
                </h1>
                <div className="flex items-center gap-3 text-zinc-500">
                    <span className="font-medium text-foreground">
                        By {post.author.firstName} {post.author.lastName}
                    </span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </header>

            {/* Main Content */}
            <div 
                className="prose prose-zinc dark:prose-invert lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            <Interactions 
                postId={post.id} 
                blogId={post.blogId} 
                likes={post.likes} 
                userId={user?.id}
                commentCount={post.comments.length}
            />

            <CommentSection 
                postId={post.id} 
                blogId={post.blogId} 
                comments={post.comments} 
                userId={user?.id}
            />
        </article>
    );
}