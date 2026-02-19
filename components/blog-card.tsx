import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, Calendar, Heart, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export function BlogCard({ post }: { post: any }) {
  const displayDate = post.updatedAt || post.createdAt;
  const postHref = `/blogs/${post.blogId}`;

  return (
    <Card
      className="
        relative flex flex-col h-[350px] sm:h-[400px] md:h-[450px] lg:h-[470px] overflow-hidden rounded-3xl
        bg-white/5 dark:bg-white/5
        backdrop-blur-lg
        border border-black/10 dark:border-white/10
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:translate-y-[-2px] hover:shadow-2xl
        p-0
      "
    >
      <div className="relative w-full aspect-video rounded-t-3xl overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {post.author && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
            {post.author.imageUrl && (
              <img
                src={post.author.imageUrl}
                alt={post.author.firstName && post.author.lastName || "Author"}
                className="w-6 h-6 rounded-full border border-white/20"
              />
            )}
            <span className="text-xs text-white font-medium">
              {post.author.firstName} {post.author.lastName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 px-3">
        {post.category && (
          <span
            className="text-xs px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(displayDate), "MMM dd, yyyy")}
        </div>
      </div>

      <h3 className="mt-3 px-3 text-lg sm:text-xl font-bold leading-snug">
        {post.title}
      </h3>

      <CardContent className="p-0 px-3 flex-1 mb-2 mt-1">
        <div
          className="text-sm sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: String(post.content || "") }}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between px-3 py-3 border-t border-black/10 dark:border-white/10">
        <Link
          href={postHref}
          className="flex items-center gap-1 text-sm text-primary"
        >
          Read More <ChevronRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <Heart className="w-4 h-4" />
            <span>{post.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentCount || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
