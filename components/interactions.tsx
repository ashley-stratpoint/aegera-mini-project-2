"use client";

import { Heart, MessageSquare } from "lucide-react";
import { toggleLike } from "@/lib/actions/likes";
import { useTransition } from "react";

export default function Interactions({ postId, blogId, likes, userId, commentCount }: any) {
  const [isPending, startTransition] = useTransition();
  const isLiked = likes.some((like: any) => Number(like.userId) === Number(userId));

  const handleLike = () => {
      if (!userId) {
          alert("Please sign in to like this post");
          return;
      }
      
      startTransition(async () => {
          await toggleLike(Number(postId), userId, blogId);
      });
  };

  return (
    <div className="mt-10 flex items-center gap-8 py-6 border-y border-zinc-100 dark:border-zinc-900">
      <button 
        onClick={handleLike}
        disabled={isPending}
        className={`flex items-center gap-2 font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}
      >
        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes.length}</span>
      </button>

      <div className="flex items-center gap-2 text-zinc-500 font-medium">
        <MessageSquare className="w-6 h-6" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
}