'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { UserButton, useUser, ClerkLoaded, ClerkLoading} from '@clerk/nextjs';
import { Bell, PenLine } from 'lucide-react';
import Link from "next/link";

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
                    <Link href="/blogs/write" title="Create Post">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <PenLine className="h-5 w-5" />
                        </Button>
                    </Link>
                    <ClerkLoading>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </ClerkLoading>
                    
                    {!mounted ? (
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-24 rounded bg-zinc-200 animate-pulse hidden sm:block" />
                            <div className="h-9 w-9 rounded-full bg-zinc-200 animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <div className="hidden sm:flex flex-col items-end">
                                {isLoaded && user && (
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Hey, <span className="font-bold text-foreground capitalize">
                                            {user.firstName}
                                        </span>
                                    </span>
                                )}
                            </div>
                            <UserButton 
                                afterSignOutUrl="/" 
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9 md:h-10 md:w-10"
                                    }
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}