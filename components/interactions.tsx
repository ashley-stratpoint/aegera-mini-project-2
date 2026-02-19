"use client";

import { Heart, MessageSquare } from "lucide-react";
import { toggleLike } from "@/lib/actions/likes";
import { useTransition } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Interactions({ postId, blogId, likes, userId, commentCount }: any) {
  const [isPending, startTransition] = useTransition();

  const isLiked =
    likes?.some((like: any) => Number(like.userId) === Number(userId)) ?? false;

  const handleLike = () => {
    startTransition(async () => {
      await toggleLike(Number(postId), userId, blogId);
    });
  };

  const scrollToComments = () => {
    const element = document.getElementById("comments-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-10 flex items-center gap-10 py-6">
      <SignedIn>
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-6 h-6 cursor-pointer transition ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-zinc-500 hover:text-red-500"
            }`}
          />
          <span className="text-sm">{likes.length}</span>
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <div className="flex items-center gap-1 cursor-pointer">
            <Heart className="w-6 h-6 text-zinc-500 hover:text-red-500 transition" />
            <span className="text-sm">{likes.length}</span>
          </div>
        </SignInButton>
      </SignedOut>

      <div className="flex items-center gap-1">
        <MessageSquare
          onClick={scrollToComments}
          className="w-6 h-6 cursor-pointer text-zinc-500 hover:opacity-70 transition"
        />
        <span className="text-sm">{commentCount}</span>
      </div>
    </div>
  );
}
