"use client";

import { useState } from 'react';

export default function Tagline() {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", query);
    };

    return (
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-0 md:mt-0 gap-10">
            <div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">New Beginnings</h1>
                <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Here dwell the stories that are just beginning to shine. Peek at the newest masterpieces through these blogs.
                </p>
            </div>
        </div>
    )
}
