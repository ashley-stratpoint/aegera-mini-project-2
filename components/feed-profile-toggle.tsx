"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FeedProfileToggle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "feed";

    return (
        <div className="flex items-center justify-center mt-8">
            <div className="flex p-1 bg-zinc-900 rounded-full border border-zinc-800">
                <button
                    onClick={() => router.push("/blogs?view=feed")}
                    className={cn(
                        "px-10 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                        view === "feed" 
                            ? "bg-white text-black shadow-md" 
                            : "text-zinc-400 hover:text-zinc-200"
                    )}
                >
                    Feed
                </button>
                <button
                    onClick={() => router.push("/blogs?view=profile")}
                    className={cn(
                        "px-10 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                        view === "profile" 
                            ? "bg-white text-black shadow-md" 
                            : "text-zinc-400 hover:text-zinc-200"
                    )}
                >
                    Profile
                </button>
            </div>
        </div>
    );
}