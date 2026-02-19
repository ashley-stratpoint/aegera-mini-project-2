'use client';

import React from "react";
import { cn } from "@/lib/utils";

interface ToolbarToggleProps {
    onClick: () => void;
    active: boolean;
    children: React.ReactNode;
    className?: string;
}

export function ToolbarToggle({ onClick,active, children, className }: ToolbarToggleProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                active 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm" 
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:text-zinc-400",
                className
            )}
        >
        {children}
        </button>
  );
}