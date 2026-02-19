"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FeedProfileToggle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "feed";

    return (
        <div className="flex items-center justify-center mt-8">
            <div className="flex p-1 bg-zinc-900 dark:bg-zinc-500 rounded-full border border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => router.push("/blogs?view=feed")}
                    className={cn(
                        "px-10 py-2 rounded-full text-sm font-semibold transition-all duration-600",
                        view === "feed" 
                            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                            : "text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
                    )}
                >
                    Feed
                </button>
                <button
                    onClick={() => router.push("/blogs?view=profile")}
                    className={cn(
                        "px-8 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                        view === "profile" 
                            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm" 
                            : "text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
                    )}
                >
                    Profile
                </button>
            </div>
        </div>
    );
}