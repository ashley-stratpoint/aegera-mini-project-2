'use client';

import { useTransition } from "react";
import { deletePost } from "@/lib/actions/posts";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeletePostButton({ blogId, postId }: { blogId: string; postId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await deletePost(postId, blogId);
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-zinc-200 dark:border-zinc-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold tracking-tight">Remove from Museum?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your story. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full border-zinc-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isPending}
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}