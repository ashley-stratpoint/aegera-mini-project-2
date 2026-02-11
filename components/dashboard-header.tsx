"use client";

import { useState, useEffect } from 'react';
import { Logo } from '@/components/logo';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils';

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

export default function DashboardHeader() {
    const {user, isLoaded } = useUser();
    const [query, setQuery] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", query);
    };

    return (
        <div className='py-5 px-5 md:px-12 lg:px-28'>
            <div className='flex justify-between items-center border-b pb-3'>
                <Logo className="h-8 md:h-10 lg:h-12 transition-all duration-300" />

                <div className='flex items-center gap-4'>
                    <div className="hidden sm:flex flex-col items-end">
                        {!isLoaded ? (
                            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                        ) : user ? (
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Hey, <span className="font-bold text-foreground capitalize">
                                    {user.firstName}
                                </span>
                            </span>
                        ) : null}
                    </div>
                        <UserButton 
                            afterSignOutUrl="/" 
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9 md:h-10 md:w-10"
                                }
                            }}
                        />
                </div>
            </div>
            <div className='mt-10 md:mt-20 flex flex-col items-center text-center max-w-2xl mx-auto'>
                <h1 className='text-4xl sm:text-6xl font-bold tracking-tight'>New Beginnings</h1>
                <p className='mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed'>Here dwell the stories that are just beginning to shine. Peek at the newest masterpieces through these latest blogs.</p>
            </div>
            <div className="mt-10 flex justify-center">
                <AnimatedGroup variants={{ item: itemVariants }}>
                    <form 
                        onSubmit={handleSearch}
                        className="hover:bg-background dark:hover:border-t-border bg-muted group flex w-full max-w-md items-center gap-3 rounded-full border p-1.5 pl-4 shadow-md shadow-zinc-950/5 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 dark:border-t-white/5 dark:shadow-zinc-950"
                    >
                        
                        <input 
                            type="text"
                            placeholder="Search categories"
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
        </div>
    )
}