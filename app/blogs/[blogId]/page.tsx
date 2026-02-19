import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from 'next';
import { getBlog } from "@/lib/blogs";
import { syncUser } from "@/lib/actions/sync-user";
import Interactions from "@/components/interactions";
import CommentsSection from "@/components/comments-section";
import { DeletePostButton } from "@/components/delete-post-button";
import { Button } from "@/components/ui/button";
import WriteBlogPost from "@/components/write-blog-post";

type Props = {
    params: { blogId: string };
    searchParams: { mode?: string };
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

export default async function BlogPostDetails({ params, searchParams }: Props) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    const blogId = resolvedParams.blogId;
    const mode = resolvedSearchParams.mode;

    const post = await getBlog(blogId);
    if (!post) {
        notFound();
    }

    const user = await syncUser();
    const isOwner = String(user?.id) === String(post.authorId);

    const isEditing = mode === "edit" && isOwner;
    const isEdited = Math.floor(new Date(post.updatedAt).getTime() / 1000) > Math.floor(new Date(post.createdAt).getTime() / 1000);

    if (isEditing) {
        return (
            <WriteBlogPost 
                userId={user?.id as number} 
                initialData={{
                    id: post.id,
                    blogId: post.blogId,
                    title: post.title,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    categorySlug: post.category.slug
                }} 
            />
        );
    }

    return (
        <article className="max-w-3xl mx-auto py-10 px-6">
            <div className="flex justify-between items-center mb-10 w-full">
                <Link href="/blogs" className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-black transition-colors">
                    <ChevronLeft className="w-4 h-4" /> 
                    <span>Back to SIMULA</span>
                </Link>

                {isOwner && (
                    <div className="flex items-center gap-2">
                        <Link href={`/blogs/${post.blogId}?mode=edit`}>
                            <Button variant="outline" size="sm" className="rounded-full">
                                Edit
                            </Button>
                        </Link>
                        <DeletePostButton blogId={post.blogId} postId={post.id} />
                    </div>
                )}
            </div>
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

            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {post.title}
                </h1>
                <div className="flex items-center gap-3 text-zinc-500">
                    <div className="flex items-center gap-2">
                            <img 
                                src={post.author.imageUrl} 
                                alt={post.author.firstName && post.author.firstName || "Author"} 
                                className="w-6 h-6 rounded-full border border-white/20"
                            />
                        <span className="font-medium text-foreground">
                            By {post.author.firstName} {post.author.lastName}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            {isEdited && (
                                <span 
                                    className="text-xs italic opacity-50 flex items-center gap-1.5"
                                    title={`Last updated: ${new Date(post.updatedAt).toLocaleString()}`}
                                >
                                    <span className="text-[10px] leading-none">•</span>
                                    Edited
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

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

            <div id="comments-section">
                <CommentsSection 
                    postId={post.id} 
                    blogId={post.blogId} 
                    comments={post.comments} 
                    userId={user?.id}
                />
            </div>
        </article>
    );
}