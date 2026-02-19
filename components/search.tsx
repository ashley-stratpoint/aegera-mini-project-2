"use client";

import { ArrowRight, Search } from 'lucide-react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { useState } from 'react';

const itemVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function TaglineSearch() {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", query);
    };

    return (
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-0 md:mt-8 gap-10">
            <AnimatedGroup variants={{ item: itemVariants }} className="w-full">
                <form 
                    onSubmit={handleSearch}
                    className="hover:bg-background dark:hover:border-t-border bg-muted group flex max-w-5xl w-full mb-15 items-center gap-3 rounded-full border p-1.5 pl-4 shadow-md shadow-zinc-950/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 dark:border-t-white/5 dark:shadow-zinc-950"
                >
                    <input 
                        type="text"
                        placeholder="Search keyword"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
                    />

                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                    
                    <button 
                        type="submit"
                        className="bg-background group-hover:bg-primary group-hover:text-primary-foreground size-8 overflow-hidden rounded-full duration-500 transition-colors flex items-center justify-center"
                    >
                        <div className="flex w-20 -translate-x-[20px] items-center justify-center shrink-0 duration-500 ease-in-out group-hover:translate-x-1/4">
                            <Search className="m-auto size-4 shrink-0" />
                            <Search className="m-auto size-4 shrink-0" />
                        </div>
                    </button>
                </form>
            </AnimatedGroup>
        </div>
    )
}
